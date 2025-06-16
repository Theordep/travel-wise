// API URLs
export const API_BASE_URL = 'http://localhost:3001'
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

// API Endpoints
export const ENDPOINTS = {
    USERS: '/users',
    SERVICES: '/services',
    TRAVELS: '/travels'
}

// Travel Types
export const TRAVEL_TYPES = [
    'Turismo',
    'Negócios',
    'Aventura',
    'Romântico',
    'Família',
    'Cultural',
    'Relaxamento',
    'Gastronômico',
    'Esportes',
    'Natureza'
]

// Service Categories
export const SERVICE_CATEGORIES = [
    'Consultoria',
    'Planejamento',
    'Transporte',
    'Hospedagem',
    'Turismo',
    'Alimentação',
    'Seguro',
    'Documentação'
]

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user'
}

// Travel Status
export const TRAVEL_STATUS = {
    PLANNED: 'planned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
}

// Category Icons
export const CATEGORY_ICONS = {
    'Consultoria': '💼',
    'Planejamento': '📋',
    'Transporte': '🚗',
    'Hospedagem': '🏨',
    'Turismo': '🗺️',
    'Alimentação': '🍽️',
    'Seguro': '🛡️',
    'Documentação': '📄'
}

// Travel Type Icons
export const TRAVEL_TYPE_ICONS = {
    'Turismo': '🏛️',
    'Negócios': '💼',
    'Aventura': '🏔️',
    'Romântico': '💕',
    'Família': '👨‍👩‍👧‍👦',
    'Cultural': '🎭',
    'Relaxamento': '🧘',
    'Gastronômico': '🍷',
    'Esportes': '⚽',
    'Natureza': '🌲'
}

// Validation Rules
export const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    MIN_PASSWORD_LENGTH: 6,
    MAX_TRAVEL_DURATION: 365,
    MIN_TRAVEL_DURATION: 1,
    MAX_TRAVELERS: 20,
    MIN_TRAVELERS: 1
}

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
    VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
    AUTH_ERROR: 'Credenciais inválidas.',
    NOT_FOUND: 'Recurso não encontrado.',
    UNAUTHORIZED: 'Acesso não autorizado.',
    GEMINI_ERROR: 'Erro na API do Gemini. Tente novamente.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
    USER_CREATED: 'Usuário criado com sucesso!',
    USER_UPDATED: 'Usuário atualizado com sucesso!',
    USER_DELETED: 'Usuário excluído com sucesso!',
    SERVICE_CREATED: 'Serviço criado com sucesso!',
    SERVICE_UPDATED: 'Serviço atualizado com sucesso!',
    SERVICE_DELETED: 'Serviço excluído com sucesso!',
    TRAVEL_CREATED: 'Plano de viagem criado com sucesso!',
    LOGIN_SUCCESS: 'Login realizado com sucesso!'
}

// Local Storage Keys
export const STORAGE_KEYS = {
    USER: 'user',
    TRAVEL_PLANS: 'travel_plans',
    PREFERENCES: 'user_preferences'
}

// Default Values
export const DEFAULTS = {
    TRAVEL_DURATION: 7,
    TRAVELERS_COUNT: 1,
    TRAVEL_TYPE: 'Turismo',
    USER_ROLE: 'user',
    SERVICE_CATEGORY: 'Consultoria'
}

// API Response Status
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

// Prompt Templates for Gemini AI
export const GEMINI_PROMPTS = {
    TRAVEL_PLAN: (destination, duration, travelType, travelers, budget, startDate) => `
    Crie um plano completo de viagem para:
    
    DESTINO: ${destination}
    DURAÇÃO: ${duration} dias
    TIPO DE VIAGEM: ${travelType}
    NÚMERO DE VIAJANTES: ${travelers}
    ORÇAMENTO ESTIMADO: ${budget || 'Não informado'}
    DATA INICIAL: ${startDate}
    
    Por favor, forneça um plano estruturado em JSON com as seguintes seções:
    
    {
      "baggage": {
        "clothes": ["lista de roupas recomendadas"],
        "hygiene": ["lista de itens de higiene"],
        "accessories": ["lista de acessórios"],
        "electronics": ["lista de eletrônicos"],
        "documents": ["documentos necessários"],
        "luggage_size": "tamanho recomendado da mala"
      },
      "tourism": {
        "attractions": ["pontos turísticos principais"],
        "hidden_gems": ["lugares menos conhecidos"],
        "daily_itinerary": ["roteiro dia a dia"],
        "food_recommendations": ["restaurantes e pratos típicos"],
        "cultural_tips": ["dicas culturais importantes"],
        "transportation": ["opções de transporte local"]
      },
      "budget": {
        "accommodation": "valor médio hospedagem por dia",
        "food": "valor médio alimentação por dia",
        "transportation": "valor médio transporte",
        "activities": "valor médio atividades por dia",
        "total_estimated": "estimativa total da viagem",
        "money_saving_tips": ["dicas para economizar"]
      },
      "weather": {
        "climate_description": "descrição do clima na época",
        "temperature_range": "faixa de temperatura",
        "rain_probability": "probabilidade de chuva",
        "what_to_expect": "o que esperar do tempo"
      },
      "useful_tips": [
        "dicas gerais importantes para o destino"
      ]
    }
    
    Seja específico e detalhado. Considere a época do ano, o clima local, a cultura do destino e o tipo de viagem especificado.
  `
}

// Application Configuration
export const APP_CONFIG = {
    NAME: 'TravelWise',
    VERSION: '1.0.0',
    DESCRIPTION: 'Recomendador Inteligente de Viagens',
    AUTHOR: 'Estudantes de Front-end',
    CONTACT_EMAIL: 'contato@travelwise.com',
    CONTACT_PHONE: '(48) 99999-9999',
    ADDRESS: 'Criciúma, Santa Catarina, Brasil'
}

// Feature Flags
export const FEATURES = {
    GEMINI_AI: true,
    PRINT_FUNCTIONALITY: true,
    EXPORT_PDF: false, // Não implementado ainda
    SHARE_LINK: false, // Não implementado ainda
    DARK_MODE: false, // Não implementado ainda
    MULTI_LANGUAGE: false // Não implementado ainda
}

export default {
    API_BASE_URL,
    GEMINI_API_URL,
    ENDPOINTS,
    TRAVEL_TYPES,
    SERVICE_CATEGORIES,
    USER_ROLES,
    TRAVEL_STATUS,
    CATEGORY_ICONS,
    TRAVEL_TYPE_ICONS,
    VALIDATION,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    STORAGE_KEYS,
    DEFAULTS,
    HTTP_STATUS,
    GEMINI_PROMPTS,
    APP_CONFIG,
    FEATURES
}