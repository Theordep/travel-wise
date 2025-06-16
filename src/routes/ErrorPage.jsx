import { useRouteError, useNavigate } from 'react-router-dom'

function ErrorPage() {
    const error = useRouteError()
    const navigate = useNavigate()

    console.error(error)

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                {/* Error Icon */}
                <div className="text-8xl mb-6">😵</div>

                {/* Error Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Oops! Algo deu errado
                </h1>

                {/* Error Message */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 font-medium mb-2">
                        {error?.status === 404 ? 'Página não encontrada' : 'Erro interno'}
                    </p>
                    <p className="text-red-600 text-sm">
                        {error?.statusText || error?.message || 'Erro desconhecido'}
                    </p>
                </div>

                {/* Error Details */}
                <div className="text-gray-600 text-sm mb-8">
                    {error?.status === 404 ? (
                        <div>
                            <p className="mb-2">🔍 A página que você está procurando não existe.</p>
                            <p>Verifique o endereço ou navegue para uma página válida.</p>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-2">⚠️ Ocorreu um erro inesperado no sistema.</p>
                            <p>Nossa equipe foi notificada e está trabalhando na correção.</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <span>⬅️</span>
                        <span>Voltar à Página Anterior</span>
                    </button>

                    <button
                        onClick={() => navigate('/app/home')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <span>🏠</span>
                        <span>Ir para o Início</span>
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <span>🔄</span>
                        <span>Recarregar Página</span>
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                        💡 Precisa de Ajuda?
                    </h3>
                    <p className="text-xs text-blue-600">
                        Se o problema persistir, entre em contato conosco em{' '}
                        <a href="mailto:contato@travelwise.com" className="underline">
                            contato@travelwise.com
                        </a>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-6 text-xs text-gray-400">
                    <p>TravelWise - Recomendador Inteligente de Viagens</p>
                    <p>Código do erro: {error?.status || 'UNKNOWN'}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage