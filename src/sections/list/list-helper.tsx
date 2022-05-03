
import React from 'react';
import { Menu, Popconfirm, Dropdown } from '../../index';
import { isFunction, map, isArray } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';
import { SVG } from 'douhub-ui-web-basic';
import { Tooltip } from '../../index';

export const rendeActionButtonColumn = (
    menuItems: Array<{ title: string, action: string, confirmation?: string }>,
    onClick: (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => void,
    entity?: Record<string, any>,
    settings?: LIST_COLUMN_SETTINGS_TYPE
) => {

    return {
        title: '',
        id: 'id',
        dataIndex: 'id',
        key: 'action-button',
        width: 40,
        fixed: 'right',
        className: 'cursor-pointer',
        render: (id: string, record: Record<string, any>, rowIndex: number) => {
            const r = { id, ...record };
            const menu = <Menu>{map(menuItems, (menuItem: any, index: number) => {
                return <Menu.Item
                    key={`action-button-menu-${index}`}
                    className="w-full"
                    onClick={() => { !isNonEmptyString(menuItem.confirmation) && onClick(r, menuItem.action, entity, rowIndex) }}>
                    {isNonEmptyString(menuItem.confirmation) ?
                        <Popconfirm
                            placement="left"
                            okType={menuItem.okType}
                            title={menuItem.confirmation}
                            onConfirm={() => { onClick(r, menuItem.action, entity, rowIndex) }}
                            okText="Yes"
                            cancelText="No"
                        >
                            {menuItem.title}
                        </Popconfirm> : <span>{menuItem.title}</span>}
                </Menu.Item>
            })}
            </Menu>;


            const wrapperClassName = isFunction(settings?.onRenderWrapperClassName) ? settings?.onRenderWrapperClassName(record) : '';
            const wrapperStyle = isFunction(settings?.onRenderWrapperStyle) ? settings?.onRenderWrapperStyle(record) : {};

            const iconClassName = isFunction(settings?.onRenderIconClassName) ? settings?.onRenderIconClassName(record) : {};
            const iconColor = isFunction(settings?.onRenderIconColor) ? settings?.onRenderIconColor(record) : '#000000';

            const icon = record.uiDoing ? '/icons/loading.svg' : '/icons/menu-vertical.svg'

            return <Dropdown disabled={record.uiDisabled} trigger={['click']} overlay={menu} placement="bottomLeft">
                <div className={`w-full flex  justify-center ${record.uiDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${wrapperClassName}`}
                    style={wrapperStyle}
                >
                    <SVG id={`list-col-icon-action-button`} color={iconColor} src={icon} className={`h-4 w-4 ${record.uiDoing ? 'spinner' : ''} ${iconClassName}`} />
                </div>
            </Dropdown>
        }
    }
}

export type LIST_COLUMN_TOOLTIP_TYPE = { placement?: 'top' | 'left' | 'bottom' | 'right', title: string, color?: string };
export type LIST_COLUMN_SETTINGS_TYPE = {
    onRenderWrapperClassName?: (record: Record<string, any>) => string,
    onRenderWrapperStyle?: (record: Record<string, any>) => Record<string, any>,
    onRenderIconClassName?: (record: Record<string, any>) => string,
    onRenderIconColor?: (record: Record<string, any>) => Record<string, any>,
    tooltip?: LIST_COLUMN_TOOLTIP_TYPE
}

export const renderIconButtonColumn = (
    iconUrl: string,
    action: string,
    onClick: (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => void,
    entity?: Record<string, any>,
    settings?: LIST_COLUMN_SETTINGS_TYPE
) => {
    return {
        title: '',
        id: 'id',
        dataIndex: 'id',
        key: `icon-col-${action}`,
        width: 40,
        fixed: 'right',
        className: 'cursor-pointer',
        render: (id: string, record: Record<string, any>, rowIndex: number) => {

            const r = { id, ...record };
            const wrapperClassName = isFunction(settings?.onRenderWrapperClassName) ? settings?.onRenderWrapperClassName(r) : '';
            const wrapperStyle = isFunction(settings?.onRenderWrapperStyle) ? settings?.onRenderWrapperStyle(r) : {};

            const iconClassName = isFunction(settings?.onRenderIconClassName) ? settings?.onRenderIconClassName(r) : '';
            const iconColor = isFunction(settings?.onRenderIconColor) ? settings?.onRenderIconColor(r) : '#000000';

            const c = <div className={`w-full flex justify-center ${record.uiDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${wrapperClassName}`}
                style={wrapperStyle}
                onClick={() => !record.uiDisabled && onClick(r, action, entity, rowIndex)} >
                <SVG id={`list-col-icon-${iconUrl}-${id}`} color={record.uiDisabled ? '#cccccc' : iconColor} src={iconUrl} className={`h-4 w-4 ${iconClassName}`} />
            </div>

            if (settings?.tooltip) {
                return <Tooltip
                    color={settings?.tooltip.color ? settings?.tooltip.color : '#999999'}
                    placement={settings?.tooltip.placement ? settings?.tooltip.placement : 'left'}
                    title={settings?.tooltip.title}>
                    {c}
                </Tooltip>
            }
            else {
                return c;
            }
        }
    }
}

export const DEFAULT_EDIT_COLUMN = (
    onClick: (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => void,
    entity?: Record<string, any>,
    events?: LIST_COLUMN_SETTINGS_TYPE
) => {
    return renderIconButtonColumn('/icons/edit.svg', 'edit',
        onClick,
        entity,
        events
    );
}

export const DEFAULT_OPEN_IN_BROWSER_COLUMN = (
    onClick: (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => void,
    entity?: Record<string, any>,
    settings?: LIST_COLUMN_SETTINGS_TYPE

) => {
    return renderIconButtonColumn('/icons/open-in-browser.svg', 'open-in-browser',
        onClick,
        entity,
        settings
    );
}

export const DEFAULT_EMAIL_COLUMN = (
    onClick: (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => void,
    entity?: Record<string, any>,
    settings?: LIST_COLUMN_SETTINGS_TYPE
) => {
    return renderIconButtonColumn('/icons/send-email.svg', 'email',
        onClick,
        entity,
        settings
    );
}

export const DEFAULT_ACTION_COLUMN = (
    onClick: (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => void,
    entity?: Record<string, any>,
    menuItems?: Array<{ title: string, action: string, confirmation?: string }>,
    settings?: {
        deleteConfirmationMessage?: string,
        deleteButtonLabel?: string,
        onRenderWrapperClassName?: (record: Record<string, any>) => string,
        onRenderWrapperStyle?: (record: Record<string, any>) => Record<string, any>,
        onRenderIconClassName?: (record: Record<string, any>) => string,
        onRenderIconColor?: (record: Record<string, any>) => Record<string, any>,
        tooltip?: LIST_COLUMN_TOOLTIP_TYPE
    }
) => {

    const deleteConfirmation = settings?.deleteConfirmationMessage ? settings?.deleteConfirmationMessage : `Are you sure you want to delete the ${entity?.uiName.toLowerCase()}?`
    return rendeActionButtonColumn([
        { title: settings?.deleteButtonLabel ? settings?.deleteButtonLabel : "Delete", action: "delete", confirmation: deleteConfirmation },
        ...(isArray(menuItems) ? menuItems : [])
    ],
        onClick,
        entity,
        {
            onRenderWrapperClassName: settings?.onRenderWrapperClassName,
            onRenderWrapperStyle: settings?.onRenderWrapperStyle,
            onRenderIconClassName: settings?.onRenderIconClassName,
            onRenderIconColor: settings?.onRenderIconColor,
            tooltip: settings?.tooltip
        }
    );
}

export const DEFAULT_COLUMNS = (
    onClick: (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => void,
    entity: Record<string, any>
) => {
    return [
        {
            title: '',
            dataIndex: 'display',
            id: 'display',
            key: 'default-display',
            render: (v: string, data: Record<string, any>) => {
                const text = data.highlight?.searchDisplay ? data.highlight?.searchDisplay : v;
                const searchDetail = data.highlight?.searchContent ? data.highlight?.searchContent : [];

                return <div className="flex flex-col items-start">
                    <div className="text-base font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: text }}></div>
                    {searchDetail.length > 0 && <div className="mt-1 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: searchDetail[0] }}></div>}
                </div>
            },
        },
        DEFAULT_EDIT_COLUMN(onClick, entity)
    ];
};

