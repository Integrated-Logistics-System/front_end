import { usePathname } from "next/navigation";

interface SidebarProps {
    setCurrentPath: (path: string) => void;
}

export const Sidebar = ({ setCurrentPath }: SidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { path: '/dashboard', label: '대시보드' },
        { path: '/store', label: '스토어'},
        { path: '/inventory', label: '재고 관리' },
        { path: '/shipping', label: '배송 관리' },
        { path: '/report', label: '리포트' },
        { path: '/settings', label: '설정' },
    ];


    return (
        <aside className="w-64 bg-gray-50 border-r">
            <nav className="p-4 space-y-2">
                {menuItems.map(({ path, label }) => (
                    <button
                        key={path}
                        onClick={() => {
                            setCurrentPath(path); // 메뉴 클릭 시 콘텐츠 변경
                        }}
                        className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 
                            ${pathname === path ? 'bg-gray-100' : ''}`}
                    >
                        {label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};
