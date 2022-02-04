import React, { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import LabelField from './label';
import Uploader from '../controls/uploader';
import SVG from '../controls/svg';
import CSS from '../controls/css';
import { _window } from '../util';
import { isNonEmptyString, newGuid } from 'douhub-helper-util';
import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer, FloatingMenu } from '@tiptap/react';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import HtmlFieldCode from './html-code';

import { HTML_FIELD_CSS } from './html-css';
import { HTML_FIELD_CODE_CSS } from './html-code-css';
import { ARTICLE_CSS } from "./article-css";
// import './html-code-langs.scss';
// load all highlight.js languages
import lowlight from 'lowlight';

// load specific languages only
// import lowlight from 'lowlight/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// lowlight.registerLanguage('javascript', javascript)


const DISPLAY_NAME = 'HtmlField';

const HtmlField = (props: Record<string, any>) => {

    const { label, disabled, style,
        labelStyle, alwaysShowLabel,
        name,
        hideLabel, hideH1, hideH2, hideH3,
        hideH4, record } = props;

    const defaultValue = isNonEmptyString(props.defaultValue) ? props.defaultValue : '';
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(isNonEmptyString(props.value) ? props.value : defaultValue);
    const [id] = useState(newGuid());

    if (!_window?.HtmlFields) _window.HtmlFields = {};

    useEffect(() => {
        const newValue = isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value]);

    const onEvent = (editor: any, action?: string) => {

        const html = editor.getHTML();
        let fieldEditor: any = document.getElementsByClassName(`field-html-${id}`);
        fieldEditor = fieldEditor.length > 0 && fieldEditor[0];

        console.log({ html, action })


        if ((action == 'init' || action == 'blur') && html == '<p></p>') {
            if (fieldEditor) fieldEditor.className = `${fieldEditor.className} is-placeholder field-html-${id}-is-placeholder`;
            editor?.commands?.setContent(`<p>${placeholder}</p>`);
        }

        if (action == 'focus' && html == `<p>${placeholder}</p>`) {
            if (fieldEditor) fieldEditor.className = fieldEditor.className.replace(`field-html-${id}-is-placeholder`, '').replace(`is-placeholder`, '').trim();
            editor?.commands?.setContent(`<p></p>`);
        }

        if ((action == 'selection' || action == 'focus') && fieldEditor) {
            if (html == `<p></p>`) {
                if (fieldEditor.className.indexOf('is-empty') < 0) fieldEditor.className = `${fieldEditor.className} is-empty`;
            }
            else {
                if (fieldEditor.className.indexOf('is-empty') > 0) fieldEditor.className = fieldEditor.className.replace(`is-empty`, '');
            }
        }

        if (action == 'update') {
            if (fieldEditor) fieldEditor.className = fieldEditor.className.replace(`field-html-${id}-is-placeholder`, '').replace(`is-placeholder`, '').trim();
            document.getElementById(`field-html-for-sync-${id}`)?.click();
        }
    }


    const editor: any = useEditor({
        content: value,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Dropcursor,
            Typography,
            CodeBlockLowlight
                .extend({
                    addNodeView() {
                        return ReactNodeViewRenderer(HtmlFieldCode)
                    },
                })
                .configure({ lowlight }),
        ],
        onBeforeCreate() {
            //const { editor } = createParams;
        },
        onCreate({ editor }) {
            //the line below has to be done here, do not move inside onEvent
            document.getElementById(`field-html-for-init-${id}`)?.click();
            onEvent(editor, 'init');
        },
        onUpdate: (updateParams) => {

            const { editor } = updateParams;
            //const transaction: Record<string, any> = updateParams?.transaction;

            onEvent(editor, 'update');
        },
        onSelectionUpdate({ editor }) {
            onEvent(editor, 'selection');
            // editor.chain().focus().setImage({ src: url }).run()
            // The selection has changed.
        },
        onTransaction({ editor }) {
            onEvent(editor, 'transaction');
            // The editor state has changed.
        },
        onFocus({ editor }) {
            onEvent(editor, 'focus');
        },
        onBlur({ editor }) {
            onEvent(editor, 'blur');
        },
        onDestroy() {
            // The editor is being destroyed.
        }
    });

    const onClickLink = () => {

        const hasLink: any = editor.isActive('link');
        if (hasLink) {
            editor.chain().focus().toggleLink().run();
        }
        else {
            const url = window.prompt('URL', editor.getAttributes('link').href);
            if (!isNonEmptyString(url)) return;

            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
        }
    }

    const onChangeHeader = (level: number) => {
        editor.chain().focus().toggleHeading({ level }).run();
    }

    const onInitValue = () => {
        const curValue = editor?.getHTML();
        if (curValue != value) {
            editor?.commands?.setContent(value);
        }
    }

    const onSyncValue = () => {
        const newValue = editor?.getHTML();
        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(isNonEmptyString(newValue) ? newValue : null);
    }

    const onUploadPhoto = (photoInfo: Record<string, any>) => {
        editor.commands.setImage({
            src: photoInfo.cfSignedResult.signedUrl
        })
    }

    return <div className="field ">
        <CSS id="html-field-css" content={HTML_FIELD_CSS} />
        <CSS id="html-field-code-css" content={HTML_FIELD_CODE_CSS} />
        <CSS id="html-field-article-css" content={ARTICLE_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        <div className={`w-full field-html field-html-${id} article`} style={style}>
            {editor && <FloatingMenu editor={editor}>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="float-menu"
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className="float-menu"
                >
                    H3
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className="float-menu"
                >
                    <SVG src="/icons/material-bullet-list.svg" style={{ width: 20 }} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className="float-menu"
                >
                    <SVG src="/icons/material-numbered-list.svg" style={{ width: 20 }} />
                </button>
                <button className="float-menu">
                    <Uploader entityName={record.entityName} attributeName={name}
                        fileType="Photo"
                        signedUrlSize={960}
                        onSuccess={onUploadPhoto}
                        recordId={record.id ? record.id : newGuid()}
                        fileNamePrefix={newGuid()}
                        uiFormat="icon" iconUrl="/icons/image.svg"
                        wrapperStyle={{ width: 20, height: 20, border: 'none' }} />
                </button>
            </FloatingMenu>}
            {editor && <BubbleMenu editor={editor} className="menu-wrapper">
                <div className="menu">
                    {!hideH1 && <div
                        onClick={() => onChangeHeader(1)}
                        className={`menu-text ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}>
                        H1
                    </div>}
                    {!hideH2 && <div
                        onClick={() => onChangeHeader(2)}
                        className={`menu-text ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}>
                        H2
                    </div>}
                    {!hideH3 && <div
                        onClick={() => onChangeHeader(3)}
                        className={`menu-text ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}>
                        H3
                    </div>}
                    {!hideH4 && <div
                        onClick={() => onChangeHeader(4)}
                        className={`menu-text ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}>
                        H4
                    </div>}
                    <div className="menu-sp" />
                    <div
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`menu-text menu-text-bold ${editor.isActive('bold') ? 'active' : ''}`} >
                        B
                    </div>
                    <div
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`menu-text menu-text-italic ${editor.isActive('italic') ? 'active' : ''}`} >
                        I
                    </div>
                    <div
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`menu-text menu-text-strikethrough ${editor.isActive('strike') ? 'active' : ''}`} >
                        T
                    </div>
                    <div className="menu-sp" />
                    <SVG src="/icons/material-bullet-list.svg"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`menu-icon ${editor.isActive('bulletList') ? 'active' : ''}`} />
                    <SVG src="/icons/material-numbered-list.svg"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`menu-icon ${editor.isActive('orderedList') ? 'active' : ''}`} />
                    <div className="menu-sp" />
                    {/* <SVG src="/icons/source-code.svg"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`menu-icon ${editor.isActive('codeBlock') ? 'active' : ''}`} /> */}
                    <SVG src="/icons/material-get-quote.svg"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`menu-icon ${editor.isActive('blockquote') ? 'active' : ''}`} />

                    <SVG src="/icons/material-link.svg"
                        onClick={onClickLink}
                        className={`menu-icon ${editor.isActive('link') ? 'active' : ''}`} />
                </div>
            </BubbleMenu>}
            <EditorContent editor={editor} className="field-html-editor" />
            <div id={`field-html-for-init-${id}`} onClick={onInitValue} />
            <div id={`field-html-for-sync-${id}`} onClick={onSyncValue} />
        </div>
    </div>
};

HtmlField.displayName = DISPLAY_NAME;
export default HtmlField;