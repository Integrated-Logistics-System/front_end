import { useState, useEffect } from "react";

interface StoreProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export const StoreContent = () => {

    const [products, setProducts] = useState<StoreProduct[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true);

                const mockProducts: StoreProduct[] = [
                    { id: "P001", name: "Product 1", price: 29.99, stock: 120 },
                    { id: "P002", name: "Product 2", price: 49.99, stock: 80 },
                    { id: "P003", name: "Product 3", price: 19.99, stock: 200 },
                ];

                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
                setProducts(mockProducts);
            } catch (err) {
                setError("Failed to load products." + err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading store data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Store Product Management</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left">Product ID</th>
                        <th className="px-4 py-2 text-left">Product Name</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Stock</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products?.map((product) => (
                        <tr key={product.id} className="border-b">
                            <td className="px-4 py-2">{product.id}</td>
                            <td className="px-4 py-2">{product.name}</td>
                            <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                            <td className="px-4 py-2">{product.stock}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};