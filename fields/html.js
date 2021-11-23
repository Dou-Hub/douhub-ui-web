import React, { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import Label from './label';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit';
import SVG from '../controls/svg';
import cheerio from "cheerio";

const DISPLAY_NAME = 'FieldHtml';

const FieldHtmlCSS = () => <style global jsx>{`
.field-html {
    border-bottom: dashed 1px #cccccc;
}

.field-html .field-html-editor 
{
    flex: 1;
    min-height: 42px;
}

.field-html .ProseMirror
{ 
    outline: none !important;
    width: 100%;
    font-size: 0.9rem;
}


.field-html .ProseMirror p:last-child
{ 
    margin-bottom: 0;
}

.field-html .ProseMirror p.is-placeholder
{ 
    color: #aaaaaa;
}

.field-html .menu-wrapper
{
    display: flex;
    flex-direction: row;
    background: #ffffff;
    border: solid 1px #d9d9d9;
    padding: 0 3px;
}

.field-html .menu
{
    
}

.field-html .menu-sp
{ 
    float: left;
    width: 1px;
    height: 20px;
    margin: 6px 3px;
    border-left: solid 1px #d9d9d9;
}

.field-html .menu-icon
{ 
    float: left;
    width: 20px;
    height: 20px;
    margin: 6px 3px;
    cursor: pointer;
    line-height: 20px;
}

.field-html .menu-text
{ 
    float: left;
    height: 20px;
    margin: 6px 3px;
    cursor: pointer;
    line-height: 20px;
    font-size: 1rem;
}

.field-html .menu-text.active
{ 
    color: #40a9ff;
}

.field-html .menu-text-strikethrough
{
    text-decoration: line-through;
}

.field-html .menu-text-bold
{
    
}

.field-html .menu-text-italic
{
    font-style: italic;
}

.field-html .menu-icon.active svg
{ 
    fill: #40a9ff;
}

.field-html p,
.field-html li
{
    margin-bottom: 1rem;
}

.field-html blockquote
{ 
    border-left: solid 3px #d9d9d9;
    font-style: italic;
    margin: 15px;
    padding: 15px;
    margin-left: 0px;
}



`}</style>

const FieldHtml = React.forwardRef((props, ref) => {

    const { label, disabled, style, labelStyle, alwaysShowLabel, hideLabel, hideH1, hideH2, hideH3, hideH4 } = props;

    const defaultValue = _.isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(_.isNonEmptyString(props.value) ? props.value : defaultValue);
    const [id] = useState(_.newGuid());

    const onChange = () => {
        const forChange = document.getElementById(`field-html-for-change-${id}`);
        const newValue = forChange.getAttribute('data-content');
        const headerChanged = forChange.getAttribute('data-header-changed');
        let headers = null;
        if (headerChanged=='true') 
        {
            headers = {h1:[],h2:[],h3:[]};
            forChange.setAttribute('data-header-changed', 'false');
            const $ = cheerio.load(newValue);
           
            $('h1').each(function () {
                if ($(this).text().length>0) headers.h1.push($(this).text());
            });

            $('h2').each(function () {
                if ($(this).text().length>0) headers.h2.push($(this).text());
            });

            $('h3').each(function () {
                if ($(this).text().length>0) headers.h3.push($(this).text());
            });
        }

        if (_.isFunction(props.onChange)) props.onChange(_.isNonEmptyString(newValue) ? newValue : null, headers);
       
    }

    const editor = useEditor({
        content: value,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        onBeforeCreate({ editor }) {

        },
        onCreate({ editor }) {
            const field = document.getElementsByClassName(`field-html-${id}`);
            const emptyP = field.length > 0 && field[0].getElementsByClassName(`is-editor-empty`);
            if (emptyP.length > 0) {
                emptyP[0].innerHTML = placeholder;
                emptyP[0].className = "is-placeholder";
            }
        },
        onUpdate: (updateParams) => {
            const {editor} = updateParams;
            let newValue = editor.getHTML();

            const field = document.getElementsByClassName(`field-html-${id}`);
            const placeHolder = field.length > 0 && field[0].getElementsByClassName(`is-placeholder`);
            if (placeHolder.length > 0 || newValue == '<p></p>') {
                newValue = null;
            }
            if (!_.isNonEmptyString(newValue)) newValue = defaultValue ? defaultValue : '';
            setValue(newValue);
            const forChange = document.getElementById(`field-html-for-change-${id}`);
            forChange.setAttribute('data-content', newValue);

            if (editor.isActive('heading'))
            {
                forChange.setAttribute('data-header-changed', 'true');
            }
            
            if (forChange) forChange.click();
            // The content has changed.
        },
        onSelectionUpdate({ editor }) {
            // The selection has changed.
        },
        onTransaction({ editor, transaction }) {
            // The editor state has changed.
        },
        onFocus({ editor, event }) {
            const fieldEditor = document.getElementsByClassName(`field-html-${id}`);
            const emptyP = fieldEditor.length > 0 && fieldEditor[0].getElementsByClassName(`is-placeholder`);
            if (emptyP.length > 0) {
                emptyP[0].innerHTML = '';
                emptyP[0].className = '';
            };
        },
        onBlur({ editor, event }) {
            const fieldEditor = document.getElementsByClassName(`field-html-${id}`);
            const emptyP = fieldEditor.length > 0 && fieldEditor[0].getElementsByClassName(`is-editor-empty`);
            if (emptyP.length > 0) {
                emptyP[0].innerHTML = placeholder;
                emptyP[0].className = `is-placeholder`;
            }
        },
        onDestroy() {
            // The editor is being destroyed.
        }
    });

    const onClickLink = () => {
       
        const hasLink = editor.isActive('link');
        if (hasLink) {
            editor.chain().focus().toggleLink().run();
        }
        else {
            const url = window.prompt('URL', editor.getAttributes('link').href);
            if (!_.isNonEmptyString(url)) return;

            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
        }
    }

    useEffect(() => {
        const newValue = _.isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onChangeHeader = (level) => {
        // const forChange = document.getElementById(`field-html-for-change-${id}`);
        // forChange.setAttribute('data-header-changed', 'true');
        editor.chain().focus().toggleHeading({ level }).run();
    }

    return <>
        <FieldHtmlCSS />
        <Label text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || _.isNonEmptyString(value) || !_.isNonEmptyString(placeholder)))}
        />
        <div className={`field field-html field-html-${id}`} style={style}>
            {editor && <BubbleMenu editor={editor} className="menu-wrapper">
                <div className="menu">
                    {!hideH1 && <div
                        onClick={()=>onChangeHeader(1)}
                        className={`menu-text ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}>
                        H1
                    </div>}
                    {!hideH2 && <div
                        onClick={()=>onChangeHeader(2)}
                        className={`menu-text ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}>
                        H2
                    </div>}
                    {!hideH3 && <div
                        onClick={()=>onChangeHeader(3)}
                        className={`menu-text ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}>
                        H3
                    </div>}
                    {!hideH4 && <div
                        onClick={()=>onChangeHeader(4)}
                        className={`menu-text ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}>
                        H4
                    </div>}
                    <div className="menu-sp" />
                    <div src="/icons/material-bold.svg"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`menu-text menu-text-bold ${editor.isActive('bold') ? 'active' : ''}`} >
                        B
                    </div>
                    <div src="/icons/material-italic.svg"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`menu-text menu-text-italic ${editor.isActive('italic') ? 'active' : ''}`} >
                        I
                    </div>
                    <div src="/icons/material-strikethrough.svg"
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
            <div id={`field-html-for-change-${id}`} onClick={onChange} />
        </div>
    </>
});

FieldHtml.displayName = DISPLAY_NAME;
export default FieldHtml;
