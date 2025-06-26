import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function NavBar() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/')
    }

    const navLinks = [
        { to: '/app/home', label: 'Home', icon: '🏠' },
        { to: '/app/travel-planner', label: 'Planejar Viagem', icon: '✈️' },
        { to: '/app/my-travels', label: 'Minhas Viagens', icon: '🗺️' },
        { to: '/app/users', label: 'Usuários', icon: '👥' }
    ]

    return (
        <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌍</span>
                        <span className="text-xl font-bold">TravelWise</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-500 text-blue-100'
                                    }`
                                }
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="text-sm">
                            Olá, {JSON.parse(localStorage.getItem('user') || '{}').name || 'Usuário'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Sair
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-blue-200 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-blue-500">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 px-4 py-3 transition-colors duration-200 ${isActive
                                        ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-500 text-blue-100'
                                    }`
                                }
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                        <div className="px-4 py-3 border-t border-blue-500 mt-4">
                            <p className="text-sm mb-2">
                                Olá, {JSON.parse(localStorage.getItem('user') || '{}').name || 'Usuário'}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-200 w-full"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar