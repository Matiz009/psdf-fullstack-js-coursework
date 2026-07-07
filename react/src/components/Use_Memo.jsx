import { useMemo, useState } from 'react';

function ExpensiveComponent({ number }) {
  const [theme, setTheme] = useState('light');

  // Without useMemo: recalculates on EVERY render (even theme changes!)
  // With useMemo: only recalculates when 'number' changes
  const result = useMemo(() => {
    console.log('Computing...');
    let total = 0;
    for (let i = 0; i < 1_000_000_000; i++) total += i;   // slow!
    return number * 2 + total;
  }, [number]);        // ← dependency: only re-run if number changes

  return (
    <div style={{ background: theme === 'dark' ? 'black' : 'white' }}>
      <p>Result: {result}</p>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
        Toggle Theme    {/* ← won't trigger expensive recalculation */}
      </button>
    </div>
  );
}

// Very common: memoized list filtering
const filteredList = useMemo(
  () => bigList.filter(item => item.name.includes(searchQuery)),
  [bigList, searchQuery]
);