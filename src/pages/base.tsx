
import React from 'react';
import { EnvCenter, MessageCenter } from "douhub-ui-store";
import Head from './head';
import { _window, _track } from "douhub-ui-web-basic";

const PageBase = (props: Record<string, any>) => {

    const { solution } = props;
    const Header = props.Header ? props.Header : () => <></>;
    const Footer = props.Footer ? props.Footer : () => <></>;
    const Body = props.Body ? props.Body : () => <></>;
    _window.solution = solution;
    const sharedProps = { solution };

    return <div id="body">
        <Head type="website" url="/" {...sharedProps}  {...props.headProps}/>
        <EnvCenter />
        <MessageCenter />
        <Header {...sharedProps} {...props.headerProps}/>
        <Body {...sharedProps} {...props.bodyProps} />
        {props.children}
        <Footer {...sharedProps} {...props.footerProps} />
    </div>
};

export default PageBase
