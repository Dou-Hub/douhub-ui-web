
import React from 'react';
import {isFunction} from 'lodash';
import {Recaptcha, getRecaptchaToken as getRecaptchaTokenFromControl} from 'douhub-ui-web-basic';

export const getRecaptchaToken = (id: string) => {
    return getRecaptchaTokenFromControl(id);
}

const RecaptchaField = (props: Record<string,any>) => {

    const { id } = props;

    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }

    return <div className="field field-recaptcha" onClick={onClick}>
        <Recaptcha id={id} />
    </div>
};

export default RecaptchaField;
