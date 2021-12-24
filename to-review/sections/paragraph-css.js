
const ParagraphSectionCSS = () => <style global={true} jsx={true}>
{`
    .section-paragraph
    {
        display: flex;
        flex-direction: column;
        // margin-top: 1rem;
    }

    .section-paragraph img
    {
        width: 100% !important;
        height: auto !important;
        margin-bottom: 30px;
    }

    .body-xs .section-paragraph,
    .body-s .section-paragraph 
    {
        display: flex;
        flex-direction: column;
    }

    .section-paragraph a
    {
        color: rgba(0,0,0,0.85);
        text-decoration: underline;
    }

    .section-paragraph a::selection
    {
        color: rgba(0,0,0,0.85);
    }

    .section-paragraph h1
    {
        font-size: 2.2rem !important;
        line-height: 1.2;
        font-weight: 700;
        margin-top: 0.5rem;
        margin-bottom: 2rem;
    }
    
    .section-paragraph h2
    {
        font-size: 1.8rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .section-paragraph h3
    {
        font-size: 1.4rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    .section-paragraph h4
    {
        font-size: 1.2rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }
`}
</style>

ParagraphSectionCSS.displayName = 'ParagraphSectionCSS';
export default ParagraphSectionCSS