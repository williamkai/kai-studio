// src/App.jsx
function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      {/* 這是一個使用 Tailwind v4 樣式的測試標題 */}
      <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
        Kai-Studio
      </h1>
      <p className="text-slate-500 mt-4 text-lg">
        前端開發環境已就緒，準備開始寫登入功能。
      </p>

      {/* 測試按鈕，確認 Tailwind 的 hover 效果 */}
      <button className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg">
        環境測試成功
      </button>
    </div>
  )
}

export default App