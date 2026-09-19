// src/MainApp.tsx — this is your original App.tsx, renamed
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./stores/index";
import { logoutUser } from "./stores/authSlice";
import AppLayout from "./components/layout/AppLayout";
import type { Page } from "./components/layout/Sidebar";
import UsersPage from "./pages/UsersPage";

export default function MainApp() {
  const [activePage, setActivePage] = useState<Page>("team-boards");
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());   // was: console.log("Logout clicked")
  };

  const renderPage = () => {
    switch (activePage) {
      case "team-boards":
        return <UsersPage />;
      case "dashboard":
        return <PagePlaceholder title="Dashboard" description="Dashboard UI will be implemented next." />;
      case "recent":
        return <PagePlaceholder title="Recent" description="Recently viewed items will appear here." />;
      case "favorites":
        return <PagePlaceholder title="Favorites" description="Your favorite items will appear here." />;
      case "settings":
        return <PagePlaceholder title="Settings" description="Settings UI will be implemented later." />;
      case "help":
        return <PagePlaceholder title="Help" description="Help UI will be implemented later." />;
      case "profile":
        return <PagePlaceholder title="Profile" description="Profile UI will be implemented later." />;
      default:
        return null;
    }
  };

  return (
    <AppLayout activePage={activePage} onPageChange={setActivePage} onLogout={handleLogout}>
      {renderPage()}
    </AppLayout>
  );
}

function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section>
      <h1 className="text-2xl font-bold text-black">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </section>
  );
}