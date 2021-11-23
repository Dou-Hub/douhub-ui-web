
const ConprehensiveSectionCSS = () => <style global jsx>
{`
    .section-comprehensive
    {
        display: flex;
    }

    .section-comprehensive img
    {
        width: 100% !important;
        height: auto !important;
        margin-bottom: 30px;
    }
    
    .body-mobile .section-comprehensive .left-area,
    .body-xs .section-comprehensive.right-area-true .left-area,
    .body-s .section-comprehensive.right-area-true .left-area
    {
        margin-right: 0;
        width: 100% !important;
        max-width: 100% !important;
    }

    .body-mobile .section-comprehensive .right-area,
    .body-xs .section-comprehensive.right-area-true .right-area,
    .body-s .section-comprehensive.right-area-true .right-area
    {
        width: 100%;
        margin-top: 30px;
        border-left: none;
        padding-left: 0;
        padding-right: 0;
    }

    .body-mobile .section-comprehensive,
    .body-xs .section-comprehensive,
    .body-s .section-comprehensive 
    {
        display: flex;
        flex-direction: column;
    }

    .body-m .section-comprehensive.right-area-true .left-area,
    .body-l .section-comprehensive.right-area-true .left-area,
    .body-xl .section-comprehensive.right-area-true .left-area
    {
        margin-right: 40px
    }

    .body-m .section-comprehensive .left-area,
    .body-l .section-comprehensive .left-area,
    .body-xl .section-comprehensive .left-area
    {
        display: flex;
        width: 50%;
        flex-direction: column;
        color: #333333;
        font-weight: 400;
    }

    .body-m .section-comprehensive .right-area,
    .body-l .section-comprehensive .right-area,
    .body-xl .section-comprehensive .right-area
    {
        width: 50%;
        display: flex;
        flex-direction: column;
        border-left: dashed 1px rgba(0,0,0,0.1);
        padding: 0 0 0 40px;
        color: #333333;
        font-weight: 400;
    }

    .body-m .section-comprehensive,
    .body-l .section-comprehensive,
    .body-xl .section-comprehensive
    {
        display: flex;
        flex-direction: row;
    }

    .section-comprehensive .right-area-button
    {
        border-radius: 5px;
    }

    .section-comprehensive a
    {
        color: rgba(0,0,0,0.85);
        text-decoration: underline;
    }

    .section-comprehensive a::selection
    {
        color: rgba(0,0,0,0.85);
    }

    .section-comprehensive h1
    {
        font-size: 2.8rem !important;
        line-height: 1;
        font-weight: 700;
        margin-top: 0 !important;
        margin-bottom: 1.8rem !important;
    }

    .section-comprehensive h2
    {
        font-size: 2.2rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem !important;
        margin-bottom: 1rem !important;
    }

    .section-comprehensive h3
    {
        font-size: 1.6rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem !important;
        margin-bottom: 1rem !important;
    }

    .section-comprehensive .max-width-control
    {
        display: flex;
        border-bottom: dashed 1px #cccccc !important;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
    }

    .section-comprehensive .max-width-control .ant-slider
    {
        flex: 1;
        margin-top: 2px;
        margin-bottom: 2px;
    }

    .section-comprehensive .max-width-control .ant-switch
    {
        margin-right: 0.5rem;
    }

    .section-comprehensive .max-width-control span
    {
        line-height: 1.2;
        margin-right: 0.5rem;
        font-size: 0.8rem;
    }
`}
</style>

ConprehensiveSectionCSS.displayName = 'ConprehensiveSectionCSS';
export default ConprehensiveSectionCSS