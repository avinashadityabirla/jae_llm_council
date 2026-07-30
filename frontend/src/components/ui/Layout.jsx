import Sidebar from "./Sidebar";

import TopBar from "./TopBar";

function Layout({ children, activeView, onNavigate, breadcrumbs }) {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar activeView={activeView} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar breadcrumbs={breadcrumbs} />

        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
