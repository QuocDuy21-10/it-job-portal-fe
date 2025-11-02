"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
      Loading editor...
    </div>
  ),
});

import "react-quill-new/dist/quill.snow.css";

const ReactQuillAny = ReactQuill as any;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  // placeholder = "Enter text...",
  disabled = false,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "script",
    "color",
    "background",
    "link",
    "image",
  ];

  return (
    <div className="quill-wrapper">
      <ReactQuillAny
        ref={(ref: any) => {
          quillRef.current = ref;
        }}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        // placeholder={placeholder}
        readOnly={disabled}
        className="bg-white rounded-md"
      />
      <style jsx>{`
        .quill-wrapper :global(.ql-toolbar) {
          border: 1px solid hsl(var(--input));
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
        }
        .quill-wrapper :global(.ql-container) {
          border: 1px solid hsl(var(--input));
          border-radius: 0 0 0.375rem 0.375rem;
          min-height: 200px;
        }
        .quill-wrapper :global(.ql-editor) {
          min-height: 200px;
          font-size: 14px;
        }
        .quill-wrapper :global(.ql-snow .ql-stroke) {
          stroke: hsl(var(--foreground) / 0.5);
        }
        .quill-wrapper :global(.ql-snow .ql-fill) {
          fill: hsl(var(--foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}
