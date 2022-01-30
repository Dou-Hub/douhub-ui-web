import { isNonEmptyString,  _process, _track, isObject } from 'douhub-helper-util';
import { assign, isNil } from 'lodash';
import nookies from 'nookies';
// import {  callAPIBase } from '../call-api';

export const getServerSidePropsForPage = async ( props: Record<string, any>): Promise<Record<string, any>> => {

    const { query, req, resolvedUrl,
        locale, locales, settings, pageProps
    } = props;

    const city = req.headers['CloudFront-Viewer-City'.toLowerCase()];
    let country = req.headers['CloudFront-Viewer-Country'.toLowerCase()];
    country = country ? country.toLowerCase() : '';
    country = country != 'us' && country != 'ca' ? 'us' : country;

    const countryName = req.headers['CloudFront-Viewer-Country-Name'.toLowerCase()];
    const region = req.headers['CloudFront-Viewer-Country-Region'.toLowerCase()];
    const regionName = req.headers['CloudFront-Viewer-Country-Region-Name'.toLowerCase()];
    const latitude = req.headers['CloudFront-Viewer-Latitude'.toLowerCase()];
    const longitude = req.headers['CloudFront-Viewer-Longitude'.toLowerCase()];
    const metroCode = req.headers['CloudFront-Viewer-Metro-Code'.toLowerCase()];
    const postalCode = req.headers['CloudFront-Viewer-Postal-Code'.toLowerCase()];
    const timeZone = req.headers['CloudFront-Viewer-Time-Zone'.toLowerCase()];
    const referer = req.headers['Referer'.toLowerCase()];
    const cfIsMobile = req.headers['cloudfront-is-mobile-viewer'] == 'true';
    const cfIsTablet = req.headers['cloudfront-is-tablet-viewer'] == 'true';

    const cookies = nookies.get(props);
    const slug = query && query.slug ? query.slug.toLowerCase() : '';
    const entity = query && query.entity ? query.entity.toLowerCase() : '';
    const hideHeader = props.hideHeader || query.header == 'false';
    const hideFooter = props.hideFooter || query.footer == 'false';
    const userAgent = req.headers['user-agent'];

    let host = req?.headers?.host;
    if (isNonEmptyString(host)) host = host.split(':')[0];

    const solution = props.solution;

    if (isNil(solution)) console.error('solution os not provided.');
    
    //let solution: Record<string, any> = { solutionId: settings.solutionId, host, country };
    // const currentContext = isObject(props.currentContext)?props.currentContext: await callAPIBase(
    //     getPlatformApiEndpoint(settings, 'context', ''),
    //     { solutionId: settings.solutionId }, 'GET'); //TODO: use us only for now
    // if (currentContext.type != 'error' && currentContext?.context?.solution) {
    //     solution = { ...currentContext?.context?.solution, host, country };
    // }

    const site = solution?.site?solution.site:{};
    if (!isObject(site.host)) site.host = {};
   
    solution.stage = settings.stage;
    solution.host = isNonEmptyString(site.host[host])?site.host[host]:host;
    solution.country = country;

    const passPreReleaseCode = !solution.preReleaseMode || solution.preReleaseMode && cookies && cookies['pre-release-code'] == solution.version;

    const userAgentIsMobile = isNonEmptyString(userAgent) && Boolean(userAgent.match(
        /Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i
    ));

    const userAgentIsTablet = isNonEmptyString(userAgent) && Boolean(userAgent.match(
        /iPad|WPDesktop/i
    ));

    const mobile = userAgentIsMobile && !userAgentIsTablet || cfIsMobile && !cfIsTablet;
    const tablet = userAgentIsTablet && !userAgentIsTablet || cfIsTablet && !cfIsMobile;

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
        city: isNonEmptyString(city) ? city : '',
        country: isNonEmptyString(country) ? country : '',
        countryName: isNonEmptyString(countryName) ? countryName : '',
        region: isNonEmptyString(region) ? region : '',
        regionName: isNonEmptyString(regionName) ? regionName : '',
        latitude: isNonEmptyString(latitude) ? latitude : '',
        longitude: isNonEmptyString(longitude) ? longitude : '',
        metroCode: isNonEmptyString(metroCode) ? metroCode : '',
        postalCode: isNonEmptyString(postalCode) ? postalCode : '',
        timeZone: isNonEmptyString(timeZone) ? timeZone : '',
        referer: isNonEmptyString(referer) ? referer : ''
    }

    const path = resolvedUrl.split('?')[0].split('/');
    if (isNonEmptyString(locale) && path[0].length == 0) path[0] = locale;

    

    return {
        props: assign(
            { passPreReleaseCode },
            {
                query, hideHeader, hideFooter, entity, slug, host, server: true,
                mobile, tablet, userAgent, url: req.url, context,
                locale, locales,
                path
            },
            { solution, track: _track },
            pageProps)
    }
}
