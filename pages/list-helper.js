import _ from '../../../shared/util/base';
import { callAPIBase, callAPI } from '../../util/web';
import { APPCOLORS, colorByName } from '../../../shared/util/colors';
import SVG from '../controls/svg';

export const MESSAGE = {
    "search-error": `<p>Your search - "[KEYWORDS]" - was failed.</p>
    <p>Suggestions:</p>
    <ul>
        <li>Make sure that all words are spelled correctly.</li>
        <li>Try different keywords.</li>
        <li>Try more general keywords.</li>
        <li>Try fewer keywords.</li>
    </ul>`,
    "list-no-data": `<p>There is no record match your query.</p>`,
    "search-no-data": `<p>Your search - "[KEYWORDS]" - did not match any result.</p>
    <p>Suggestions:</p>
    <ul>
        <li>Make sure that all words are spelled correctly.</li>
        <li>Try different keywords.</li>
        <li>Try more general keywords.</li>
        <li>Try fewer keywords.</li>
    </ul>`,
    "no-keyword": `<p>Type your keywords in the search box.</p>
    <p>Suggestions:</p>
    <ul>
        <li>Make sure that all words are spelled correctly.</li>
        <li>Try different keywords.</li>
        <li>Try more general keywords.</li>
        <li>Try fewer keywords.</li>
    </ul>`,
    "too-many-request": `<p>You have too may requests in a short period, please try again later.`
}

export const PAGE_SIZE = 30;


const LoadMoreStyles = () => <style global jsx>
    {`
    .list-load-more-button-wrapper
    {
        width: 100%;
        display: flex;
        padding: 10px 10px 30px 10px;
        justify-content: center;
    }

    .list-load-more-button
    {
       background-color: ${colorByName('blue', 700)} !important;
       border-color: ${colorByName('blue', 800)} !important;
       border-radius: 5px;
       padding: 5px 20px;
       color: #ffffff !important;
       cursor: pointer;
    }

    .list-load-more-button:hover
    {
        background-color: ${colorByName('blue', 600)} !important;
    }
`}
</style>

const LoadingStyles = () => <style global jsx>{`
    .list-loading 
    {
        width: 100%;
        display:  flex;
        margin: 10px 0px 30px;
        justify-content: center;
    }

    .list-loading span
    {
        margin-left: 10px;
    }
`}</style>

export const LoadMore = (props) => {
    const { onClick } = props;
    return <>
        <LoadMoreStyles />
        <div className="list-load-more-button-wrapper" onClick={onClick}>
            <div className="list-load-more-button">Load More</div>
        </div></>
}

export const Loading = (props) => {

    return <>
        <LoadingStyles />
        <div className="list-loading">
            <SVG src="/logo.svg" className="spinner" style={{ width: 24, height: 24 }} />
            <span>Loading data ...</span>
        </div>
    </>
}


const ListMessageStyles = () => <style global jsx>{`
    .list-message
    {
        margin-top: 30px;
        margin-bottom: 10px;
        font-size: 1rem;
        width: 100%;
    }

    .list-message-error
    {
        color: ${APPCOLORS.danger};
    }

    .list-message-info
    {
        color: ${APPCOLORS.info};
    }
`}</style>

export const MessageContent = (props) => {
    const { type, style, keywords, pageNumber, message, wrapperStyle } = props;

    if (!_.isNonEmptyString(type)) return null;

    let html = MESSAGE[type];
    if (!_.isNonEmptyString(html)) html = 'Failed to load data.';

    html = html.replace('[KEYWORDS]', keywords).replace('[PAGENUMBER]', pageNumber);

    if (_.isNonEmptyString(message)) html = `${html}<br><span style="font-size:0.8rem">${message}</span>`;

    return <>
        <ListMessageStyles />
        <div 
        className={`list-message list-message-${style}`} 
        style={wrapperStyle}
        dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
}


export const loadData = async ({ apiEndpoint, newPageNumber, skipCognito,
    query, newKeywords, pageSize, result,
    source, onStart, onFinish, isSearch }) => {

    if (_.isFunction(onStart)) onStart({ newPageNumber, newKeywords, source });
   
    let newResult = {};
    const hasKeywords = _.isNonEmptyString(newKeywords);

    try {
        const callAPIFunc = skipCognito ? callAPIBase : callAPI;

        const data = {
            pageNumber: newPageNumber,
            pageSize: _.isNumber(pageSize) ? pageSize : PAGE_SIZE
        };

        if (query) data.query = query;
        if (_.isNonEmptyString(newKeywords)) data.keywords = newKeywords;

        newResult = await callAPIFunc(apiEndpoint, data, 'POST', { skipCognito });

        newResult.data = newPageNumber == 1 ? newResult.data : _.concat(result && _.isArray(result.data) ? result.data : [], newResult && _.isArray(newResult.data) ? newResult.data : []);

        if (!newResult.data || newResult.data && newResult.data.length == 0) {
            if (isSearch) {
                newResult.error = { style: 'info', type: !hasKeywords ? 'no-keyword' : 'search-no-data' };
            }
            else {
                newResult.error = { style: 'info', type: 'list-no-data' };
            }
        }
    }
    catch (error) {
        switch (error.statusName) {
            case 'ERROR_API_TOO_MANY_REQUESTS':
                {
                    newResult.error = { style: 'info', type: 'too-many-request' };
                    break;
                }
            default: {
                newResult.error = {
                    style: 'error',
                    type: hasKeywords ? 'search-error' : _.isObject(error) && _.isNonEmptyString(error.name) ? error.name : 'list-error',
                    message: _.isNonEmptyString(error.error) ? error.error : null
                };
            }
        }
    }

    if (_.isFunction(onFinish)) onFinish(newResult);

    return newResult;
}
