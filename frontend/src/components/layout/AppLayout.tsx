import { type ReactNode } from "react";
import Header from "./Header";
import Sidebar, { type Page } from "./Sidebar";

type AppLayoutProps = {
  children: ReactNode;
  activePage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
};

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  "team-boards": "Engineering Team Board",
  recent: "Recent",
  favorites: "Favorites",
  settings: "Settings",
  help: "Help",
  profile: "Profile",
};

export default function AppLayout({
  children,
  activePage,
  onPageChange,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar
        activePage={activePage}
        onPageChange={onPageChange}
        onLogout={onLogout}
      />

      <Header currentPage={pageTitles[activePage]} />

      <main className="ml-64 min-h-screen pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}