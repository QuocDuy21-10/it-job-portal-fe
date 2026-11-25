"use client";

import { forwardRef, useRef } from "react";
import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});

import "react-quill-new/dist/quill.snow.css";

const ReactQuillAny = ReactQuill as any;

interface RichTextEditorProps {
  value: string;
  // source is "user" for edits and "api" when Quill normalizes the loaded HTML.
  onChange: (value: string, delta?: unknown, source?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowImages?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  function RichTextEditor(
    {
      value,
      onChange,
      // placeholder = "Enter text...",
      disabled = false,
      allowImages = true,
      id,
      "aria-label": ariaLabel,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) {
    const quillRef = useRef<any>(null);

    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ color: [] }, { background: [] }],
        allowImages ? ["link", "image"] : ["link"],
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
      ...(allowImages ? ["image"] : []),
    ];

    return (
      <div
        ref={ref}
        role="group"
        id={id}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className="quill-wrapper"
      >
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
          className="rounded-md bg-background"
        />
        <style jsx>{`
          .quill-wrapper :global(.ql-toolbar) {
            border: 1px solid hsl(var(--input));
            border-bottom: none;
            border-radius: 8px 8px 0 0;
          }
          .quill-wrapper :global(.ql-container) {
            border: 1px solid hsl(var(--input));
            border-radius: 0 0 8px 8px;
            min-height: 200px;
          }
          .quill-wrapper[aria-invalid="true"] :global(.ql-toolbar),
          .quill-wrapper[aria-invalid="true"] :global(.ql-container) {
            border-color: hsl(var(--error));
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
);
