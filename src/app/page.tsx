'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden selection:bg-primary-500/30">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between forge-card !p-4 !rounded-3xl border-white/5 bg-white/5 backdrop-blur-2xl">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center p-0.5 shadow-lg shadow-primary-500/20">
              <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              MindForge
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/login" className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-6 py-2.5 rounded-2xl bg-white text-background text-sm font-bold shadow-xl hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 lg:pt-64 lg:pb-44 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-6 py-2 rounded-full forge-glass border-white/10 mb-10 text-sm font-medium text-primary-400"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            <span>AI-Powered Brainstorming</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9]"
          >
            Forge Your Ideas <br />
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent text-glow">
              Into Reality.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Break through creative blocks with the world's most intelligent mind mapping platform. Collaborative, AI-driven, and designed for visionary thinkers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link href="/register" className="w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg shadow-2xl shadow-primary-500/50 hover:scale-105 active:scale-95 transition-all">
              Start Forging Free
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 rounded-[2rem] forge-glass border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "AI Intelligence",
                desc: "Smart suggestions that learn from your domain to expand your thinking in real-time.",
                icon: (
                  <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "Organic Canvas",
                desc: "An infinite, fluid workspace that prioritizes flow over rigid structures and boxes.",
                icon: (
                  <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Deep Insights",
                desc: "Analyze connections in your data you never knew existed with semantic graph technology.",
                icon: (
                  <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="forge-card flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-8 border border-primary-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Spacer */}
      <section className="py-64 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[800px] h-[800px] rounded-full bg-primary-500/10 blur-[120px] animate-float-slow"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-10 tracking-tight leading-tight">
            Designed for the <br /> <span className="opacity-40 italic">Modern Mind.</span>
          </h2>
          <p className="text-2xl text-gray-500 italic max-w-2xl mx-auto">
            "MindForge isn't just a tool; it's a cerebral extension. It turned our chaotic research into a structured roadmap in minutes."
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">MindForge</span>
          </div>
          <div className="flex space-x-12">
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition-colors">Changelog</span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 MindForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
