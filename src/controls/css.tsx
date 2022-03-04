import React, {useEffect, useState} from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { _window } from '../util';

const CSS = (props: Record<string,any>) => {

    const { id, content } = props;
    const [display, setDisplay] = useState(false);
    useEffect(() => {
        if (isNonEmptyString(id) && !_window.document.getElementById(id)) {
            setDisplay(true);
        }
    },[])

    return display && isNonEmptyString(content)?
        <style id={id}>{content}</style> :
        <></>
}


CSS.displayName = 'CSS';
export default CSS;