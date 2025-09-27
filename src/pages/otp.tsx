"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

function maskEmail(email: string) {
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    const maskedUser = user.length <= 2 ? user[0] + "*" : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];
    return maskedUser + "@" + domain;
}

function maskPhone(phone: string) {
    if (phone.length < 4) return "***";
    return phone.slice(0, 2) + "***" + phone.slice(-2);
}

export default function OtpPage() {
    const [user, setUser] = useState<{ email: string; cellulare: string } | null>(null);
    const [selected, setSelected] = useState<"email" | "whatsapp" | null>(null);
    const [sent, setSent] = useState<"email" | "whatsapp" | null>(null);
    const [serverMsg, setServerMsg] = useState<string | null>(null);
    const [otpInput, setOtpInput] = useState("");
    const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = sessionStorage.getItem("user");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser({
                    email: parsed.user?.email || "",
                    cellulare: parsed.user?.cellulare || ""
                });
            } catch {
                setUser(null);
            }
        }
    }, []);

    const otpMutation = trpc.auth.otp.useMutation();
    const verifyOtpMutation = trpc.auth.verifyOtp.useMutation();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerMsg(null);
        if (!selected || !user) return;
        try {
            const res = await otpMutation.mutateAsync({ email: user.email, cellulare: user.cellulare, tipo: selected });
            setSent(selected);
            setServerMsg(res?.message || null);
            setShowOtpForm(true);
        } catch (err: any) {
            setServerMsg(err?.message || "Errore nell'invio dell'OTP. Riprova.");
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyMsg(null);
        setVerifying(true);
        if (!user) return;
        try {
            const res = await verifyOtpMutation.mutateAsync({ email: user.email, otp: otpInput });
            setVerifyMsg(res?.message || null);
            // Aggiorna sessionStorage per segnare l'utente come verificato
            const stored = sessionStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.user.verificato = 1;
                sessionStorage.setItem("user", JSON.stringify(parsed));
            }
            // Redirect immediato alla home autenticata
            router.push("/auth/home");
        } catch (err: any) {
            setVerifyMsg(err?.message || "OTP non valido o errore di verifica.");
        } finally {
            setVerifying(false);
        }
    };

    const mainColor = '#2563eb';
    const bgColor = '#f4f6fb';
    const cardColor = '#fff';
    const borderColor = '#e5e7eb';
    const shadow = '0 4px 24px 0 rgba(37,99,235,0.08)';
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: bgColor,
        },
        formCard: {
            backgroundColor: cardColor,
            padding: '2.5rem 2.2rem',
            borderRadius: '18px',
            boxShadow: shadow,
            width: '100%',
            maxWidth: '400px',
            border: `1.5px solid ${borderColor}`,
        },
        logo: {textAlign: 'center' as const, marginBottom: '2rem'},
        title: {
            textAlign: 'center' as const,
            color: mainColor,
            marginBottom: '0.5rem',
            fontSize: '1.75rem',
            fontWeight: '700',
            letterSpacing: '-0.025em',
        },
        subtitle: {
            textAlign: 'center' as const,
            color: '#666',
            marginBottom: '2rem',
            fontSize: '0.95rem',
        },
        radioGroup: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '1.5rem',
            margin: '2.2rem 0 0.5rem 0',
        },
        radioRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
        },
        radioCircle: (active: boolean, color: string) => ({
            display: 'inline-block',
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: active ? `6px solid ${color}` : '2px solid #cbd5e1',
            background: active ? color : '#fff',
            transition: 'border 0.2s',
        }),
        badge: {
            background: '#f9fafb',
            borderRadius: 8,
            padding: '0.65rem 1.1rem',
            fontSize: '1.08rem',
            color: '#374151',
            fontWeight: 500,
            minWidth: 160,
            textAlign: 'center' as const,
            letterSpacing: '0.01em',
            border: `1.5px solid ${borderColor}`,
        },
        button: {
            backgroundColor: mainColor,
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1.08rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: '2.2rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 1,
        },
        buttonDisabled: {
            background: '#cbd5e1',
            color: '#fff',
            cursor: 'not-allowed',
            opacity: 0.7,
        }
    };

    if (!user) {
        return <div style={styles.container}><div style={styles.formCard}>Utente non trovato. Effettua di nuovo il login.</div></div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <div style={styles.logo}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#2563eb"/>
                        <path
                            d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM24.707 20.707L19.707 25.707C19.512 25.902 19.256 26 19 26C18.744 26 18.488 25.902 18.293 25.707C17.902 25.316 17.902 24.684 18.293 24.293L22.586 20L18.293 15.707C17.902 15.316 17.902 14.684 18.293 14.293C18.684 13.902 19.316 13.902 19.707 14.293L24.707 19.293C25.098 19.684 25.098 20.316 24.707 20.707Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <h2 style={styles.title}>Verifica OTP</h2>
                {/* Form scelta metodo invio OTP */}
                {!showOtpForm && (
                    <form onSubmit={handleSendOtp} style={{width: '100%'}}>
                        <div style={styles.radioGroup}>
                            <div style={{...styles.radioRow, flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem'}}>
                                <label style={{display: 'flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer'}}>
                                    <span style={styles.radioCircle(selected === 'email', '#2563eb')}>
                                        {selected === 'email' && (
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6.5" fill="white"/></svg>
                                        )}
                                    </span>
                                    <input
                                        type="radio"
                                        name="otpMethod"
                                        value="email"
                                        checked={selected === 'email'}
                                        onChange={() => setSelected('email')}
                                        style={{display: 'none'}}
                                    />
                                    <span style={{fontWeight: 500, fontSize: '1.08rem', color: '#1a1a1a'}}>Ricevi via Email</span>
                                </label>
                                <span style={{...styles.badge, marginLeft: 32}}>{maskEmail(user.email)}</span>
                            </div>
                            <div style={{...styles.radioRow, flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem'}}>
                                <label style={{display: 'flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer'}}>
                                    <span style={styles.radioCircle(selected === 'whatsapp', '#25d366')}>
                                        {selected === 'whatsapp' && (
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6.5" fill="white"/></svg>
                                        )}
                                    </span>
                                    <input
                                        type="radio"
                                        name="otpMethod"
                                        value="whatsapp"
                                        checked={selected === 'whatsapp'}
                                        onChange={() => setSelected('whatsapp')}
                                        style={{display: 'none'}}
                                    />
                                    <span style={{fontWeight: 500, fontSize: '1.08rem', color: '#1a1a1a'}}>Ricevi via WhatsApp</span>
                                </label>
                                <span style={{...styles.badge, marginLeft: 32}}>{maskPhone(user.cellulare)}</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            style={{
                                ...styles.button,
                                ...(selected ? {} : styles.buttonDisabled),
                                opacity: otpMutation.isLoading ? 0.7 : 1,
                            }}
                            disabled={!selected || otpMutation.isLoading}
                        >
                            {otpMutation.isLoading ? 'Invio in corso...' : 'Invia OTP'}
                        </button>
                    </form>
                )}
                {serverMsg && (
                    <div style={{ marginTop: "1.7rem", color: sent === "whatsapp" ? "#25d366" : "#2563eb", fontWeight: 600, textAlign: 'center', fontSize: '1.08rem', letterSpacing: '0.01em' }}>
                        {serverMsg}
                    </div>
                )}
                {/* Form inserimento OTP */}
                {showOtpForm && (
                    <form onSubmit={handleVerifyOtp} style={{ width: '100%', marginTop: '2.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '1.08rem', color: '#1a1a1a', marginBottom: 8 }}>
                            Inserisci il codice OTP ricevuto:
                        </label>
                        <input
                            type="text"
                            value={otpInput}
                            onChange={e => setOtpInput(e.target.value)}
                            maxLength={6}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                fontSize: '1.1rem',
                                borderRadius: 8,
                                border: '1.5px solid #e5e7eb',
                                margin: '0.7rem 0 1.2rem 0',
                                letterSpacing: '0.3em',
                                textAlign: 'center',
                                outline: 'none',
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                        />
                        <button
                            type="submit"
                            style={{ ...styles.button, opacity: verifying ? 0.7 : 1 }}
                            disabled={verifying || otpInput.length !== 6}
                        >
                            {verifying ? 'Verifica in corso...' : 'Verifica OTP'}
                        </button>
                        {verifyMsg && (
                            <div style={{ marginTop: 18, color: verifyMsg.includes('successo') ? '#2563eb' : '#e11d48', fontWeight: 600, textAlign: 'center', fontSize: '1.08rem', letterSpacing: '0.01em' }}>
                                {verifyMsg}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}