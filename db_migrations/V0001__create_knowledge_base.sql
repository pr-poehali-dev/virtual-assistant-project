-- Создание таблицы для хранения диалогов и обучающих данных
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    context_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_learned BOOLEAN DEFAULT FALSE
);

-- Создание таблицы для хранения базы знаний (FAQ)
CREATE TABLE knowledge_base (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[],
    category VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для переводов (кэш переводов для оффлайн режима)
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    source_text TEXT NOT NULL,
    source_lang VARCHAR(10),
    target_lang VARCHAR(10) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_text, target_lang)
);

-- Создание индексов для быстрого поиска
CREATE INDEX idx_conversations_user_message ON conversations USING gin(to_tsvector('russian', user_message));
CREATE INDEX idx_knowledge_keywords ON knowledge_base USING gin(keywords);
CREATE INDEX idx_translations_lookup ON translations(source_text, target_lang);

-- Добавление начальных данных в базу знаний
INSERT INTO knowledge_base (question, answer, keywords, category) VALUES
('привет', 'Здравствуйте! Я ваш виртуальный помощник. Готов помочь с любыми вопросами, переводами и задачами. Чем могу быть полезен?', ARRAY['привет', 'здравствуй', 'hello', 'hi'], 'greeting'),
('как дела', 'У меня всё отлично, спасибо! Я в режиме обучения и постоянно совершенствуюсь. Готов помочь вам с любыми задачами!', ARRAY['как дела', 'how are you'], 'greeting'),
('спасибо', 'Пожалуйста, всегда рад помочь! Если у вас есть ещё вопросы - обращайтесь.', ARRAY['спасибо', 'благодарю', 'thanks'], 'thanks'),
('возможности', 'Я умею: отвечать на вопросы, помогать с задачами, переводить тексты на любые языки мира, запоминать контекст разговора, работать в оффлайн режиме после обучения.', ARRAY['возможности', 'что умеешь', 'help', 'помощь'], 'info'),
('перевод', 'Я готов помочь с переводом! Укажите текст и язык перевода. Например: "Переведи на английский: Привет, как дела?"', ARRAY['перевод', 'переведи', 'translate'], 'translation');
