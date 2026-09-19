
import { useState } from "react";

import AppLayout from "./components/layout/AppLayout";
import type { Page } from "./components/layout/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import UsersPage from "./pages/UsersPage";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const renderPage = () => {
    switch (activePage) {
      /* ── Core pages ── */
      case "dashboard":
        return <DashboardPage onNavigate={setActivePage} />;

      case "board":
        return <BoardPage />;

      case "team-boards":
        return <UsersPage />;

      /* ── Stub pages ── */
      case "recent":
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
              🕐
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              Recent Activity
            </h1>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Recently viewed boards and tasks will appear here.
            </p>
          </div>
        );

      case "favorites":
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50 text-2xl">
              ⭐
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              Favorites
            </h1>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Star boards and tasks to find them quickly here.
            </p>
          </div>
        );

      case "settings":
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
              ⚙️
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Workspace settings will be available here soon.
            </p>
          </div>
        );

      case "help":
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              💬
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              Help &amp; Support
            </h1>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Documentation and support resources are coming soon.
            </p>
          </div>
        );

      case "profile":
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
              T
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              Tsi
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              tsi@example.com
            </p>
            <p className="mt-4 max-w-sm text-sm text-gray-400">
              Profile management will be available here soon.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AppLayout>
  );
}
