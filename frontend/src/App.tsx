import { Outlet } from 'react-router-dom';
import { Navbar } from './components/layouts/Navbar.js';
import { Sidebar } from './components/layouts/Sidebar.js';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
