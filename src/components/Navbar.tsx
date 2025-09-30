import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FiHome, FiCalendar, FiUser, FiMenu, FiX } from "react-icons/fi";
import { MdChecklist } from "react-icons/md";

export default function Navbar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or ESC
  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuOpen]);

  // Responsive: show burger under 1024px
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 1024);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            fontWeight: 900,
            fontSize: 26,
            letterSpacing: 1,
            color: "#222",
            background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 8px rgba(37,99,235,0.08)",
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <MdChecklist size={30}  />
            Todo
          </span>
        </span>
      </div>
      {/* Desktop nav */}
      {!isMobile && (
        <div style={{ display: "flex", gap: 8 }}>
          <NavBtn
            active={currentPath === "/[auth]/home" || currentPath === "/auth/home"}
            onClick={() => router.push("/auth/home")}
            icon={<FiHome size={20} />}
            label="Tasks"
          />
          <NavBtn
            active={currentPath === "/[auth]/calendario" || currentPath === "/auth/calendario"}
            onClick={() => router.push("/auth/calendario")}
            icon={<FiCalendar size={20} />}
            label="Calendario"
          />
          <NavBtn
            active={currentPath === "/[auth]/account" || currentPath === "/auth/account"}
            onClick={() => router.push("/auth/account")}
            icon={<FiUser size={20} />}
            label="Account"
          />
        </div>
      )}
      {/* Burger icon for mobile/tablet */}
      {isMobile && (
        <button
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            fontSize: 28,
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
            boxShadow: menuOpen ? "0 2px 8px #2563eb22" : undefined,
            zIndex: 1101,
          }}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      )}
      {/* Mobile drawer menu */}
      {isMobile && menuOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(30,41,59,0.32)",
              zIndex: 1100,
              transition: "background 0.2s",
            }}
          />
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 240,
              background: "#fff",
              boxShadow: "-2px 0 16px 0 rgba(37,99,235,0.13)",
              display: "flex",
              flexDirection: "column",
              padding: "32px 18px 18px 18px",
              gap: 12,
              zIndex: 1101,
              animation: "slideInRight 0.22s cubic-bezier(.4,1.2,.6,1)"
            }}
          >
            <NavBtn
              active={currentPath === "/[auth]/home" || currentPath === "/auth/home"}
              onClick={() => { setMenuOpen(false); router.push("/auth/home"); }}
              icon={<FiHome size={22} />}
              label="Tasks"
            />
            <NavBtn
              active={currentPath === "/[auth]/calendario" || currentPath === "/auth/calendario"}
              onClick={() => { setMenuOpen(false); router.push("/auth/calendario"); }}
              icon={<FiCalendar size={22} />}
              label="Calendario"
            />
            <NavBtn
              active={currentPath === "/[auth]/account" || currentPath === "/auth/account"}
              onClick={() => { setMenuOpen(false); router.push("/auth/account"); }}
              icon={<FiUser size={22} />}
              label="Account"
            />
          </div>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </>
      )}
      <style>{`
        .nav-btn {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          box-shadow: 0 1px 4px 0 rgba(37,99,235,0.04);
        }
        .nav-btn:hover {
          background: #2563eb22;
          color: #1d4ed8;
        }
        .nav-btn.active {
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
          color: #fff;
          box-shadow: 0 2px 8px 0 rgba(37,99,235,0.10);
        }
      `}</style>
    </nav>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      className={`nav-btn ${active ? "active" : ""}`}
      onClick={onClick}
      type="button"
      aria-current={active ? "page" : undefined}
    >
      {icon}
      {label}
    </button>
  );
}

const navStyle: React.CSSProperties = {
  width: "100%",
  height: 64,
  background:
    "linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%)",
  color: "#222",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 36px",
  boxSizing: "border-box",
  boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
  borderBottom: `1.5px solid #e5e7eb`,
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1000,
  backdropFilter: "blur(8px)",
};
