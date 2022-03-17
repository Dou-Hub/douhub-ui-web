import { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import { solution } from '../../../shared/metadata/solution';
import { DefaultSideArea } from './base';
import { MessageContent, PAGE_SIZE, loadData, LoadMore, Loading } from './list-helper';
import StackGrid from "react-stack-grid";
import { numberWithCommas } from '../../../shared/util/format';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Div from '../controls/div';
import SearchPageCSS from './search-css';
import ReactResizeDetector from 'react-resize-detector';
import {SVG} from 'douhub-ui-web-basic';

const apiEndpoint = `${solution.apis.search}search-web-product-page`;
const autoLoadMore = true;


const getColsCount = (size) => {
    let colsCount = 5;
    switch (size) {
        case 'xs':
            {
                colsCount = 2;
                break;
            }
        case 's':
            {
                colsCount = 3;
                break;
            }
        case 'm':
            {
                colsCount = 4;
                break;
            }
        case 'l':
            {
                colsCount = 4;
                break;
            }
        default:
            {
                break;
            }
    }


    return colsCount;
}

export const getServerSideProps = async (props) => {
    const { query } = props;
    const keywords = _.isNonEmptyString(query.q) ? query.q : '';
    let result = { total: 0, data: [] };
    let error = null;

    result = await loadData({
        isSearch: true,
        pageSize: PAGE_SIZE,
        apiEndpoint,
        newKeywords: keywords,
        newPageNumber: 1,
        skipCognito: true,
        result
    });

    if (result.error) {
        error = _.clone(result.error);
        result = { total: 0, data: [] };
    }

    if (result.error) {
        error = _.clone(result.error);
        result = { total: 0, data: [] };
    }

    return { result, keywords, header: { keywords }, error }

}

export const MainArea = (props) => {

    const { env, server } = props;
    
    const size = env.size;
    let [keywords, setKeywords] = useState(props.keywords);
    let [pageNumber, setPageNumber] = useState(1);
    let [loading, setLoading] = useState(false);

    const [result, setResult] = useState(props.result);
    const [error, setError] = useState(props.error);
    const [width, setWidth] = useState(0);
    const { total, data } = result;
    const colsCount = getColsCount(size);
  
    const getSectionData = (data) => {

        return _.map(data, (r) => {
            let content = '';
            let title = r.display;
            const text = r.display;
            if (_.isObject(r.highlight)) {

                if (_.isArray(r.highlight.searchContent) && r.highlight.searchContent.length > 0) {
                    content = r.highlight.searchContent[0];
                }

                if (_.isArray(r.highlight.searchDisplay) && r.highlight.searchDisplay.length > 0) {
                    if (!_.isNonEmptyString(content)) {
                        content = r.highlight.searchDisplay[0];
                    }
                    else {
                        title = r.highlight.searchDisplay.length == 1 ? r.highlight.searchDisplay[0] : title;
                    }

                }
            }
            if (!_.isNonEmptyString(content)) 
            {
                content = _.isNonEmptyString(r.abstract)?r.abstract:'';
                if (content.length>64) content = `${content.substring(0, 96)} ...`;
            }
            return { id: r.id, title, text, abstract: r.abstract, url: r.canonical, media: r.media, prevPrice: r.prevPrice, currentPrice: r.currentPrice, currency: r.currency, content };
        });
    }

    const [sectionData, setSectionData] = useState(getSectionData(data));

    const updateSectionData = (newData) => {
        const newSectionData = getSectionData(newData);
        //console.log({newSectionData})
        setSectionData(newSectionData);
        if (_.isFunction(props.onSendToSideArea)) props.onSendToSideArea({ sections: [newSectionData] });
    }

    const onStart = (props) => {
        const { newPageNumber, newKeywords } = props;
        loading = true;
        setLoading(true);
        if (!_.isNil(newPageNumber) && newPageNumber != pageNumber) {
            pageNumber = newPageNumber;
            setPageNumber(newPageNumber);
        }
        if (!_.isNil(newKeywords) && newKeywords != keywords) {
            keywords = newKeywords;
            setKeywords(newKeywords);
        }
        setError(null);
    };

    const onLoadMore = () => {
       loadData(
            {
                search: true,
                apiEndpoint, pageSize: PAGE_SIZE,
                newPageNumber: pageNumber + 1,
                newKeywords: keywords, result,
                skipCognito: true,
                onStart, onFinish
            }
        );
    }

    const onAutoLoadMore = _.throttle(() => {
        //console.log({offsetToBottom: env && env.offsetToBottom, footerHeight: env && env.footerHeight, total, data})
        if (!server && env && env.scrollTop > 0 & env.offsetToBottom < env.footerHeight + 100 && data.length < total && !loading) {

            //window.scrollTo(0, env.scrollTop - env.footerHeight - 200);
            onLoadMore();
            //if (newResult.total == result.total) setTimeout(() => window.scrollTo(0, env.scrollHeight), 1000);
        }
    }, 3000);

    const onSearch = _.debounce((newKeywords) => {
        (async () => {
            await loadData(
                {
                    isSearch: true,
                    apiEndpoint, pageSize: PAGE_SIZE,
                    newPageNumber: 1, newKeywords, result: { total: 0, data: [] },
                    skipCognito: true,
                    onStart, onFinish
                });
        })()
    }, 200);

    const onFinish = (newResult) => {
        setLoading(false);
        if (newResult.error) {
            setError(newResult.error);
        }
        else {
            setResult(newResult);
            updateSectionData(newResult.data);
        }
    }

    useEffect(() => {
        (async () => {
            if (!autoLoadMore) return;
            await onAutoLoadMore(pageNumber + 1);
        })();
    }, [env && env.scrollTop, env && env.offsetToBottom]);


    useEffect(() => {
        const newKeywords = props.keywords;
        if (keywords != newKeywords) {
            window.scrollTo(0, 0);
            setResult({ total: 0, data: [] });
            updateSectionData([]);
            onSearch(newKeywords);
        }
    }, [props.keywords]);

    // useEffect(() => {
    //     updateSectionData(data);
    // }, []);

    const openPage = (item) => {

    }

    const onResize = (newWidth) => {
        setWidth(newWidth);
    }

    const onClickItem = (curItem)=>{
        window.open(curItem.url);
    }

    const renderResult = () => {
        
         if (sectionData.length == 0 || error || !server && _.isNil(size)) return null;

        const pFontSize = `${0.7 + 0.3 / colsCount}rem`;
        const buttonFontSize = `${0.8 + 0.3 / colsCount}rem`;
        const h3FontSize = `${0.9 + 0.4 / colsCount}rem`;

        const gutter = colsCount * 6 - 2;
        const columnWidth = (width - gutter) / colsCount - gutter;

        //console.log({ width, colsCount, columnWidth })

        let Wrapper = width > 0 && !server ? StackGrid : Div;
        const wrapperProps = width > 0 ? {
            columnWidth,
            className: "search-page-grid",
            style: { marginTop: gutter, marginBottom: gutter, paddingLeft: gutter, paddingRight: gutter },
            gutterWidth: gutter,
            gutterHeight: gutter
        } : {};

       
        return <>
            <SearchPageCSS />
            <ReactResizeDetector onResize={onResize} />
            {_.isNonEmptyString(props.title) && <h1 className="search-page-title" style={{paddingLeft: gutter, paddingRight: gutter}}>{props.title}</h1>}
            <Wrapper {...wrapperProps}>
                {_.map(sectionData, (item, i) => {
                    return <div key={item.id} id={`search-item-${item.id}`} className="item" onClick={()=>onClickItem(item)}>

                        {_.isNonEmptyString(item.media) && <div
                            className="media"
                            onClick={() => openPage(item)}
                        >
                            <LazyLoadImage className="media" src={item.media} alt={item.text} title={item.text} />
                        </div>}
                        <div className="info" style={{ paddingBottom: gutter }}>
                            <h3
                                title={item.url}
                                style={{ fontSize: h3FontSize }}
                                onClick={() => openPage(item)}
                                dangerouslySetInnerHTML={{ __html: item.title }} />
                            <p
                                className="content"
                                style={{ fontSize: pFontSize, marginBottom: pFontSize }}
                                onClick={() => openPage(item)}
                                dangerouslySetInnerHTML={{ __html: item.content }}></p>
                            <div className="buttons">
                                {_.isNumber(item.currentPrice) ? <div
                                    type="dashed"
                                    className="button"
                                    size="small"
                                    onClick={() => openPage(item)}
                                    style={{ fontSize: buttonFontSize }}>
                                    <div className="price">{item.currency} ${numberWithCommas(item.currentPrice)}</div>
                                    <SVG src="/icons/buy.svg" className="shop"/>
                                </div> : <div className="button-ph"></div>}
                                {/* {supportRecordEdit && <ReactSVG src="/icons/edit.svg" className="button-edit" />} */}
                            </div>
                        </div>
                    </div>
                })}
            </Wrapper>
        </>
    }

    const onDeleteRecord = (id) => {
        result.data = _.without(_.map(result.data, (r) => _.sameGuid(r.id, id) ? null : r), null);
        result.total--;
        setResult(result);
        updateSectionData(result.data);
    }

    return <>
        {renderResult()}
        {!autoLoadMore && !loading && <LoadMore onClick={onLoadMore} />}
        {loading && !error && <Loading />}
        <MessageContent {...error} keywords={keywords} pageNumber={pageNumber} wrapperStyle={{padding:'0 20px;'}}/>
    </>
}

export const getPageContent = (data) => {
    let content = '';
    
    _.each(data, (item) => {
        if (item) {

            if (_.isNonEmptyString(item.display)) content = `${content} ${item.display}`;
            if (_.isNonEmptyString(item.abstract)) content = `${content} ${item.abstract}`;
        }
    })

    return content;
}


export const SideArea = (props) => {
    const { result } = props;
    return <DefaultSideArea {...props} content={getPageContent(result.data)} />
}

export default { SideArea, MainArea, getServerSideProps }