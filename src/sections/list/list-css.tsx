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

    .douhub-list .ant-table-tbody>tr>td.ant-table-cell-row-hover,
    .douhub-list .ant-table-tbody>tr.ant-table-row:hover>td
    {
        background: rgb(251,252,253) !important;
    }

    .douhub-list .ant-table-tbody>tr>td:last-child:before,
    .douhub-list .ant-table-selection-column:before
    {
       width: 0px !important;
    }
    
    .douhub-list .ant-table-thead>tr>th
    {
        background: rgb(251,252,253) !important;
    }

    .douhub-list .ant-table-selection-column
    {
       padding-left: 16px;
    }

    .douhub-list-header .ant-select-selector
    {
        padding: 0 !important;
        line-height: 1;
    }

    .douhub-list-header .ant-select
    {
        height: 32px;
    }

    .douhub-list-header .ant-select-selection-item
    {
        padding-right: 36px !important;
    }

    .douhub-list-header .douhub-list-title .ant-select-selection-item
    {
        font-weight: bold !important;
        font-size: 1.2rem;
        line-height: 30px !important;
    }

    .douhub-list-header .douhub-list-title h1
    {
        font-weight: bold !important;
        font-size: 1.2rem;
        line-height: 1.6 !important;
        margin-bottom: 0;
        height: 32px;
        margin-right: 20px;
    }
     
    .douhub-list-full .layout-pane
    {
        width: 100% !important;
    }
`
