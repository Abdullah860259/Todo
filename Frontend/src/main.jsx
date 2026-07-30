import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='870288029682-lnptd8qhnfbem1q3fu2pd4spcbgpe1r3.apps.googleusercontent.com'>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  </GoogleOAuthProvider>
)
