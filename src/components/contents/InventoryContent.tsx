import { useState, useEffect } from "react";

interface InventoryData {
    productName: string;
    stock: number;
    price: number;
}

export const InventoryContent = () => {

    const [data, setData] = useState<InventoryData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true);

                const mockData: InventoryData[] = [
                    { productName: "Product A", stock: 120, price: 25 },
                    { productName: "Product B", stock: 85, price: 40 },
                    { productName: "Product C", stock: 50, price: 15 },
                ];

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

    if (loading) return <div>Loading inventory...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Inventory Overview</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Stock</th>
                        <th className="px-4 py-2 text-left">Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="px-4 py-2">{item.productName}</td>
                            <td className="px-4 py-2">{item.stock}</td>
                            <td className="px-4 py-2">${item.price.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
