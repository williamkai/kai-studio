import useAuthStore from '@/features/auth/store/useAuthStore';
import { Link } from 'react-router-dom';

export default function Home() {
    const { isLoggedIn } = useAuthStore();

    return (
        <div className="space-y-12">
            <section className="text-center py-10">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]">
                    打造你的 <span className="text-blue-600 dark:text-blue-400">數位筆記</span> 殿堂
                </h1>
                <p className="text-lg app-text-muted max-w-2xl mx-auto">
                    Kai-Studio 提供極致流暢的編輯體驗，支援 Markdown、圖表與多端同步。
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { icon: "📝", title: "智能編輯器", desc: "支援區塊式編輯，輕鬆插入圖片、表格與程式碼。", color: "bg-blue-500/10" },
                    { icon: "📊", title: "自動生成目錄", desc: "動態追蹤閱讀進度，無論筆記多長，都能精準定位。", color: "bg-green-500/10" },
                    { icon: "🚀", title: "極速同步", desc: "搭配 FastAPI 強大後端，實現秒級存檔，資料永不遺失。", color: "bg-purple-500/10" }
                ].map((item, index) => (
                    <div key={index} className="p-8 app-card rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 text-3xl`}>
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="app-text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <section className="mt-20 p-10 rounded-3xl bg-blue-600 text-white text-center shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">準備好提升你的效率了嗎？</h2>
                <p className="mb-8 opacity-90 text-blue-50">立即加入 Kai-Studio，開啟你的數位化管理生活。</p>

                <Link to={isLoggedIn ? "/dashboard" : "/login"} className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-all">
                    {isLoggedIn ? "進入管理後台" : "免費開始使用"}
                </Link>
            </section>
        </div>
    );
}