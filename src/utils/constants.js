// API URLs
export const API_BASE_URL = 'http://localhost:3001'
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// API Endpoints
export const ENDPOINTS = {
    USERS: '/users',
    SERVICES: '/services',
    TRAVELS: '/travels'
}

// 🤖 CONFIGURAÇÕES GEMINI AI
export const GEMINI_CONFIG = {
    // Modelo recomendado para texto
    MODEL: 'gemini-1.5-flash',
    
    // URL base da API
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    
    // Configurações de geração
    GENERATION_CONFIG: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        topP: 0.8,
        topK: 40,
    },
    
    // Configurações de segurança
    SAFETY_SETTINGS: [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
    ]
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
    GEMINI_ERROR: 'Erro na API do Gemini. Tente novamente.',
    GEMINI_QUOTA_EXCEEDED: 'Limite da API Gemini excedido. Tente novamente mais tarde.',
    GEMINI_INVALID_KEY: 'Chave da API Gemini inválida.',
    GEMINI_PARSE_ERROR: 'Erro ao processar resposta da IA.',
    GEMINI_CONTENT_BLOCKED: 'Conteúdo bloqueado por políticas de segurança.'
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
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    GEMINI_SUCCESS: 'IA gerou seu plano com sucesso!'
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
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
}

// 🤖 TEMPLATES DE PROMPTS PARA GEMINI AI
export const GEMINI_PROMPTS = {
    // Template principal para planejamento de viagem
    TRAVEL_PLAN: (destination, duration, travelType, travelers, budget, startDate) => `
Você é um especialista em planejamento de viagens com 20 anos de experiência. Crie um plano COMPLETO e DETALHADO de viagem baseado nas informações abaixo:

🌍 DESTINO: ${destination}
📅 DATA DE INÍCIO: ${startDate}
⏰ DURAÇÃO: ${duration} dias
🎯 TIPO DE VIAGEM: ${travelType}
👥 NÚMERO DE VIAJANTES: ${travelers} pessoa(s)
💰 ORÇAMENTO ESTIMADO: ${budget || 'Não informado'}

INSTRUÇÕES IMPORTANTES:
- Considere a época do ano e clima local
- Seja específico com nomes reais de lugares, restaurantes e valores atualizados
- Adapte as recomendações ao tipo de viagem especificado
- Use valores em moeda local e conversões para reais quando apropriado
- Inclua dicas práticas e específicas do destino

RETORNE APENAS UM JSON VÁLIDO no formato exato abaixo (sem texto adicional):

{
  "baggage": {
    "clothes": [
      "Item específico de roupa 1 adequado ao clima",
      "Item específico de roupa 2",
      "Item específico de roupa 3",
      "Item específico de roupa 4",
      "Item específico de roupa 5"
    ],
    "hygiene": [
      "Item de higiene 1",
      "Item de higiene 2",
      "Item de higiene 3",
      "Item de higiene 4",
      "Item de higiene 5"
    ],
    "accessories": [
      "Acessório necessário 1",
      "Acessório necessário 2",
      "Acessório necessário 3",
      "Acessório necessário 4"
    ],
    "electronics": [
      "Eletrônico essencial 1",
      "Eletrônico essencial 2",
      "Eletrônico essencial 3",
      "Eletrônico essencial 4"
    ],
    "documents": [
      "Documento obrigatório 1",
      "Documento obrigatório 2",
      "Documento obrigatório 3",
      "Documento obrigatório 4"
    ],
    "luggage_size": "Tamanho e tipo de mala específico recomendada"
  },
  "tourism": {
    "attractions": [
      "Nome real da atração 1 - descrição breve",
      "Nome real da atração 2 - descrição breve",
      "Nome real da atração 3 - descrição breve",
      "Nome real da atração 4 - descrição breve",
      "Nome real da atração 5 - descrição breve"
    ],
    "hidden_gems": [
      "Nome real do lugar único 1",
      "Nome real do lugar único 2",
      "Nome real do lugar único 3"
    ],
    "daily_itinerary": [
      "Dia 1: Atividades detalhadas e específicas",
      "Dia 2: Atividades detalhadas e específicas",
      "Dia 3: Atividades detalhadas e específicas"
    ],
    "food_recommendations": [
      "Nome real do restaurante/prato 1",
      "Nome real do restaurante/prato 2",
      "Nome real do restaurante/prato 3",
      "Nome real do restaurante/prato 4"
    ],
    "cultural_tips": [
      "Dica cultural específica e prática 1",
      "Dica cultural específica e prática 2",
      "Dica cultural específica e prática 3"
    ],
    "transportation": [
      "Meio de transporte 1 - detalhes e preços",
      "Meio de transporte 2 - detalhes e preços",
      "Meio de transporte 3 - detalhes e preços"
    ]
  },
  "budget": {
    "accommodation": "Valor em moeda local por dia",
    "food": "Valor em moeda local por dia",
    "transportation": "Valor total estimado",
    "activities": "Valor em moeda local por dia",
    "total_estimated": "Valor total em Reais (R$)",
    "money_saving_tips": [
      "Dica específica de economia 1",
      "Dica específica de economia 2",
      "Dica específica de economia 3"
    ]
  },
  "weather": {
    "climate_description": "Descrição detalhada do clima na época específica",
    "temperature_range": "Faixa de temperatura em °C",
    "rain_probability": "Probabilidade e padrão de chuva",
    "what_to_expect": "O que esperar do tempo durante a viagem"
  },
  "useful_tips": [
    "Dica importante e específica 1",
    "Dica importante e específica 2",
    "Dica importante e específica 3",
    "Dica importante e específica 4",
    "Dica importante e específica 5"
  ]
}`,

    // Template para revisão/melhoria de planos
    TRAVEL_PLAN_REVIEW: (existingPlan, feedback) => `
Revise e melhore o plano de viagem abaixo baseado no feedback fornecido:

PLANO EXISTENTE:
${JSON.stringify(existingPlan, null, 2)}

FEEDBACK DO USUÁRIO:
${feedback}

Retorne o plano atualizado no mesmo formato JSON, incorporando as melhorias solicitadas.`,

    // Template para sugestões rápidas
    QUICK_SUGGESTIONS: (destination, days) => `
Forneça 5 sugestões rápidas para uma viagem de ${days} dias para ${destination}.
Formato: lista simples, uma sugestão por linha.`
}

// 🔧 UTILITÁRIOS PARA GEMINI AI
export const GEMINI_UTILS = {
    // Função para construir URL da API
    buildApiUrl: (model = GEMINI_CONFIG.MODEL) => {
        return `${GEMINI_CONFIG.BASE_URL}/${model}:generateContent`
    },

    // Função para validar resposta da API
    validateResponse: (response) => {
        return response && 
               response.candidates && 
               response.candidates[0] && 
               response.candidates[0].content &&
               response.candidates[0].content.parts &&
               response.candidates[0].content.parts[0] &&
               response.candidates[0].content.parts[0].text
    },

    // Função para extrair texto da resposta
    extractText: (response) => {
        if (!GEMINI_UTILS.validateResponse(response)) {
            throw new Error('Resposta inválida da API Gemini')
        }
        return response.candidates[0].content.parts[0].text
    },

    // Função para limpar JSON da resposta
    cleanJsonText: (text) => {
        return text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .replace(/^[^{]*/, '') // Remove texto antes do primeiro {
            .replace(/[^}]*$/, '') // Remove texto depois do último }
            .trim()
    },

    // Função para fazer parse seguro do JSON
    parseJsonSafely: (text) => {
        try {
            const cleanedText = GEMINI_UTILS.cleanJsonText(text)
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
            
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            } else {
                throw new Error('Formato JSON não encontrado na resposta')
            }
        } catch (error) {
            console.error('Erro ao fazer parse do JSON:', error)
            return null
        }
    }
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
    GEMINI_FALLBACK: true, // Usar plano padrão se IA falhar
    PRINT_FUNCTIONALITY: true,
    EXPORT_PDF: false, // Não implementado ainda
    SHARE_LINK: false, // Não implementado ainda
    DARK_MODE: false, // Não implementado ainda
    MULTI_LANGUAGE: false // Não implementado ainda
}

export default {
    API_BASE_URL,
    GEMINI_API_URL,
    GEMINI_CONFIG,
    GEMINI_UTILS,
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