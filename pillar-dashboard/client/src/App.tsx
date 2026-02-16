import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LayoutProvider } from "./contexts/LayoutContext";


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

function AppToggle({ activeApp, onToggle }: { activeApp: 'pillars' | 'ms365'; onToggle: (app: 'pillars' | 'ms365') => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 8,
      left: 8,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      background: '#1e293b',
      borderRadius: 9999,
      padding: 3,
      gap: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    }}>
      <button
        onClick={() => onToggle('pillars')}
        style={{
          padding: '5px 14px',
          borderRadius: 9999,
          fontSize: '0.75rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: activeApp === 'pillars' ? '#3b82f6' : 'transparent',
          color: activeApp === 'pillars' ? '#fff' : '#94a3b8',
        }}
      >
        10 Pillars
      </button>
      <button
        onClick={() => onToggle('ms365')}
        style={{
          padding: '5px 14px',
          borderRadius: 9999,
          fontSize: '0.75rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: activeApp === 'ms365' ? '#3b82f6' : 'transparent',
          color: activeApp === 'ms365' ? '#fff' : '#94a3b8',
        }}
      >
        MS 365 Tools
      </button>
    </div>
  );
}

function App() {
  const [activeApp, setActiveApp] = useState<'pillars' | 'ms365'>('pillars');

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
            {activeApp === 'pillars' ? (
              <Router />
            ) : (
              <iframe
                src="/ms365tools.html"
                title="MS 365 Tools"
                style={{
                  width: '100%',
                  height: '100vh',
                  border: 'none',
                }}
              />
            )}
          </TooltipProvider>
        </LayoutProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
