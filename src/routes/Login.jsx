import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpar erro quando usuário começar a digitar
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:3001/users')

            if (!response.ok) {
                throw new Error('Erro na conexão com o servidor')
            }

            const users = await response.json()

            const user = users.find(u =>
                u.email === formData.email && u.password === formData.password
            )

            if (user) {
                localStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }))
                navigate('/app/home')
            } else {
                setError('Email ou senha incorretos. Tente novamente.')
            }
        } catch (error) {
            console.error('Erro no login:', error)
            setError('Erro de conexão. Verifique se o servidor está rodando.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <span className="text-4xl">🌍</span>
                        <h1 className="text-3xl font-bold text-gray-800">TravelWise</h1>
                    </div>
                    <p className="text-gray-600">
                        Seu assistente inteligente para planejamento de viagens
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

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            📧 Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            🔒 Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Entrando...</span>
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                <span>Entrar</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        💡 Credenciais de Demonstração:
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Email:</strong> admin@travelwise.com</p>
                        <p><strong>Senha:</strong> admin123</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2025 TravelWise - Recomendador Inteligente de Viagens</p>
                </div>
            </div>
        </div>
    )
}

export default Login