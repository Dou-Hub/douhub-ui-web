import React, { useEffect, useState } from 'react';
import _ from '../../shared/util/base';
import { setWebQueryValue, getWebQueryValue } from '../../shared/util/data';
import PageHeaderCSS from './page-header-css';
import Search from './page-header-search';
// import { solution } from '../../shared/metadata/solution';
// import { callAPI } from '../util/web';
import PageHeaderUser from './page-header-user';
import { signOut, goodCurrentPoolUser } from '../util/authentication';
import SVG from './controls/svg';
import { addHistory } from './sections/tags-from-history';
import dynamic from 'next/dynamic';
import { logDynamic } from './controls/base';
import { getItem, setItem } from '../util/local-db';
import { solution } from '../../shared/metadata/solution';

const DISPLAY_NAME = 'PageHeader';

let Drawer = null;
let SignIn = null;
let SignUp = null;
let CreateNewPageButton = null;
// let PageHeaderUser = null;

const PageHeader = React.forwardRef((props, ref) => {
   
    const { hide, server, user, slug, mobile, env } = props;

    const [keywords, setKeywords] = useState(props.keywords);
    const [showDrawer, setShowDrawer] = useState(false);
    const [signIn, setSignIn] = useState(null);
    const [signUp, setSignUp] = useState(null);
    const isLargeSize = env.size=='xl' || env.size=='l';
    const isSearchPage = slug=='search-product' || slug=='search-page' ;
    const [entity, setEntity] = useState(slug == 'search-page' ? 'page' : 'product');

    useEffect(() => {
        (async () => {
            const verificationCode = getWebQueryValue(`${window.location}`, 'verification-code');
            if (_.isNonEmptyString(verificationCode)) {
                if (!await goodCurrentPoolUser()) {
                    const email = getWebQueryValue(`${window.location}`, 'email');
                    setSignIn({ verificationCode, email });
                }
            }
            setEntity(_.isNonEmptyString(props.entity) ? (props.entity == 'page' ? 'page' : 'product') : getItem('search-entity', 'product'));
        })();
    }, [process.browser]);

    useEffect(() => {
        setKeywords(props.keywords);
    }, [props.keywords]);


    const renderCreateNewPageButton = (source) => {
        if (!CreateNewPageButton) CreateNewPageButton = logDynamic(dynamic(() => import('./controls/create-new-button'), { ssr: false }),
            './controls/create-new-button',
            DISPLAY_NAME);
        //console.log(`render CreateNewPageButton from ${source}`)
        return <CreateNewPageButton user={user} onCreatePage={onClickSignIn} />
    }

    const goHome = () => {
        window.location = '/';
    }

    const onClickMenu = () => {
        setShowDrawer(true);
    }

    const onCloseDrawer = () => {
        setShowDrawer(false);
    }

    const onClickSignOut = () => {
        (async () => {
            await signOut();
            window.location = '/';
        })();
    }


    const onClickSignIn = () => {
        setShowDrawer(false);
        setSignIn({});
    }

    const onClickSignUp = () => {
        setShowDrawer(false);
        setSignIn(null);
        setSignUp({});
    }

    const onCancelSignIn = () => {
        setSignIn(null);
    }

    const onCancelSignUp = () => {
        setSignUp(null);
    }

    const onClickUser = () => {
        if (!user) {
            onClickSignIn();
        }
    }

    const onSubmitSearch = (keywords) => {
        addHistory({ text: keywords });
        window.location = setWebQueryValue(`/search/${entity == 'page' ? 'page' : 'product'}`, 'q', keywords);
    }

    const onChangeKeywords = (newKeywords) => {
        setKeywords(newKeywords);
    }

    const onChangeEntity = (newEntity) => {
        setItem('search-entity', newEntity);
        if (_.isNonEmptyString(keywords)) {
            window.location = setWebQueryValue(`/search/${newEntity == 'page' ? 'page' : 'product'}`, 'q', keywords);
        }
        else {
            setEntity(newEntity);
        }
    }

    const renderSignIn = () => {
        if (!signIn) return null;
        if (!SignIn) SignIn = logDynamic(dynamic(() => import('./controls/auth-sign-in'), { ssr: false }), './controls/auth-sign-in',
            DISPLAY_NAME);
        return <SignIn onClose={onCancelSignIn} onClickSignUp={onClickSignUp} data={signIn} />
    }

    const renderSignOut = () => {
        if (!signUp) return null;
        if (!SignUp) SignUp = logDynamic(dynamic(() => import('./controls/auth-sign-up'), { ssr: false }), './controls/auth-sign-up',
            DISPLAY_NAME);
        return <SignUp onClose={onCancelSignUp} />
    }

    const onClickList = (slug)=>{
        window.location = `/list/${slug}`;
    }

    const onClickHome = ()=>{
        window.location = `/`;
    }

    const renderDrawer = () => {
        if (!showDrawer) return null;
        if (!Drawer) Drawer = logDynamic(dynamic(() => import('./controls/antd/drawer'), { ssr: false }), './controls/antd/drawer',
            DISPLAY_NAME);
        return <Drawer
            width={320}
            className="header-drawer"
            placement="left"
            closable={true}
            onClose={onCloseDrawer}
            visible={showDrawer}
        >
            {renderCreateNewPageButton('drawer')}

            {!user && <div className="item section-start" onClick={onClickSignIn}>Sign In</div>}
            {!user && <div className="item" onClick={onClickSignUp}>Sign Up</div>}

            {user && user.id==solution.ownedBy && <div className="item section-start section-end" onClick={onClickHome}>Home</div>}

            {user && user.id==solution.ownedBy && <div className="item section-start" onClick={()=>onClickList('web-feed-product')}>Manage Product Feeds</div>}
            {user && user.id==solution.ownedBy && <div className="item section-end" onClick={()=>onClickList('web-feed-article')}>Manage Article Feeds</div>}
            {user && user.id==solution.ownedBy && <div className="item section-start" onClick={()=>onClickList('page')}>Manage Pages</div>}
            {user && user.id==solution.ownedBy && <div className="item section-end" onClick={()=>onClickList('bookmark')}>Manage Bookmarks</div>}
            {/* <div className="item" onClick={onClickKnowledge}>Knowledge</div> */}
            {user && <div className="item section-start" onClick={onClickSignOut}>Sign Out</div>}
        </Drawer>
    }

    const renderUser = () => {
        // if (size == 'xs' || server) return null;
        // if (!PageHeaderUser) PageHeaderUser = logDynamic(dynamic(() => import('./page-header-user'), { ssr: false }), './page-header-user', DISPLAY_NAME);
        return <PageHeaderUser
            key="user-icon"
            user={user}
            hide={hide}
            avatarStyle={{ borderRadius: 5 }}
            size={isLargeSize ? 50 : 40}
            onClick={onClickUser}
            onClickSignOut={onClickSignOut}
        />
    }

    const scroll = env && _.isNumber(env.scrollTop) ? env.scrollTop > 0 : false;
    return (
        hide ? renderUser() : <>
            <PageHeaderCSS />
            <div ref={ref} className={`header-wrapper header-wrapper-scroll-${scroll}`}>
                <div className="header">

                    {!server && <SVG src="/icons/menu-squared.svg" className="menu-icon" onClick={onClickMenu} />}

                    <div className="logo" onClick={goHome}>
                        <SVG className="logo-icon" src="/logo.svg" />
                        <div className="logo-text-wrapper">
                            <div className="logo-text-1">{solution.site.name}</div>
                            <div className="logo-text-2">{solution.site.title}</div>
                        </div>
                    </div>

                    <div className="logo-ph"></div>

                    <Search
                        isLargeSize = {isLargeSize}
                        autoFocus={isSearchPage && !mobile}
                        keywords={keywords}
                        entity={entity}
                        onChangeEntity={onChangeEntity}
                        onChange={onChangeKeywords}
                        onSubmit={onSubmitSearch}
                    />

                    {isLargeSize && renderCreateNewPageButton('header')}

                    {renderUser()}
             
                </div>
            </div>
            {renderDrawer()}
            {renderSignIn()}
            {renderSignOut()}
        </>
    )
});


PageHeader.displayName = DISPLAY_NAME;
export default PageHeader;