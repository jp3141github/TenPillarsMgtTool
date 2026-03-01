import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ObsidianFramework from "./components/ObsidianFramework";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LayoutProvider, useLayout } from "./contexts/LayoutContext";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppToggle({ activeApp, onToggle }: { activeApp: 'pillars' | 'ms365' | 'obsidian'; onToggle: (app: 'pillars' | 'ms365' | 'obsidian') => void }) {
  const { layout } = useLayout();
  const isMobile = layout === 'mobile';
  const [expanded, setExpanded] = useState(false);

  const tabs: { key: 'pillars' | 'ms365' | 'obsidian'; label: string }[] = [
    { key: 'pillars', label: '10 Pillars' },
    { key: 'obsidian', label: 'Framework' },
    { key: 'ms365', label: 'MS 365 Tools' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 8,
      ...(isMobile
        ? { left: '50%', transform: 'translateX(-50%)' }
        : { left: 8 }),
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      background: '#1e293b',
      borderRadius: 9999,
      padding: 3,
      gap: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    }}>
      {/* +/- toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          fontSize: '1rem',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          background: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          transition: 'transform 0.2s',
        }}
        title={expanded ? 'Hide app switcher' : 'Show app switcher'}
      >
        {expanded ? '\u2212' : '+'}
      </button>
      {/* Tabs shown only when expanded */}
      {expanded && tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => { onToggle(tab.key); setExpanded(false); }}
          style={{
            padding: '5px 14px',
            borderRadius: 9999,
            fontSize: '0.75rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeApp === tab.key ? '#3b82f6' : 'transparent',
            color: activeApp === tab.key ? '#fff' : '#94a3b8',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function App() {
  const [activeApp, setActiveApp] = useState<'pillars' | 'ms365' | 'obsidian'>('pillars');

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <LayoutProvider>
          <TooltipProvider>
            <Toaster />
            <AppToggle activeApp={activeApp} onToggle={setActiveApp} />
            <div style={{ display: activeApp === 'pillars' ? 'block' : 'none' }}>
              <Router />
            </div>
            <div style={{ display: activeApp === 'obsidian' ? 'block' : 'none', paddingTop: 48 }}>
              <ObsidianFramework />
            </div>
            <iframe
              src="/ms365tools.html"
              title="MS 365 Tools"
              style={{
                width: '100%',
                height: '100vh',
                border: 'none',
                display: activeApp === 'ms365' ? 'block' : 'none',
              }}
            />
          </TooltipProvider>
        </LayoutProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
