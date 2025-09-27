import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, []);

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6"
            style={{ textAlign: "center" }}
        >
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="text-center"
            >
                <div className="relative mb-4 flex justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="absolute inset-0 z-0 rounded-full bg-blue-200 blur-2xl opacity-60 w-40 h-40"
                        aria-hidden
                    />
                    <motion.span
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="z-10 text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 drop-shadow-lg"
                    >
                        404
                    </motion.span>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <div className="flex justify-center mb-2">
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-3xl md:text-4xl"
                            role="img"
                            aria-label="Magnifying glass"
                        >
                            🔍
                        </motion.span>
                    </div>
                    <p className="mb-2 text-2xl md:text-3xl font-semibold text-gray-800">
                        Oops! Pagina non trovata
                    </p>
                    <p className="mb-6 text-gray-500 text-base md:text-lg">
                        La pagina che cerchi non esiste o è stata spostata.
                    </p>
                    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={() => (window.location.href = "/auth/home")}
                            className="rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-7 py-3 text-lg font-bold text-white shadow-xl transition hover:from-blue-700 hover:to-blue-500 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            🏠 Torna alla Home
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;

