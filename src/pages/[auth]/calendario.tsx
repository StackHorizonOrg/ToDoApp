import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Navbar from "@/components/Navbar";
import {format, addDays, subDays} from "date-fns";
import {it} from "date-fns/locale";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Trash2} from "lucide-react";
import {trpc} from "../../utils/trpc";

const mainColor = "#2563eb";
const bgColor = "#f4f6fb";
const borderColor = "#e5e7eb";

export default function Calendario() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [tasks, setTasks] = useState<any[]>([]);
    const tasksForSelectedDate = tasks.filter(task =>
        task.dueDate && task.dueDate == selectedDate
    );
    const [loadingMessage, setLoadingMessage] = useState("Caricamento in corso...");


    const getTaskByDate = trpc.tasks.getByDate.useMutation({
        onSuccess: (data) => {
            setTasks(data);
            setLoading(false);
        },
        onError: (error) => {
            console.error("Errore nel recupero delle task:", error);
            setLoading(false);
        }
    });

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

    // Funzione per formattare la data in YYYY-MM-DD
    const formatDate = (date: Date) => {
        return date.toISOString().slice(0, 10);
    };

    // Carica eventi della data selezionata
    const fetchTasksForDate = (date: Date, idUser: number) => {
        setLoading(true);
        setLoadingMessage("Caricamento task...");
        getTaskByDate.mutate({ date: formatDate(date), idUser });
    };

    const deleteTaskMutation = trpc.tasks.deleteTask.useMutation({
        onSuccess: (data)=>{
            fetchTasksForDate(selectedDate, user.id);
        },
        onError(error){
            console.error("Non è stato possibile eliminare la task", error);
        }
    });
    const updateTask = trpc.tasks.updateTaskStatus.useMutation({
        onSuccess: (data)=> {
            fetchTasksForDate(selectedDate, user.id);
        },
        onError(error){
            console.error("Non è stato possibile aggiornare lo stato della task", error);
        }
    });
    // Aggiorna tasks quando arrivano dal server
    useEffect(() => {
        if (getTaskByDate.data) {
            setTasks(getTaskByDate.data);
            setLoading(false);
        }
    }, [getTaskByDate.data]);

    // Carica eventi della data odierna quando utente è pronto
    useEffect(() => {
        if (user && selectedDate) {
            fetchTasksForDate(selectedDate, user.id);
            setLoadingMessage("Caricamento task...");
            // RIMOSSO setLoading(false) qui
        }
    }, [user, selectedDate]);

    if (loading) {
        return (
            <div style={{
                background: bgColor,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Navbar/>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        border: `6px solid ${borderColor}`,
                        borderTop: `6px solid ${mainColor}`,
                        animation: 'spin 0.8s linear infinite',
                        marginBottom: 22
                    }}/>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <span style={{color: mainColor, fontWeight: 600, fontSize: '1.13rem', letterSpacing: 0.2}}>{loadingMessage}</span>
                </div>
            </div>
        );
    }

    // Funzione per cambiare stato di una task (completata/in corso)
    const toggleTask = (id: string | number) => {
        updateTask.mutate({id: Number(id)});
    };
    // Funzione per eliminare una task
    const deleteTask = (id: string) => {
        deleteTaskMutation.mutate({id: Number(id)});
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fff', // sfondo bianco
        }}>
            <Navbar/>
            <main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: 'calc(100vh - 64px)',
                    width: '100%',
                    paddingTop: 80, // spazio sotto la navbar
                    paddingLeft: 'clamp(8px, 4vw, 24px)',
                    paddingRight: 'clamp(8px, 4vw, 24px)',
                    boxSizing: 'border-box',
                    gap: 20,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: 400,
                        margin: '0 auto',
                        borderRadius: 18,
                        background: '#fff',
                        padding: 18,
                        marginTop: 8,
                        marginBottom: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 16,
                        position: 'relative',
                        boxShadow: '0 2px 12px #2563eb18',
                        minHeight: 80,
                        transition: 'box-shadow 0.2s',
                    }}
                >

                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, width: '100%'}}>
                        <button
                            type="button"
                            aria-label="Giorno precedente"
                            onClick={() => {
                                const newDate = subDays(selectedDate, 1);
                                setSelectedDate(newDate);
                            }}
                            style={{
                                background: '#f4f6fb',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 22,
                                color: mainColor,
                                cursor: 'pointer',
                                boxShadow: '0 1px 4px #e0e7ff22',
                                transition: 'background 0.18s, color 0.18s',
                                outline: 'none',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#e0e7ff'}
                            onMouseOut={e => e.currentTarget.style.background = '#f4f6fb'}
                        >
                            <ChevronLeft style={{width: 18, height: 18}} />
                        </button>
                        <div style={{flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontWeight: 900,
                                            fontSize: 24,
                                            backgroundImage: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            cursor: 'pointer',
                                            padding: 0,
                                            margin: 0,
                                            lineHeight: 1.1,
                                            textShadow: '0 2px 8px #e0e7ff55',
                                            borderBottom: '2px solid #e5e7eb',
                                            borderRadius: 0,
                                            transition: 'border 0.18s',
                                            outline: 'none',
                                        }}
                                        className="calendar-date-btn-responsive"
                                    >
                                        {format(selectedDate, "dd MMMM yyyy", { locale: it })}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="center" style={{
                                    padding: 0,
                                    borderRadius: 18,
                                    boxShadow: '0 8px 32px 0 rgba(37,99,235,0.13)',
                                    background: '#fff',
                                    border: '1.5px solid #e5e7eb',
                                    marginTop: 8,
                                    minWidth: 270,
                                    minHeight: 0,
                                    overflow: 'hidden',
                                    zIndex: 100,
                                    width: '100vw',
                                    maxWidth: 340,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    right: 'auto',
                                }}>
                                    <div style={{padding: 14, background: 'linear-gradient(90deg, #f4f6fb 0%, #e0e7ff 100%)', borderBottom: '1px solid #e5e7eb', textAlign: 'center'}}>
                                        <span style={{fontWeight: 700, color: mainColor, fontSize: 16, letterSpacing: 0.2}}>Scegli una data</span>
                                    </div>
                                    <div style={{padding: 8, background: '#fff'}}>
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={date => {
                                                console.log(date);
                                                 return date && setSelectedDate(date);
                                            }}
                                            initialFocus
                                            locale={it}
                                            style={{borderRadius: 12, background: '#fff', border: 'none', boxShadow: 'none', minWidth: 210, maxWidth: '100vw'}}
                                        />
                                    </div>
                                    <style>{`
                                        @media (max-width: 600px) {
                                            .rdp {
                                                font-size: 15px !important;
                                            }
                                            div[style*='max-width: 340px'] {
                                                min-width: 0 !important;
                                                max-width: 98vw !important;
                                                border-radius: 10px !important;
                                                left: 1vw !important;
                                                transform: none !important;
                                            }
                                            div[style*='padding: 14px'] span {
                                                font-size: 14px !important;
                                            }
                                            div[style*='padding: 8px'] {
                                                padding: 2px !important;
                                            }
                                        }
                                    `}</style>
                                </PopoverContent>
                            </Popover>
                            <div style={{
                                marginTop: 8,
                                background: '#f4f6fb',
                                color: mainColor,
                                fontWeight: 700,
                                fontSize: 14,
                                borderRadius: 8,
                                padding: '3px 12px',
                                boxShadow: '0 1px 4px #e0e7ff22',
                                display: 'inline-block',
                                minWidth: 40,
                                letterSpacing: 0.2,
                            }}>
                                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label="Giorno successivo"
                            onClick={() => {
                                const newDate = addDays(selectedDate, 1);
                                setSelectedDate(newDate);
                            }}
                            style={{
                                background: '#f4f6fb',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 22,
                                color: mainColor,
                                cursor: 'pointer',
                                boxShadow: '0 1px 4px #e0e7ff22',
                                transition: 'background 0.18s, color 0.18s',
                                outline: 'none',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#e0e7ff'}
                            onMouseOut={e => e.currentTarget.style.background = '#f4f6fb'}
                        >
                            <ChevronRight style={{width: 18, height: 18}} />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedDate(new Date())}
                        style={{
                            marginTop: 8,
                            background: '#f4f6fb',
                            border: '1.5px solid #e5e7eb',
                            borderRadius: 10,
                            color: mainColor,
                            fontWeight: 700,
                            fontSize: 14,
                            padding: '7px 18px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 4px #e0e7ff22',
                            transition: 'background 0.18s',
                            outline: 'none',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#e0e7ff'}
                        onMouseOut={e => e.currentTarget.style.background = '#f4f6fb'}
                    >
                        Oggi
                    </button>
                </div>
                {/* DIV SCROLLABILE TASKS */}
                <div
                    className="tasks-scrollable-list"
                    style={{
                        width: '100%',
                        maxWidth: '80%',
                        margin: '0 auto',
                        background: '#fff',
                        borderRadius: 16,
                        boxShadow: '0 2px 12px #2563eb18',
                        padding: 'clamp(10px, 3vw, 22px)',
                        minHeight: 80,
                        maxHeight: '50vh',
                        overflowY: 'auto',
                        border: '1.5px solid #e0e7ff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        alignItems: 'stretch',
                        boxSizing: 'border-box',
                    }}
                >
                    {tasks.length > 0?tasks.map((task) => (
                        <div key={task.id}
                            style={{
                                marginTop: 5,
                                marginBottom: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                background: '#f4f6fb',
                                borderRadius: 14,
                                boxShadow: '0 1px 6px 0 rgba(37,99,235,0.07)',
                                padding: 'clamp(10px, 2vw, 16px)',
                                gap: 8,
                                position: 'relative',
                                borderLeft: task.completed !== 'in corso' ? '4px solid #22c55e' : '4px solid #2563eb',
                                transition: 'box-shadow 0.2s',
                                minHeight: 54,
                                alignItems: 'flex-start',
                            }}
                        >
                            <div style={{display: 'flex', alignItems: 'center', gap: 8, width: '100%'}}>
                                <input type="checkbox" checked={task.completed  !== 'in corso' } onChange={() => toggleTask(task.id)}
                                    style={{width: 20, height: 20, accentColor: '#2563eb', marginRight: 8, cursor: 'pointer'}}
                                    aria-label={task.completed  !== 'in corso' ? 'Segna come incompleto' : 'Segna come completato'}
                                />
                                <div style={{flex: 1}}>
                                    <div style={{fontSize: 16, fontWeight: 700, color: '#222', textDecoration: task.completed  !== 'in corso' ? 'line-through' : 'none'}}>{task.title}</div>
                                    <div style={{fontSize: 13, color: '#64748b', marginTop: 2}}>
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
                                        fontSize: 16,
                                        cursor: 'pointer',
                                        marginLeft: 12,
                                        padding: 4,
                                        opacity: 0.7,
                                        transition: 'opacity 0.2s',
                                        alignSelf: 'flex-start',
                                    }}
                                    aria-label="Elimina task"
                                    title="Elimina task"
                                ><Trash2 className="h-2 w-2" /></button>
                            </div>
                            {task.description && (
                                <div style={{fontSize: 13, color: '#334155', marginTop: 6, whiteSpace: 'pre-line'}}>{task.description}</div>
                            )}
                        </div>
                    )): (<div>
                        <span style={{color: '#64748b', fontWeight: 500, fontSize: 14, textAlign: 'center', display: 'block', marginTop: 12}}>Nessuna task per questa data.</span>
                    </div>)}
                    <style>{`
                        .tasks-scrollable-list::-webkit-scrollbar {
                            width: 6px;
                        }
                        .tasks-scrollable-list::-webkit-scrollbar-thumb {
                            background: #2563eb;
                            border-radius: 8px;
                        }
                        .tasks-scrollable-list::-webkit-scrollbar-track {
                            background: #e0e7ff;
                            border-radius: 8px;
                        }
                        @media (max-width: 900px) {
                            .tasks-scrollable-list {
                                max-width: 98vw !important;
                                padding: 8px !important;
                                gap: 8px !important;
                                border-radius: 12px !important;
                            }
                        }
                        @media (max-width: 600px) {
                            .tasks-scrollable-list {
                                max-width: 99vw !important;
                                padding: 4px !important;
                                gap: 5px !important;
                                border-radius: 8px !important;
                            }
                            .tasks-scrollable-list > div {
                                padding: 5px !important;
                                font-size: 12px !important;
                            }
                            .tasks-scrollable-list > div > span {
                                font-size: 11px !important;
                            }
                        }
                    `}</style>
                </div>
                <style>{`
                    @media (max-width: 900px) {
                        main {
                            padding-top: 60px !important;
                            padding-left: 2vw !important;
                            padding-right: 2vw !important;
                            gap: 12px !important;
                        }
                    }
                    @media (max-width: 600px) {
                        main {
                            padding-top: 100px !important;
                            padding-left: 1vw !important;
                            padding-right: 1vw !important;
                            gap: 6px !important;
                        }
                        div[style*='max-width: 400px'] {
                            padding: 6px !important;
                            border-radius: 8px !important;
                            gap: 5px !important;
                        }
                        button {
                            font-size: 14px !important;
                            padding: 5px 10px !important;
                        }
                    }
                `}</style>
            </main>
        </div>
    );
}
