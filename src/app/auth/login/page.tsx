"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login} from "@/app/utils/auth";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const success = await login(email, password);

            if (success) {
                router.refresh(); // Refresh to update client state
            } else {
                setError('로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(`로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                <h3 className="text-2xl font-bold text-center">로그인</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="email">이메일</label>
                            <input
                                type="email"
                                placeholder="이메일"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                placeholder="비밀번호"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">로그인</button>
                            <a href="#" className="text-sm text-blue-600 hover:underline">비밀번호를 잊으셨나요?</a>
                        </div>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
