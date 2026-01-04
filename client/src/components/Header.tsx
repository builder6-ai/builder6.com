import React from 'react';
import { 
  Columns, 
  Rows, 
  Maximize, 
  Monitor, 
  Smartphone, 
  ExternalLink, 
  Share2, 
  Check, 
  X 
} from 'lucide-react';
import clsx from 'clsx';

type Layout = 'horizontal' | 'vertical' | 'preview';
type PreviewMode = 'desktop' | 'mobile';

interface HeaderProps {
  layout: Layout;
  setLayout: (layout: Layout) => void;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  onShare: () => void;
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  onOpenNewTab: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  layout,
  setLayout,
  previewMode,
  setPreviewMode,
  onShare,
  isSaving,
  saveStatus,
  onOpenNewTab
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-gray-800 text-white shrink-0 h-[60px]">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>
        <h1 className="font-bold text-lg tracking-tight">Builder6 Play <span className="text-xs font-normal text-gray-400 ml-1">(Lite)</span></h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Layout Controls */}
        <div className="flex items-center bg-gray-700 rounded-lg p-1 gap-1">
          <button 
            onClick={() => setLayout('horizontal')}
            className={clsx("p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors", layout === 'horizontal' && "bg-gray-600 text-white")}
            title="Split Left/Right"
          >
            <Columns size={16} />
          </button>
          <button 
            onClick={() => setLayout('vertical')}
            className={clsx("p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors", layout === 'vertical' && "bg-gray-600 text-white")}
            title="Split Top/Bottom"
          >
            <Rows size={16} />
          </button>
          <button 
            onClick={() => setLayout('preview')}
            className={clsx("p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors", layout === 'preview' && "bg-gray-600 text-white")}
            title="Preview Only"
          >
            <Maximize size={16} />
          </button>
        </div>

        {/* Preview Mode Controls */}
        <div className="flex items-center bg-gray-700 rounded-lg p-1 gap-1">
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={clsx("p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors", previewMode === 'desktop' && "bg-gray-600 text-white")}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={clsx("p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors", previewMode === 'mobile' && "bg-gray-600 text-white")}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
          <button 
            onClick={onOpenNewTab}
            className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
        </div>

        <button 
          onClick={onShare}
          disabled={isSaving}
          className="bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white px-4 py-1.5 rounded text-sm font-medium transition flex items-center gap-2 min-w-[100px] justify-center"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : saveStatus === 'success' ? (
            <><span>Copied!</span><Check size={16} /></>
          ) : saveStatus === 'error' ? (
            <><span>Error</span><X size={16} /></>
          ) : (
            <><span>Share</span><Share2 size={16} /></>
          )}
        </button>
      </div>
    </header>
  );
};
