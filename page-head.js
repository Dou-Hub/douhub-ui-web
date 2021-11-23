
import Head from 'next/head';
import _ from '../../shared/util/base';
import { solution } from '../../shared/metadata/solution';

const PageHead = (props) => {

    const { noIndex, publishedOn } = props;

    const domain = _.isNonEmptyString(props.domain) ? props.domain : solution.site.domain;
    const type = props.type == 'website' ? 'website' : 'article';
    const author = _.isNonEmptyString(props.author) ? props.author : solution.site.author;
    const siteName = solution.site.name;
    const titleAppendSiteName = props.titleAppendSiteName != false;
    let image = _.isNonEmptyString(props.image)?props.image:solution.site.image;
    if (!_.isNonEmptyString(image)) image = '/home.webp';
    if (image.indexOf('/')==0) image = `https://${domain}${image}`;

    let title = _.isNonEmptyString(props.title) ? props.title : solution.site.title;
    if (title.length > 120) title = title.substring(0, 120) + ' ...';
    if (titleAppendSiteName) title = title + ` - ${solution.site.name}`;
   
    let description = _.isNonEmptyString(props.description) ? props.description : solution.site.description;
    if (!_.isNonEmptyString(description)) description = '';
    if (description.length > 150) description = description.substring(0, 150) + ' ...'
   
   
    const keywords = _.isNonEmptyString(props.keywords) ? props.keywords : solution.site.keywords;

    const twitterName = _.isNonEmptyString(solution.site.twitterName) ? solution.site.twitterName : null;
    const facebookDomainVerification = _.isNonEmptyString(solution.site.facebookDomainVerification) ? solution.site.facebookDomainVerification : null;
    const facebookName = _.isNonEmptyString(solution.site.facebookName) ? solution.site.facebookName : null;

    const url = `https://${domain}${_.isNonEmptyString(props.url) ? props.url : ''}`;

    const gtag = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("js", new Date());
        gtag("config", "${solution.site.googleTagManagerId}");
    `

    return <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="msvalidate.01" content={solution.site.bingVerifySite} />
        
        {
            noIndex ?
                <meta name="robots" content="noindex" /> :
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        }


        {url && <link rel="canonical" href={url} />}

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
        {url && <meta property="og:url" content={url} />}


        {facebookDomainVerification && <meta name="facebook-domain-verification" content={facebookDomainVerification} />}
        {type == 'article' && facebookName && <meta property="article:publisher" content={`https://www.facebook.com/${facebookName}/`} />}
        {type == 'article' && facebookName && publishedOn && <meta property="article:modified_time" content={publishedOn} />}


        {/* use tool from https://favicon.io/favicon-converter/ */}
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

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


        <script async src={`https://www.googletagmanager.com/gtag/js?id=${solution.site.googleTagManagerId}`}></script>
        <script dangerouslySetInnerHTML={{ __html: gtag }} />

    </Head>
}

export default PageHead;