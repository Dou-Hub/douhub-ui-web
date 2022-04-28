export const HTML_FIELD_CODE_CSS = `

.field-html .ProseMirror pre {
    background: rgb(249 250 251);
    color: #333;
    padding: 1.5rem 1rem 1rem 1rem;
    margin-bottom: 2rem;
}

.field-html .ProseMirror precode {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
}

.field-html .ProseMirror code,
.field-html .ProseMirror span {
  font-size: 0.8rem;
}

.field-html .ProseMirror pre .hljs-comment,
.field-html .ProseMirror pre .hljs-quote {
  color: #777777;
  font-size: 0.7rem;
}

.field-html .ProseMirror pre .hljs-variable,
.field-html .ProseMirror pre .hljs-template-variable,
.field-html .ProseMirror pre .hljs-attribute,
.field-html .ProseMirror pre .hljs-tag,
.field-html .ProseMirror pre .hljs-name,
.field-html .ProseMirror pre .hljs-regexp,
.field-html .ProseMirror pre .hljs-link,
.field-html .ProseMirror pre .hljs-name,
.field-html .ProseMirror pre .hljs-selector-id,
.field-html .ProseMirror pre .hljs-selector-class {
  color: blue;
}

.field-html .ProseMirror pre .hljs-number,
.field-html .ProseMirror pre .hljs-meta,
.field-html .ProseMirror pre .hljs-built_in,
.field-html .ProseMirror pre .hljs-builtin-name,
.field-html .ProseMirror pre .hljs-literal,
.field-html .ProseMirror pre .hljs-type,
.field-html .ProseMirror pre .hljs-params {
  color: #fbbc88;
}

.field-html .ProseMirror pre .hljs-string,
.field-html .ProseMirror pre .hljs-symbol,
.field-html .ProseMirror pre .hljs-bullet {
  color: green;
}

.field-html .ProseMirror pre .hljs-title,
.field-html .ProseMirror pre .hljs-section {
  color: #f97316;
}

.field-html .ProseMirror pre .hljs-keyword,
.field-html .ProseMirror pre .hljs-selector-tag {
  color: #0ea5e9;
}

.field-html .ProseMirror pre .hljs-emphasis {
  font-style: italic;
}

.field-html .ProseMirror pre .hljs-strong {
  font-weight: 700;
}

.field-html .ProseMirror .code-block {
  position: relative;
}

.field-html .ProseMirror .code-block-lang {
  position: absolute;
  top: -15px;
  right: 0;
  min-width: 120px;
}

.field-html .ProseMirror .code-block-lang .ant-select-selector{
  background-color: rgb(249 250 251);
  border-color: rgb(249 250 251);
  font-size: 0.8rem;
  cursor: pointer;
}

.field-html .ProseMirror .code-block-lang .ant-select-arrow {
  color: #333333;
}

`