import React from 'react';
// import 'antd/dist/antd.min.css';
const AntdCSS = () => <style global={true} jsx={true}>
{`
    html {
        --antd-wave-shadow-color: none !important;
    }

    .ant-popover-message-title
    {
        padding-left: 0 !important;
    }

    .ant-popover-message .anticon
    {
        display: none !important;
    }

    .ant-dropdown-menu-title-content a {
        color: #222222 !important;
    }

    .ant-input[disabled]
    {
        color: rgba(0,0,0,0.3) !important;
        background-color: rgba(0,0,0,0.01) !important;
    }
}`}
</style>

AntdCSS.displayName = 'AntdCSS';
export default AntdCSS;