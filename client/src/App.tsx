import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import LZString from 'lz-string';
import clsx from 'clsx';

const defaultCode = `<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="p-8 bg-white shadow-lg rounded-2xl max-w-sm">
    <div class="flex items-center space-x-4">
      <div class="shrink-0">
        <img class="h-12 w-12" src="https://cdn.tailwindcss.com/img/logo.svg" alt="ChitChat Logo">
      </div>
      <div>
        <div class="text-xl font-medium text-black">ChitChat</div>
        <p class="text-slate-500">You have a new message!</p>
      </div>
    </div>
  </div>
</div>`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'preview'>('horizontal');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadCode = async () => {
      // Check path ID
      const path = window.location.pathname;
      if (path && path.length > 1) {
        const id = path.substring(1);
        try {
          const response = await fetch(`/api/play/snippets/${id}`);
          if (response.ok) {
            const data = await response.json();
            setCode(data.code);
            return;
          }
        } catch (e) {
          console.error('Failed to load snippet', e);
        }
      }

      // Check hash
      const hash = window.location.hash.substring(1);
      if (hash) {
        const decompressed = LZString.decompressFromEncodedURIComponent(hash);
        if (decompressed) setCode(decompressed);
      }
    };

    loadCode();
  }, []);

  useEffect(() => {
    const compressed = LZString.compressToEncodedURIComponent(code);
    window.history.replaceState(null, '', '#' + compressed);
  }, [code]);

  const handleShare = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const response = await fetch('/api/play/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        const newUrl = window.location.origin + '/' + data._id;
        window.history.pushState(null, '', '/' + data._id);
        await navigator.clipboard.writeText(newUrl);
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleOpenNewTab = () => {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
            ${code}
        </body>
        </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <Header 
        layout={layout} 
        setLayout={setLayout}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onShare={handleShare}
        isSaving={isSaving}
        saveStatus={saveStatus}
        onOpenNewTab={handleOpenNewTab}
      />
      
      <main className={clsx(
        "flex-1 flex overflow-hidden",
        layout === 'vertical' ? "flex-col" : "flex-row"
      )}>
        <div className={clsx(
          "border-gray-700 flex flex-col",
          layout === 'preview' ? "hidden" : "flex",
          layout === 'vertical' ? "w-full h-1/2 border-b" : "w-1/2 h-full border-r"
        )}>
          <Editor code={code} onChange={(val) => setCode(val || '')} />
        </div>

        <div className={clsx(
          "bg-white relative",
          layout === 'preview' ? "w-full h-full" : 
          layout === 'vertical' ? "w-full h-1/2" : "w-1/2 h-full"
        )}>
          <Preview code={code} mode={previewMode} />
        </div>
      </main>
    </div>
  );
}

export default App;
