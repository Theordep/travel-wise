import { useState, useEffect } from 'react'

function Services() {
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: ''
    })

    const categories = [
        'Consultoria',
        'Planejamento',
        'Transporte',
        'Hospedagem',
        'Turismo',
        'Alimentação',
        'Seguro',
        'Documentação'
    ]

    useEffect(() => {
        loadServices()
    }, [])

    const loadServices = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('http://localhost:3001/services')
            if (!response.ok) {
                throw new Error('Erro ao carregar serviços')
            }
            const data = await response.json()
            setServices(data)
        } catch (error) {
            console.error('Erro ao carregar serviços:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = editingService
                ? `http://localhost:3001/services/${editingService.id}`
                : 'http://localhost:3001/services'

            const method = editingService ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Erro ao salvar serviço')
            }

            await loadServices()
            resetForm()
            setShowModal(false)
        } catch (error) {
            console.error('Erro ao salvar serviço:', error)
            setError(error.message)
        }
    }

    const handleEdit = (service) => {
        setEditingService(service)
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            category: service.category
        })
        setShowModal(true)
    }

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Tem certeza que deseja excluir este serviço?')) {
            return
        }

        try {
            const response = await fetch(`http://localhost:3001/services/${serviceId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Erro ao excluir serviço')
            }

            await loadServices()
        } catch (error) {
            console.error('Erro ao excluir serviço:', error)
            setError(error.message)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            duration: '',
            category: ''
        })
        setEditingService(null)
    }

    const openModal = () => {
        resetForm()
        setShowModal(true)
    }

    const getCategoryIcon = (category) => {
        const icons = {
            'Consultoria': '💼',
            'Planejamento': '📋',
            'Transporte': '🚗',
            'Hospedagem': '🏨',
            'Turismo': '🗺️',
            'Alimentação': '🍽️',
            'Seguro': '🛡️',
            'Documentação': '📄'
        }
        return icons[category] || '🛎️'
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🛎️ Gerenciar Serviços</h1>
                    <p className="text-gray-600 mt-1">Cadastre e gerencie os serviços oferecidos</p>
                </div>
                <button
                    onClick={openModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                    <span>➕</span>
                    <span>Novo Serviço</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6">
                            {/* Service Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="text-3xl">
                                        {getCategoryIcon(service.category)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {service.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Service Description */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>

                            {/* Service Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">💰 Preço:</span>
                                    <span className="text-lg font-bold text-green-600">{service.price}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">⏱️ Duração:</span>
                                    <span className="text-sm font-medium text-gray-800">{service.duration}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                >
                                    <span>✏️</span>
                                    <span>Editar</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                >
                                    <span>🗑️</span>
                                    <span>Excluir</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {services.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🛎️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
                    <p className="text-gray-500 mb-6">Comece criando seu primeiro serviço</p>
                    <button
                        onClick={openModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                        ➕ Criar Primeiro Serviço
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingService ? '✏️ Editar Serviço' : '➕ Novo Serviço'}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ❌
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome do Serviço
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Digite o nome do serviço"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Descrição
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descreva o serviço em detalhes"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoria
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {getCategoryIcon(category)} {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Preço
                                    </label>
                                    <input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: R$ 150,00"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                        Duração
                                    </label>
                                    <input
                                        type="text"
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: 2 horas"
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                                    >
                                        {editingService ? 'Atualizar' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Services