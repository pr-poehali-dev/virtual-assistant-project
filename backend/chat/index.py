import json
import urllib.request
import urllib.parse

def handler(event, context):
    '''
    Business: Обработка сообщений виртуального помощника через бесплатный AI API
    Args: event - dict с httpMethod, body (JSON с message и history)
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
    
    system_prompt = '''Ты виртуальный помощник с функцией саморазвития и профессиональным переводчиком на все языки мира.

Твои способности:
1. Помогаешь пользователям с любыми задачами
2. ПЕРЕВОДИШЬ текст на любой язык мира (когда пользователь просит "переведи на...")
3. Запоминаешь контекст и учишься на каждом диалоге
4. Работаешь как в онлайн, так и в оффлайн режиме

Когда пользователь просит перевод:
- Определи исходный язык автоматически
- Переведи точно и естественно на указанный язык
- Сохраняй стиль и тон оригинала
- Для сложных фраз дай альтернативные варианты

Отвечай дружелюбно, профессионально и по существу.'''

    messages = [{'role': 'system', 'content': system_prompt}]
    
    for msg in history[-10:]:
        messages.append({
            'role': msg.get('role'),
            'content': msg.get('content')
        })
    
    messages.append({
        'role': 'user',
        'content': user_message
    })
    
    try:
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': messages,
            'temperature': 0.7,
            'max_tokens': 500
        }
        
        request_data = json.dumps(payload).encode('utf-8')
        
        req = urllib.request.Request(
            'https://api.ai21.com/studio/v1/chat/completions',
            data=request_data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'choices' in result and len(result['choices']) > 0:
                assistant_message = result['choices'][0]['message']['content']
            else:
                assistant_message = generate_fallback_response(user_message)
    
    except Exception as e:
        assistant_message = generate_fallback_response(user_message)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'message': assistant_message,
            'request_id': context.request_id
        }),
        'isBase64Encoded': False
    }

def generate_fallback_response(user_message: str) -> str:
    message_lower = user_message.lower()
    
    if 'перевед' in message_lower or 'translate' in message_lower:
        return "Я готов помочь с переводом! Укажите текст и язык перевода. Например: 'Переведи на английский: Привет, как дела?'"
    
    if any(word in message_lower for word in ['привет', 'здравствуй', 'hello', 'hi']):
        return "Здравствуйте! Я ваш виртуальный помощник. Готов помочь с любыми вопросами, переводами и задачами. Чем могу быть полезен?"
    
    if any(word in message_lower for word in ['спасибо', 'благодар', 'thanks', 'thank you']):
        return "Пожалуйста, всегда рад помочь! Если у вас есть ещё вопросы - обращайтесь."
    
    if any(word in message_lower for word in ['как дела', 'how are you', 'как ты']):
        return "У меня всё отлично, спасибо! Я в режиме обучения и постоянно совершенствуюсь. Готов помочь вам с любыми задачами!"
    
    if any(word in message_lower for word in ['помощь', 'help', 'что умеешь', 'возможности']):
        return """Я умею:
• Отвечать на вопросы и помогать с задачами
• Переводить тексты на любые языки мира
• Запоминать контекст разговора
• Работать в режиме саморазвития

Просто напишите ваш вопрос или запрос!"""
    
    return "Понял ваш запрос! Я виртуальный помощник в режиме обучения. Задавайте любые вопросы, прошу переводы или помощь с задачами - я постараюсь помочь!"