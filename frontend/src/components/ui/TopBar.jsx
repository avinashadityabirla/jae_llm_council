function TopBar({ breadcrumbs = [] }) {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Breadcrumbs */}

      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.length === 0 ? (
          <span className="text-neutral-500">Home</span>
        ) : (
          breadcrumbs.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? "text-neutral-900 font-medium"
                    : "text-neutral-500"
                }
              >
                {b}
              </span>

              {i < breadcrumbs.length - 1 && (
                <span className="text-neutral-400">/</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Right actions */}

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <span className="text-lg">🔔</span>
        </button>

        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <span className="text-lg">❓</span>
        </button>

        <div className="h-8 w-px bg-neutral-200" />

        <div className="text-sm">
          <div className="font-medium text-neutral-900">Avinash Naidu</div>

          <div className="text-xs text-neutral-500">avinash.naidu@abc.com</div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
