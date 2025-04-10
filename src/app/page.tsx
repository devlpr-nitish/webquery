"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
    return (
        <div className={`${poppins.className} min-h-[780px] bg-[#f9f9f9] text-gray-900`}>

            <motion.section
                className="min-h-[780px] flex flex-col h-auto items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-[#09090B] to-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h1
                    className="text-5xl font-extrabold text-gray-200 mb-6 leading-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Turn Any Page <br /> Into Smart Answers
                </motion.h1>
                <motion.p
                    className="text-lg text-gray-300 max-w-2xl mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    WebQuery allows you to capture a webpage screenshot and ask questions related to its content using AI-powered insights just after giving the url of that page.
                </motion.p>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                >
                    <Link
                        href="/convert"
                        className="border border-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:border-blue-300 transition"
                    >
                        Try It Now
                    </Link>
                </motion.div>
            </motion.section>
            
        </div>
    );
}
