import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // 引入導航主機
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 用 BrowserRouter 把 App 包起來，這樣全站就能換頁了 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)