//  COPYRIGHT:       PrimeObjects Software Inc. (C) 2021 All Right Reserved
//  COMPANY URL:     https://www.primeobjects.com/
//  CONTACT:         developer@primeobjects.com
//
//  This source is subject to the PrimeObjects License Agreements.
//
//  Our EULAs define the terms of use and license for each PrimeObjects product.
//  Whenever you install a PrimeObjects product or research PrimeObjects source code file, you will be prompted to review and accept the terms of our EULA.
//  If you decline the terms of the EULA, the installation should be aborted and you should remove any and all copies of our products and source code from your computer.
//  If you accept the terms of our EULA, you must abide by all its terms as long as our technologies are being employed within your organization and within your applications.
//
//  THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY
//  OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT
//  LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
//  FITNESS FOR A PARTICULAR PURPOSE.
//
//  ALL OTHER RIGHTS RESERVED

import React from 'react';

import _ from '../../../shared/util/base';
import { COLORS } from '../../../shared/util/colors';
import { View, Text } from './base';

const styles = {
    wrapper: { flexDirection: 'row' },
    text: { marginLeft: 10, alignSelf: 'center' }
};

export const LoadingIcon = (props) => {

    const color = _.isNonEmptyString(props.color) ? props.color : COLORS.blackA06;
    const size = _.isNumber(props.size) ? props.size : 16;

    return <span role="img" aria-label="loading" className="anticon anticon-loading douhub-spinner"
        style={_.style({ fontSize: size, color, alignSelf: 'center' }, props.style)}>
        <svg viewBox="0 0 1024 1024" focusable="false" className="anticon-spin" data-icon="loading"
            width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg>
    </span>
}


const LoadingCircle = (props) => {

    const { text, wrapperStyle, textStyle, className } = props;

    const color = _.isNonEmptyString(props.color) ? props.color : COLORS.blackA06;
    const size = _.isNumber(props.size) ? props.size : 16;

    const textColor = _.isNonEmptyString(props.textColor) ? props.textColor : color;
    const textSize = _.isNumber(props.textSize) ? props.textSize : size;

    return <View className={className} style={_.style(styles.wrapper, wrapperStyle)}>
        <LoadingIcon
            color={color}
            size={size}
        />
        {_.isNonEmptyString(text) && <Text style={_.style(styles.text, { fontSize: textSize, color: textColor }, textStyle)}>{text}</Text>}
    </View>
};

export default LoadingCircle;
