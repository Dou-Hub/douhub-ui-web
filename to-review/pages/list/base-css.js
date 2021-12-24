const ListBaseCSS = () => <style global={true} jsx={true}>{`

    body
    {
        overflow-y: hidden;
    }

    .page-list 
    {
        width: 100%;
        position: relative;
    }

    .page-list h1
    {
        font-size: 20px !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        background: #ffffff;
        padding-top: 20px;
        padding-bottom: 20px;
        height: 65px !important;
    }

   
    .page-list .table
    {
        margin-bottom: 0;
        position: absolute;
    }

    .page-list .page-list-header >div
    {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .page-list .page-list-header h1
    {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        flex: 1;
    }

    .page-list .page-list-header button
    {
        align-self: center;
    }

    .page-list .ant-table .ant-table-body
    {
        overflow: hidden;
        overflow-y: auto;
    }

    .page-list .ant-table thead th,
    .page-list .ant-table tbody td
    {
        padding: 0.5rem 0.8rem;
        font-size: 0.8rem;
    }

    .page-list .table tbody tr .menu
    {
        cursor: pointer;
    }
    
    .page-list .table tbody tr .cell-icon
    {
        width: 20px;
        cursor: pointer;
    }

    .page-list-iframe-drawer .ant-drawer-body{
        padding: 0;
        padding-right: 25px; 
        overflow: hidden;
    }

    .page-list-iframe-drawer iframe
    {
        width: 100%;
        height: 100%;
        border: none;  
    }
    
    .page-list-iframe-drawer .ant-drawer-close
    {
        padding: 10px;
        background-color: #f9f9f9;
        z-index: 110;
    }

    .page-list-editor-drawer .ant-drawer-close
    {
        padding: 15px;
        background-color: #f9f9f9;
        z-index: 110;
    }

    .page-list-editor-drawer .header
    {
        padding: 10px;
        background-color: #f9f9f9;
        height: 48px;
        position: absolute;
        top: 0;
        left: 0;
        border-bottom: solid 1px #eeeeee;
        z-index: 100;
        displat: flex;
        flex-direction: column;
    }

    .page-list-editor-drawer .header .buttons
    {
        margin: 0;
        padding: 0;
    }

    .page-list-editor-drawer .header .error
    {
        font-size: 0.8rem;
        color: #ff0000;
    }

    .page-list-editor-drawer  .ant-drawer-header
    {
        border-bottom: none;
        height: 48px;
    }

    .page-list-editor-drawer  .ant-drawer-header .button
    {
       margin-left: 10px;
       cursor: pointer;
    }

    .page-list-editor-drawer  .ant-drawer-header .button-icon svg
    {
       width: 25px;
       height: 25px;
    }

    .page-list-editor-drawer  .ant-drawer-header .button-icon-delete svg
    {
        fill: #ff0000;
    }

`}
</style>

ListBaseCSS.displayName = 'ListBaseCSS';
export default ListBaseCSS;
