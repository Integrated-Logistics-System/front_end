import { useState, useEffect } from "react";

// 예시 데이터의 타입 정의
interface ReportData {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByMonth: { month: string; count: number }[];
}

export const ReportContent = () => {
    // useState의 타입을 ReportData 또는 null로 지정
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 데이터 로드 시뮬레이션 (예시 데이터)
        const fetchData = async () => {
            try {
                setLoading(true);
                // 실제 API 호출 대신 예시 데이터 추가
                const mockData: ReportData = {
                    totalOrders: 1200,
                    totalRevenue: 500000,
                    averageOrderValue: 416.67,
                    ordersByMonth: [
                        { month: "Jan", count: 100 },
                        { month: "Feb", count: 120 },
                        { month: "Mar", count: 130 },
                        { month: "Apr", count: 150 },
                        { month: "May", count: 160 },
                        { month: "Jun", count: 140 },
                    ],
                };
                // 비동기 호출 시뮬레이션
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
                setData(mockData);
            } catch (err) {
                setError("Failed to load report data." + err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading report...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
            <div className="space-y-6">
                {/* 총 주문 및 매출 */}
                <div className="flex space-x-4">
                    <div className="p-4 bg-blue-100 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Orders</h2>
                        <p>{data?.totalOrders}</p>
                    </div>
                    <div className="p-4 bg-green-100 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Revenue</h2>
                        <p>${data?.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-yellow-100 rounded shadow">
                        <h2 className="text-lg font-semibold">Average Order Value</h2>
                        <p>${data?.averageOrderValue.toFixed(2)}</p>
                    </div>
                </div>

                {/* 월별 주문 수 */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Orders by Month</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data?.ordersByMonth.map((monthData) => (
                            <div key={monthData.month} className="p-4 bg-gray-100 rounded shadow">
                                <h3 className="text-md font-semibold">{monthData.month}</h3>
                                <p>Orders: {monthData.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
