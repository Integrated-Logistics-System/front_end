import { useState, useEffect } from "react";

interface SettingsData {
    theme: string; // 테마 (라이트/다크)
    emailNotifications: boolean; // 이메일 알림 설정
    pushNotifications: boolean; // 푸시 알림 설정
}

export const SettingsContent = () => {

    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true);
                // 실제 API 호출 대신 예시 데이터 추가
                const mockSettings: SettingsData = {
                    theme: "light", // 기본 테마는 라이트
                    emailNotifications: true,
                    pushNotifications: false,
                };
                // 비동기 호출 시뮬레이션
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
                setSettings(mockSettings);
            } catch (err) {
                setError("Failed to load settings." + err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (settings) {
            setSettings({ ...settings, theme: e.target.value });
        }
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof SettingsData) => {
        if (settings) {
            setSettings({ ...settings, [type]: e.target.checked });
        }
    };

    if (loading) return <div>Loading settings...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Theme</h2>
                    <select
                        value={settings?.theme}
                        onChange={handleThemeChange}
                        className="p-2 border rounded"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">Notifications</h2>
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={settings?.emailNotifications}
                                onChange={(e) => handleNotificationChange(e, "emailNotifications")}
                                className="form-checkbox"
                            />
                            <span>Email Notifications</span>
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={settings?.pushNotifications}
                                onChange={(e) => handleNotificationChange(e, "pushNotifications")}
                                className="form-checkbox"
                            />
                            <span>Push Notifications</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
