import { useState, useEffect } from "react";

// 예시 데이터의 타입 정의
interface ShipmentData {
    trackingNumber: string;
    status: string;
    deliveryDate: string;
}

export const ShipContent = () => {
    // useState의 타입을 ShipmentData 배열 또는 null로 지정
    const [data, setData] = useState<ShipmentData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 데이터 로드 시뮬레이션 (예시 데이터)
        const fetchData = async () => {
            try {
                setLoading(true);
                // 실제 API 호출 대신 예시 데이터 추가
                const mockData: ShipmentData[] = [
                    { trackingNumber: "TRK12345", status: "Shipped", deliveryDate: "2024-12-28" },
                    { trackingNumber: "TRK67890", status: "In Transit", deliveryDate: "2024-12-30" },
                    { trackingNumber: "TRK54321", status: "Delivered", deliveryDate: "2024-12-25" },
                ];
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

    if (loading) return <div>Loading shipments...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Shipment Overview</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left">Tracking Number</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Delivery Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((shipment, index) => (
                        <tr key={index} className="border-b">
                            <td className="px-4 py-2">{shipment.trackingNumber}</td>
                            <td className="px-4 py-2">{shipment.status}</td>
                            <td className="px-4 py-2">{shipment.deliveryDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
