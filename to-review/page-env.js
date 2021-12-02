
import { useEffect } from 'react';
import _ from '../../shared/util/base';
import { callAPI } from '../util/web';
import { solution } from '../../shared/metadata/solution';

const getSize = (mobile) => {
    let size = mobile ? 'xs' : 'l';
    if (process.browser) {
        const width = window.innerWidth;
        if (width >= 1200 && width <= 3600) size = 'xl';
        if (width >= 992 && width <= 1199) size = 'l';
        if (width >= 768 && width <= 991) size = 'm';
        if (width >= 576 && width <= 767) size = 's';
        if (width >= 0 && width <= 575) size = 'xs';
    }

    return size;
}

const PageEnv = (props) => {

    const { hideHeader, hideFooter, headerRef, footerRef, mobile } = props;


    const onEnvUpdated = (newEnv) => {
        if (_.isFunction(props.onEnvUpdated)) props.onEnvUpdated(newEnv);
    }

    const onUserUpdated = (newUser) => {
        if (_.isFunction(props.onUserUpdated)) props.onUserUpdated(newUser);
    }

    const messageHandler = (e) => {

        const data = e && e.data;
        const action = data && data.action;
        if (!_.isNonEmptyString(action)) return;

        const user = data.user;

        //setLatestAction(data);

        switch (action) {
            case 'user-session-off':
                {
                    onUserUpdated(null);
                    break;
                }
            case 'user-session-on':
                {
                    //try to retrieve user 
                    (async () => {
                        const userProfile = await callAPI(`${solution.apis.auth}current-user`, null, 'GET');
                        onUserUpdated(userProfile);
                    })();
                    break;
                }
            case 'user-profile-update':
                {
                    onUserUpdated(user);
                    break;
                }
        }

    }


    const envHandler = _.debounce((auto) => {

        const headerHeight = hideHeader ? 0 : (headerRef && headerRef.current && _.isFunction(headerRef.current.getBoundingClientRect) ? headerRef.current.getBoundingClientRect().height : 81);
        const footerHeight = hideFooter ? 0 : (footerRef && footerRef.current && _.isFunction(footerRef.current.getBoundingClientRect) ? footerRef.current.getBoundingClientRect().height : 41);

        const prevEnv = window.env;

        const env = {
            headerHeight,
            footerHeight,
            width: window.innerWidth,
            height: window.innerHeight,
            // scrollY: window.scrollY,
            offsetHeight: document.documentElement.offsetHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollHeight: document.documentElement.scrollHeight,
            offsetToBottom: document.documentElement.offsetHeight - window.innerHeight - document.documentElement.scrollTop,
            size: getSize(),
            mobile
        }

        if (_.isNil(prevEnv) || !_.isNil(prevEnv) && JSON.stringify(prevEnv) != JSON.stringify(env)) {
            window.env = env;
            window.document.getElementById('body').className = `body body-${env.size} body-${env.mobile ? 'mobile' : 'desktop'}`;
            onEnvUpdated(env);
        }

    }, 300);

    const scrollHandler = () => {
        envHandler();
    };

    const onBeforeUnload = () => {
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        envHandler();
        const interval = setInterval(envHandler, 500);

        if (window.addEventListener) {
            window.addEventListener("resize", envHandler);
            window.addEventListener("message", messageHandler);
            window.addEventListener("scroll", scrollHandler);
            window.addEventListener("beforeunload", onBeforeUnload);
        } else {
            window.attachEvent("onresize", envHandler);
            window.attachEvent("onmessage", messageHandler);
            window.attachEvent("onscroll", scrollHandler);
            window.attachEvent("onbeforeunload", onBeforeUnload)
        }

        return () => {

            if (window.removeEventListener) {
                window.removeEventListener("onresize", envHandler);
                window.removeEventListener("message", messageHandler);
                window.removeEventListener("scroll", envHandler);
                window.removeEventListener("beforeunload", onBeforeUnload);
            } else {
                window.detachEvent("onresize", envHandler);
                window.detachEvent("onmessage", messageHandler);
                window.detachEvent("onscroll", envHandler);
                window.detachEvent("onbeforeunload", onBeforeUnload);
            }

            clearInterval(interval);
        }
    }, []);

    return <></>
}

PageEnv.displayName = 'PageEnv';
export default PageEnv;