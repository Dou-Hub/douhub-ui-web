
import React from 'react';
import { EnvCenter, MessageCenter } from "douhub-ui-store";
import Head from './head';

const PageBase = (props: Record<string, any>) => {

    const { solution, children } = props;
    const Header = props.Header ? props.Header : ()=><></>;
    const Footer = props.Footer ? props.Footer : ()=><></>;

    const sharedProps = { solution };
  
    return <div id="body">
        <Head type="website" url="/" {...sharedProps} />
        <EnvCenter />
        <MessageCenter />
        <Header {...sharedProps} />
        {children}
        <Footer {...sharedProps} />
    </div>
};

export default PageBase
