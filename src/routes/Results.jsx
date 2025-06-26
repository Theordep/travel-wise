import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner'

function Results() {
    const { travelId } = useParams()
    const navigate = useNavigate()
    const [travel, setTravel] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('baggage')

    useEffect(() => {
        loadTravelData()
    }, [travelId])

    const loadTravelData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/travels/${travelId}`)
            if (!response.ok) {
                throw new Error('Viagem não encontrada')
            }
            const travelData = await response.json()
            setTravel(travelData)
        } catch (error) {
            console.error('Erro ao carregar dados da viagem:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const tabs = [
        { id: 'baggage', label: 'Bagagem', icon: '🎒' },
        { id: 'tourism', label: 'Turismo', icon: '🗺️' },
        { id: 'budget', label: 'Orçamento', icon: '💰' },
        { id: 'weather', label: 'Clima', icon: '🌤️' },
        { id: 'tips', label: 'Dicas', icon: '💡' }
    ]

    if (isLoading) {
        return <LoadingSpinner message="Carregando seu plano de viagem..." />
    }

    if (error || !travel) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Algo deu errado</h2>
                <p className="text-gray-600 mb-6">{error || 'Não foi possível carregar os dados da viagem'}</p>
                <button
                    onClick={() => navigate('/app/travel-planner')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                    Voltar ao Planejador
                </button>
            </div>
        )
    }

    const { travelPlan } = travel

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            ✈️ Seu Plano de Viagem Personalizado
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-blue-100">
                            <div className="flex-col justify-center">
                                <span className="block text-sm">Destino</span>
                                <span className="font-semibold">{travel.destination}</span>
                            </div>
                            <div className="flex-col justify-center">
                                <span className="block text-sm">Data</span>
                                <span className="font-semibold">{formatDate(travel.startDate)}</span>
                            </div>
                            <div className="flex-col justify-center">
                                <span className="block text-sm">Duração</span>
                                <span className="font-semibold">{travel.duration} dias</span>
                            </div>
                            <div className="flex-col justify-center">
                                <span className="block text-sm">Tipo</span>
                                <span className="font-semibold">{travel.travelType}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block text-6xl">
                        🎯
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-lg mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex justify-start px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Baggage Tab */}
                    {activeTab === 'baggage' && travelPlan?.baggage && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">🎒 Recomendações de Bagagem</h2>
                                <p className="text-gray-600">Lista personalizada baseada no seu destino e tipo de viagem</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">👕</span>
                                        Roupas
                                    </h3>
                                    <ul className="space-y-2">
                                        {travelPlan.baggage.clothes?.map((item, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-green-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🧴</span>
                                        Higiene
                                    </h3>
                                    <ul className="space-y-2">
                                        {travelPlan.baggage.hygiene?.map((item, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">👓</span>
                                        Acessórios
                                    </h3>
                                    <ul className="space-y-2">
                                        {travelPlan.baggage.accessories?.map((item, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">📱</span>
                                        Eletrônicos
                                    </h3>
                                    <ul className="space-y-2">
                                        {travelPlan.baggage.electronics?.map((item, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-red-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">📄</span>
                                        Documentos
                                    </h3>
                                    <ul className="space-y-2">
                                        {travelPlan.baggage.documents?.map((item, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🧳</span>
                                        Mala Recomendada
                                    </h3>
                                    <p className="text-gray-700 text-sm">{travelPlan.baggage.luggage_size}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tourism Tab */}
                    {activeTab === 'tourism' && travelPlan?.tourism && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">🗺️ Guia Turístico</h2>
                                <p className="text-gray-600">Descubra os melhores lugares e experiências do seu destino</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🏛️</span>
                                        Principais Atrações
                                    </h3>
                                    <div className="space-y-3">
                                        {travelPlan.tourism.attractions?.map((attraction, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="text-blue-500 font-bold mr-3">{index + 1}.</span>
                                                <span className="text-gray-700">{attraction}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">💎</span>
                                        Lugares Únicos
                                    </h3>
                                    <div className="space-y-3">
                                        {travelPlan.tourism.hidden_gems?.map((gem, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="text-purple-500 font-bold mr-3">•</span>
                                                <span className="text-gray-700">{gem}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🍽️</span>
                                        Gastronomia
                                    </h3>
                                    <div className="space-y-3">
                                        {travelPlan.tourism.food_recommendations?.map((food, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="text-green-500 font-bold mr-3">🍴</span>
                                                <span className="text-gray-700">{food}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🚌</span>
                                        Transporte Local
                                    </h3>
                                    <div className="space-y-3">
                                        {travelPlan.tourism.transportation?.map((transport, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="text-yellow-500 font-bold mr-3">🚗</span>
                                                <span className="text-gray-700">{transport}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Daily Itinerary */}
                            {travelPlan.tourism.daily_itinerary?.length > 0 && (
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">📅</span>
                                        Roteiro Sugerido
                                    </h3>
                                    <div className="space-y-3">
                                        {travelPlan.tourism.daily_itinerary.map((day, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-3">
                                                    Dia {index + 1}
                                                </span>
                                                <span className="text-gray-700">{day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cultural Tips */}
                            {travelPlan.tourism.cultural_tips?.length > 0 && (
                                <div className="bg-orange-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🏛️</span>
                                        Dicas Culturais
                                    </h3>
                                    <div className="space-y-3">
                                        {travelPlan.tourism.cultural_tips.map((tip, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="text-orange-500 font-bold mr-3">💡</span>
                                                <span className="text-gray-700">{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Budget Tab */}
                    {activeTab === 'budget' && travelPlan?.budget && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">💰 Estimativa de Orçamento</h2>
                                <p className="text-gray-600">Planejamento financeiro detalhado para sua viagem</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="text-3xl mb-2">🏨</div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Hospedagem</h3>
                                    <p className="text-2xl font-bold text-blue-600">{travelPlan.budget.accommodation}</p>
                                    <p className="text-sm text-gray-500">por dia</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="text-3xl mb-2">🍽️</div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Alimentação</h3>
                                    <p className="text-2xl font-bold text-green-600">{travelPlan.budget.food}</p>
                                    <p className="text-sm text-gray-500">por dia</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="text-3xl mb-2">🚌</div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Transporte</h3>
                                    <p className="text-2xl font-bold text-yellow-600">{travelPlan.budget.transportation}</p>
                                    <p className="text-sm text-gray-500">total</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="text-3xl mb-2">🎭</div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Atividades</h3>
                                    <p className="text-2xl font-bold text-purple-600">{travelPlan.budget.activities}</p>
                                    <p className="text-sm text-gray-500">por dia</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center">
                                <h3 className="text-2xl font-bold mb-2">💎 Estimativa Total</h3>
                                <p className="text-4xl font-bold mb-2">{travelPlan.budget.total_estimated}</p>
                                <p className="text-blue-100">Para {travel.duration} dias • {travel.travelers} pessoa(s)</p>
                            </div>

                            {/* Money Saving Tips */}
                            {travelPlan.budget.money_saving_tips?.length > 0 && (
                                <div className="bg-green-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">💡</span>
                                        Dicas para Economizar
                                    </h3>
                                    <div className="space-y-3">
                                        {travelPlan.budget.money_saving_tips.map((tip, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="text-green-500 font-bold mr-3">💰</span>
                                                <span className="text-gray-700">{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Weather Tab */}
                    {activeTab === 'weather' && travelPlan?.weather && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">🌤️ Informações Climáticas</h2>
                                <p className="text-gray-600">Condições esperadas para o período da sua viagem</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🌡️</span>
                                        Temperatura
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600 mb-2">{travelPlan.weather.temperature_range}</p>
                                    <p className="text-gray-700">{travelPlan.weather.climate_description}</p>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="mr-2">🌧️</span>
                                        Precipitação
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600 mb-2">{travelPlan.weather.rain_probability}</p>
                                    <p className="text-gray-700">{travelPlan.weather.what_to_expect}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tips Tab */}
                    {activeTab === 'tips' && travelPlan?.useful_tips && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">💡 Dicas Importantes</h2>
                                <p className="text-gray-600">Informações essenciais para uma viagem perfeita</p>
                            </div>

                            <div className="space-y-4">
                                {travelPlan.useful_tips.map((tip, index) => (
                                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <span className="text-yellow-500 text-xl mr-3">💡</span>
                                            <div>
                                                <p className="text-gray-800 font-medium">Dica #{index + 1}</p>
                                                <p className="text-gray-700 mt-1">{tip}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mb-8">
                <button
                    onClick={() => navigate('/app/travel-planner')}
                    className="flex-col justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 space-x-2"
                >
                    <span>➕</span>
                    <span>Nova Viagem</span>
                </button>

                <button
                    onClick={() => window.print()}
                    className="flex-col justify-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 space-x-2"
                >
                    <span>🖨️</span>
                    <span>Imprimir</span>
                </button>

                <button
                    onClick={() => navigate('/app/home')}
                    className="flex-col justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 space-x-2"
                >
                    <span>🏠</span>
                    <span>Voltar ao Início</span>
                </button>
            </div>
        </div>
    )
}

export default Results