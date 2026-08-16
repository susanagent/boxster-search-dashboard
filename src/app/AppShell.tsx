import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { ComparisonTray } from "../components/ComparisonTray";
import { AddCandidateModal } from "../components/AddCandidateModal";
import { daysSince, formatDate } from "../lib/format";
import {
  ActivityIcon,
  ClockIcon,
  ColumnsIcon,
  DatabaseIcon,
  GridIcon,
  MessageIcon,
  MoreIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
} from "../components/icons";
import styles from "./AppShell.module.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: GridIcon, end: true },
  { to: "/candidates", label: "Candidates", icon: ColumnsIcon, end: false },
  { to: "/compare", label: "Compare", icon: ColumnsIcon, end: false },
  { to: "/search-runs", label: "Search Runs", icon: ActivityIcon, end: false },
  { to: "/sources", label: "Sources", icon: DatabaseIcon, end: false },
  { to: "/feedback-rules", label: "Feedback / Rules", icon: MessageIcon, end: false },
];

const MOBILE_PRIMARY = NAV_ITEMS.slice(0, 4);
const MOBILE_OVERFLOW = NAV_ITEMS.slice(4);

export function AppShell() {
  const { searchRuns } = useAppData();
  const [addOpen, setAddOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const settingsRef = useRef<HTMLDivElement>(null);

  const lastRun = searchRuns.reduce((latest, run) =>
    !latest || (run.completedAt ?? run.startedAt) > (latest.completedAt ?? latest.startedAt) ? run : latest
  , searchRuns[0]);
  const staleDays = lastRun ? daysSince(lastRun.completedAt ?? lastRun.startedAt) : undefined;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/candidates?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className={styles.shell}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <nav className={styles.rail} aria-label="Primary">
        <div className={styles.brand}>
          Driver&rsquo;s Logbook
          <span className={styles.brandSub}>Boxster search</span>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
          >
            <item.icon size={18} />
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.mainCol}>
        <header className={styles.topbar}>
          <form className={styles.searchField} role="search" onSubmit={handleSearchSubmit}>
            <SearchIcon size={16} />
            <label htmlFor="global-search" className="visually-hidden">
              Search candidates
            </label>
            <input
              id="global-search"
              type="search"
              placeholder="Search candidates…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <span className={styles.freshness}>
            <ClockIcon size={14} />
            {lastRun
              ? `Last run ${formatDate(lastRun.completedAt ?? lastRun.startedAt)} (${staleDays}d ago)`
              : "No search runs yet"}
          </span>

          <div className={styles.spacer} />

          <button
            type="button"
            className={styles.utilButton}
            disabled
            title="Automated search runs aren't wired up in this MVP — see Search Runs for the manual log and docs/DATA_IMPORT.md for the intended automation path."
          >
            <RefreshIcon size={16} />
            Run search
          </button>
          <button
            type="button"
            className={`${styles.utilButton} ${styles.utilButtonPrimary}`}
            onClick={() => setAddOpen(true)}
          >
            <PlusIcon size={16} />
            Add candidate
          </button>
          <div style={{ position: "relative" }} ref={settingsRef}>
            <button
              type="button"
              className={styles.utilButton}
              aria-expanded={settingsOpen}
              aria-haspopup="true"
              onClick={() => setSettingsOpen((v) => !v)}
            >
              Settings
            </button>
            {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
          </div>
        </header>

        <main id="main" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      <nav className={styles.bottomNav} aria-label="Primary">
        {MOBILE_PRIMARY.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.bottomNavItemActive : ""}`}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          className={styles.bottomNavItem}
          aria-expanded={moreOpen}
          aria-haspopup="true"
          onClick={() => setMoreOpen((v) => !v)}
        >
          <MoreIcon size={20} />
          More
        </button>
        {moreOpen && (
          <div className={styles.moreSheet} role="menu">
            {MOBILE_OVERFLOW.map((item) => (
              <NavLink key={item.to} to={item.to} role="menuitem" onClick={() => setMoreOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {location.pathname !== "/compare" && <ComparisonTray />}
      <AddCandidateModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { resetData } = useAppData();
  return (
    <div
      role="menu"
      style={{
        position: "absolute",
        right: 0,
        top: "calc(100% + 4px)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-panel)",
        boxShadow: "var(--shadow-overlay)",
        padding: "var(--space-2)",
        minWidth: 220,
        zIndex: 50,
        fontSize: "var(--font-size-dense)",
      }}
    >
      <p style={{ margin: "4px 8px", color: "var(--color-text-secondary)", fontSize: "var(--font-size-small)" }}>
        Data is stored locally in this browser.
      </p>
      <button
        type="button"
        style={{
          width: "100%",
          textAlign: "left",
          padding: "8px",
          background: "none",
          border: "none",
          borderRadius: "var(--radius-control)",
          minHeight: 40,
        }}
        onClick={() => {
          if (window.confirm("Reset all local edits and reload the seed candidate data?")) {
            resetData();
          }
          onClose();
        }}
      >
        Reset to seed data
      </button>
    </div>
  );
}
