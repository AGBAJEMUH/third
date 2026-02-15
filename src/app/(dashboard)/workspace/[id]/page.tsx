'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
}

interface Connection {
    from: string;
    to: string;
}

interface MindMapData {
    nodes: Node[];
    connections: Connection[];
}

export default function MindMapEditorPage() {
    const router = useRouter();
    const params = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mapData, setMapData] = useState<MindMapData>({ nodes: [], connections: [] });
    const [title, setTitle] = useState('');
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [draggingNode, setDraggingNode] = useState<string | null>(null);
    const [editingNode, setEditingNode] = useState<string | null>(null);
    const [tempText, setTempText] = useState('');
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [showAISuggestions, setShowAISuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    // Initialize pan to center
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPan({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        }
    }, []);

    useEffect(() => {
        fetchMindMap();
    }, [params.id]);

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to fill window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        // Draw connections with Bezier curves
        mapData.connections.forEach((conn) => {
            const fromNode = mapData.nodes.find((n) => n.id === conn.from);
            const toNode = mapData.nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return;

            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);

            // Bezier curve for organic feel
            const cp1x = fromNode.x + (toNode.x - fromNode.x) / 2;
            const cp1y = fromNode.y;
            const cp2x = fromNode.x + (toNode.x - fromNode.x) / 2;
            const cp2y = toNode.y;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, toNode.x, toNode.y);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 3 / zoom;
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        // Draw nodes
        mapData.nodes.forEach((node) => {
            const isSelected = node.id === selectedNode;
            const isEditing = node.id === editingNode;

            if (isEditing) return; // Handled by HTML overlay

            ctx.save();

            // Shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;

            // Pill Shape
            const padding = 30;
            ctx.font = '700 16px Inter';
            const textWidth = ctx.measureText(node.text).width;
            const nodeWidth = Math.max(120, textWidth + padding * 2);
            const nodeHeight = 54;

            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.roundRect(node.x - nodeWidth / 2, node.y - nodeHeight / 2, nodeWidth, nodeHeight, 27);
            ctx.fill();

            if (isSelected) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 4 / zoom;
                ctx.stroke();
            }

            // Text
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.text, node.x, node.y);

            ctx.restore();
        });

        ctx.restore();
    }, [mapData, zoom, pan, selectedNode, editingNode]);

    useEffect(() => {
        drawCanvas();
        window.addEventListener('resize', drawCanvas);
        return () => window.removeEventListener('resize', drawCanvas);
    }, [drawCanvas]);

    const fetchMindMap = async () => {
        try {
            const res = await fetch(`/api/maps/${params.id}`);
            if (!res.ok) {
                if (res.status === 401) router.push('/login');
                return;
            }
            const { map } = await res.json();
            setTitle(map.title);
            setMapData(JSON.parse(map.data));
        } catch (error) {
            console.error('Error fetching mind map:', error);
        }
    };

    const saveMap = async () => {
        setSaving(true);
        try {
            await fetch(`/api/maps/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    data: JSON.stringify(mapData),
                }),
            });
        } catch (error) {
            console.error('Error saving map:', error);
        } finally {
            setSaving(false);
        }
    };

    const getCanvasPos = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left - pan.x) / zoom,
            y: (clientY - rect.top - pan.y) / zoom
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getCanvasPos(e.clientX, e.clientY);

        // Find if clicked on node
        const clickedNode = mapData.nodes.find((node) => {
            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx) return false;
            ctx.font = '700 16px Inter';
            const nodeWidth = Math.max(120, ctx.measureText(node.text).width + 60);
            return x >= node.x - nodeWidth / 2 && x <= node.x + nodeWidth / 2 && y >= node.y - 27 && y <= node.y + 27;
        });

        if (clickedNode) {
            setDraggingNode(clickedNode.id);
            setSelectedNode(clickedNode.id);
            setOffset({ x: x - clickedNode.x, y: y - clickedNode.y });
        } else {
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
            setSelectedNode(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingNode) {
            const { x, y } = getCanvasPos(e.clientX, e.clientY);
            setMapData((prev) => ({
                ...prev,
                nodes: prev.nodes.map((node) =>
                    node.id === draggingNode
                        ? { ...node, x: x - offset.x, y: y - offset.y }
                        : node
                ),
            }));
        } else if (isPanning) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        if (draggingNode) {
            setDraggingNode(null);
            saveMap();
        }
        setIsPanning(false);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        const { x, y } = getCanvasPos(e.clientX, e.clientY);
        const clickedNode = mapData.nodes.find((node) => {
            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx) return false;
            ctx.font = '700 16px Inter';
            const nodeWidth = Math.max(120, ctx.measureText(node.text).width + 60);
            return x >= node.x - nodeWidth / 2 && x <= node.x + nodeWidth / 2 && y >= node.y - 27 && y <= node.y + 27;
        });

        if (clickedNode) {
            setEditingNode(clickedNode.id);
            setTempText(clickedNode.text);
        }
    };

    const finishEditing = () => {
        if (!editingNode) return;
        setMapData(prev => ({
            ...prev,
            nodes: prev.nodes.map(n => n.id === editingNode ? { ...n, text: tempText || n.text } : n)
        }));
        setEditingNode(null);
        saveMap();
    };

    const addNode = () => {
        const newNode: Node = {
            id: `node-${Date.now()}`,
            text: 'New Idea',
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            color: '#8b5cf6',
        };

        setMapData((prev) => ({
            ...prev,
            nodes: [...prev.nodes, newNode],
        }));
        saveMap();
    };

    const deleteNode = () => {
        if (!selectedNode) return;
        setMapData((prev) => ({
            nodes: prev.nodes.filter((n) => n.id !== selectedNode),
            connections: prev.connections.filter(
                (c) => c.from !== selectedNode && c.to !== selectedNode
            ),
        }));
        setSelectedNode(null);
        saveMap();
    };

    const startAISuggestions = async () => {
        if (!selectedNode) return;
        const node = mapData.nodes.find(n => n.id === selectedNode);
        if (!node) return;

        try {
            const res = await fetch('/api/ai/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: node.text }),
            });
            const data = await res.json();
            setAiSuggestions(data.suggestions || []);
            setShowAISuggestions(true);
        } catch (error) {
            console.error('AI Error:', error);
        }
    };

    const addSuggestion = (suggestion: string) => {
        if (!selectedNode) return;
        const parent = mapData.nodes.find(n => n.id === selectedNode);
        if (!parent) return;

        const newNode: Node = {
            id: `node-${Date.now()}`,
            text: suggestion,
            x: parent.x + (Math.random() - 0.5) * 300,
            y: parent.y + 200,
            color: '#3b82f6',
        };

        setMapData(prev => ({
            nodes: [...prev.nodes, newNode],
            connections: [...prev.connections, { from: selectedNode, to: newNode.id }]
        }));
        setShowAISuggestions(false);
        saveMap();
    };

    return (
        <div className="h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Header Overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-6">
                <div className="forge-card !p-2 !rounded-2xl flex items-center space-x-4 border-white/10 shadow-3xl">
                    <Link href="/workspace" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveMap}
                        className="bg-transparent border-none text-white font-bold text-lg focus:outline-none w-48 text-center"
                    />
                    {saving && (
                        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-primary-500">Auto-Saving</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            />

            {/* Node Editing Overlay */}
            {editingNode && mapData.nodes.find(n => n.id === editingNode) && (
                <div
                    className="absolute z-[60]"
                    style={{
                        left: pan.x + mapData.nodes.find(n => n.id === editingNode)!.x * zoom,
                        top: pan.y + mapData.nodes.find(n => n.id === editingNode)!.y * zoom,
                        transform: 'translate(-50%, -50%) scale(' + zoom + ')'
                    }}
                >
                    <input
                        autoFocus
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        onBlur={finishEditing}
                        onKeyDown={(e) => e.key === 'Enter' && finishEditing()}
                        className="px-8 py-3 rounded-full bg-primary-600 text-white font-bold text-lg text-center shadow-2xl outline-none min-w-[160px]"
                        style={{ backgroundColor: mapData.nodes.find(n => n.id === editingNode)!.color }}
                    />
                </div>
            )}

            {/* Bottom Toolbar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
                <div className="forge-card !p-3 !rounded-[2rem] flex items-center space-x-2 border-white/10 shadow-4xl">
                    <button
                        onClick={addNode}
                        className="p-4 rounded-3xl bg-white/5 hover:bg-primary-500 text-white transition-all flex items-center space-x-2 group"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-bold pr-2 hidden group-hover:block">Add Idea</span>
                    </button>

                    {selectedNode && (
                        <>
                            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                            <button
                                onClick={startAISuggestions}
                                className="px-6 py-4 rounded-3xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>AI Expand</span>
                            </button>
                            <button
                                onClick={deleteNode}
                                className="p-4 rounded-3xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-10 right-10 z-50 flex flex-col space-y-3">
                <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="w-12 h-12 rounded-2xl glass border-white/10 text-white font-bold hover:bg-white/5 shadow-xl transition-all">+</button>
                <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.4))} className="w-12 h-12 rounded-2xl glass border-white/10 text-white font-bold hover:bg-white/5 shadow-xl transition-all">−</button>
                <button onClick={() => { setZoom(1); setPan({ x: innerWidth / 2, y: innerHeight / 2 }); }} className="p-3 rounded-2xl glass border-white/10 text-gray-400 hover:text-white shadow-xl transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
            </div>

            {/* AI Modal */}
            <AnimatePresence>
                {showAISuggestions && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="glass-card max-w-lg w-full"
                        >
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 text-2xl text-primary-400">🤖</div>
                                <h2 className="text-3xl font-black text-white">AI Concept Forge</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mb-10">
                                {aiSuggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => addSuggestion(suggestion)}
                                        className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-primary-500 hover:border-primary-500 text-left text-white font-bold transition-all flex items-center justify-between group"
                                    >
                                        <span>{suggestion}</span>
                                        <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowAISuggestions(false)}
                                className="w-full py-4 rounded-2xl border border-white/5 text-gray-500 hover:text-white transition-all font-bold"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
