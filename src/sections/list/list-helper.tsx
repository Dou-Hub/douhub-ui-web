
import React from 'react';
import SVG from '../../controls/svg';
import { isFunction, without } from 'lodash';

export const renderIconButtonColumn = (
    iconUrl: string,
    action: string,
    onClickRecord: (record: Record<string, any>, action: string) => void,
    onRenderWrapperClassName?: (record: Record<string, any>) => string,
    onRenderWrapperStyle?: (record: Record<string, any>) => Record<string,any>,
    onRenderIconClassName?: (record: Record<string, any>) => string,
    onRenderIconColor?: (record: Record<string, any>) => Record<string,any>
) => {
    return {
        title: '',
        id: 'id',
        dataIndex: 'id',
        width: 40,
        fixed: 'right',
        className: 'cursor-pointer',
        render: (id: string, record: Record<string, any>) => {
            
            const wrapperClassName = isFunction(onRenderWrapperClassName)?onRenderWrapperClassName(record):'';
            const wrapperStyle = isFunction(onRenderWrapperStyle)?onRenderWrapperStyle(record):{};

            const iconClassName = isFunction(onRenderIconClassName)?onRenderIconClassName(record):{};
            const iconColor = isFunction(onRenderIconColor)?onRenderIconColor(record):'#000000';

            return <div className={`cursor-pointer w-full flex  justify-center ${wrapperClassName}`}
                style={wrapperStyle}
                onClick={() => onClickRecord({id,...record}, action)} >
                <SVG id={`list-col-icon-${iconUrl}`} color={iconColor} src={iconUrl} className={`h-4 w-4 ${iconClassName}`} />
            </div>
        }
    }
}

export const DEFAULT_EDIT_COLUMN = (
    onClickRecord: (record: Record<string, any>, action: string) => void,
    onRenderWrapperClassName?: (record: Record<string, any>) => string,
    onRenderWrapperStyle?: (record: Record<string, any>) => Record<string,any>,
    onRenderIconClassName?: (record: Record<string, any>) => string,
    onRenderIconColor?: (record: Record<string, any>) => Record<string,any>
    ) => {
    return renderIconButtonColumn('/icons/edit.svg','edit', 
    onClickRecord,
    onRenderWrapperClassName,
    onRenderWrapperStyle,
    onRenderIconClassName,
    onRenderIconColor
    );
}


export const DEFAULT_EMAIL_COLUMN = (
    onClickRecord: (record: Record<string, any>, action: string) => void,
    onRenderWrapperClassName?: (record: Record<string, any>) => string,
    onRenderWrapperStyle?: (record: Record<string, any>) => Record<string,any>,
    onRenderIconClassName?: (record: Record<string, any>) => string,
    onRenderIconColor?: (record: Record<string, any>) => Record<string,any>
) => {
return renderIconButtonColumn('/icons/send-email.svg','email', 
    onClickRecord,
    onRenderWrapperClassName,
    onRenderWrapperStyle,
    onRenderIconClassName,
    onRenderIconColor
    );
}

export const DEFAULT_COLUMNS = (
    onClickRecord: (record: Record<string, any>, action: string) => void
) => {
    return without([
        {
            title: '',
            dataIndex: 'display',
            id: 'display',
            render: (v: string, data: Record<string, any>) => {
                const text = data.highlight?.searchDisplay ? data.highlight?.searchDisplay : v;
                const searchDetail = data.highlight?.searchContent ? data.highlight?.searchContent : [];

                return <div className="flex flex-col items-start">
                    <div className="text-sm font-normal text-gray-900" dangerouslySetInnerHTML={{ __html: text }}></div>
                    {searchDetail.length > 0 && <div className="mt-1 text-xs font-light text-gray-900" dangerouslySetInnerHTML={{ __html: searchDetail[0] }}></div>}
                </div>
            },
        },
        DEFAULT_EDIT_COLUMN(onClickRecord)
    ], undefined);
};

