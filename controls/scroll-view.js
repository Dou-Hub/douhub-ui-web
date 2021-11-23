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

import React, { useEffect, useRef } from 'react';
import _ from '../../../shared/util/base';
import { View } from './base';
import { COLORS } from '../../../shared/util/colors';
import { Scrollbar as ScrollbarControl } from 'react-scrollbars-custom';

const styles = {
    trackYStyle: {
        width: 8,
        backgroundColor: COLORS.blackA01
    },

    thumbYStyle: {
        backgroundColor: COLORS.blackA01
    }
}


const ScrollView = (props) => {

    const viewProps = props;
    // _.cloneDeep(props);
    // delete viewProps.renderItem;
    // delete viewProps.onEndReachedThreshold;
    // delete viewProps.onEndReached;

    useEffect(() => {
        if (_.isObject(props.top)) scroll.current.scrollToTop(props.top.value);
    }, [props.top])

    const scroll = useRef(null);

    const onScroll = _.debounce((params) => {
        const { contentScrollHeight, clientHeight, scrollTop } = params;
        if (_.isFunction(props.onScroll)) props.onScroll(params);
        if (contentScrollHeight - clientHeight - scrollTop < 30) {
            if (_.isFunction(props.onEndReached)) props.onEndReached(params);
        }
    }, 300);

    return <View {...viewProps}>
        <ScrollbarControl
            noScrollX={true}
            onScroll={onScroll}
            ref={scroll}
            trackYProps={{
                renderer: props => {
                    const { elementRef, ...restProps } = props;
                    restProps.style = _.assign({}, restProps.style, styles.trackYStyle, props.trackYStyle);
                    return <div {...restProps} ref={elementRef} />;
                }
            }}

            thumbYProps={{
                renderer: props => {
                    const { elementRef, ...restProps } = props;
                    restProps.style = _.assign({}, restProps.style, styles.thumbYStyle, props.thumbYStyle);
                    return <div {...restProps} ref={elementRef} />;
                }
            }}
        >
            {props.children}
        </ScrollbarControl>
    </View>
}

export default ScrollView;