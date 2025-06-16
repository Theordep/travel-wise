function LoadingSpinner({ message = "Carregando..." }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
                {/* Spinner Animation */}
                <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                    </div>
                </div>

                {/* Loading Message */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Processando sua solicitação...
                </h2>

                <p className="text-gray-600 max-w-md mx-auto mb-8">
                    {message}
                </p>

                {/* Progress Steps */}
                <div className="space-y-3 max-w-sm mx-auto">
                    <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700">Analisando destino e clima...</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <span className="text-gray-700">Processando recomendações...</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <span className="text-gray-700">Gerando orçamento estimado...</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        <span className="text-gray-700">Finalizando seu plano...</span>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Dica:</strong> Nossa IA está considerando clima, cultura local e suas preferências para criar o plano perfeito!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoadingSpinner