export const HTML_FIELD_CODE_CSS = `

    .field-html .ProseMirror pre {
        background: rgb(249 250 251);
        color: #333;
        padding: 1.5rem 1rem 1rem 1rem;
        margin-bottom: 2rem;
    }

    .field-html .ProseMirror code
    {
        font-size: smaller;
    }

    .field-html .ProseMirror pre .hljs-comment,
    .field-html .ProseMirror pre .hljs-quote {
        color: #777777;
        font-size: smaller;
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
        margin-top: 2rem;
    }


    .field-html .ProseMirror .ant-select-selection-item
    {
        text-align: center;
    }

    .field-html .ProseMirror .code-block-lang {
        position: absolute;
        top: -15px;
        right: 0;
        min-width: 120px;
    }

    .field-html .ProseMirror .code-block-lang .ant-select-selection-item,
    .field-html .ProseMirror .code-block-lang .ant-select-selection-search-input
    {
        font-size: 
    }

    .field-html .ProseMirror .code-block-lang.readonly {
        background-color: rgb(249 250 251);
        text-align: center;
    }
    

    .field-html .ProseMirror .code-block-lang .ant-select-selector{
        background-color: rgb(249 250 251);
        border-color: rgb(249 250 251);
        cursor: pointer;
    }

    .field-html .ProseMirror .code-block-lang .ant-select-arrow {
        color: #333333;
    }

`