import { Outlet } from 'react-router-dom'
import NavBar from './components/shared/NavBar'
import Footer from './components/shared/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App