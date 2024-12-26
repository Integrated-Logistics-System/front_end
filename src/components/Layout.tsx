import {useRouter} from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <header className="bg-white shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">어크로스비</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.push('/profile')}>프로필</button>
                        <button onClick={() => router.push('/settings')}>설정</button>
                    </div>
                </nav>
            </header>

            <main className="flex">
                <aside className="w-64 bg-gray-50 border-r">
                    <nav className="p-4 space-y-2">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                        >
                            대시보드
                        </button>
                        <button
                            onClick={() => router.push('/orders')}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                        >
                            주문 관리
                        </button>
                        <button
                            onClick={() => router.push('/inventory')}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                        >
                            재고 관리
                        </button>
                        <button
                            onClick={() => router.push('/shipping')}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                        >
                            배송 관리
                        </button>
                    </nav>
                </aside>

                <div className="flex-1 p-8">
                    {children}
                </div>
            </main>

            <footer className="bg-gray-50 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
                    <p className="text-gray-500">© 2024 유통. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
