const PageBaseCSS = () => <style global={true} jsx={true}>{`

    html {
        --antd-wave-shadow-color: none !important;
        --scroll-bar: 0;
        line-height: 1.15;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        -ms-overflow-style: scrollbar;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }

    *, :after, :before
    {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    body {

        color: rgba(0,0,0,.85);
        font-size: 14px;
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
        font-variant: tabular-nums;
        line-height: 1.5715;
        background-color: #fff;
        font-feature-settings: "tnum";
        padding: 0;
        margin: 0;
    } 

    .body {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .no-text-select {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
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

    @keyframes blinker {
        50% {
          opacity: 0;
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    .spinner {
        display: inline-block;
        animation: spin 2s linear infinite;
    }

    .ant-input[disabled]
    {
        color: rgba(0,0,0,0.3) !important;
        background-color: rgba(0,0,0,0.01) !important;
    }

    .section-wrapper
    {
        margin-top: 0rem;
        margin-bottom: 1.5rem;
        width: 100%;
    }

    .body-xs .section-wrapper.edit-mode-false.first,
    .body-s .section-wrapper.edit-mode-false.first,
    .body-m .section-wrapper.edit-mode-false.first
    {
        margin-top: 20px;
    }

    .body-l .section-wrapper.edit-mode-false.first,
    .body-xl .section-wrapper.edit-mode-false.first
    {
        margin-top: 30px;
    }
    
    .section-wrapper.relocate-true
    {
        margin-bottom: 0;
    }

    .section {
        width: 100%;
    }

    .section-loading-true
    {
        display: none;
    }

    .body-xs .section,
    .body-s .section,
    .body-xs .section-title,
    .body-s .section-title
    {
        margin-top: 20px;
    }

    .section p {
        line-height: 1.3;
    }

    .section-title {
        font-size: 1.6rem;
        font-weight: 500;
        margin-bottom: 1rem;
        margin-top: 1.5rem;
    }

    .section-title-true 
    {
        margin-top: 0.6rem;
    }

    .section-title.field-text
    {
        margin-top: 0 !important;
    }

    .page-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 61px;
        min-width: 360px;
        width: 100%;
        max-width: 1440px;
    }

    .body-l .page-wrapper,
    .body-xl .page-wrapper 
    {
        margin-top: 81px;
    }

    .page-wrapper.header-hide
    {
        margin-top: 0 !important;
    }

    .page {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .page-loading-true
    {
        display: none;
    }

    .body-xl .header, .body-xl .footer, .body-xl .page {
        max-width: 1440px;
    }

    .body-l .header, 
    .body-l .footer, 
    .body-l .page {
        max-width: 1200px;
    }

    .body-m .header, .body-m .footer, .body-m .page {
        max-width: 992px;
    }

    .body-s .header, .body-s .footer, .body-s .page {
        max-width: 768px;
    }

    .body-xs .header, .body-xs .footer, .body-xs .page {
        min-width: 360px;
        max-width: 576px;
    }


    .page h1
    {
        font-size: 2.8rem;
        font-weight: 700;
        margin-bottom: 1.8rem;
    }

    .page .function {
        width: 61px;
        border-right: solid 1px #eeeeee;
        background-color: #ffffff;
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .body-s .page .function,
    .body-xs .page .function  {
       left: 0;
    }

    .page .function .button
    {
        margin-top: 20px;
        cursor: pointer;
        margin-left: 10px;
        margin-right: 10px;
    }

    .page .function .button svg
    {
        width: 24px;
        height: 24px;
    }

    .page .function .button-delete svg
    {
        fill: #e53935;
    }

    .page .function .button-relocate-true svg
    {
        fill: #1e88e5;
    }

    .page.function-true .main
    {
        margin-left: 60px;
    }

    .page .main {
        display: flex;
        flex-direction: column;
        align-items:flex-start;
        flex: 1;
        min-height: 100%;
        padding-left: 20px;
        padding-right: 20px;
    }

    .page .main h1 {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .page .main p,
    .page .main li
    {
        margin-bottom: 1rem;
    }

    .page .main blockquote
    { 
        border-left: solid 3px #d9d9d9;
        font-style: italic;
        margin: 15px;
        padding: 15px;
        margin-left: 0px;
    }

    .page .main .description {
       font-size: 1.1rem;
    }

    .body-xl .page .main,
    .body-l .page .main
    {
        padding-left: 30px;
        padding-right: 30px;
    }


    // .page.side-area-false.function-true .main
    // {
    //     width: calc(100% - 61px);
    // }

    .page .side {
        width: 280px;
        padding-left: 30px;
        padding-right: 30px;
        display: flex;
        flex-direction: column;
        border-left: solid 1px #eeeeee;
    }


    .body-xl .page .side {
        width: 350px;
    }

    .page .side .section
    {
        margin-bottom: 0;
    }

`}
</style>

PageBaseCSS.displayName = 'PageBaseCSS';
export default PageBaseCSS;
