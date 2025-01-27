import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/socketContext.jsx'


createRoot(document.getElementById('root')).render(
  
    <AuthProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>           
    </AuthProvider>
 
)
