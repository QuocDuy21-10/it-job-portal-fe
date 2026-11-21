import type React from "react";

export const markdownComponents = {
  ul: ({
    node,
    ...props
  }: React.ComponentPropsWithoutRef<"ul"> & { node?: unknown }) => (
    <ul className="list-disc space-y-0.5 pl-4" {...props} />
  ),
  ol: ({
    node,
    ...props
  }: React.ComponentPropsWithoutRef<"ol"> & { node?: unknown }) => (
    <ol className="list-decimal space-y-0.5 pl-4" {...props} />
  ),
  a: ({
    node,
    ...props
  }: React.ComponentPropsWithoutRef<"a"> & { node?: unknown }) => (
    <a
      className="text-blue-600 hover:underline dark:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  // Images become links so the browser never loads a model-chosen URL (no reliance on CSP).
  img: ({
    node,
    src,
    alt,
  }: React.ComponentPropsWithoutRef<"img"> & { node?: unknown }) =>
    typeof src === "string" && src ? (
      <a
        href={src}
        className="text-blue-600 hover:underline dark:text-blue-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        {alt || src}
      </a>
    ) : null,
  p: ({
    node,
    ...props
  }: React.ComponentPropsWithoutRef<"p"> & { node?: unknown }) => (
    <p className="mb-1 last:mb-0" {...props} />
  ),
  strong: ({
    node,
    ...props
  }: React.ComponentPropsWithoutRef<"strong"> & { node?: unknown }) => (
    <strong className="font-semibold" {...props} />
  ),
};
