const TagsCSS = () => <style global jsx>
{`
    .field-tags {
        display: flex;
        flex-direction: column !important;
        padding-top: 0.5rem;
    }

    .field-tags-auto-search-checkbox
    {
        margin-bottom: 1rem;
    }

    .field-tags-auto-search-true
    {
        margin-bottom: 0;
    }

    .field-tags-0
    {
        padding-top: 5px;
    }

    .field-tags .list
    {
        display: flex;
        max-height: 310px;
        overflow: hidden;
        overflow-y: scroll;
        margin-bottom: 10px;
    }

    .field-tags-0 .list
    {
        margin-bottom: 0;
    }

    .field-tags .tag
    {
        display: flex;
        color: #333333;
        border: solid 1px rgba(0,0,0,0.1);
        background-color: #ffffff;
        padding: 5px 10px;
        float: left;
        margin: 0px 10px 5px 0;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .field-tags .tag:hover
    {
        color: #000000;
        background-color: rgba(0,0,0,0.02);
    }

    .field-tags .tag > .x
    {
        align-self: center;
        margin-left: 8px;
    }

    .field-tags .tag > .x > div
    {
        width: 16px;
        height: 16px;
    }


    .field-tags .tag svg
    {
        width: 16px;
        height: 16px;
        fill: #999999;
    }

    .field-tags .tag svg:hover
    {
        fill: #FF0000;
    }

    .field-tags-input 
    {
        border: none !important;
        padding-top: 0 !important;
    }
`}
</style>

TagsCSS.displayName = 'TagsCSS';
export default TagsCSS;