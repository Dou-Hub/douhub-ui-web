export const LIST_CSS = `

    .douhub-list .splitter-layout > .layout-splitter
    {
        background-color: #FFFFFF !important;
    }

    .douhub-list .ant-table-thead>tr>th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan]):before
    {
        height: 100%;
    }

    .douhub-list .ant-table-tbody>tr>td:before
    {
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: rgba(0,0,0,.06);
        transform: translateY(-50%);
        transition: background-color .3s;
        content: "";
    }

    .douhub-list .ant-table-tbody>tr>td:last-child:before,
    .douhub-list .ant-table-selection-column:before
    {
       width: 0px !important;
    }
    
    .douhub-list .ant-table-thead>tr>th
    {
        background: rgb(249 250 251);
    }

    .douhub-list .ant-table-selection-column
    {
       padding-left: 16px;
    }
   
    .douhub-list-title .ant-select-selector
    {
        padding: 0 !important;
    }

    .douhub-list-title .ant-select-selection-item
    {
        font-weight: bold !important;
        font-size: larger;
        padding-right: 36px !important;
    }

    .douhub-list-sidepanel-hidden .layout-pane-primary,
    .douhub-list-sidepanel-hidden .layout-splitter,
    .douhub-list-full .layout-pane-primary,
    .douhub-list-full .layout-splitter
    {
        display: none;
    }

    .douhub-list-full .layout-pane
    {
        width: 100% !important;
    }
`
