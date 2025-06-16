import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Importar componentes de rotas
import Home from './routes/Home.jsx'
import Login from './routes/Login.jsx'
import Users from './routes/Users.jsx'
import Services from './routes/Services.jsx'
import TravelPlanner from './routes/TravelPlanner.jsx'
import Results from './routes/Results.jsx'
import ErrorPage from './routes/ErrorPage.jsx'

// Configuração das rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: "/app",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <Home />
      },
      {
        path: "users",
        element: <Users />
      },
      {
        path: "services",
        element: <Services />
      },
      {
        path: "travel-planner",
        element: <TravelPlanner />
      },
      {
        path: "results/:travelId",
        element: <Results />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)