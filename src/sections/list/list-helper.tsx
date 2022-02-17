
import React from 'react';
import {SVG, Menu, Popconfirm, Dropdown} from '../../index';
import { isFunction, without, map } from 'lodash';
import {isNonEmptyString} from 'douhub-helper-util';

export const rendeActionButtonColumn = (
    menuItems: Array<{ title: string, action: string, confirmation?:string }>,
    onClick: (record: Record<string, any>, action: string) => void,
    onRenderWrapperClassName?: (record: Record<string, any>) => string,
    onRenderWrapperStyle?: (record: Record<string, any>) => Record<string, any>,
    onRenderIconClassName?: (record: Record<string, any>) => string,
    onRenderIconColor?: (record: Record<string, any>) => Record<string, any>
) => {

    return {
        title: '',
        id: 'id',
        dataIndex: 'id',
        width: 40,
        fixed: 'right',
        className: 'cursor-pointer',
        render: (id: string, record: Record<string, any>) => {
            const r = {id,...record};
            const menu = <Menu>{map(menuItems, (menuItem: any) => {

                return <Menu.Item 
                
                className="w-full" 
                onClick={() => { !isNonEmptyString(menuItem.confirmation) && onClick(r , menuItem.action) }}>
                    {isNonEmptyString(menuItem.confirmation) ?
                        <Popconfirm
                            placement="left"
                            title={menuItem.confirmation}
                            onConfirm={() => { onClick(r , menuItem.action)}}
                            okText="Yes"
                            cancelText="No"
                        >
                            {menuItem.title}
                        </Popconfirm> : <span>{menuItem.title}</span>}
                </Menu.Item>
            })}
            </Menu>;


            const wrapperClassName = isFunction(onRenderWrapperClassName) ? onRenderWrapperClassName(record) : '';
            const wrapperStyle = isFunction(onRenderWrapperStyle) ? onRenderWrapperStyle(record) : {};

            const iconClassName = isFunction(onRenderIconClassName) ? onRenderIconClassName(record) : {};
            const iconColor = isFunction(onRenderIconColor) ? onRenderIconColor(record) : '#000000';

            const icon = record.uiDoing?'/icons/loading.svg':'/icons/menu-vertical.svg'

            return <Dropdown disabled={record.uiDisabled} trigger={['click']} overlay={menu} placement="bottomLeft">
                <div className={`w-full flex  justify-center ${record.uiDisabled?'cursor-not-allowed':'cursor-pointer'} ${wrapperClassName}`}
                    style={wrapperStyle}
                >
                    <SVG id={`list-col-icon-action-button`} color={iconColor} src={icon} className={`h-4 w-4 ${record.uiDoing?'spinner':''} ${iconClassName}`} />
                </div>
            </Dropdown>
        }
    }
}

export const renderIconButtonColumn = (
    iconUrl: string,
    action: string,
    onClick: (record: Record<string, any>, action: string) => void,
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
            
            const r = {id,...record};
            const wrapperClassName = isFunction(onRenderWrapperClassName)?onRenderWrapperClassName(r):'';
            const wrapperStyle = isFunction(onRenderWrapperStyle)?onRenderWrapperStyle(r):{};

            const iconClassName = isFunction(onRenderIconClassName)?onRenderIconClassName(r):'';
            const iconColor = isFunction(onRenderIconColor)?onRenderIconColor(r):'#000000';

            return <div className={`w-full flex justify-center ${record.uiDisabled?'cursor-not-allowed':'cursor-pointer'} ${wrapperClassName}`}
                style={wrapperStyle}
                onClick={() => !record.uiDisabled && onClick(r, action)} >
                <SVG id={`list-col-icon-${iconUrl}-${id}`} color={record.uiDisabled?'#cccccc':iconColor} src={iconUrl} className={`h-4 w-4 ${iconClassName}`} />
            </div>
        }
    }
}

export const DEFAULT_EDIT_COLUMN = (
    onClick: (record: Record<string, any>, action: string) => void,
    onRenderWrapperClassName?: (record: Record<string, any>) => string,
    onRenderWrapperStyle?: (record: Record<string, any>) => Record<string,any>,
    onRenderIconClassName?: (record: Record<string, any>) => string,
    onRenderIconColor?: (record: Record<string, any>) => Record<string,any>
    ) => {
    return renderIconButtonColumn('/icons/edit.svg','edit',
    onClick,
    onRenderWrapperClassName,
    onRenderWrapperStyle,
    onRenderIconClassName,
    onRenderIconColor
    );
}


export const DEFAULT_EMAIL_COLUMN = (
    onClick: (record: Record<string, any>, action: string) => void,
    onRenderWrapperClassName?: (record: Record<string, any>) => string,
    onRenderWrapperStyle?: (record: Record<string, any>) => Record<string,any>,
    onRenderIconClassName?: (record: Record<string, any>) => string,
    onRenderIconColor?: (record: Record<string, any>) => Record<string,any>
) => {
return renderIconButtonColumn('/icons/send-email.svg','email', 
onClick,
    onRenderWrapperClassName,
    onRenderWrapperStyle,
    onRenderIconClassName,
    onRenderIconColor
    );
}

export const DEFAULT_COLUMNS = (
    onClick: (record: Record<string, any>, action: string) => void
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
        DEFAULT_EDIT_COLUMN(onClick)
    ], undefined);
};

