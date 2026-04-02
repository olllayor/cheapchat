import type { CSSProperties } from 'react';
import { CheckCircledIcon, Cross2Icon, CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Toaster } from 'sonner';

export function AtlasToaster() {
  return (
    <Toaster
      theme="system"
      position="top-right"
      expand={false}
      visibleToasts={3}
      closeButton
      richColors={false}
      gap={8}
      offset={{ top: 64, right: 16 }}
      mobileOffset={{ top: 64, left: 12, right: 12 }}
      containerAriaLabel="Atlas notifications"
      icons={{
        success: <CheckCircledIcon className="size-[18px]" />,
        error: <CrossCircledIcon className="size-[18px]" />,
        info: <InfoCircledIcon className="size-[18px]" />,
        close: <Cross2Icon className="size-4" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-fit max-w-[320px] min-w-0 items-center rounded-[20px] border border-toast-border bg-toast-bg px-3.5 py-2.5 text-toast-text shadow-[0_12px_28px_rgba(8,12,20,0.28)] backdrop-blur-xl',
          content: 'flex min-w-0 flex-1 flex-col justify-center',
          title: 'truncate pr-1 text-[13px] leading-none font-medium tracking-[-0.02em] text-toast-text',
          description: 'mt-1 line-clamp-1 pr-1 text-[11px] leading-[1.25] text-toast-text/72',
          icon: 'mr-2.5 flex size-4 shrink-0 items-center justify-center text-toast-icon',
          closeButton:
            'ml-2 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-transparent text-toast-close transition hover:text-toast-close-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-toast-border',
          actionButton:
            'ml-2 inline-flex h-6 items-center rounded-full border border-white/8 bg-white/6 px-2.5 text-[11px] font-medium text-toast-text transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-toast-border',
        },
        style: { WebkitAppRegion: 'no-drag' } as CSSProperties,
      }}
    />
  );
}
