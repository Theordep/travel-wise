import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import geminiService from '../services/geminiService.js'
import { TRAVEL_TYPES, SUCCESS_MESSAGES } from '../utils/constants.js'

function TravelPlanner() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        duration: '',
        travelType: 'Turismo',
        budget: '',
        travelers: '1'
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (error) setError('')
    }

    // 🤖 FUNÇÃO PRINCIPAL USANDO O SERVIÇO GEMINI
    const generateTravelPlan = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            console.log('🚀 Iniciando geração do plano de viagem...')

            // 🔥 Usar o serviço dedicado do Gemini
            const travelPlan = await geminiService.generateTravelPlan(formData)

            console.log('✅ Plano gerado:', travelPlan)

            // 💾 Salvar no JSON Server
            console.log('💾 Salvando viagem no banco de dados...')
            const travelData = {
                ...formData,
                userId: user.id,
                status: 'planned',
                createdAt: new Date().toISOString(),
                travelPlan: travelPlan
            }

            const saveResponse = await fetch('http://localhost:3001/travels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(travelData)
            })

            if (!saveResponse.ok) {
                throw new Error('Erro ao salvar viagem no banco de dados')
            }

            const savedTravel = await saveResponse.json()
            console.log('✅ Viagem salva com sucesso:', savedTravel.id)

            // 🚀 Redirecionar para página de resultados
            navigate(`/app/results/${savedTravel.id}`)

        } catch (error) {
            console.error('❌ Erro ao gerar plano de viagem:', error)
            throw error
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // ✅ Validações
            if (!formData.destination.trim()) {
                throw new Error('Por favor, informe o destino')
            }
            if (!formData.startDate) {
                throw new Error('Por favor, selecione a data de início')
            }
            if (!formData.duration || formData.duration < 1) {
                throw new Error('Por favor, informe a duração da viagem')
            }
            if (!formData.travelers || formData.travelers < 1) {
                throw new Error('Número de viajantes deve ser pelo menos 1')
            }

            // 🔑 Verificar configuração do Gemini
            const geminiStats = geminiService.getStats()
            if (!geminiStats.apiKeyConfigured) {
                throw new Error('Chave da API Gemini não configurada. Verifique o arquivo .env')
            }

            console.log('🤖 Status do Gemini:', geminiStats)

            await generateTravelPlan()

        } catch (error) {
            console.error('❌ Erro no handleSubmit:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // 🧪 Função para testar conexão com Gemini
    const testGeminiConnection = async () => {
        try {
            setIsLoading(true)
            const testPrompt = "Responda apenas: 'Conexão funcionando!'"
            const response = await geminiService.generateContent(testPrompt)
            alert(`✅ Teste bem-sucedido! Resposta: ${response.substring(0, 100)}`)
        } catch (error) {
            alert(`❌ Erro no teste: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <LoadingSpinner message="🤖 Nossa IA está criando seu plano de viagem personalizado..." />
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        ✈️ Planejador Inteligente de Viagens
                    </h1>
                    <p className="text-gray-600">
                        Informe os detalhes da sua viagem e nossa IA criará um plano completo personalizado
                    </p>
                    
                    {/* Debug Info - apenas em desenvolvimento */}
                    {import.meta.env.DEV && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">
                                🔧 Modo Desenvolvimento | 
                                API Key: {import.meta.env.VITE_GEMINI_API_KEY ? '✅ Configurada' : '❌ Não configurada'}
                            </p>
                            <button
                                onClick={testGeminiConnection}
                                className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                🧪 Testar Conexão Gemini
                            </button>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center space-x-2">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Destino */}
                        <div>
                            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                                🌍 Destino
                            </label>
                            <input
                                type="text"
                                id="destination"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Ex: Paris, França"
                            />
                        </div>

                        {/* Data de Início */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                📅 Data de Início
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Duração */}
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                ⏰ Duração (dias)
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                min="1"
                                max="365"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Ex: 7"
                            />
                        </div>

                        {/* Número de Viajantes */}
                        <div>
                            <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2">
                                👥 Número de Viajantes
                            </label>
                            <input
                                type="number"
                                id="travelers"
                                name="travelers"
                                value={formData.travelers}
                                onChange={handleChange}
                                required
                                min="1"
                                max="20"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Tipo de Viagem */}
                        <div>
                            <label htmlFor="travelType" className="block text-sm font-medium text-gray-700 mb-2">
                                🎯 Tipo de Viagem
                            </label>
                            <select
                                id="travelType"
                                name="travelType"
                                value={formData.travelType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                                {TRAVEL_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Orçamento */}
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                                💰 Orçamento Estimado (opcional)
                            </label>
                            <input
                                type="text"
                                id="budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Ex: R$ 3.000"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto shadow-lg"
                        >
                            <span className="text-xl">🤖</span>
                            <span>Gerar Plano de Viagem Inteligente</span>
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-2">
                            Powered by Google Gemini AI ⚡
                        </p>
                    </div>
                </form>

                {/* Features Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="text-4xl mb-3">🎒</div>
                        <h3 className="font-bold text-gray-800 mb-2">Bagagem Inteligente</h3>
                        <p className="text-sm text-gray-600">
                            Lista personalizada baseada no clima, cultura e atividades do destino
                        </p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="text-4xl mb-3">🗺️</div>
                        <h3 className="font-bold text-gray-800 mb-2">Roteiro Personalizado</h3>
                        <p className="text-sm text-gray-600">
                            Pontos turísticos, restaurantes e atividades recomendadas pela IA
                        </p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="text-4xl mb-3">💰</div>
                        <h3 className="font-bold text-gray-800 mb-2">Orçamento Detalhado</h3>
                        <p className="text-sm text-gray-600">
                            Estimativas precisas e dicas de economia para sua viagem
                        </p>
                    </div>
                </div>

                {/* AI Info Section */}
                <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-3xl">🤖</div>
                        <h3 className="text-xl font-bold text-gray-800">Powered by Gemini AI</h3>
                    </div>
                    <p className="text-center text-gray-600 text-sm">
                        Nossa IA considera <strong>clima, cultura local, época do ano, tipo de viagem</strong> e suas preferências 
                        para criar um plano único e personalizado. Cada recomendação é baseada em dados atualizados e 
                        experiências reais de viajantes.
                    </p>
                </div>

                {/* Example Destinations */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        🌟 Destinos Populares
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            'Paris, França',
                            'Tóquio, Japão', 
                            'Nova York, EUA',
                            'Barcelona, Espanha',
                            'Rio de Janeiro, Brasil',
                            'Londres, Inglaterra',
                            'Bangkok, Tailândia',
                            'Buenos Aires, Argentina'
                        ].map((destination) => (
                            <button
                                key={destination}
                                onClick={() => setFormData(prev => ({ ...prev, destination }))}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                            >
                                {destination}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TravelPlanner