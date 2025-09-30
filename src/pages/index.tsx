"use client";

import React, {useState} from 'react';
import { useRouter } from 'next/router';
import {trpc} from "../utils/trpc";

export default function IndexPage() {
    // Stati per il form di login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [loginError, setLoginError] = useState('');

    const router = useRouter();
    // Mutation per il login - DEVE essere definita fuori da handleSubmit
    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: (data) => {
            console.log("Login successful:", data);
            sessionStorage.setItem("user", JSON.stringify(data));
            setLoginError('');
            // Se l'utente è verificato, vai su /auth/home, altrimenti su /components/otp
            if (data.user.verificato) {
                router.push('/auth/home');
            } else {
                router.push('./otp');
            }
        },
        onError: (error) => {
            console.error("Login failed:", error);
            setLoginError(error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        console.log('Form submitted:', {email, password});

        // Validazione base
        if (!email || !password) {
            setLoginError('Inserisci email e password');
            return;
        }

        // Chiamata alla mutation con i dati del form
        loginMutation.mutate({email, password});
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
        form: {display: 'flex', flexDirection: 'column' as const, gap: '1.25rem'},
        inputGroup: {display: 'flex', flexDirection: 'column' as const, gap: '0.5rem'},
        label: {color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'},
        input: {
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: `1.5px solid ${borderColor}`,
            fontSize: '1rem',
            transition: 'all 0.2s ease',
            backgroundColor: '#f9fafb',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box' as const,
        },
        button: {
            backgroundColor: isHovered ? '#1a56db' : mainColor,
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1.08rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: '0.5rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
        },
        forgotPassword: {textAlign: 'right' as const, marginTop: '-0.5rem'},
        forgotPasswordLink: {
            color: mainColor,
            fontSize: '0.875rem',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
        },
        footer: {textAlign: 'center' as const, marginTop: '2rem', color: '#666', fontSize: '0.875rem'},
        footerLink: {color: mainColor, textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s ease'},
    };

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
                <h1 style={styles.title}>Bentornato</h1>
                <p style={styles.subtitle}>Accedi al tuo account per continuare</p>
                {loginError && (
                    <div style={{color: 'red', fontSize: '0.875rem', textAlign: 'center' as const, marginBottom: '1rem'}}>
                        {loginError}
                    </div>
                )}
                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="email">Indirizzo email</label>
                        <input
                            style={styles.input}
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nome@azienda.com"
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="password">Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div style={styles.forgotPassword}>
                        <a href="#" style={styles.forgotPasswordLink}>Password dimenticata?</a>
                    </div>
                    <button
                        style={{
                            ...styles.button,
                            backgroundColor: loginMutation.isLoading ? '#9ca3af' : (isHovered ? '#1a56db' : '#2563eb'),
                            cursor: loginMutation.isLoading ? 'not-allowed' : 'pointer'
                        }}
                        type="submit"
                        disabled={loginMutation.isLoading}
                        onMouseEnter={() => !loginMutation.isLoading && setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {loginMutation.isLoading ? 'Accesso in corso...' : 'Accedi'}
                        {!loginMutation.isLoading && (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.166 10h11.667M11.666 5l5 5-5 5"
                                    stroke="currentColor"
                                    strokeWidth="1.67"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </button>
                </form>
                <div style={styles.footer}>
                    Non hai un account?{' '}
                    <a href="register" style={styles.footerLink}>Registrati</a>
                </div>
            </div>
        </div>
    );
}
