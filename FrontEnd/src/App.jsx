import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login'
import { RouterProvider } from 'react-router-dom'
import router from './Router'

function App() {
  return (
  <RouterProvider router={router} />
  )
}

export default App
