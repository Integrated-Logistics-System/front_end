"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardContent } from "@/components/contents/DashboardContent";
import { StoreContent } from "@/components/contents/StoreContent";
import { SettingsContent } from "@/components/contents/SettingsContent";
import { ShipContent} from "@/components/contents/ShipContent";
import { InventoryContent } from "@/components/contents/InventoryContent"
import { ReportContent } from "@/components/contents/ReportContent"
import {Header} from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const routeComponents = {
    '/dashboard': DashboardContent,
    '/store': StoreContent,
    '/inventory': InventoryContent,
    '/shipping': ShipContent,
    '/report': ReportContent,
    '/settings': SettingsContent,
} as const;

export default function ClientHome() {
    useRouter();
    const { isLoggedIn } = useAuth();
    const [currentPath, setCurrentPath] = useState('/dashboard'); // 초기 페이지 경로 설정

    useEffect(() => {
        if (!isLoggedIn) {
            return; // 로그인하지 않은 경우에는 아무것도 하지 않음
        }

        if (currentPath === '/') {
            setCurrentPath('/dashboard'); // 기본 페이지로 설정
        }
    }, [isLoggedIn, currentPath]);

    const ContentComponent = routeComponents[currentPath as keyof typeof routeComponents] || DashboardContent;

    if (isLoggedIn === null) {
        return <div>Loading...</div>; // 로그인 상태 로딩 중
    }

    return (
        <div>
            <Header/>
        <div className="flex h-screen bg-gray-100">
            <Sidebar setCurrentPath={setCurrentPath} /> {/* setCurrentPath를 Sidebar로 전달 */}
            <div className="flex-1 p-8">
                <ContentComponent />
            </div>
        </div>
            <Footer/>
            </div>
    );
}
