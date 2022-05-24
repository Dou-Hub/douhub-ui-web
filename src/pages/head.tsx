import React from 'react';
import Head from 'next/head';
import { isObject } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';

const PageHead = (props: {
    noIndex?: false,
    type: 'website' | 'article',
    facebook?: {
        domainVerification?: string,
        name?: string,
        publishedOn?: Date
    },
    host?: string,
    author?: string,
    keywords?: string,
    solution: Record<string, any>,
    titleAppendSiteName?: false,
    image?: string,
    title?: string,
    description?: string,
    url: string,
    canonical?: string
}) => {

    const { noIndex,  titleAppendSiteName, url, host } = props;
    const solution = props.solution?props.solution:{};
    const site = solution?.site ? solution.site : {};
    const domain = isNonEmptyString(host) ? host : solution.host;
    const protocol = domain == 'localhost' ? 'http' : 'https';
    const type = props.type == 'website' ? 'website' : 'article';
    const author = isNonEmptyString(props.author) ? props.author : site.author;
    const siteName = site.name;
    const canonical = isNonEmptyString(props.canonical) ? props.canonical : `${protocol}://${domain}${url}`;
    const headManifestUrl = `${protocol}://${domain}`;

    let image = isNonEmptyString(props.image) ? props.image : site.image;
    if (!isNonEmptyString(image)) image = '/home.webp';
    if (image.indexOf('/') == 0) image = `${protocol}://${domain}${image}`;

    let title = isNonEmptyString(props.title) ? props.title : (site?.title ? site.title : '');
    if (title.length > 120) title = title.substring(0, 120) + ' ...';
    if (titleAppendSiteName) title = title + ` - ${site.name}`;

    let description = isNonEmptyString(props.description) ? props.description : site.description;
    if (!isNonEmptyString(description)) description = '';
    if (description.length > 150) description = description.substring(0, 150) + ' ...';


    const keywords = isNonEmptyString(props.keywords) ? props.keywords : site.keywords;
    const twitterName = isNonEmptyString(site.twitterName) ? site.twitterName : null;
    const facebook = isObject(site.facebook) ? site.facebook : props.facebook;

    const gtag = site.googleTagManagerId && `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("js", new Date());
        gtag("config", "${site.googleTagManagerId}");
    `

    return <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="msvalidate.01" content={site.bingVerifySite} />

        {
            noIndex ?
                <meta name="robots" content="noindex" /> :
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        }


        <link rel="canonical" href={canonical} />

        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}

        {twitterName && <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} key="twcard" />}
        {twitterName && <meta name="twitter:site" content={`@${twitterName}`} />}
        {author && <meta name="author" content={author} />}

        <meta property="og:locale" content="en_US" key="oglocale" />
        <meta property="og:type" content={type} key="ogtype" />
        <meta property="og:site_name" content={siteName} key="ogsitename" />
        {image && <meta property="og:image" content={image} key="ogimage" />}

        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
        <meta property="og:url" content={canonical} />


        {facebook?.domainVerification && <meta name="facebook-domain-verification" content={facebook.domainVerification} />}
        {type == 'article' && facebook?.name && <meta property="article:publisher" content={`https://www.facebook.com/${facebook.name}/`} />}
        {type == 'article' && facebook?.name && facebook?.publishedOn && <meta property="article:modified_time" content={facebook.publishedOn} />}


        {/* use tool from https://favicon.io/favicon-converter/ */}
        <link rel="icon" type="image/svg+xml" href={`${headManifestUrl}/logo.svg`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${headManifestUrl}/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${headManifestUrl}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${headManifestUrl}/favicon-16x16.png`} />


        <link rel="mask-icon" href={`${headManifestUrl}/safari-pinned-tab.svg`} color={site.tileColor ? site.tileColor : site.themeColor} />
        <meta name="msapplication-TileColor" content={site.tileColor ? site.tileColor : site.themeColor} />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />

        <link rel="manifest" href={`${headManifestUrl}/site.webmanifest`} />

        {/* 
            <link rel="alternate" hrefLang="en-ca" href={`/ca/en${props.url ? props.url : '/'}`} />
            <link rel="alternate" hrefLang="en-us" href={`/us/en${props.url ? props.url : '/'}`} /> 
            <link rel="alternate" hrefLang="x-default" href={url} />
        */}


        {/* <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries --> */}
        {`<!--[if lt IE 9]>`}
        {`  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>`}
        {`  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>`}
        {`<![endif]--></link>`}


        {site.googleTagManagerId && <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.googleTagManagerId}`}></script>}
        {gtag && <script dangerouslySetInnerHTML={{ __html: gtag }} />}
    </Head>
}

export default PageHead;