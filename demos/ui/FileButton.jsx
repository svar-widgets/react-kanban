import { useRef } from 'react';
import { Button } from '@svar-ui/react-core';
import './FileButton.css';

// Button that opens the file picker and passes the chosen file on.
function FileButton({ accept, type, onFile, children }) {
  const inputRef = useRef(null);

  function pick() {
    const input = inputRef.current;
    const file = input?.files?.[0];
    if (file) onFile(file);
    // the same file can be picked again
    if (input) input.value = '';
  }

  return (
    <>
      <input
        ref={inputRef}
        className="wx-demo-file"
        type="file"
        accept={accept}
        onChange={pick}
      />
      <Button type={type} onClick={() => inputRef.current?.click()}>
        {children}
      </Button>
    </>
  );
}

export default FileButton;
