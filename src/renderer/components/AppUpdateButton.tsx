import type { AppUpdateSnapshot } from '../../shared/contracts';
import { DownloadIcon, LoaderCircleIcon, RotateCcwIcon } from 'lucide-react';

type AppUpdateButtonProps = {
  updateState: AppUpdateSnapshot;
  onClick: () => void;
};

function getButtonLabel(updateState: AppUpdateSnapshot) {
  switch (updateState.status) {
    case 'available':
      return 'Update';
    case 'downloading':
      return 'Downloading...';
    case 'downloaded':
      return 'Restart';
    default:
      return null;
  }
}

export function AppUpdateButton({ updateState, onClick }: AppUpdateButtonProps) {
  const label = getButtonLabel(updateState);

  if (!label) {
    return null;
  }

  const disabled = updateState.status === 'downloading';
  const icon =
    updateState.status === 'downloading' ? (
      <LoaderCircleIcon className="h-3.5 w-3.5 animate-spin" />
    ) : updateState.status === 'downloaded' ? (
      <RotateCcwIcon className="h-3.5 w-3.5" />
    ) : (
      <DownloadIcon className="h-3.5 w-3.5" />
    );
  const toneClass =
    updateState.status === 'downloaded'
      ? 'border-[#5d78d8]/28 bg-[#5d78d8]/12 text-[#dbe5ff] hover:border-[#6c87eb]/36 hover:bg-[#5d78d8]/16'
      : updateState.status === 'downloading'
        ? 'border-white/8 bg-white/[0.03] text-white/58'
        : 'border-white/8 bg-white/[0.035] text-white/78 hover:border-white/12 hover:bg-white/[0.06] hover:text-white';

  return (
    <div
      className="absolute inset-y-0 left-4 z-10 flex items-center"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium tracking-[0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition ${toneClass} ${
          disabled ? 'cursor-default' : 'active:scale-[0.985]'
        }`}
      >
        {icon}
        {label}
      </button>
    </div>
  );
}
