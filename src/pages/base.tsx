
import React from 'react';
import { EnvCenter, MessageCenter } from "douhub-ui-store";
import Head from './head';
import { _window, _track } from "../util";

const PageBase = (props: Record<string, any>) => {

    const { solution} = props;
    const Header = props.Header ? props.Header : ()=><></>;
    const Footer = props.Footer ? props.Footer : ()=><></>;
    const Body = props.Body ? props.Body : ()=><></>;
    _window.solution = solution;
    const sharedProps = { solution };
  
    return <div id="body">
        <Head type="website" url="/" {...sharedProps} />
        <EnvCenter />
        <MessageCenter />
        <Header {...sharedProps} />
        <Body {...sharedProps} />
        {props.children}
        <Footer {...sharedProps} />
    </div>
};

export default PageBase
