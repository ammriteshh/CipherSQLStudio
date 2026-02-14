import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const QueryEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    return (
        <div className="editor-section">
            <Editor
                height="100%"
                defaultLanguage="sql"
                value={value}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

export default QueryEditor;
