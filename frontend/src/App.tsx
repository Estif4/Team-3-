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

      case "recent":
        return (
          <PagePlaceholder
            title="Recent"
            description="Recently viewed items will appear here."
          />
        );

      case "favorites":
        return (
          <PagePlaceholder
            title="Favorites"
            description="Your favorite items will appear here."
          />
        );

      case "settings":
        return (
          <PagePlaceholder
            title="Settings"
            description="Settings will be implemented later."
          />
        );

      case "help":
        return (
          <PagePlaceholder
            title="Help"
            description="Help center will be implemented later."
          />
        );

      case "profile":
        return (
          <PagePlaceholder
            title="Profile"
            description="Your profile will be implemented later."
          />
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

function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section>
      <h1 className="text-2xl font-bold text-black">
        {title}
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </section>
  );
}