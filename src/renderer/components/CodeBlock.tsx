import { Check, Copy } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCallback, useRef } from 'react';

import { useClipboard } from '../hooks/useClipboard';

type CodeBlockProps = PropsWithChildren<{
  language?: string;
}>;

export function CodeBlock({ children, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const { copied, copy } = useClipboard();

  const handleCopy = useCallback(() => {
    const text = codeRef.current?.textContent ?? '';
    void copy(text);
  }, [copy]);

  return (
    <div className="group/code relative my-3 overflow-hidden rounded-xl border border-border-default">
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-subtle px-3 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-faint">
          {language || 'text'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md p-1 text-text-muted transition hover:bg-bg-hover hover:text-text-primary"
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre ref={codeRef} className="m-0 overflow-x-auto p-4 text-sm leading-relaxed">
        {children}
      </pre>
    </div>
  );
}
