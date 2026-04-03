import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Tes pages
import Layout from './component/UX/Layout'
import Match from './component/pages/Match'
import Ranking from './component/pages/Ranking'
import Login from './component/pages/Login'
import Scoreboard from './component/pages/ScoreOverlay'
import EventInfo from './component/pages/EventInfo'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        index: true, // Utilise 'index: true' au lieu de path: "/" pour la route par défaut
        element: <Match />,
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
      {
        path: "eventinfo",
        element: <EventInfo />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Le Login est ici, en dehors du Layout
  },
  {
    path: "/overlay",
    element: <Scoreboard />, // Le Login est ici, en dehors du Layout
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)