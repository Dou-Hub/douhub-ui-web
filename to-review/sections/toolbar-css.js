const ToolbarSectionCSS = () => <style global jsx>
{`
    .section-toolbar
    {
        display: flex;
        flex-direction: row;
        margin-bottom: 1.5rem;
        width: 100%;
    }

    .section-toolbar .button-add-first-section
    {
        display: flex;
        flex-direction: row;
    }

    .section-toolbar-relocate-true
    {
        padding: 1rem 0 0 0;
        cursor: pointer;
        margin-bottom: 0;
    }

    .section-toolbar-relocate-false
    {
        padding: 0;
        margin-top: 1rem;
    }

    .section-toolbar .button
    {
        cursor: pointer;
        margin-right: 5px;
        padding: 5px 8px;
    }

    .section-toolbar .button svg
    {
        width: 18px;
        height: 18px;
    }

    .section-toolbar .button-number
    {
        cursour: inherit;
        font-weight: 700;
        border: none;
        min-width: 40px;
    }
    
    .section-toolbar .button-relocate-section
    {
        padding-left: 5px;
        padding-right: 5px;
        width: 30px;
        margin-right: 10px;
    }

    .section-toolbar .button-on
    {
        background-color: #40a9ff;
        border-color: #40a9ff;
        color: #ffffff;
    }

    .section-toolbar .button-on svg
    {
        fill: #ffffff;
    }

    .section-toolbar .button-on span
    {
        color: #ffffff;
    }

    .section-wrapper.sortable-chosen .button-relocate-section
    {
        background-color: #1e88e5;
        border-color: #1e88e5;
    }

    .section-wrapper.sortable-chosen svg
    {
        fill: #ffffff;
    }

    .section-toolbar .button-delete:hover
    {
        border-color: #e53935 !important;
    }

    .section-toolbar .button-icon
    {
        height: 18px;
    }

    .section-toolbar .button-delete svg
    {
        fill: #e53935;
    }

    .section-toolbar .name
    {
        max-width: 180px;
        margin-right: 5px;
    }

    .section-toolbar .section-info
    {
        align-self: center;
        margin-left: 5px;
    }

    .section-toolbar-relocate-false .button-relocate-section
    {
        display: none;
    }

    .section-toolbar .button-relocate-items-true svg
    {
        fill: #1e88e5;
    }

    .section-toolbar-relocate-false .section-info
    {
        display: none;
    }

    .section-toolbar-relocate-true .button-new-section,
    .section-toolbar-relocate-true .name,
    .section-toolbar-relocate-true .button-delete,
    .section-toolbar-relocate-true .button-edit
    {
        display: none;
    }

`}
</style>

ToolbarSectionCSS.displayName = 'ToolbarSectionCSS';
export default ToolbarSectionCSS;
