import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CheckSquare, Target, TrendingUp, Calendar } from "lucide-react";
import { trpc } from "../../utils/trpc";

const mainColor = "#2563eb";
const bgColor = "#f4f6fb";
const borderColor = "#e5e7eb";

export default function Account() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);

    const getTasks = trpc.tasks.getTasks.useMutation({
        onSuccess: (data) => setTasks(data),
        onError: (error) => console.error("Non è stato possibile recuperare le task", error),
    });

    // Recupera user da sessionStorage e gestisce redirect
    useEffect(() => {
        const stored = sessionStorage.getItem("user");
        if (!stored) {
            router.replace("/");
            return;
        }
        try {
            const parsed = JSON.parse(stored);
            if (!parsed.user?.verificato) {
                router.replace("/components/otp");
            } else {
                setUser(parsed.user);
            }
        } catch {
            router.replace("/");
        }
    }, []);

    // Carica le task quando l'user è valorizzato
    useEffect(() => {
        if (user && user.id) {
            getTasks.mutate({ idUser: user.id });
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div
                style={{
                    background: bgColor,
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            border: `6px solid ${borderColor}`,
                            borderTop: `6px solid ${mainColor}`,
                            animation: "spin 0.8s linear infinite",
                            marginBottom: 22,
                        }}
                    />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <span style={{ color: mainColor, fontWeight: 600, fontSize: "1.13rem", letterSpacing: 0.2 }}>
            Controllo accesso...
          </span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <main
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minHeight: "calc(100vh - 64px)",
                    width: "100%",
                    background: "#fff",
                    paddingTop: 104,
                    paddingLeft: 16,
                    paddingRight: 16,
                    boxSizing: "border-box",
                    gap: 8,
                    flexGrow: 1,
                }}
            >
                <h1
                    style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        letterSpacing: 0.5,
                        textAlign: 'center',
                    }}
                >
                    Il mio account
                </h1>
                <p
                    style={{
                        color: '#64748b',
                        fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                        fontWeight: 500,
                        margin: 0,
                        textAlign: 'center',
                    }}
                >
                    Panoramica delle tue attività e dati personali
                </p>
                {/* Righe di 4 card */}
                <div
                    style={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 16,
                        marginTop: "4vh",
                    }}
                >
                    {/* Task Totali */}
                    <div
                        style={{
                            background: "#2563eb22",
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <CheckSquare style={{ width: 15, height: "auto", color: "#2563eb" }} />
                            <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>Task Totali</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 700, color: "#2563eb", margin: 0 }}>{tasks.length}</p>
                    </div>

                    {/* Completati */}
                    <div
                        style={{
                            background: "#2563eb22",
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <Target style={{ width: 15, height: "auto", color: "#267D39" }} />
                            <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>Completati</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 700, color: "#267D39", margin: 0 }}>
                            {tasks.filter((t) => t.completed !== "in corso").length}
                        </p>
                    </div>

                    {/* Attivi */}
                    <div
                        style={{
                            background: "#2563eb22",
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <TrendingUp style={{ width: 15, height: "auto", color: "#862C92" }} />
                            <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>Attivi</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 700, color: "#862C92", margin: 0 }}>
                            {tasks.filter((t) => t.completed === "in corso").length}
                        </p>
                    </div>

                    {/* Scaduti */}
                    <div
                        style={{
                            background: "#2563eb22",
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <Calendar style={{ width: 15, height: "auto", color: "#CE4828" }} />
                            <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>Scaduti</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 700, color: "#CE4828", margin: 0 }}>
                            {tasks.filter((t) => {
                                return (new Date(t.date) < new Date()) && t.completed === 'in corso'
                            }).length}
                        </p>
                    </div>
                </div>

                {/* Contenitore espandibile sotto */}
                <div
                    style={{
                        width: "100%",
                        marginTop: 48,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            width: "98%",
                            maxWidth: 380,
                            background: "#fff",
                            borderRadius: 14,
                            boxShadow: "0 2px 16px 0 rgba(37,99,235,0.10)",
                            padding: 28,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 18,
                        }}
                    >
                        <div style={{ fontWeight: 600, fontSize: 18, color: '#2563eb', marginBottom: 0, letterSpacing: 0.2 }}>Modifica account</div>
                        <div style={{ width: '100%', borderBottom: '1px solid #e5e7eb', marginBottom: 10 }} />
                        {/* Avatar */}
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #2563eb 60%, #60a5fa 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 28,
                                color: "#fff",
                                fontWeight: 700,
                                boxShadow: "0 1px 6px 0 #2563eb22",
                                border: "2.5px solid #fff",
                                marginBottom: 2,
                            }}
                        >
                            {user?.nome ? user.nome[0].toUpperCase() + user.cognome[0].toUpperCase() : "U"}
                        </div>
                        {/* Form */}
                        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{ fontWeight: 500, color: '#2563eb', fontSize: 14, marginBottom: 0 }}>Nome</label>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={user?.name || ""}
                                    onChange={() => {}}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: 7,
                                        border: "1.5px solid #e5e7eb",
                                        fontSize: 15,
                                        background: '#f8fafc',
                                        width: "100%",
                                        boxSizing: "border-box",
                                        outline: 'none',
                                        transition: 'border 0.2s',
                                    }}
                                    onFocus={e => e.currentTarget.style.border = '1.5px solid #2563eb'}
                                    onBlur={e => e.currentTarget.style.border = '1.5px solid #e5e7eb'}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{ fontWeight: 500, color: '#2563eb', fontSize: 14, marginBottom: 0 }}>Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={user?.email || ""}
                                    onChange={() => {}}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: 7,
                                        border: "1.5px solid #e5e7eb",
                                        fontSize: 15,
                                        background: '#f8fafc',
                                        width: "100%",
                                        boxSizing: "border-box",
                                        outline: 'none',
                                        transition: 'border 0.2s',
                                    }}
                                    onFocus={e => e.currentTarget.style.border = '1.5px solid #2563eb'}
                                    onBlur={e => e.currentTarget.style.border = '1.5px solid #e5e7eb'}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{ fontWeight: 500, color: '#2563eb', fontSize: 14, marginBottom: 0 }}>Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value=""
                                    onChange={() => {}}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: 7,
                                        border: "1.5px solid #e5e7eb",
                                        fontSize: 15,
                                        background: '#f8fafc',
                                        width: "100%",
                                        boxSizing: "border-box",
                                        outline: 'none',
                                        transition: 'border 0.2s',
                                    }}
                                    onFocus={e => e.currentTarget.style.border = '1.5px solid #2563eb'}
                                    onBlur={e => e.currentTarget.style.border = '1.5px solid #e5e7eb'}
                                />
                            </div>
                            <button
                                type="button"
                                style={{
                                    marginTop: 10,
                                    background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: 16,
                                    border: 'none',
                                    borderRadius: 7,
                                    padding: '11px 0',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 4px 0 #2563eb22',
                                    transition: 'background 0.2s',
                                    width: '100%',
                                    letterSpacing: 0.2,
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%)'}
                                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)'}
                            >
                                Salva modifiche
                            </button>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    );
}
