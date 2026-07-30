function FilterChips({ label, options, selected, onChange }) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div>
      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
        {label}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              onClick={() => toggle(option)}
              className={
                active
                  ? "px-3 py-1 rounded-full text-xs font-medium bg-red-800 text-white"
                  : "px-3 py-1 rounded-full text-xs font-medium border border-gray-300 bg-white"
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterChips;
