const SearchPageCSS = () => <style global={true} jsx={true}>{`
    .search-page-title
    {
        font-size: 1.6rem !important;
        font-weight: 600 !important;
        margin-top: 1.5rem !important;
        margin-bottom: 0 !important;
    }

    .search-page-grid {
        width: 100%;
    }

    .search-page-grid .item
    {
        cursor: pointer;
    }

    .search-page-grid .media {
        width: 100%;
    }

    .search-page-grid .buttons
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .search-page-grid .buttons .button-edit,
    .search-page-grid .buttons .button-edit svg
    {
        width: 25px;
        height: 25px;
        cursor: pointer;
    }

    .search-page-grid .buttons .ph
    {
        height: 25px;
        flex: 1;
    }

    .search-page-grid .buttons .action
    {
        height: 25px;
        width 100%;
    }

    .search-page-grid .button
    {
        height: auto;
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .search-page-grid .button-ph
    {
        padding: 2px;
        height: auto;
    }

    .search-page-grid .button .shop
    {
        line-height: 1;
        width: 16px;
        height: 16px;
    }

    .search-page-grid .button .price
    {
        color: #f15d22;
        font-weight: 500;
        line-height: 1;
        padding: 2px 0;
        white-space: nowrap;
        flex: 1;
    }

    .search-page-grid .info h3
    {
        line-height: 1.3;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
    
    .search-page-grid .info p
    {
        margin-bottom: 0.5rem;
        line-height: 1.3;
    }

    .search-page-grid .buttons
    {
        margin-top: 1rem;
    }

    .search-page-grid .search-highlight
    {
        color: #1890ff;
        font-weight: bold;
    }

`}
</style>

SearchPageCSS.displayName = 'SearchPageCSS';
export default SearchPageCSS;