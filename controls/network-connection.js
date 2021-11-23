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

import React, { useEffect } from 'react';
import _ from '../../../shared/util/base';
import { View, Text } from './base';
import { COLORS } from '../../../shared/util/colors';

const styles = {
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 5
    },
    dotDoing: {
        backgroundColor: COLORS.blue,
        animation: 'blinker 1s linear infinite'
    },
    dotOn: {
        backgroundColor: COLORS.green
    },
    dotOff: {
        backgroundColor: COLORS.red
    },
    name: {
        fontSize: 12,
        marginLeft: 10
    },
    version: {
        fontSize: 12,
        marginLeft: 5
    },
    doingText: {
        fontSize: 12,
        marginLeft: 10
    },

}


const NetworkConnection = (props) => {
    
    const { name, version } = props;
    const status = props.status ? props.status : 'doing';
    const doingText = props.doingText ? props.doingText : 'Connecting ...';

    let statusDotStyle = styles.dotDoing;
    if (status == 'on') statusDotStyle = styles.dotOn;
    if (status == 'off') statusDotStyle = styles.dotOff;

    useEffect(() => {
        if (_.isObject(props.top)) scroll.current.scrollToTop(props.top.value);
    }, [props.top])

    return <View style={{ ...styles.wrapper, ...props.wrapperStyle }}>
        <View style={{ ...styles.dot, ...styles.dotOn, ...statusDotStyle, ...props.dotStyle }} />
        {status=='doing' && _.isNonEmptyString(doingText) && <Text style={{ ...styles.doingText, ...props.doingTextStyle }}>{doingText}</Text>}
        {status!='doing' && _.isNonEmptyString(name) && <Text style={{ ...styles.name, ...props.nameStyle }}>{name}</Text>}
        {_.isNonEmptyString(version) && <Text style={{ ...styles.version, ...props.versionStyle }}>({version})</Text>}
    </View>
}

export default NetworkConnection;