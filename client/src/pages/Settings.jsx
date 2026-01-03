import React, { useEffect, useState } from 'react';

const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"
];

export default function Settings() {
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "dark");

    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    };

    return (
        <div className="pb-20">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* Appearance Section */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🎨</span> Appearance
                </h2>
                <div className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                        <p className="text-sm opacity-70 mb-4">Choose a theme that fits your vibe.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {themes.map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => handleThemeChange(theme)}
                                    className={`relative overflow-hidden rounded-lg border-2 text-left transition-all hover:scale-105 ${currentTheme === theme ? 'border-primary shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-base-100' : 'border-base-content/10 hover:border-base-content/30'
                                        }`}
                                >
                                    <div className="w-full h-full" data-theme={theme}>
                                        <div className="grid grid-cols-5 grid-rows-3">
                                            <div className="col-span-5 row-span-3 row-start-1 h-16 w-full bg-base-100 p-2 gap-1 flex flex-col justify-between">
                                                <div className="font-bold text-xs">{theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                                                    <div className="w-3 h-3 rounded-full bg-neutral"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {currentTheme === theme && (
                                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-content">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Section */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🔒</span> Privacy
                </h2>
                <div className="card bg-base-200 shadow-sm">
                    <div className="card-body p-0">
                        <div className="form-control px-6 py-4 border-b border-base-content/5">
                            <label className="label cursor-pointer">
                                <span className="label-text font-medium text-lg">Private Account</span>
                                <input type="checkbox" className="toggle toggle-primary" />
                            </label>
                            <p className="text-xs opacity-60 mt-1">Only people you approve can see your photos and videos.</p>
                        </div>

                        <div className="form-control px-6 py-4 border-b border-base-content/5">
                            <label className="label cursor-pointer">
                                <span className="label-text font-medium text-lg">Activity Status</span>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                            </label>
                            <p className="text-xs opacity-60 mt-1">Allow accounts you follow to see when you were last active.</p>
                        </div>

                        <div className="form-control px-6 py-4">
                            <label className="label cursor-pointer">
                                <span className="label-text font-medium text-lg">Read Receipts</span>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                            </label>
                            <p className="text-xs opacity-60 mt-1">Let others know when you've noticed their messages.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🛡️</span> Security
                </h2>
                <div className="card bg-base-200 shadow-sm">
                    <div className="card-body">
                        <div className="flex flex-col gap-4">
                            <button className="btn btn-outline justify-between">
                                CHANGE PASSWORD
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>

                            <div className="form-control border rounded-xl p-4 border-base-content/10">
                                <label className="label cursor-pointer p-0">
                                    <span className="label-text font-medium">Two-Factor Authentication</span>
                                    <input type="checkbox" className="toggle toggle-success" />
                                </label>
                            </div>

                            <button className="btn btn-outline justify-between">
                                MANAGE DEVICES
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Info Section */}
            <section className="mb-10 text-center opacity-60">
                <p className="text-sm">Stagr v1.0.0</p>
                <div className="flex justify-center gap-4 mt-2 text-xs text-primary">
                    <button className="hover:underline">Terms of Service</button>
                    <span>•</span>
                    <button className="hover:underline">Privacy Policy</button>
                    <span>•</span>
                    <button className="hover:underline">Open Source</button>
                </div>
            </section>

        </div>
    )
}
