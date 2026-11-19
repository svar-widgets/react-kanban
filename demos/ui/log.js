import { useMemo, useState } from 'react';

// Reactive list of messages shown by EventLog; newest first.
// Returns a stable object: add/clear can be called from any closure.
export function useEventLog(limit = 50) {
  const [entries, setEntries] = useState([]);

  const log = useMemo(() => {
    let next = 1;
    return {
      entries: [],
      add(text) {
        const time = new Date().toLocaleTimeString();
        const id = next++;
        setEntries((prev) => [{ id, time, text }, ...prev].slice(0, limit));
      },
      clear() {
        setEntries([]);
      },
    };
  }, [limit]);

  log.entries = entries;
  return log;
}
