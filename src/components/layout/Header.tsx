// components/layout/Header.tsx
import {useRouter} from "next/navigation";

export const Header = () => {
    const router = useRouter();

    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">창고</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.push('/profile')}>프로필</button>
                    <button onClick={() => router.push('/settings')}>설정</button>
                </div>
            </nav>
        </header>
    );
};
