// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* 定義路徑 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MainLayout>
  );
}

export default App;