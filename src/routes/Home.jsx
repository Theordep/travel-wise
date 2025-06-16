import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({
        users: 0,
        services: 0,
        travels: 0
    })

    useEffect(() => {
        // Carregar dados do usuário
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        setUser(userData)

        // Carregar estatísticas
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const [usersRes, servicesRes, travelsRes] = await Promise.all([
                fetch('http://localhost:3001/users'),
                fetch('http://localhost:3001/services'),
                fetch('http://localhost:3001/travels')
            ])

            const users = await usersRes.json()
            const services = await servicesRes.json()
            const travels = await travelsRes.json()

            setStats({
                users: users.length,
                services: services.length,
                travels: travels.length
            })
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error)
        }
    }

    const features = [
        {
            icon: '🎒',
            title: 'Recomendações de Bagagem',
            description: 'IA personalizada sugere itens essenciais baseados no destino, clima e duração.',
            action: () => navigate('/app/travel-planner')
        },
        {
            icon: '🗺️',
            title: 'Roteiro Turístico',
            description: 'Pontos turísticos, restaurantes e atividades recomendados para sua viagem.',
            action: () => navigate('/app/travel-planner')
        },
        {
            icon: '💰',
            title: 'Estimativa de Orçamento',
            description: 'Calcule gastos médios com hospedagem, alimentação e atividades.',
            action: () => navigate('/app/travel-planner')
        },
        {
            icon: '🛎️',
            title: 'Serviços Premium',
            description: 'Consultoria personalizada e serviços exclusivos para sua viagem.',
            action: () => navigate('/app/services')
        }
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Bem-vindo, {user?.name || 'Viajante'}! 🌟
                        </h1>
                        <p className="text-xl text-blue-100">
                            Pronto para planejar sua próxima aventura?
                        </p>
                    </div>
                    <div className="hidden md:block text-6xl">
                        ✈️
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => navigate('/app/travel-planner')}
                        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                        <span>🚀</span>
                        <span>Planejar Nova Viagem</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.users}</h3>
                            <p className="text-gray-600">Usuários Cadastrados</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <span className="text-2xl">🛎️</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.services}</h3>
                            <p className="text-gray-600">Serviços Disponíveis</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <span className="text-2xl">✈️</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.travels}</h3>
                            <p className="text-gray-600">Viagens Planejadas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={feature.action}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="bg-gray-100 p-3 rounded-full">
                                <span className="text-2xl">{feature.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {feature.description}
                                </p>
                                <div className="flex items-center text-blue-600 font-medium">
                                    <span>Começar agora</span>
                                    <span className="ml-2">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    🎯 Como Funciona o TravelWise
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">1. Informe seu Destino</h3>
                        <p className="text-sm text-gray-600">
                            Digite onde quer ir, quando e por quantos dias
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">2. IA Analisa</h3>
                        <p className="text-sm text-gray-600">
                            Nossa IA processa clima, cultura e suas preferências
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📋</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">3. Receba Recomendações</h3>
                        <p className="text-sm text-gray-600">
                            Bagagem, roteiro e orçamento personalizados
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎒</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">4. Viaje Preparado</h3>
                        <p className="text-sm text-gray-600">
                            Aproveite sua viagem com total tranquilidade
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Travels */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        📈 Últimas Viagens Planejadas
                    </h2>
                    <button
                        onClick={() => navigate('/app/travel-planner')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Ver todas →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">🗼</span>
                            <h3 className="font-semibold">Paris, França</h3>
                        </div>
                        <p className="text-sm text-gray-600">10 dias • Romântico</p>
                        <p className="text-xs text-green-600 mt-1">✓ Concluído</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">🗾</span>
                            <h3 className="font-semibold">Tóquio, Japão</h3>
                        </div>
                        <p className="text-sm text-gray-600">7 dias • Cultural</p>
                        <p className="text-xs text-blue-600 mt-1">📋 Planejado</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-center h-full">
                            <button
                                onClick={() => navigate('/app/travel-planner')}
                                className="text-gray-400 hover:text-gray-600 text-center"
                            >
                                <div className="text-3xl mb-2">➕</div>
                                <p className="text-sm">Planejar Nova Viagem</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    ✨ Transforme sua Viagem em uma Experiência Única
                </h2>
                <p className="text-lg text-green-100 mb-6">
                    Deixe nossa IA cuidar dos detalhes enquanto você sonha com o destino
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/app/travel-planner')}
                        className="bg-white text-green-600 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors duration-200"
                    >
                        🚀 Planejar Agora
                    </button>
                    <button
                        onClick={() => navigate('/app/services')}
                        className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-200"
                    >
                        🛎️ Ver Serviços
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home