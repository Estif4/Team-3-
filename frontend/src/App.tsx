
import { useState } from "react";

import AppLayout from "./components/layout/AppLayout";
import type { Page } from "./components/layout/Sidebar";

import UsersPage from "./pages/UsersPage";

export default function App() {
  const [activePage, setActivePage] =
    useState<Page>("team-boards");

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const renderPage = () => {
    switch (activePage) {
      case "team-boards":
        return <UsersPage />;

      case "dashboard":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome to SyncBoard.
            </p>
          </div>
        );

      case "recent":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">
              Recent
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Recently viewed items will appear here.
            </p>
          </div>
        );

      case "favorites":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">
              Favorites
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Your favorite items will appear here.
            </p>
          </div>
        );

      case "settings":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Settings will be implemented later.
            </p>
          </div>
        );

      case "help":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">
              Help
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Help center will be implemented later.
            </p>
          </div>
        );

      case "profile":
        return (
          <div>
            <h1 className="text-2xl font-bold text-black">
              Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Your profile will be implemented later.
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
