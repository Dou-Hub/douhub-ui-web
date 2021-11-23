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

import _ from '../../../shared/util/base';
import { Text, View } from './base';

const styles = {
    wrapper: { flexDirection: 'row', marginTop: 2, marginBottom: 2 },
    iconWrapper: { marginRight: 10, minWidth: 16, minHeight: 16, marginRight: 10 },
    icon: { fontSize: 14, },
    text: { fontSize: 14, maxWidth: 100, whiteSpace: 'normal' }
}

const MenuItemContent = (props) => {

    const icon = props.icon;
    const text = props.text;
    const hideIcon = props.hideIcon === true;

    return <View style={_.style(styles.wrapper, props.wrapperStyle)}>
        {/* {icon && <Icon icon={icon} wrapperStyle={_.style(styles.iconWrapper, props.iconWrapperStyle)} iconStyle={_.style(styles.icon, props.iconStyle)} />} */}
        {_.isNonEmptyString(text) && <Text style={_.style(styles.text, icon && !hideIcon && { paddingLeft: 26 }, props.textStyle)}>{text}</Text>}
    </View>
}

export default MenuItemContent;