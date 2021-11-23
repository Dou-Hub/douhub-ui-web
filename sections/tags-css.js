const DISPLAY_NAME = 'TagsSectionCSS';

const TagsSectionCSS = () => <style global jsx>
    {`
    
    .section-tags .tag
    {
        display: flex;
        color: #333333;
        border: solid 1px rgba(0,0,0,0.1);
        background-color: #ffffff;
        padding: 5px 10px;
        float: left;
        margin: 0 10px 10px 0;
        font-size: 0.9rem;
        cursor: pointer;
    }

    .section-tags .tag.anchor
    {
        cursor: pointer;
    }

    .section-tags .tag a
    {
        text-decoration: none;
        color: #333333;
    }
    
    .section-tags .tag:hover
    {
        color: #000000;
        background-color: rgba(0,0,0,0.02);
    }

    .section-tags .tag > div
    {
        align-self: center;
    }

    .section-tags .tag svg
    {
        width: 14px;
        height: 14px;
        fill: #666666;
    }

    .section-tags .tag svg:hover
    {
         fill: #FF0000;
    }

    .section-tags .tag-type-note
    {
        font-size: 0.7rem;
        color: rgba(0,0,0,0.5);
        line-height: 1.1;
        border-bottom: dashed 1px #cccccc;
        padding-bottom: 15px;
    }
`}
</style>

TagsSectionCSS.displayName = DISPLAY_NAME;
export default TagsSectionCSS;