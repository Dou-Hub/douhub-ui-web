
export const HTML_FIELD_CSS = `
.field-html 
{
    margin-top: 0.5rem;
}
.field-html ol
{
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

.field-html ul
{
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

.field-html ol
{
    list-style-type: decimal;
    
}

.field-html .field-html-editor 
{
    flex: 1;
    min-height: 26px;
}

.field-html .field-html-editor.readonly
{
    flex: 1;
    min-height: auto;
}

.field-html .ProseMirror
{ 
    outline: none !important;
    width: 100%;
    text-align: left;
}

.field-html .ProseMirror mark
{
    border-radius: 0.3rem;
    padding: 0.1rem .2em 0.2rem 0.2rem;
}

.field-html.is-placeholder .ProseMirror p
{ 
    color: #bbbbbb;
    
}

.field-html.is-placeholder 
.field-html.is-empty 
{ 
    
}

.field-html .ProseMirror p:last-child
{
    margin-bottom: 0 !important
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

.field-html.is-empty .float-menu
{
    display: none
}

.field-html .menu-color
{
    width: 20px;
    height: 20px;
    margin: 3px;
    cursor: pointer;
}


.field-html .menu .menu-color:first-child
{
    margin-left: 0;
}


.field-html .menu .menu-color:last-child
{
    margin-right: 0;
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

.field-html img.ProseMirror-selectednode
{
    border: dashed 2px #333333;
}

.field-html .tippy-content > div
{
    display: flex;
}

`;
