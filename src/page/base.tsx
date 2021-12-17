
import React from 'react';
import { EnvCenter, MessageCenter } from "douhub-ui-store";
import Head from './head';

const PageBase = (props: Record<string, any>) => {

    const { solution} = props;
    const Header = props.Header ? props.Header : ()=><></>;
    const Footer = props.Footer ? props.Footer : ()=><></>;
    const Body = props.Body ? props.Body : ()=><></>;

    const sharedProps = { solution };
  
    return <div id="body">
        <Head type="website" url="/" {...sharedProps} />
        <EnvCenter />
        <MessageCenter />
        <Header {...sharedProps} />
        <Body {...sharedProps} />
        <Footer {...sharedProps} />
    </div>
};

export default PageBase
