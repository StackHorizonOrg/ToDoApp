"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {Trash2} from "lucide-react";
import {trpc} from "../../utils/trpc";

const mainColor = "#2563eb";
const bgColor = "#f4f6fb";
const borderColor = "#e5e7eb";

export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Array<any>>([]);
    // Stato per la modale di aggiunta task
    const [showAddCard, setShowAddCard] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", date: "", description: "" });
    // Stato per errori form
    const [formError, setFormError] = useState("");
    const addTaskMutation = trpc.tasks.addTask.useMutation({
        onSuccess: (data) => {
            console.log("Task aggiunta con successo", data);
            getTasks.mutate({idUser: user.id});
        },
        onError: (error) => {
            console.error("Non è stato possibile aggiungere la task", error);
        }
    });

    const getTasks = trpc.tasks.getTasks.useMutation({
        onSuccess: (data) => {
            console.log(data);
            setTasks(data);
            setTotalCount(data.length);
            setCompletedCount(data.filter((t: any) => t.completed !== 'in corso').length);
        },
        onError: (error) => {
            console.error("Non è stato possibile recuperare le task", error);
        }
    });

    const deleteTaskMutation = trpc.tasks.deleteTask.useMutation({
        onSuccess: (data)=>{
            console.log("Task eliminata con successo", data);
            getTasks.mutate({idUser: user.id});
        },
        onError(error){
            console.error("Non è stato possibile eliminare la task", error);
        }
    });

    const updateTask = trpc.tasks.updateTaskStatus.useMutation({
        onSuccess: (data)=> {
            console.log("Stato task aggiornata con successo", data);
            getTasks.mutate({idUser: user.id});
        },
        onError(error){
            console.error("Non è stato possibile aggiornare lo stato della task", error);
        }
    });

    // Funzione per aggiungere una nuova task
    const handleAddTask = () => {
        if (!newTask.title.trim() || !newTask.date.trim() || !newTask.description.trim()) {
            setFormError("Tutti i campi sono obbligatori");
            return;
        }
        const idUser = JSON.parse(sessionStorage.getItem("user") || "").user.id;
        addTaskMutation.mutate({idUser, titolo: newTask.title.trim(), descrizione: newTask.description.trim(), scadenza: newTask.date});
        setTotalCount(totalCount + 1);
        setShowAddCard(false);
        setNewTask({ title: "", date: "", description: "" });
        setFormError("");
    };
    // Funzioni per task (aggiungo anche visualizzazione e gestione task)
    const toggleTask = (id: number) => {
        setTasks(tasks => tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        updateTask.mutate({id});
    };
    const deleteTask = (id: number) => {
        deleteTaskMutation.mutate({id});
        setTasks(tasks => tasks.filter(t => t.id !== id));
    };

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
                const idUser = JSON.parse(sessionStorage.getItem("user") || "").user.id;
                getTasks.mutate({idUser});
                setLoading(false);
            }
        } catch {
            router.replace("/");
        }
    }, []);
    if (loading) {

        return (
            <div style={{background: bgColor, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        border: `6px solid ${borderColor}`,
                        borderTop: `6px solid ${mainColor}`,
                        animation: 'spin 0.8s linear infinite',
                        marginBottom: 22
                    }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <span style={{color: mainColor, fontWeight: 600, fontSize: '1.13rem', letterSpacing: 0.2}}>Controllo accesso...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{background: "#ffffff", minHeight: '100vh'}}>
            <Navbar/>
            <main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: 'calc(100vh - 64px)',
                    width: '100%',
                    background: '#ffffff',
                    paddingTop: 104,
                    paddingLeft: 16,
                    paddingRight: 16,
                    boxSizing: 'border-box',
                    gap: 8,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
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
                        I miei Task
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
                        {totalCount === 0
                            ? "Inizia aggiungendo il tuo primo task!"
                            : `${completedCount} di ${totalCount} task completati`}
                    </p>
                    <Button
                        style={{
                            width: '100%',
                            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                            padding: '12px 0',
                            borderRadius: 12,
                            background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                            color: '#fffff',
                            boxShadow: showAddCard ? '0 2px 12px 0 rgba(37,99,235,0.18)' : '0 1px 4px 0 #e0e7ff55',
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                            border: showAddCard ? 'none' : '1.5px solid #e0e7ff',
                            margin: '4px 0 10px 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                        aria-label="Aggiungi nuovo task"
                        onClick={() => setShowAddCard(true)}
                    >
                        <span style={{fontSize: '1.5em', fontWeight: 900, marginRight: 4, lineHeight: 1}}>＋</span>
                        Aggiungi nuovo task
                    </Button>
                    {/* Card per aggiunta task */}
                    {showAddCard && (
                        <>
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(30,41,59,0.45)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'fadeIn .18s',
                        }}
                        onClick={e => { if (e.target === e.currentTarget) setShowAddCard(false); }}
                        >
                            <Card style={{
                                width: '100%',
                                maxWidth: 420,
                                borderRadius: 24,
                                boxShadow: '0 12px 48px 0 rgba(37,99,235,0.22)',
                                padding: 0,
                                background: '#fff',
                                position: 'relative',
                                animation: 'fadeInUp .22s',
                                overflow: 'hidden',
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <div style={{
                                    background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                                    padding: '24px 36px 18px 36px',
                                    color: '#fff',
                                    fontWeight: 900,
                                    fontSize: 24,
                                    letterSpacing: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: '1.5px solid #e5e7eb22',
                                    boxShadow: '0 2px 12px 0 rgba(37,99,235,0.10)',
                                }}>
                                    <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="5" fill="#fff" opacity=".13"/><rect x="6" y="8" width="12" height="8" rx="4" fill="#fff" opacity=".32"/></svg>
                                        Nuova Task
                                    </span>
                                    <button
                                        onClick={() => setShowAddCard(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: 26,
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            opacity: 0.85,
                                            marginLeft: 8,
                                            transition: 'opacity 0.2s',
                                        }}
                                        aria-label="Chiudi"
                                    >✕</button>
                                </div>
                                <form onSubmit={e => { e.preventDefault(); handleAddTask(); }} style={{padding: 30, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 22}}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                                        <Label htmlFor="titolo" style={{fontWeight: 700, color: '#2563eb', fontSize: 15, marginBottom: 2}}>Titolo</Label>
                                        <Input id="titolo" autoFocus value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Titolo della task" style={{fontSize: 17, borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#f8fafc', boxShadow: '0 1px 6px 0 #e0e7ff33', padding: '13px 14px'}} />
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                                        <Label htmlFor="data" style={{fontWeight: 700, color: '#2563eb', fontSize: 15, marginBottom: 2}}>Data e ora scadenza</Label>
                                        <Input id="data" type="datetime-local" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })} style={{fontSize: 17, borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#f8fafc', boxShadow: '0 1px 6px 0 #e0e7ff33', padding: '13px 14px'}} />
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                                        <Label htmlFor="desc" style={{fontWeight: 700, color: '#2563eb', fontSize: 15, marginBottom: 2}}>Descrizione</Label>
                                        <Textarea id="desc" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Aggiungi una descrizione..." rows={3} style={{fontSize: 17, borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#f8fafc', boxShadow: '0 1px 6px 0 #e0e7ff33', padding: '13px 14px'}} />
                                    </div>
                                    {formError && <span style={{color: '#ef4444', fontWeight: 600, fontSize: 15, marginTop: 2}}>{formError}</span>}
                                    <Button type="submit" style={{marginTop: 10, fontWeight: 800, fontSize: 17, borderRadius: 12, background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', color: '#fff', boxShadow: '0 2px 12px 0 rgba(37,99,235,0.13)', letterSpacing: 0.2, padding: '15px 0', border: 'none'}}>Salva</Button>
                                </form>
                            </Card>
                        </div>
                        <style>{`
                            @keyframes fadeInUp { from { opacity: 0; transform: translateY(32px);} to { opacity: 1; transform: none; } }
                        `}</style>
                        </>
                    )}
                </div>
                {/* Elenco task come card professionali */}
                <div style={{
                    width: '100%',
                    marginTop: "4vh",
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}>
                    {tasks.length === 0 ? (
                        <div style={{color: '#94a3b8', textAlign: 'center', fontSize: 18, marginTop: 32}}>Nessun task presente</div>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#2563eb22',
                                    borderRadius: 16,
                                    boxShadow: '0 2px 12px 0 rgba(37,99,235,0.07)',
                                    padding: '18px 20px',
                                    gap: 10,
                                    position: 'relative',
                                    borderLeft: task.completed !== 'in corso' ? '5px solid #22c55e' : '5px solid #2563eb',
                                    transition: 'box-shadow 0.2s',
                                    minHeight: 64,
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                    <input type="checkbox" checked={task.completed  !== 'in corso' } onChange={() => toggleTask(task.id)}
                                        style={{width: 22, height: 22, accentColor: '#2563eb', marginRight: 8, cursor: 'pointer'}}
                                        aria-label={task.completed  !== 'in corso' ? 'Segna come incompleto' : 'Segna come completato'}
                                    />
                                    <div style={{flex: 1}}>
                                        <div style={{fontSize: 18, fontWeight: 700, color: task.completed  === 'in corso' ? '#222' : '#222', textDecoration: task.completed  !== 'in corso' ? 'line-through' : 'none'}}>{task.title}</div>
                                        <div style={{fontSize: 15, color: '#64748b', marginTop: 2}}>
                                          {task.date && (() => {
                                            const d = new Date(task.date);
                                            const giorno = d.getDate().toString().padStart(2, '0');
                                            const mese = (d.getMonth() + 1).toString().padStart(2, '0');
                                            const anno = d.getFullYear();
                                            const ore = d.getHours().toString().padStart(2, '0');
                                            const minuti = d.getMinutes().toString().padStart(2, '0');
                                            return `Scadenza: ${giorno}/${mese}/${anno} ${ore}:${minuti}`;
                                          })()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            fontWeight: 700,
                                            fontSize: 18,
                                            cursor: 'pointer',
                                            marginLeft: 4,
                                            padding: 4,
                                            opacity: 0.7,
                                            transition: 'opacity 0.2s',
                                        }}
                                        aria-label="Elimina task"
                                        title="Elimina task"
                                    ><Trash2 className="h-2 w-2" /> </button>
                                </div>
                                {task.description && (
                                    <div style={{fontSize: 15, color: '#334155', marginTop: 8, whiteSpace: 'pre-line'}}>{task.description}</div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
                `}</style>
            </main>
        </div>
    );
}