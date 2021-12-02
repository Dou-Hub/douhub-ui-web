
import React from 'react';
import _ from '../../../shared/util/base';
export const Text = (props) => {
    const { html } = props;
    return _.isNonEmptyString(html) ?
        <div {...props} html="" dangerouslySetInnerHTML={{ __html: html }}></div> :
        <div {...props}>{props.children}</div>
};

export const View = (props) => {
    return <div {...props} style={_.style({ display: 'flex', flexDirection: 'row' }, props.style)}>{props.children}</div>;
};

export const logDynamic = (object, url, name) => {
    if (_.isNonEmptyString(name)) {
        console.log(`Dynamic load ${url} ${name}`);
    }
    else {
        console.log(`Dynamic load ${url}`);
    }
    return object;
}
