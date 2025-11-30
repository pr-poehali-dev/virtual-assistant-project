import json
import os
from openai import OpenAI

def handler(event, context):
    '''
    Business: Обработка сообщений виртуального помощника через OpenAI GPT
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
    
    body_data = json.loads(event.get('body', '{}'))
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
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'}),
            'isBase64Encoded': False
        }
    
    client = OpenAI(api_key=api_key)
    
    messages = [
        {
            'role': 'system',
            'content': '''Ты виртуальный помощник с функцией саморазвития и профессиональным переводчиком на все языки мира.

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

Примеры запросов на перевод:
- "Переведи на английский: Привет, как дела?"
- "Translate to Spanish: Hello world"
- "Переведи это на французский"
- "На китайский: Спасибо"

Отвечай дружелюбно, профессионально и по существу.'''
        }
    ]
    
    for msg in history[-10:]:
        messages.append({
            'role': msg.get('role'),
            'content': msg.get('content')
        })
    
    messages.append({
        'role': 'user',
        'content': user_message
    })
    
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=messages,
        temperature=0.7,
        max_tokens=500
    )
    
    assistant_message = response.choices[0].message.content
    
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