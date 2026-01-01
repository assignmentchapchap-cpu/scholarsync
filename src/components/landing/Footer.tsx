'use client';

import { Github, Twitter, Linkedin, GraduationCap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-white py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 font-bold text-xl mb-4">
                            <GraduationCap className="w-8 h-8 text-indigo-500" />
                            <span>ScholarSync</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering educators with AI-driven insights for fairer, faster grading.
                        </p>
                    </div>

                    <div>
                        <h5 className="font-bold text-slate-300 mb-4 uppercase text-xs tracking-wider">Product</h5>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-slate-300 mb-4 uppercase text-xs tracking-wider">Resources</h5>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-slate-300 mb-4 uppercase text-xs tracking-wider">Legal</h5>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ScholarSync Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Github className="w-5 h-5 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                        <Twitter className="w-5 h-5 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                        <Linkedin className="w-5 h-5 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
