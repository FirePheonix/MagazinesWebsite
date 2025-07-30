import React, { useRef, useEffect, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Define the props type for our wrapper
interface QuillWrapperProps {
  value: string;
  onChange: (content: string) => void;
  modules?: any;
  formats?: string[];
  placeholder?: string;
  className?: string;
  theme?: string;
}

const QuillWrapper = forwardRef<ReactQuill, QuillWrapperProps>((props, ref) => {
  const {
    value,
    onChange,
    modules,
    formats,
    placeholder,
    className,
    theme = 'snow'
  } = props;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<ReactQuill>(null);
  
  // Forward the ref
  useEffect(() => {
    if (ref && typeof ref === 'function') {
      ref(quillRef.current);
    } else if (ref) {
      ref.current = quillRef.current;
    }
  }, [ref]);

  return (
    <div ref={containerRef} className="quill-editor-container">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme={theme}
        className={className}
      />
    </div>
  );
});

export default QuillWrapper;