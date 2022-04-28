import React from 'react';
import { isInteger, isNumber } from 'lodash';
import { SVG } from 'douhub-ui-web-basic';
import { COLORS, isNonEmptyString } from 'douhub-helper-util';

const styles = {
    countWrapper: { position: 'absolute', top: -6, right: -8, borderRadius: 9, backgroundColor: COLORS.red, justifyContent: 'space-around' },
    count: { fontSize: 8, color: COLORS.white, alignSelf: 'center' }
}


const PageHeaderNotification = (props: Record<string, any>) => {

    const { countWrapperStyle, countStyle, hide, count, wrapperClassName, wrapperStyle } = props;
    const size = isInteger(props.size) ? props.size : 24;

    return hide ? null : <div 
        style={wrapperStyle}
        className={`relative inline-flex ${isNonEmptyString(wrapperClassName)?wrapperClassName:''}`}>
        <div className="-mx-1 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <SVG id="page_header_notification" style={{ width: size }} color={COLORS.gray} src="/icons/notification.svg" />
            {isNumber(count) && count > 0 &&
                <div
                    className="flex flex-row justify-center w-full" style={{ width: size * 2 / 3, height: size * 2 / 3, ...styles.countWrapper, ...countWrapperStyle }}>
                    <div style={{ ...styles.count, ...countStyle }}>{count > 9 ? '9+' : count}</div>
                </div>}
        </div>
    </div>
}

export default PageHeaderNotification