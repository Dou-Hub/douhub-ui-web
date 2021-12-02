import _ from '../../../shared/util/base';
import TagsFromSections from '../sections/tags-from-content';
import TagsFromHistory from '../sections/tags-from-history';
import dynamic from 'next/dynamic';
import Sys404 from './sys/404';
import { getUI } from '../../metadata/ui';
import { solution } from '../../../shared/metadata/solution';
import { getBaseDomain } from '../../../shared/util/web';
import nookies from 'nookies';

let pages = {};

const getCurSlug = (slug, supportedSlugs, defaultSlug) => {
    const supportedSlug = supportedSlugs[slug.toLowerCase()];
    return _.isObject(supportedSlug) && supportedSlug.hasPage ? slug.toLowerCase() : defaultSlug;
}

export const getPageMetadata = (props, supportedSlugs, defaultPage) => {
    if (!_.isNonEmptyString(defaultPage)) defaultPage = '404';
    const ui = getUI(props);
    let slug = props.slug;
    let metadata = "";
    if (_.isNonEmptyString(slug)) {
        metadata = supportedSlugs[slug.toLowerCase()];
    }
    return _.isObject(metadata) ? metadata : ui.pages[defaultPage];
}

export const getPageFront = (props, supportedSlugs, defaultSlug) => {

    const { slug } = props;

    const curSlug = getCurSlug(slug, supportedSlugs, defaultSlug);
    if (!_.isNonEmptyString(curSlug)) return Sys404;


    const path = props.path.join('/').replace(slug, '');

    const pageKey = `front-${path.replace(/\//g, '-')}-${curSlug.replace(/\//g, '-')}`;

    let pageFront = pages[pageKey];
    if (pageFront) return pageFront;

    pageFront = {}
    try {
        pageFront.MainArea = dynamic(() => import(`.${path.toLowerCase()}${curSlug}`).then((mod) => mod.MainArea), { ssr: false });
        pageFront.SideArea = dynamic(() => import(`.${path.toLowerCase()}${curSlug}`).then((mod) => mod.SideArea), { ssr: false });
        pages[pageKey] = pageFront;
    }
    catch (err) {
        error.err(err);
        pageFront = Sys404;
    }
    return pageFront;
}

export const getPageServer = async (props, supportedSlugs, defaultSlug) => {

    const { query, resolvedUrl } = props;

    const slug = _.isNonEmptyString(query.slug) ? query.slug.toLowerCase() : '';
    const curSlug = getCurSlug(slug, supportedSlugs, defaultSlug);

    if (!_.isNonEmptyString(curSlug)) return Sys404.getServerSideProps;

    const path = resolvedUrl.replace(query.slug, '');

    const pageKey = `server-${path.replace(/\//g, '-')}-${curSlug.replace(/\//g, '-')}`;
    let pageServer = pages[pageKey];
    if (pageServer) return pageServer;

    try {
        const page = await import(`.${path.toLowerCase()}${curSlug}`);
        if (page && _.isFunction(page.getServerSideProps)) {
            pageServer = page.getServerSideProps;
        }
        else {
            pageServer = () => { };
        }
        pages[pageKey] = pageServer;
    }
    catch (error) {
        console.error(error);
        pageServer = Sys404.getServerSideProps;
    }

    return pageServer;
}

export const getServerSidePropsByPage = async (props, getServerSidePropsFromPage) => {

    const { query, req, resolvedUrl } = props;
    const cookies = nookies.get(props);
    const slug = _.isNonEmptyString(query.slug) ? query.slug.toLowerCase() : '';
    const entity = _.isNonEmptyString(query.entity) ? query.entity.toLowerCase() : '';
    const hideHeader = props.hideHeader || query.header == 'false';
    const hideFooter = props.hideFooter || query.footer == 'false';
    const userAgent = req.headers['user-agent'];

    let host = req.headers.host;
    if (host.indexOf('localhost') >= 0 && _.isNonEmptyString(query.domain)) host = query.domain;
    if (_.isNonEmptyString(host)) host = host.split(':')[0];
    if (host.indexOf('.amazonaws.com')>0 && _.isNonEmptyString(solution.site.host[host]))
    {
        host = solution.site.host[host];
    }
    if (_.isNonEmptyString(host) && host!='localhost') host = getBaseDomain(host);
    
    const passPreReleaseCode = !solution.preReleaseMode || solution.preReleaseMode && cookies && cookies['pre-release-code'] == solution.version;


    const cfIsMobile = req.headers['cloudfront-is-mobile-viewer'] == 'true';
    const cfIsTablet = req.headers['cloudfront-is-tablet-viewer'] == 'true';

    const userAgentIsMobile = _.isNonEmptyString(userAgent) && Boolean(userAgent.match(
        /Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i
    ));


    const userAgentIsTablet = _.isNonEmptyString(userAgent) && Boolean(userAgent.match(
        /iPad|WPDesktop/i
    ));

    const mobile = userAgentIsMobile && !userAgentIsTablet || cfIsMobile && !cfIsTablet;
    const tablet = userAgentIsTablet && !userAgentIsTablet || cfIsTablet && !cfIsMobile;

    const city = req.headers['CloudFront-Viewer-City'.toLowerCase()];
    const country = req.headers['CloudFront-Viewer-Country'.toLowerCase()];
    const countryName = req.headers['CloudFront-Viewer-Country-Name'.toLowerCase()];
    const region = req.headers['CloudFront-Viewer-Country-Region'.toLowerCase()];
    const regionName = req.headers['CloudFront-Viewer-Country-Region-Name'.toLowerCase()];
    const latitude = req.headers['CloudFront-Viewer-Latitude'.toLowerCase()];
    const longitude = req.headers['CloudFront-Viewer-Longitude'.toLowerCase()];
    const metroCode = req.headers['CloudFront-Viewer-Metro-Code'.toLowerCase()];
    const postalCode = req.headers['CloudFront-Viewer-Postal-Code'.toLowerCase()];
    const timeZone = req.headers['CloudFront-Viewer-Time-Zone'.toLowerCase()];
    const referer = req.headers['Referer'.toLowerCase()];

    if (!passPreReleaseCode && slug != 'pre-release-code') {

        //in the case of having a key passed from query string, we can check the key here
        //this is for Google Insight Call to dev
        const queryPreReleaseCode = query['pre-release-code'];
        if (solution.version == queryPreReleaseCode) {
            nookies.set(props, 'pre-release-code', solution.version);
        }
        else {
            return {
                redirect: {
                    destination: `/pre-release-code`,
                    permanent: false
                },
            }
        }
    }

    //get the user context
    const context = {
        // headers: req.headers,
        city: _.isNonEmptyString(city) ? city : '',
        country: _.isNonEmptyString(country) ? country : '',
        countryName: _.isNonEmptyString(countryName) ? countryName : '',
        region: _.isNonEmptyString(region) ? region : '',
        regionName: _.isNonEmptyString(regionName) ? regionName : '',
        latitude: _.isNonEmptyString(latitude) ? latitude : '',
        longitude: _.isNonEmptyString(longitude) ? longitude : '',
        metroCode: _.isNonEmptyString(metroCode) ? metroCode : '',
        postalCode: _.isNonEmptyString(postalCode) ? postalCode : '',
        timeZone: _.isNonEmptyString(timeZone) ? timeZone : '',
        referer: _.isNonEmptyString(referer) ? referer : ''
    }

    //console.log({passPreReleaseCode})
    const baseProps = { query, hideHeader, hideFooter, entity, slug, host, server: true, mobile, tablet, userAgent, url: req.url, context, path: resolvedUrl.split('?')[0].split('/') };
    const pageProps = getServerSidePropsFromPage ? await getServerSidePropsFromPage({ ...props, ...baseProps }) : {};
    return { props: _.assign({ passPreReleaseCode }, baseProps, pageProps) }
}


export const DefaultSideArea = (props) => {
    const { content } = props;
    return <>
        <TagsFromSections {...props} trackHistory={true} content={content} title="Tags" format="capital-all" />
        <TagsFromHistory {...props} trackHistory={true} title="History" format="capital-all" allowDelete={true} />
    </>
}

// export default { renderMainArea, renderSideArea, getServerSideProps };
