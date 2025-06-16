import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner'

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

    const travelTypes = [
        'Turismo',
        'Negócios',
        'Aventura',
        'Romântico',
        'Família',
        'Cultural',
        'Relaxamento',
        'Gastronômico'
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (error) setError('')
    }

    const generateTravelPlan = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            // Prompt para a IA Gemini
            const prompt = `
        Crie um plano completo de viagem para:
        
        DESTINO: ${formData.destination}
        DURAÇÃO: ${formData.duration} dias
        TIPO DE VIAGEM: ${formData.travelType}
        NÚMERO DE VIAJANTES: ${formData.travelers}
        ORÇAMENTO ESTIMADO: ${formData.budget || 'Não informado'}
        DATA INICIAL: ${formData.startDate}
        
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

            // Chamada para a API Gemini
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            })

            if (!response.ok) {
                throw new Error('Erro na API do Gemini')
            }

            const data = await response.json()
            const generatedText = data.candidates[0].content.parts[0].text

            // Tentar extrair JSON da resposta
            let travelPlan
            try {
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    travelPlan = JSON.parse(jsonMatch[0])
                } else {
                    throw new Error('Formato JSON não encontrado')
                }
            } catch (parseError) {
                // Se não conseguir parsear, criar estrutura padrão
                travelPlan = {
                    baggage: {
                        clothes: ['Roupas adequadas ao clima', 'Sapatos confortáveis'],
                        hygiene: ['Escova de dentes', 'Pasta de dentes', 'Shampoo'],
                        accessories: ['Óculos de sol', 'Protetor solar'],
                        electronics: ['Carregador de celular', 'Câmera'],
                        documents: ['Passaporte', 'Documentos de identidade'],
                        luggage_size: 'Mala de tamanho médio'
                    },
                    tourism: {
                        attractions: ['Pontos turísticos principais da região'],
                        hidden_gems: ['Lugares únicos para explorar'],
                        daily_itinerary: ['Roteiro personalizado'],
                        food_recommendations: ['Pratos típicos locais'],
                        cultural_tips: ['Dicas culturais importantes'],
                        transportation: ['Opções de transporte']
                    },
                    budget: {
                        accommodation: 'R$ 150-300/dia',
                        food: 'R$ 80-150/dia',
                        transportation: 'R$ 50-100/dia',
                        activities: 'R$ 100-200/dia',
                        total_estimated: 'Estimativa será calculada',
                        money_saving_tips: ['Dicas de economia']
                    },
                    weather: {
                        climate_description: 'Clima da região na época escolhida',
                        temperature_range: 'Faixa de temperatura',
                        rain_probability: 'Probabilidade de chuva',
                        what_to_expect: 'Condições climáticas esperadas'
                    },
                    useful_tips: ['Dicas importantes para a viagem']
                }
            }

            // Salvar no JSON Server
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
                throw new Error('Erro ao salvar viagem')
            }

            const savedTravel = await saveResponse.json()
            navigate(`/app/results/${savedTravel.id}`)

        } catch (error) {
            console.error('Erro ao gerar plano de viagem:', error)
            throw error
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // Validações
            if (!formData.destination.trim()) {
                throw new Error('Por favor, informe o destino')
            }
            if (!formData.startDate) {
                throw new Error('Por favor, selecione a data de início')
            }
            if (!formData.duration || formData.duration < 1) {
                throw new Error('Por favor, informe a duração da viagem')
            }

            await generateTravelPlan()
        } catch (error) {
            setError(error.message)
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {travelTypes.map(type => (
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: R$ 3.000"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                        >
                            <span>🤖</span>
                            <span>Gerar Plano de Viagem Inteligente</span>
                        </button>
                    </div>
                </form>

                {/* Features Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl mb-2">🎒</div>
                        <h3 className="font-semibold text-gray-800 mb-1">Bagagem Inteligente</h3>
                        <p className="text-sm text-gray-600">Lista personalizada baseada no clima e atividades</p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl mb-2">🗺️</div>
                        <h3 className="font-semibold text-gray-800 mb-1">Roteiro Personalizado</h3>
                        <p className="text-sm text-gray-600">Pontos turísticos e atividades recomendadas</p>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-3xl mb-2">💰</div>
                        <h3 className="font-semibold text-gray-800 mb-1">Orçamento Detalhado</h3>
                        <p className="text-sm text-gray-600">Estimativas precisas por categoria de gasto</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TravelPlanner