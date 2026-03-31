import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Tes pages
import Layout from './component/UX/Layout'
import Match from './component/pages/Match'
import Ranking from './component/pages/Ranking'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Ton Header et Footer communs
    children: [
      {
        path: "/",
        element: <Match/>,
      },
      {
        path: "/ranking",
        element: <Ranking />,
      },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)