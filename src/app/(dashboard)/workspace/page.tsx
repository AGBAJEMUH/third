'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface MindMap {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export default function WorkspacePage() {
    const router = useRouter();
    const [maps, setMaps] = useState<MindMap[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewMapModal, setShowNewMapModal] = useState(false);
    const [newMapTitle, setNewMapTitle] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchMaps();
    }, []);

    const fetchMaps = async () => {
        try {
            const res = await fetch('/api/maps');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch maps');
            }
            const data = await res.json();
            setMaps(data.maps);
        } catch (error) {
            console.error('Error fetching maps:', error);
        } finally {
            setLoading(false);
        }
    };

    const createNewMap = async () => {
        if (!newMapTitle.trim()) return;

        try {
            const res = await fetch('/api/maps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newMapTitle,
                    data: JSON.stringify({
                        nodes: [{ id: 'root', text: newMapTitle, x: 0, y: 0, color: '#8b5cf6' }],
                        connections: []
                    }),
                }),
            });

            if (!res.ok) throw new Error('Failed to create map');

            const data = await res.json();
            router.push(`/workspace/${data.mapId}`);
        } catch (error) {
            console.error('Error creating map:', error);
        }
    };

    const deleteMap = async (id: number) => {
        try {
            const res = await fetch(`/api/maps/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete map');
            setMaps(maps.filter(m => m.id !== id));
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting map:', error);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 px-6 py-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between forge-card !p-4 !rounded-3xl border-white/5 bg-white/5 backdrop-blur-2xl">
                    <div className="flex items-center space-x-3 px-2">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center p-0.5 shadow-lg shadow-primary-500/20">
                                <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">M</span>
                                </div>
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                MindForge
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 pt-32 lg:pt-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tight mb-4">My Forge</h1>
                        <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
                            The space where your chaotic thoughts transform into structured brilliance.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewMapModal(true)}
                        className="px-8 py-4 rounded-[2rem] bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        + Forge New Map
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium text-lg">Igniting the forge...</p>
                    </div>
                ) : maps.length === 0 ? (
                    <div className="forge-card flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 rounded-full bg-primary-500/5 flex items-center justify-center mb-8 border border-primary-500/10 text-4xl">
                            🧠
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">The forge is cold.</h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                            Start your first mind map and watch the AI help you expand your vision.
                        </p>
                        <button
                            onClick={() => setShowNewMapModal(true)}
                            className="px-8 py-4 rounded-[2rem] bg-white text-background font-bold shadow-xl hover:scale-105 transition-all"
                        >
                            Ignite First Map
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {maps.map((map) => (
                            <div key={map.id} className="group relative">
                                <Link
                                    href={`/workspace/${map.id}`}
                                    className="forge-card flex flex-col h-full !p-8 group-hover:scale-[1.02] transition-all duration-500"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 text-2xl group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                                            🧠
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                                        {map.title}
                                    </h3>
                                    {map.description && (
                                        <p className="text-gray-500 leading-relaxed mb-8 flex-1">
                                            {map.description}
                                        </p>
                                    )}
                                    {!map.description && <div className="flex-1 mb-8"></div>}
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="text-xs font-bold uppercase tracking-widest text-gray-600">
                                            {new Date(map.updated_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setDeleteId(map.id);
                                                }}
                                                className="p-3 rounded-xl hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            <AnimatePresence>
                {showNewMapModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-card max-w-md w-full"
                        >
                            <h2 className="text-3xl font-black text-white mb-6">Forge Name</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">Give your new mind map a title that inspires creativity.</p>
                            <input
                                type="text"
                                value={newMapTitle}
                                onChange={(e) => setNewMapTitle(e.target.value)}
                                placeholder="Enter title..."
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-primary-500/20 mb-10 text-lg font-medium"
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && createNewMap()}
                            />
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowNewMapModal(false)}
                                    className="flex-1 px-4 py-4 rounded-2xl border border-white/5 hover:bg-white/5 text-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createNewMap}
                                    disabled={!newMapTitle.trim()}
                                    className="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold shadow-xl shadow-primary-500/20 transition-all disabled:opacity-50"
                                >
                                    Forge
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-card max-w-sm w-full"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 text-2xl">
                                ⚠️
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Extinguish Map?</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">This action cannot be undone. All nodes and AI insights will be lost forever.</p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 px-4 py-4 rounded-2xl border border-white/5 hover:bg-white/5 text-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteMap(deleteId)}
                                    className="flex-1 px-4 py-4 rounded-2xl bg-red-500 text-white font-bold shadow-xl shadow-red-500/20 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
