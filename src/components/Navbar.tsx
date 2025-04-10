"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <motion.nav
                className="w-full px-8 py-4 bg-[#09090B] text-white shadow-md flex justify-between items-center z-50 relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-2xl text-blue-600 font-bold tracking-wide">
                    <Link href="/">WebQuery</Link>
                </div>

                <div className="space-x-6 hidden md:flex">
                    <Link href="/" className="hover:text-blue-400 transition">Home</Link>
                    <Link href="/convert" className="hover:text-blue-400 transition">Convert</Link>
                </div>

                <div className="md:hidden" onClick={toggleMenu}>
                    {isOpen ? <XIcon /> : <MenuIcon />}
                </div>
            </motion.nav>

            {isOpen && (
                <motion.div
                    className="flex flex-col items-start px-8 py-4 bg-[#09090B] text-white md:hidden space-y-4 shadow-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link href="/" className="hover:text-blue-400 transition" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/convert" className="hover:text-blue-400 transition" onClick={() => setIsOpen(false)}>Convert</Link>
                </motion.div>
            )}
        </>
    );
}
