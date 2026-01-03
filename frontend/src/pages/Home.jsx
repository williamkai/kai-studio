
export default function Home() {
    return (
        <div className="space-y-12">
            {/* 英雄區 (Hero Section) */}
            <section className="text-center py-10">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                    打造你的 <span className="text-blue-600 dark:text-blue-400">數位筆記</span> 殿堂
                </h1>
                {/* 使用 app-text-muted 確保在各主題下的易讀性 */}
                <p className="text-lg app-text-muted max-w-2xl mx-auto">
                    Kai-Studio 提供極致流暢的編輯體驗，支援 Markdown、圖表與多端同步。
                </p>
            </section>

            {/* 功能卡片區 - 響應式佈局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 卡片物件 1 - 使用 app-card 類名 */}
                <div className="p-8 app-card rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                        📝
                    </div>
                    <h3 className="text-xl font-bold mb-3">智能編輯器</h3>
                    <p className="app-text-muted text-sm leading-relaxed">
                        支援區塊式編輯，輕鬆插入圖片、表格與程式碼，讓寫作成為一種享受。
                    </p>
                </div>

                {/* 卡片物件 2 */}
                <div className="p-8 app-card rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                        📊
                    </div>
                    <h3 className="text-xl font-bold mb-3">自動生成目錄</h3>
                    <p className="app-text-muted text-sm leading-relaxed">
                        動態追蹤閱讀進度，無論筆記多長，都能透過側邊欄精準定位內容。
                    </p>
                </div>

                {/* 卡片物件 3 */}
                <div className="p-8 app-card rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                        🚀
                    </div>
                    <h3 className="text-xl font-bold mb-3">極速同步</h3>
                    <p className="app-text-muted text-sm leading-relaxed">
                        搭配 FastAPI 強大後端，實現秒級存檔與多端即時同步，資料永不遺失。
                    </p>
                </div>

            </div>

            {/* 底部行動呼籲 (Optional) */}
            <section className="mt-20 p-10 rounded-3xl bg-blue-600 text-white text-center shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">準備好提升你的效率了嗎？</h2>
                <p className="mb-8 opacity-90">立即加入 Kai-Studio，開啟你的數位化管理生活。</p>
                <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all">
                    免費開始使用
                </button>
            </section>
        </div>
    );
}