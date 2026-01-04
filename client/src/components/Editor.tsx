import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="html"
      theme="vs-dark"
      value={code}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 20 },
        automaticLayout: true,
      }}
    />
  );
};
