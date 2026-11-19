import { useContext, useMemo } from 'react';
import { context } from '@svar-ui/react-core';

// Notices and confirmations for samples. Call during component render.
export function useDialogs() {
  const helpers = useContext(context.helpers);
  return useMemo(
    () => ({
      notice(text, type = 'info') {
        helpers.showNotice({ text, type });
      },
      // resolves to false when the user cancels
      async confirm(title, message) {
        try {
          await helpers.showModal({ title, message });
          return true;
        } catch {
          return false;
        }
      },
    }),
    [helpers],
  );
}
