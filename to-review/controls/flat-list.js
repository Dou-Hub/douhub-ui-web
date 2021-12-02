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
import ScrollView from './scroll-view';

const FlatListView = (props) => {
    const { data, renderItem, style, scrollToTop } = props;

    const renderItems = () => {
        let index = -1;
        return _.map(data, (item) => {
            index++;
            return renderItem({
                index,
                item
            });
        })
    }

    const onEndReached = ()=>{
        if (_.isFunction(props.onEndReached)) props.onEndReached();
    }

    return (
        <ScrollView style={style} onEndReached={onEndReached} top={scrollToTop}> 
          {renderItems()}
        </ScrollView>
    )
}

export default FlatListView;
