function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo e Descrição */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🌍</span>
                            <span className="text-xl font-bold">TravelWise</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Seu assistente inteligente para planejamento de viagens.
                            Recomendações personalizadas para uma experiência única.
                        </p>
                    </div>

                    {/* Links Úteis */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    📋 Sobre Nós
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    📞 Contato
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    🔒 Privacidade
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    📋 Termos de Uso
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contato</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p className="flex items-center space-x-2">
                                <span>📧</span>
                                <span>contato@travelwise.com</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <span>📱</span>
                                <span>(11) 99999-9999</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <span>📍</span>
                                <span>Criciúma, Santa Catarina</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>
                        © 2025 TravelWise. Todos os direitos reservados.
                        Desenvolvido com ❤️ por estudantes de Front-end.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer