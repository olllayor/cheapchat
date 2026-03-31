import { ChevronLeft, ChevronRight, MessageSquare, Plus, Settings } from 'lucide-react';
import { useState } from 'react';

import type { ConversationSummary } from '../../shared/contracts';

type SidebarProps = {
  conversations: ConversationSummary[];
  selectedConversationId: string | null;
  collapsed: boolean;
  onSelect: (conversationId: string) => void;
  onCreate: () => void;
  onOpenSettings: () => void;
  onToggleCollapsed: () => void;
};

export function Sidebar({
  conversations,
  selectedConversationId,
  collapsed,
  onSelect,
  onCreate,
  onOpenSettings,
  onToggleCollapsed,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      className={`flex flex-col border-r border-border-subtle bg-bg-panel transition-all ${
        collapsed ? 'w-[60px]' : 'w-[260px]'
      }`}
      style={{ transitionDuration: 'var(--duration-normal)' }}
    >
      <div 
        className="flex items-center justify-between border-b border-border-subtle px-3 py-4"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        {!collapsed && (
          <h1 className="text-base font-semibold text-text-primary" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>CheapChat</h1>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="rounded-lg p-1.5 text-text-muted transition hover:bg-bg-hover hover:text-text-primary"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="px-2 py-3">
        <button
          type="button"
          onClick={onCreate}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-hover hover:text-text-primary ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        <div className="space-y-0.5">
          {conversations.map((conv) => {
            const isActive = conv.id === selectedConversationId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition ${
                  isActive
                    ? 'bg-bg-active text-text-primary'
                    : 'text-text-tertiary hover:bg-bg-hover hover:text-text-secondary'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-text-primary' : 'text-text-faint'}`} />
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="truncate text-sm">{conv.title}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-subtle px-2 py-3">
        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-text-tertiary transition hover:bg-bg-hover hover:text-text-primary ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
