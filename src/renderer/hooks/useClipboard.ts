import { useCallback, useState } from 'react';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        // Clipboard API may fail in non-secure contexts
      }
    },
    [timeout]
  );

  return { copied, copy };
}
