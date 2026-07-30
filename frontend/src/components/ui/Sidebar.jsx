const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },

  { key: "wizard", label: "Create JD", icon: "📝" },

  { key: "committees", label: "Committees", icon: "⚖️" },

  { key: "reports", label: "Reports", icon: "📄" },

  { key: "settings", label: "Settings", icon: "⚙️" },
];

function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="w-64 bg-neutral-900 text-white flex flex-col h-screen sticky top-0">
      {/* Brand */}

      <div className="px-6 py-5 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-abc-red flex items-center justify-center font-bold text-lg">
            A
          </div>

          <div>
            <div className="font-bold text-sm leading-tight">Aditya Birla</div>

            <div className="text-abc-gold text-xs font-medium">Capital</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-neutral-400">JAE JD Creator</div>
      </div>

      {/* Nav */}

      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            (item.key === "dashboard" && activeView === "dashboard") ||
            (item.key === "wizard" && activeView === "wizard") ||
            (item.key === "committees" &&
              ["launch", "live", "verdict"].includes(activeView));

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={
                "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors " +
                (isActive
                  ? "bg-abc-red text-white border-l-4 border-abc-gold"
                  : "text-neutral-300 hover:bg-neutral-800 border-l-4 border-transparent")
              }
            >
              <span className="text-lg">{item.icon}</span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}

      <div className="px-6 py-4 border-t border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-abc-gold text-neutral-900 flex items-center justify-center text-sm font-bold">
            AN
          </div>

          <div className="text-xs">
            <div className="font-medium text-white">Avinash Naidu</div>

            <div className="text-neutral-400">Program Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
