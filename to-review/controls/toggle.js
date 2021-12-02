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

import React, { useState, useEffect } from 'react';

import _ from '../../../shared/util/base';
import { Text, View } from './base';
import { APPCOLORS, COLORS } from '../../../shared/util/colors';

const styles = {
    wrapper: { alignItems: 'center',backgroundColor: COLORS.white,  flexDirection: 'row', height: 30, 
    borderRadius: 15, padding: 3, alignSelf: 'center', cursor:'pointer',
    borderWidth: 1, borderStyle: 'solid' },
    handler: { height: 24, width: 24, borderRadius: 12 },
    text: { fontSize: 12, color: COLORS.white, textAlign: 'center', alignSelf: 'center', marginLeft: 5, marginRight: 5 },
};

const Toggle = (props) => {

    const { textStyle, wrapperStyle, handlerStyle, text, offText, onText } = props;
    const [on, setOn] = useState(props.value == true ? true : false);

     useEffect(()=>{
        setOn(props.value == true ? true : false);
    },[props.value])

    const color = _.isNonEmptyString(props.color) ? color : APPCOLORS.info;

    const onClick = () => {
        const newValue = !on;
        setOn(newValue);
        if (_.isFunction(props.onClick)) props.onClick(newValue);
    }

    return <View style={_.style(styles.wrapper, _.isFunction(props.onClick) ? { cursor: 'pointer' } : {},
        on ? { borderColor: color } : { borderColor: COLORS.blackA02 }, wrapperStyle)} onClick={onClick}>
        {!on && <View style={_.style(styles.handler, { backgroundColor: COLORS.blackA01 }, handlerStyle)}></View>}
        {_.isNonEmptyString(text) && <Text style={_.style(styles.text, { color: on ? color : COLORS.black }, textStyle)}>{text}</Text>}
        {_.isNonEmptyString(onText) && on && <Text style={_.style(styles.text, { color }, textStyle)}>{onText}</Text>}
        {_.isNonEmptyString(offText) && !on && <Text style={_.style(styles.text, { color: COLORS.black }, textStyle)}>{offText}</Text>}
        {on && <View style={_.style(styles.handler, { backgroundColor: color }, handlerStyle)}></View>}
    </View>
};

export default Toggle;
