import React from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import { GridDashboard } from './components/dashboard/GridDashboard';

function App() {
  return (
    <div className="flex h-screen bg-black overflow-hidden selection:bg-primary/30 relative z-0">
      {/* Mesh Animated Background */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none z-[-1] opacity-60 mix-blend-screen">
        <div className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-indigo-900/40 via-purple-900/20 to-transparent blur-[120px] animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-blue-900/30 via-slate-800/10 to-transparent blur-[100px] animate-[spin_80s_linear_infinite_reverse]" />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden backdrop-blur-[2px]">
        {/* Glow behind Header */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <Header />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
          <GridDashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
