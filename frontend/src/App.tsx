import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./stores";
import { fetchMe, logoutUser } from "./stores/authSlice";

import AppLayout from "./components/layout/AppLayout";
import type { Page } from "./components/layout/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import UsersPage from "./pages/UsersPage";
import AuthPage from "./pages/Auth";

export default function App() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [activePage, setActivePage] = useState<Page>("dashboard");

  // Attempt to re-hydrate current user from session on start
  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Auth Guard: If not logged in, show Auth Page
  if (!token && !user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (activePage) {
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
            description="Manage your account profile and preferences."
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
    <section className="rounded-2xl border border-gray-200 bg-white p-8">
      <h1 className="text-2xl font-bold text-black">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </section>
  );
}