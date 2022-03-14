export const ARTICLE_CSS =  `
    .article
    {
        display: flex;
        flex-direction: column;
        // margin-top: 1rem;
    }

    .article img
    {
        max-width: 100% !important;
        height: auto !important;
        margin-bottom: 30px;
    }

    .body-xs .article,
    .body-s .article 
    {
        display: flex;
        flex-direction: column;
    }

    .article a
    {
        color: rgba(0,0,0,0.85);
        text-decoration: underline;
    }

    .article a::selection
    {
        color: rgba(0,0,0,0.85);
    }

    .article h1
    {
        font-size: 2.2rem !important;
        line-height: 1.2;
        font-weight: 700;
        margin-top: 0.5rem;
        margin-bottom: 2rem;
    }
    
    .article h2
    {
        font-size: 1.8rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .article h3
    {
        font-size: 1.4rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    .article h4
    {
        font-size: 1.2rem !important;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }


    .article p,
    .article li
    {
        margin-bottom: 1rem;
        line-height: 1.5rem
    }

    .article blockquote
    { 
        border-left: solid 3px #d9d9d9;
        font-style: italic;
        margin: 1rem;
        padding: 1rem;
        margin-left: 0px;
    }

    .article blockquote  p:last-child
    { 
        margin-bottom: 0;
    }

`;