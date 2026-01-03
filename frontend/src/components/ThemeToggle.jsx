export default function ThemeToggle() {
    const changeTheme = (theme) => {
        const html = document.documentElement;
        html.classList.remove('dark', 'sepia'); // 先清空
        if (theme !== 'light') html.classList.add(theme);
    };

    return (
        <div className="flex gap-2">
            <button onClick={() => changeTheme('light')} className="px-3 py-1 border rounded bg-white text-black">明亮</button>
            <button onClick={() => changeTheme('dark')} className="px-3 py-1 border rounded bg-slate-800 text-white">深色</button>
            <button onClick={() => changeTheme('sepia')} className="px-3 py-1 border rounded bg-[#f4ecd8] text-[#5b4636]">護眼</button>
        </div>
    );
}