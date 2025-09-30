import Navbar from "@/components/Navbar";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {CheckSquare, Target, TrendingUp, Calendar} from "lucide-react";
import {trpc} from "../../utils/trpc";

const mainColor = "#2563eb";
const bgColor = "#f4f6fb";
const borderColor = "#e5e7eb";

export default function Account() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Controllo accesso...");
    const [form, setForm] = useState({
        nome: user?.nome || "",
        cognome: user?.cognome || "",
        email: user?.email || "",
        cellulare: user?.cellulare || "",
        password: "",
        notificheWhatsApp: user?.notifWhatsapp || false,
        notificheEmail: user?.notifEmail || true
    });
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const getTasks = trpc.tasks.getTasks.useMutation({
        onSuccess: (data) => {
            setTasks(data);
            setLoading(false);
        },
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

    const uploadUtente = trpc.auth.uploadUtente.useMutation({
        onSuccess: (data) => {
            return "Utente aggiornato con successo";
        },
        onError: (error) =>{
            return "Non è stato possibile aggiornare l'utente. Se il problema persiste contatta l'amministratore";
        }
    });

    const formSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setSaveMessage(null);
        // Costruisci il nuovo oggetto utente per il backend
        const newUser = {
            id: user.id,
            nome: form.nome,
            cognome: form.cognome,
            notifWhatsapp: form.notificheWhatsApp ? 1 : 0,
            notifEmail: form.notificheEmail ? 1 : 0,
            password: form.password || ""
        };
        // Aggiorna sessionStorage (mantieni email/cellulare solo qui)
        const sessionUser = JSON.parse(sessionStorage.getItem("user") as string);
        sessionUser.user = { ...sessionUser.user, ...newUser, email: user.email, cellulare: user.cellulare };
        sessionStorage.setItem("user", JSON.stringify(sessionUser));
        setUser(sessionUser.user);
        setForm(f => ({ ...f, password: "" }));
        // Invia SOLO i dati richiesti dal backend
        uploadUtente.mutate(newUser);
        setTimeout(() => {
            setSaving(false);
            setSaveMessage("Modifiche salvate con successo!");
            setTimeout(() => setSaveMessage(null), 2500);
        }, 900);
    }

    // Aggiorna la form quando cambia l'utente loggato
    useEffect(() => {
        if (user && user.id) {
            setLoadingMessage("Recupero dati...");
            getTasks.mutate({idUser: user.id});
        }
        if (user) {
            setForm({
                nome: user.nome || "",
                cognome: user.cognome || "",
                email: user.email || "",
                cellulare: user.cellulare || "",
                password: "",
                notificheWhatsApp: user.notifWhatsapp,
                notificheEmail: user.notifEmail
            });
        }
    }, [user]);

    // Responsive utility
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    useEffect(() => {
        function check() {
            setIsMobile(window.innerWidth <= 600);
            setIsTablet(window.innerWidth > 600 && window.innerWidth <= 1024);
        }
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

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
                <Navbar/>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
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
                    <span style={{color: mainColor, fontWeight: 600, fontSize: "1.13rem", letterSpacing: 0.2}}>
                        {loadingMessage}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div style={{background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column"}}>
            <Navbar/>
            <main
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minHeight: "calc(100vh - 64px)",
                    width: "100%",
                    background: "#fff",
                    paddingTop: 104, // sempre 104px come desktop
                    paddingLeft: isMobile ? 4 : isTablet ? 10 : 16,
                    paddingRight: isMobile ? 4 : isTablet ? 10 : 16,
                    boxSizing: "border-box",
                    gap: isMobile ? 4 : 8,
                    flexGrow: 1,
                }}
            >
                <h1
                    style={{
                        fontSize: isMobile ? '1.3rem' : isTablet ? '1.7rem' : 'clamp(1.5rem, 4vw, 2.1rem)',
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
                        fontSize: isMobile ? '0.98rem' : isTablet ? '1.08rem' : 'clamp(1rem, 2.5vw, 1.15rem)',
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
                        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
                        gap: isMobile ? 10 : isTablet ? 14 : 16,
                        marginTop: isMobile ? 16 : isTablet ? "2vh" : "4vh",
                        marginBottom: isMobile ? 10 : 0,
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
                        <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
                            <CheckSquare style={{width: 15, height: "auto", color: "#2563eb"}}/>
                            <span style={{fontSize: 16, fontWeight: 600, color: "#374151"}}>Task Totali</span>
                        </div>
                        <p style={{fontSize: 28, fontWeight: 700, color: "#2563eb", margin: 0}}>{tasks.length}</p>
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
                        <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
                            <Target style={{width: 15, height: "auto", color: "#267D39"}}/>
                            <span style={{fontSize: 16, fontWeight: 600, color: "#374151"}}>Completati</span>
                        </div>
                        <p style={{fontSize: 28, fontWeight: 700, color: "#267D39", margin: 0}}>
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
                        <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
                            <TrendingUp style={{width: 15, height: "auto", color: "#862C92"}}/>
                            <span style={{fontSize: 16, fontWeight: 600, color: "#374151"}}>Attivi</span>
                        </div>
                        <p style={{fontSize: 28, fontWeight: 700, color: "#862C92", margin: 0}}>
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
                        <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
                            <Calendar style={{width: 15, height: "auto", color: "#CE4828"}}/>
                            <span style={{fontSize: 16, fontWeight: 600, color: "#374151"}}>Attivi scaduti</span>
                        </div>
                        <p style={{fontSize: 28, fontWeight: 700, color: "#CE4828", margin: 0}}>
                            {tasks.filter((t) => {
                                return (new Date(t.date) < new Date()) && t.completed === 'in corso'
                            }).length}
                        </p>
                    </div>
                </div>

                {/* Contenitore espandibile sotto */}
                <div
                    style={{
                        borderRadius: 12,
                        width: "100%",
                        minHeight: isMobile ? undefined : "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: isMobile ? "20px 2px" : isTablet ? "30px 8px" : "50px 20px",
                        background: "linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: isMobile ? 340 : isTablet ? 500 : 700,
                            background: "#fff",
                            borderRadius: 12,
                            boxShadow: isMobile ? "0 2px 8px rgba(37,99,235,0.10)" : "0 8px 30px rgba(37,99,235,0.15)",
                            padding: isMobile ? "18px 8px" : isTablet ? "28px 16px" : "40px 36px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: isMobile ? 14 : isTablet ? 20 : 28,
                        }}
                    >
                        {/* Titolo */}
                        <h2
                            style={{
                                fontWeight: 700,
                                fontSize: isMobile ? 18 : isTablet ? 20 : 24,
                                color: "#2563eb",
                                margin: 0,
                                letterSpacing: 0.3,
                            }}
                        >
                            Modifica account
                        </h2>
                        {/* Avatar */}
                        <div
                            style={{
                                width: isMobile ? 60 : 90,
                                height: isMobile ? 60 : 90,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #2563eb 40%, #60a5fa 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isMobile ? 22 : 34,
                                color: "#fff",
                                fontWeight: 700,
                                boxShadow: isMobile ? "0 1px 4px rgba(37,99,235,0.15)" : "0 3px 12px rgba(37,99,235,0.25)",
                                border: "3px solid #fff",
                            }}
                        >
                            {user?.nome
                                ? user.nome[0].toUpperCase() + user.cognome[0].toUpperCase()
                                : "U"}
                        </div>
                        {/* Form */}
                        <form
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: isMobile ? 10 : 20,
                            }}
                            onSubmit={formSubmit}
                        >
                            {saving && (
                                <div style={{ color: '#2563eb', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>
                                    Salvataggio in corso...
                                </div>
                            )}
                            {saveMessage && (
                                <div style={{ color: '#267D39', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>
                                    {saveMessage}
                                </div>
                            )}
                            {/* Campi modificabili */}
                            {[
                                { key: "nome", label: "Nome", type: "text", placeholder: "Inserisci il tuo nome", disabled: false },
                                { key: "cognome", label: "Cognome", type: "text", placeholder: "Inserisci il tuo cognome", disabled: false },
                                { key: "email", label: "Email (Attenzione! non è possibile modificarla)", type: "email", placeholder: "Inserisci la tua email", disabled: true },
                                { key: "cellulare", label: "Cellulare (Attenzione! non è possibile modificarlo)", type: "text", placeholder: "Inserisci il tuo cellulare", disabled: true },
                                { key: "password", label: "Password", type: "password", placeholder: "Nuova password", disabled: false },
                            ].map((field, i) => (
                                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label
                                        style={{
                                            fontWeight: 600,
                                            color: "#2563eb",
                                            fontSize: 15,
                                        }}
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={form[field.key]}
                                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                        style={{
                                            padding: "12px 15px",
                                            borderRadius: 10,
                                            border: "1.8px solid #e2e8f0",
                                            fontSize: 15,
                                            background: "#f9fafb",
                                            width: "100%",
                                            boxSizing: "border-box",
                                            outline: "none",
                                            transition: "all 0.25s",
                                        }}
                                        disabled={field.disabled}
                                        onFocus={e => (e.currentTarget.style.border = "1.8px solid #2563eb")}
                                        onBlur={e => (e.currentTarget.style.border = "1.8px solid #e2e8f0")}
                                    />
                                </div>
                            ))}
                            {/* Notifiche */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 16px",
                                        border: "1.5px solid #e2e8f0",
                                        borderRadius: 12,
                                        background: "#f9fafb",
                                    }}
                                >
                                    <span style={{ fontSize: 15, fontWeight: 500, color: "#334155" }}>
                                        Ricevere notifiche via WhatsApp
                                    </span>
                                    <label
                                        style={{
                                            position: "relative",
                                            display: "inline-block",
                                            width: 44,
                                            height: 24,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.notificheWhatsApp}
                                            onChange={e => setForm(f => ({ ...f, notificheWhatsApp: e.target.checked }))}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: form.notificheWhatsApp ? "#2563eb" : "#cbd5e1",
                                                borderRadius: 24,
                                                transition: "0.3s",
                                            }}
                                        ></span>
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: "3px",
                                                left: form.notificheWhatsApp ? "22px" : "3px",
                                                width: 18,
                                                height: 18,
                                                backgroundColor: "#fff",
                                                borderRadius: "50%",
                                                transition: "0.3s",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                            }}
                                        ></span>
                                    </label>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 16px",
                                        border: "1.5px solid #e2e8f0",
                                        borderRadius: 12,
                                        background: "#f9fafb",
                                    }}
                                >
                                    <span style={{ fontSize: 15, fontWeight: 500, color: "#334155" }}>
                                        Ricevere notifiche via Email
                                    </span>
                                    <label
                                        style={{
                                            position: "relative",
                                            display: "inline-block",
                                            width: 44,
                                            height: 24,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.notificheEmail}
                                            onChange={e => setForm(f => ({ ...f, notificheEmail: e.target.checked }))}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: form.notificheEmail ? "#2563eb" : "#cbd5e1",
                                                borderRadius: 24,
                                                transition: "0.3s",
                                            }}
                                        ></span>
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: "3px",
                                                left: form.notificheEmail ? "22px" : "3px",
                                                width: 18,
                                                height: 18,
                                                backgroundColor: "#fff",
                                                borderRadius: "50%",
                                                transition: "0.3s",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                            }}
                                        ></span>
                                    </label>
                                </div>
                            </div>
                            {/* Bottone */}
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    marginTop: isMobile ? 14 : 25,
                                    background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: isMobile ? 15 : 16,
                                    border: "none",
                                    borderRadius: 12,
                                    padding: isMobile ? "10px 0" : "14px 0",
                                    cursor: "pointer",
                                    boxShadow: isMobile ? "0 1px 4px rgba(37,99,235,0.15)" : "0 3px 10px rgba(37,99,235,0.25)",
                                    transition: "all 0.25s",
                                    width: "100%",
                                    letterSpacing: 0.3,
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.background =
                                        "linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%)")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.background =
                                        "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)")
                                }
                            >
                                {saving ? "Salvando..." : "Salva"}
                            </button>

                            {/* Bottone Logout */}
                            <button
                                type="button"
                                disabled={loggingOut}
                                onClick={() => {
                                    setLoggingOut(true);
                                    setTimeout(() => {
                                        sessionStorage.removeItem("user");
                                        router.replace("/");
                                    }, 1000);
                                }}
                                style={{
                                    marginTop: isMobile ? 8 : 10,
                                    background: loggingOut ? "#be123c" : "#e11d48",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: isMobile ? 15 : 16,
                                    border: "none",
                                    borderRadius: 12,
                                    padding: isMobile ? "9px 0" : "12px 0",
                                    cursor: loggingOut ? "not-allowed" : "pointer",
                                    boxShadow: isMobile ? "0 1px 4px rgba(225,29,72,0.10)" : "0 2px 8px rgba(225,29,72,0.15)",
                                    transition: "all 0.25s",
                                    width: "100%",
                                    letterSpacing: 0.3,
                                }}
                                onMouseOver={e => { if (!loggingOut) e.currentTarget.style.background = "#be123c"; }}
                                onMouseOut={e => { if (!loggingOut) e.currentTarget.style.background = "#e11d48"; }}
                            >
                                {loggingOut ? "Disconnessione in corso..." : "Logout"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
