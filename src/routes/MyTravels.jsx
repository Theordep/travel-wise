import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TRAVEL_TYPES, TRAVEL_STATUS } from '../utils/constants.js'
import geminiService from '../services/geminiService.js'

function MyTravels() {
    const navigate = useNavigate()
    const [travels, setTravels] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingTravel, setEditingTravel] = useState(null)
    const [isRegenerating, setIsRegenerating] = useState(null)
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        duration: '',
        travelType: 'Turismo',
        budget: '',
        travelers: '1',
        status: 'planned',
        notes: ''
    })

    useEffect(() => {
        loadTravels()
    }, [])

    const loadTravels = async () => {
        try {
            setIsLoading(true)
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            const response = await fetch('http://localhost:3001/travels')
            if (!response.ok) {
                throw new Error('Erro ao carregar viagens')
            }

            const data = await response.json()
            // Filtrar viagens do usuário logado
            const userTravels = data.filter(travel => travel.userId === user.id)
            setTravels(userTravels)
        } catch (error) {
            console.error('Erro ao carregar viagens:', error)
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
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            const url = editingTravel
                ? `http://localhost:3001/travels/${editingTravel.id}`
                : 'http://localhost:3001/travels'

            const method = editingTravel ? 'PUT' : 'POST'

            const travelData = {
                ...formData,
                userId: user.id,
                createdAt: editingTravel?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(travelData)
            })

            if (!response.ok) {
                throw new Error('Erro ao salvar viagem')
            }

            await loadTravels()
            resetForm()
            setShowModal(false)
        } catch (error) {
            console.error('Erro ao salvar viagem:', error)
            setError(error.message)
        }
    }

    const handleEdit = (travel) => {
        setEditingTravel(travel)
        setFormData({
            destination: travel.destination,
            startDate: travel.startDate,
            duration: travel.duration,
            travelType: travel.travelType,
            budget: travel.budget || '',
            travelers: travel.travelers,
            status: travel.status,
            notes: travel.notes || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (travelId) => {
        if (!window.confirm('Tem certeza que deseja excluir esta viagem?')) {
            return
        }

        try {
            const response = await fetch(`http://localhost:3001/travels/${travelId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Erro ao excluir viagem')
            }

            await loadTravels()
        } catch (error) {
            console.error('Erro ao excluir viagem:', error)
            setError(error.message)
        }
    }

    const handleView = (travelId) => {
        navigate(`/app/results/${travelId}`)
    }

    const handleRegenerate = async (travel) => {
        if (!window.confirm('Deseja regenerar o plano desta viagem com a IA? Isso substituirá o plano atual.')) {
            return
        }

        try {
            setIsRegenerating(travel.id)

            // Gerar novo plano com IA
            const newTravelPlan = await geminiService.generateTravelPlan({
                destination: travel.destination,
                duration: travel.duration,
                travelType: travel.travelType,
                travelers: travel.travelers,
                budget: travel.budget,
                startDate: travel.startDate
            })

            // Atualizar viagem com novo plano
            const response = await fetch(`http://localhost:3001/travels/${travel.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...travel,
                    travelPlan: newTravelPlan,
                    updatedAt: new Date().toISOString()
                })
            })

            if (!response.ok) {
                throw new Error('Erro ao atualizar viagem')
            }

            await loadTravels()
            alert('✅ Plano regenerado com sucesso!')

        } catch (error) {
            console.error('Erro ao regenerar plano:', error)
            alert(`❌ Erro ao regenerar plano: ${error.message}`)
        } finally {
            setIsRegenerating(null)
        }
    }

    const resetForm = () => {
        setFormData({
            destination: '',
            startDate: '',
            duration: '',
            travelType: 'Turismo',
            budget: '',
            travelers: '1',
            status: 'planned',
            notes: ''
        })
        setEditingTravel(null)
    }

    const openModal = () => {
        resetForm()
        setShowModal(true)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const getStatusColor = (status) => {
        const colors = {
            planned: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusLabel = (status) => {
        const labels = {
            planned: 'Planejada',
            in_progress: 'Em Andamento',
            completed: 'Concluída',
            cancelled: 'Cancelada'
        }
        return labels[status] || status
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
                    <h1 className="text-3xl font-bold text-gray-800">🗺️ Minhas Viagens</h1>
                    <p className="text-gray-600 mt-1">Gerencie e visualize suas viagens planejadas</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate('/app/travel-planner')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                    >
                        <span>🤖</span>
                        <span>Planejar com IA</span>
                    </button>
                    <button
                        onClick={openModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                    >
                        <span>➕</span>
                        <span>Nova Viagem</span>
                    </button>
                </div>
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

            {/* Travels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travels.map((travel) => (
                    <div key={travel.id} className="bg-white rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6">
                            {/* Travel Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {travel.destination}
                                    </h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(travel.status)}`}>
                                        {getStatusLabel(travel.status)}
                                    </span>
                                </div>
                                <div className="text-2xl">
                                    {travel.travelType === 'Romântico' ? '💕' :
                                        travel.travelType === 'Família' ? '👨‍👩‍👧‍👦' :
                                            travel.travelType === 'Aventura' ? '🏔️' :
                                                travel.travelType === 'Cultural' ? '🎭' :
                                                    travel.travelType === 'Negócios' ? '💼' : '✈️'}
                                </div>
                            </div>

                            {/* Travel Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">📅 Data:</span>
                                    <span className="font-medium">{formatDate(travel.startDate)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">⏰ Duração:</span>
                                    <span className="font-medium">{travel.duration} dias</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">👥 Viajantes:</span>
                                    <span className="font-medium">{travel.travelers} pessoa(s)</span>
                                </div>
                                {travel.budget && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">💰 Orçamento:</span>
                                        <span className="font-medium text-green-600">{travel.budget}</span>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            {travel.notes && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700 italic">
                                        "{travel.notes}"
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleView(travel.id)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                    >
                                        <span>👁️</span>
                                        <span>Ver Plano</span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(travel)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                    >
                                        <span>✏️</span>
                                        <span>Editar</span>
                                    </button>
                                </div>
                                <div className="flex space-x-2">
                                    {travel.travelPlan && (
                                        <button
                                            onClick={() => handleRegenerate(travel)}
                                            disabled={isRegenerating === travel.id}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                        >
                                            {isRegenerating === travel.id ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                                    <span>Regenerando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>🔄</span>
                                                    <span>Regenerar IA</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(travel.id)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                    >
                                        <span>🗑️</span>
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {travels.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🗺️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma viagem encontrada</h3>
                    <p className="text-gray-500 mb-6">Comece planejando sua primeira viagem!</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate('/app/travel-planner')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                            <span>🤖</span>
                            <span>Planejar com IA</span>
                        </button>
                        <button
                            onClick={openModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                            <span>➕</span>
                            <span>Criar Manualmente</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingTravel ? '✏️ Editar Viagem' : '➕ Nova Viagem'}
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
                                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                                        🌍 Destino
                                    </label>
                                    <input
                                        type="text"
                                        id="destination"
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Paris, França"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            📅 Data
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                            ⏰ Dias
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="travelType" className="block text-sm font-medium text-gray-700 mb-1">
                                            🎯 Tipo
                                        </label>
                                        <select
                                            id="travelType"
                                            name="travelType"
                                            value={formData.travelType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {TRAVEL_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                                            👥 Pessoas
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                                            💰 Orçamento
                                        </label>
                                        <input
                                            type="text"
                                            id="budget"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="R$ 3.000"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            📊 Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="planned">Planejada</option>
                                            <option value="in_progress">Em Andamento</option>
                                            <option value="completed">Concluída</option>
                                            <option value="cancelled">Cancelada</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                        📝 Observações
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Notas pessoais sobre a viagem..."
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
                                        {editingTravel ? 'Atualizar' : 'Salvar'}
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

export default MyTravels