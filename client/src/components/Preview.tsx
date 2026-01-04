import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface PreviewProps {
  code: string;
  mode: 'desktop' | 'mobile';
}

export const Preview: React.FC<PreviewProps> = ({ code, mode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const updatePreview = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

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

      doc.open();
      doc.write(htmlContent);
      doc.close();
    };

    updatePreview();
  }, [code]);

  return (
    <div className={clsx(
      "bg-white w-full h-full transition-all duration-300",
      mode === 'mobile' ? "flex items-center justify-center bg-gray-100 p-8" : "relative"
    )}>
      <div className={clsx(
        "bg-white transition-all duration-300 overflow-hidden",
        mode === 'mobile' ? "w-[375px] h-[667px] border-[8px] border-gray-800 rounded-[24px] shadow-2xl" : "w-full h-full"
      )}>
        <iframe 
          ref={iframeRef}
          className="w-full h-full border-none"
          title="preview"
        />
      </div>
    </div>
  );
};
