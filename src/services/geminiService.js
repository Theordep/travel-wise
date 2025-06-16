// 🤖 SERVIÇO DEDICADO PARA INTEGRAÇÃO COM GEMINI AI
import { GEMINI_CONFIG, GEMINI_UTILS, GEMINI_PROMPTS, ERROR_MESSAGES } from '../utils/constants.js'

class GeminiService {
    constructor() {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
        this.baseUrl = GEMINI_CONFIG.BASE_URL
        this.model = GEMINI_CONFIG.MODEL

        if (!this.apiKey) {
            console.warn('⚠️ Chave da API Gemini não configurada')
        }
    }

    /**
     * 🔗 Método principal para gerar conteúdo com Gemini AI
     * @param {string} prompt - Prompt para enviar para a IA
     * @param {Object} options - Opções de configuração
     * @returns {Promise<string>} - Texto gerado pela IA
     */
    async generateContent(prompt, options = {}) {
        try {
            // Validar se a API key está configurada
            if (!this.apiKey) {
                throw new Error('Chave da API Gemini não configurada. Verifique o arquivo .env')
            }

            // Configurações padrão + opções personalizadas
            const config = {
                ...GEMINI_CONFIG.GENERATION_CONFIG,
                ...options.generationConfig
            }

            const safetySettings = options.safetySettings || GEMINI_CONFIG.SAFETY_SETTINGS

            // Construir URL da API
            const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`

            // Payload da requisição
            const payload = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: config,
                safetySettings: safetySettings
            }

            console.log('🤖 Enviando requisição para Gemini AI...', {
                url: url.replace(this.apiKey, 'API_KEY_HIDDEN'),
                prompt: prompt.substring(0, 100) + '...',
                config
            })

            // Fazer requisição para a API
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('❌ Erro na API Gemini:', response.status, errorData)

                // Tratar diferentes tipos de erro
                switch (response.status) {
                    case 400:
                        throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: ${errorData.error?.message || 'Requisição inválida'}`)
                    case 401:
                        throw new Error(ERROR_MESSAGES.GEMINI_INVALID_KEY)
                    case 403:
                        throw new Error(`${ERROR_MESSAGES.UNAUTHORIZED}: ${errorData.error?.message || 'Acesso negado'}`)
                    case 429:
                        throw new Error(ERROR_MESSAGES.GEMINI_QUOTA_EXCEEDED)
                    case 500:
                        throw new Error(`${ERROR_MESSAGES.SERVER_ERROR}: ${errorData.error?.message || 'Erro interno'}`)
                    default:
                        throw new Error(`${ERROR_MESSAGES.GEMINI_ERROR}: ${response.status}`)
                }
            }

            // Parse da resposta
            const data = await response.json()
            console.log('✅ Resposta recebida do Gemini:', {
                candidates: data.candidates?.length || 0,
                finishReason: data.candidates?.[0]?.finishReason
            })

            // Validar e extrair texto da resposta
            if (!GEMINI_UTILS.validateResponse(data)) {
                console.error('❌ Resposta inválida:', data)

                // Verificar se o conteúdo foi bloqueado
                if (data.candidates?.[0]?.finishReason === 'SAFETY') {
                    throw new Error(ERROR_MESSAGES.GEMINI_CONTENT_BLOCKED)
                }

                throw new Error('Resposta inválida da API Gemini')
            }

            const generatedText = GEMINI_UTILS.extractText(data)
            console.log('📄 Texto extraído com sucesso:', generatedText.substring(0, 200) + '...')

            return generatedText

        } catch (error) {
            console.error('❌ Erro no GeminiService.generateContent:', error)
            throw error
        }
    }

    /**
     * 🎯 Método específico para gerar planos de viagem
     * @param {Object} travelData - Dados da viagem
     * @returns {Promise<Object>} - Plano de viagem estruturado
     */
    async generateTravelPlan(travelData) {
        try {
            const { destination, duration, travelType, travelers, budget, startDate } = travelData

            // Gerar prompt específico para viagem
            const prompt = GEMINI_PROMPTS.TRAVEL_PLAN(
                destination,
                duration,
                travelType,
                travelers,
                budget,
                startDate
            )

            // Gerar conteúdo com configurações otimizadas para viagem
            const generatedText = await this.generateContent(prompt, {
                generationConfig: {
                    temperature: 0.7, // Criatividade moderada
                    maxOutputTokens: 4096, // Resposta detalhada
                    topP: 0.8,
                    topK: 40
                }
            })

            // Fazer parse do JSON retornado
            const travelPlan = GEMINI_UTILS.parseJsonSafely(generatedText)

            if (!travelPlan) {
                console.warn('⚠️ Falha no parse do JSON, gerando plano de fallback')
                return this.createFallbackPlan(travelData)
            }

            // Validar estrutura do plano
            if (!this.validateTravelPlan(travelPlan)) {
                console.warn('⚠️ Plano gerado tem estrutura inválida, usando fallback')
                return this.createFallbackPlan(travelData)
            }

            console.log('✅ Plano de viagem gerado com sucesso!')
            return travelPlan

        } catch (error) {
            console.error('❌ Erro ao gerar plano de viagem:', error)

            // Em caso de erro, retornar plano de fallback
            console.log('🛡️ Usando plano de fallback devido ao erro')
            return this.createFallbackPlan(travelData)
        }
    }

    /**
     * ✅ Validar se o plano de viagem tem a estrutura correta
     * @param {Object} plan - Plano de viagem
     * @returns {boolean} - True se válido
     */
    validateTravelPlan(plan) {
        const requiredSections = ['baggage', 'tourism', 'budget', 'weather', 'useful_tips']

        return plan &&
            typeof plan === 'object' &&
            requiredSections.every(section =>
                plan[section] && typeof plan[section] === 'object'
            )
    }

    /**
     * 🛡️ Criar plano de fallback quando a IA falha
     * @param {Object} travelData - Dados da viagem
     * @returns {Object} - Plano de viagem padrão
     */
    createFallbackPlan(travelData) {
        const { destination, duration, travelType, travelers, budget } = travelData

        return {
            baggage: {
                clothes: [
                    `Roupas adequadas ao clima de ${destination}`,
                    'Sapatos confortáveis para caminhadas',
                    'Roupas casuais para o dia a dia',
                    'Roupas elegantes para ocasiões especiais',
                    'Roupas íntimas suficientes para a viagem'
                ],
                hygiene: [
                    'Escova e pasta de dentes',
                    'Shampoo e condicionador',
                    'Desodorante',
                    'Protetor solar',
                    'Medicamentos pessoais'
                ],
                accessories: [
                    'Óculos de sol',
                    'Carteira e documentos',
                    'Relógio',
                    'Acessórios locais apropriados'
                ],
                electronics: [
                    'Carregador de celular',
                    'Câmera fotográfica',
                    'Adaptador de tomada local',
                    'Power bank'
                ],
                documents: [
                    'Passaporte ou RG',
                    'Passagens de viagem',
                    'Reservas de hotel',
                    'Seguro viagem'
                ],
                luggage_size: 'Mala de tamanho médio adequada para a duração da viagem'
            },
            tourism: {
                attractions: [
                    `Principais pontos turísticos de ${destination}`,
                    'Museus e centros culturais locais',
                    'Parques e áreas naturais',
                    'Monumentos históricos',
                    'Centros de compras e mercados'
                ],
                hidden_gems: [
                    'Lugares únicos conhecidos pelos locais',
                    'Restaurantes tradicionais autênticos',
                    'Miradouros e pontos de vista especiais'
                ],
                daily_itinerary: [
                    'Planejamento personalizado será criado com base nas suas preferências',
                    'Roteiro flexível adaptado ao seu estilo de viagem',
                    'Atividades balanceadas entre cultura e lazer'
                ],
                food_recommendations: [
                    `Pratos típicos de ${destination}`,
                    'Restaurantes bem avaliados localmente',
                    'Experiências gastronômicas autênticas',
                    'Opções para diferentes orçamentos'
                ],
                cultural_tips: [
                    'Costumes locais importantes',
                    'Etiqueta social e de negócios',
                    'Tradições e festivais da região'
                ],
                transportation: [
                    'Transporte público local',
                    'Opções de táxi e rideshare',
                    'Aluguel de veículos se necessário'
                ]
            },
            budget: {
                accommodation: 'R$ 150-300/dia',
                food: 'R$ 80-150/dia',
                transportation: 'R$ 50-100/dia',
                activities: 'R$ 100-200/dia',
                total_estimated: `R$ ${(parseInt(duration) || 7) * 400} - R$ ${(parseInt(duration) || 7) * 700}`,
                money_saving_tips: [
                    'Reserve acomodações com antecedência',
                    'Use transporte público quando possível',
                    'Coma em restaurantes locais'
                ]
            },
            weather: {
                climate_description: `Clima típico de ${destination} na época escolhida`,
                temperature_range: 'Temperaturas moderadas',
                rain_probability: 'Verifique previsão antes da viagem',
                what_to_expect: 'Condições climáticas adequadas para turismo'
            },
            useful_tips: [
                `Pesquise sobre a cultura de ${destination}`,
                'Mantenha cópias digitais dos documentos',
                'Aprenda algumas palavras básicas do idioma local',
                'Verifique requisitos de visto se necessário',
                'Contrate seguro viagem apropriado'
            ]
        }
    }

    /**
     * 🔄 Método para melhorar planos existentes
     * @param {Object} existingPlan - Plano existente
     * @param {string} feedback - Feedback do usuário
     * @returns {Promise<Object>} - Plano melhorado
     */
    async improveTravelPlan(existingPlan, feedback) {
        try {
            const prompt = GEMINI_PROMPTS.TRAVEL_PLAN_REVIEW(existingPlan, feedback)
            const generatedText = await this.generateContent(prompt)
            const improvedPlan = GEMINI_UTILS.parseJsonSafely(generatedText)

            return improvedPlan || existingPlan
        } catch (error) {
            console.error('❌ Erro ao melhorar plano:', error)
            return existingPlan
        }
    }

    /**
     * 📊 Método para obter estatísticas de uso
     * @returns {Object} - Estatísticas do serviço
     */
    getStats() {
        return {
            apiKeyConfigured: !!this.apiKey,
            model: this.model,
            baseUrl: this.baseUrl,
            fallbackEnabled: true
        }
    }
}

// 🏭 Singleton instance
const geminiService = new GeminiService()

export default geminiService

// 🔧 Funções utilitárias para uso direto
export const generateTravelPlan = (travelData) => geminiService.generateTravelPlan(travelData)
export const improveTravelPlan = (existingPlan, feedback) => geminiService.improveTravelPlan(existingPlan, feedback)
export const getGeminiStats = () => geminiService.getStats()