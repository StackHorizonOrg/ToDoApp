import React from "react";
import { useRouter } from "next/router";
import { FiHome, FiCalendar, FiUser } from "react-icons/fi";
import { MdChecklist } from "react-icons/md";

export default function Navbar() {
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            fontWeight: 900,
            fontSize: 26,
            letterSpacing: 1,
            color: "#222",
            background:
              "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 8px rgba(37,99,235,0.08)",
          }}
        >
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
            <MdChecklist size={30}/>
              ToDoApp
          </span>
        </span>
      </div>
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
