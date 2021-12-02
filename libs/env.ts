
import { useEffect, createElement } from 'react';
import { throttle } from 'lodash';
import { useEnvStore } from "douhub-ui-store";

let envCache = {
    height: 0,
    width: 0,
    scrollTop: 0,
    offsetHeight: 0
};


export const Env = (props: any) => {

    const envStore = useEnvStore({});

    const envHandler = throttle(() => {
        const env = {
            width: window.innerWidth,
            height: window.innerHeight,
            offsetHeight: document.documentElement.offsetHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollHeight: document.documentElement.scrollHeight
        }

        if (envCache.width != env.width) {
            envCache.width = env.width;
            envStore.setWidth(env.width);
            const body = window.document.getElementById('body');
            if(body) body.className = `body body-${envStore.size}`;
            console.log({ width: env.width });
        }

        if (envCache.height != env.height || envCache.scrollTop != env.scrollTop) {

            envCache.height = env.height;
            envCache.scrollTop = env.scrollTop;

            envStore.setHeight(env.height, env.offsetHeight, env.scrollTop, env.scrollHeight);
            console.log({ height: env.height, offsetHeight: env.offsetHeight, scrollTop: env.scrollTop, scrollHeight: env.scrollHeight });
        }
    }, 100);

    const scrollHandler = () => {
        envHandler();
    };

    const onBeforeUnload = () => {
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        envHandler();
        //const interval = setInterval(envHandler, 500);

        if (window.addEventListener) {
            window.addEventListener("resize", envHandler);
            window.addEventListener("scroll", scrollHandler);
            window.addEventListener("beforeunload", onBeforeUnload);
        } else {
         
            (<any>window).attachEvent("onresize", envHandler);
            (<any>window).attachEvent("onscroll", scrollHandler);
            (<any>window).attachEvent("onbeforeunload", onBeforeUnload)
            
        }

        return () => {

            if (window.removeEventListener) {
                window.removeEventListener("onresize", envHandler);
                window.removeEventListener("scroll", envHandler);
                window.removeEventListener("beforeunload", onBeforeUnload);
            } else {
                (<any>window).detachEvent("onresize", envHandler);
                (<any>window).detachEvent("onscroll", envHandler);
                (<any>window).detachEvent("onbeforeunload", onBeforeUnload);
            }

            // clearInterval(interval);
        }
    }, []);

    return createElement('div', null,'');
};
