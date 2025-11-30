import json
import os
import urllib.request
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Business: Виртуальный помощник с обучением и оффлайн режимом
    Args: event - dict с httpMethod, body (JSON с message, history, online)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict с ответом помощника
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    
    body_data = json.loads(body_str)
    user_message = body_data.get('message', '')
    history = body_data.get('history', [])
    is_online = body_data.get('online', True)
    
    if not user_message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    if is_online:
        response_text = get_online_response(user_message, history, db_url)
    else:
        response_text = get_offline_response(user_message, db_url)
    
    if db_url:
        save_conversation(user_message, response_text, db_url)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'message': response_text,
            'request_id': context.request_id,
            'mode': 'online' if is_online else 'offline'
        }),
        'isBase64Encoded': False
    }

def get_online_response(user_message: str, history: list, db_url: str) -> str:
    db_response = search_knowledge_base(user_message, db_url)
    if db_response:
        return db_response
    
    try:
        system_prompt = '''Ты виртуальный помощник с функцией саморазвития и профессиональным переводчиком.

Твои способности:
1. Помогаешь с любыми задачами
2. Переводишь текст на любой язык мира
3. Запоминаешь контекст и учишься
4. Работаешь в онлайн и оффлайн режиме

Отвечай дружелюбно, кратко и по существу.'''

        messages = [{'role': 'system', 'content': system_prompt}]
        
        for msg in history[-5:]:
            messages.append({
                'role': msg.get('role'),
                'content': msg.get('content')
            })
        
        messages.append({'role': 'user', 'content': user_message})
        
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': messages,
            'temperature': 0.7,
            'max_tokens': 400
        }
        
        request_data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            'https://api.ai21.com/studio/v1/chat/completions',
            data=request_data,
            headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'},
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=20) as response:
            result = json.loads(response.read().decode('utf-8'))
            if 'choices' in result and len(result['choices']) > 0:
                ai_response = result['choices'][0]['message']['content']
                learn_from_response(user_message, ai_response, db_url)
                return ai_response
    except:
        pass
    
    return generate_smart_response(user_message)

def get_offline_response(user_message: str, db_url: str) -> str:
    db_response = search_knowledge_base(user_message, db_url)
    if db_response:
        return db_response
    
    cached_translation = search_translations(user_message, db_url)
    if cached_translation:
        return cached_translation
    
    learned_response = search_learned_conversations(user_message, db_url)
    if learned_response:
        return learned_response
    
    return generate_smart_response(user_message)

def search_knowledge_base(user_message: str, db_url: str) -> str:
    if not db_url:
        return None
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        message_lower = user_message.lower()
        
        cur.execute("""
            SELECT answer, usage_count 
            FROM knowledge_base 
            WHERE %s ILIKE ANY(keywords)
            ORDER BY usage_count DESC 
            LIMIT 1
        """, (message_lower,))
        
        result = cur.fetchone()
        
        if result:
            cur.execute("""
                UPDATE knowledge_base 
                SET usage_count = usage_count + 1 
                WHERE answer = %s
            """, (result['answer'],))
            conn.commit()
            
            cur.close()
            conn.close()
            return result['answer']
        
        cur.close()
        conn.close()
    except:
        pass
    
    return None

def search_translations(user_message: str, db_url: str) -> str:
    if not db_url:
        return None
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT translated_text, target_lang 
            FROM translations 
            WHERE source_text = %s 
            LIMIT 5
        """, (user_message,))
        
        results = cur.fetchall()
        cur.close()
        conn.close()
        
        if results:
            translations = [f"{r['target_lang']}: {r['translated_text']}" for r in results]
            return f"Кэшированные переводы:\n" + "\n".join(translations)
    except:
        pass
    
    return None

def search_learned_conversations(user_message: str, db_url: str) -> str:
    if not db_url:
        return None
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT assistant_response 
            FROM conversations 
            WHERE user_message ILIKE %s AND is_learned = TRUE
            ORDER BY created_at DESC 
            LIMIT 1
        """, (f'%{user_message}%',))
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if result:
            return result['assistant_response']
    except:
        pass
    
    return None

def save_conversation(user_msg: str, assistant_msg: str, db_url: str):
    if not db_url:
        return
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO conversations (user_message, assistant_response, is_learned) 
            VALUES (%s, %s, TRUE)
        """, (user_msg, assistant_msg))
        
        conn.commit()
        cur.close()
        conn.close()
    except:
        pass

def learn_from_response(user_msg: str, assistant_msg: str, db_url: str):
    if not db_url:
        return
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        keywords = extract_keywords(user_msg)
        
        if keywords:
            cur.execute("""
                INSERT INTO knowledge_base (question, answer, keywords, category) 
                VALUES (%s, %s, %s, 'learned')
                ON CONFLICT DO NOTHING
            """, (user_msg[:200], assistant_msg, keywords))
            conn.commit()
        
        cur.close()
        conn.close()
    except:
        pass

def extract_keywords(text: str) -> list:
    words = text.lower().split()
    keywords = [w for w in words if len(w) > 3]
    return keywords[:5] if keywords else None

def generate_smart_response(user_message: str) -> str:
    message_lower = user_message.lower()
    
    if 'перевед' in message_lower or 'translate' in message_lower:
        return "Я готов помочь с переводом! Укажите текст и язык. В онлайн режиме я сохраняю переводы для использования оффлайн."
    
    if any(w in message_lower for w in ['привет', 'здравствуй', 'hello', 'hi']):
        return "Здравствуйте! Я ваш виртуальный помощник. В онлайн режиме я учусь, а потом могу помогать без интернета."
    
    if any(w in message_lower for w in ['спасибо', 'благодар', 'thanks']):
        return "Пожалуйста! Все наши диалоги сохраняются для работы в оффлайн режиме."
    
    if any(w in message_lower for w in ['оффлайн', 'offline', 'без интернета']):
        return "В оффлайн режиме я использую накопленные знания из предыдущих диалогов, базу знаний и кэш переводов."
    
    return "Я виртуальный помощник с функцией обучения. В онлайн режиме я накапливаю знания, а потом могу помогать без интернета!"
