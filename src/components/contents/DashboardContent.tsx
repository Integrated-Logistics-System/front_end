import { useState, useEffect } from "react";

// 예시 데이터의 타입 정의
interface DashboardData {
    orders: number;
    revenue: number;
    users: number;
}

export const DashboardContent = () => {
    // useState의 타입을 DashboardData 또는 null로 지정
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 데이터 로드 시뮬레이션 (예시 데이터)
        const fetchData = async () => {
            try {
                setLoading(true);
                // 실제 API 호출 대신 예시 데이터 추가
                const mockData: DashboardData = {
                    orders: 120,
                    revenue: 50000,
                    users: 350,
                };
                // 비동기 호출 시뮬레이션
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
                setData(mockData);
            } catch (err) {
                setError("Failed to load data." + err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-100 rounded shadow">
                    <h2 className="text-lg font-semibold">Orders</h2>
                    <p>Total: {data?.orders}</p>
                </div>
                <div className="p-4 bg-green-100 rounded shadow">
                    <h2 className="text-lg font-semibold">Revenue</h2>
                    <p>${data?.revenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded shadow">
                    <h2 className="text-lg font-semibold">Users</h2>
                    <p>Active: {data?.users}</p>
                </div>
            </div>
        </div>
    );
};
