// Shared setup for the demos that talk to the kanban-go backend. Each demo
// works on its own throwaway board: the board id is kept in localStorage and a
// new board is created when there is none or the stored one has expired.
// The demo then loads its data from the returned board URL.

export const server = 'https://kanban-backend.svar.dev';

export async function getBoardURL(demo) {
  const key = `kanban-demo-board:${demo}`;
  const stored = read(key);
  if (stored) {
    const url = `${server}/boards/${stored}`;
    const response = await fetch(`${url}/columns`);
    if (response.ok) return url;
    if (response.status !== 404)
      throw new Error(`board check failed: ${response.status}`);
  }

  const response = await fetch(`${server}/boards`, { method: 'POST' });
  if (!response.ok) throw new Error(`board create failed: ${response.status}`);
  const board = await response.json();
  write(key, board.id);
  return `${server}/boards/${board.id}`;
}

// storage can be unavailable (private mode, blocked site data)
function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // the board still works, it is just not reused on reload
  }
}
