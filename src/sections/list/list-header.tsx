import { Menu, Dropdown, SVG, Select, SelectOption, _window } from '../../index';
import React, { useEffect, useState } from 'react';
import { isArray, isFunction, map, find } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';

const ListHeader = (props: Record<string, any>) => {

    const { sidePanel, queries, entity, maxWidth, defaultQueryName, menuForCreateButton } = props;
    const [defaultValue, setDefaultValue] = useState<Record<string, any> | null>(null);
    const [status, setStatus] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        if (isArray(queries) && queries.length > 0) {
            let newDefaultValue: Record<string, any> | null = null;
            if (isNonEmptyString(defaultQueryName)) {
                newDefaultValue = find(queries, (query) => { return query.value == defaultQueryName });

            }
            newDefaultValue = newDefaultValue ? newDefaultValue : queries[0];
            console.log({ newDefaultValue })
            setDefaultValue(newDefaultValue);
        }

    }, [queries, defaultQueryName])

    const onToggleSidePanel = () => {
        if (isFunction(props.onToggleSidePanel)) props.onToggleSidePanel();
    }

    const onChangeQuery = (curQuery: Record<string, any>) => {
        if (isFunction(props.onChangeQuery)) props.onChangeQuery(curQuery);
    }

    const onChangeStatus = (curStatus: Record<string, any>) => {
        setStatus(curStatus)
        if (isFunction(props.onChangeStatus)) props.onChangeStatus(curStatus);
    }

    const onClickCreateRecord = () => {
        if (isFunction(props.onClickCreateRecord)) props.onClickCreateRecord();
    }

    const onClickUploadRecords = () => {
        if (isFunction(props.onClickUploadRecords)) props.onClickUploadRecords();
    }

    const onClickRefresh = () => {
        if (isFunction(props.onToggleSidePanel)) props.onClickRefresh();
    }

    const menu = menuForCreateButton ? menuForCreateButton : isFunction(props.onClickUploadRecords) && <Menu>
        <Menu.Item key="create">
            <div onClick={onClickCreateRecord}>
                Create {entity.uiName}
            </div>
        </Menu.Item>
        <Menu.Item key="upload">
            <div onClick={onClickUploadRecords}>
                Upload {entity.uiCollectionName}
            </div>
        </Menu.Item></Menu>

    return <div className="douhub-list-header bg-white w-full flex flex-row items-center px-4 py-4 border border-0 border-b"
        style={{ maxWidth, height: 68 }}>

        {sidePanel != 'none' && <SVG src={`/icons/${sidePanel ? 'hide' : 'show'}-sidepanel.svg`}
            style={{ width: 26, height: 26, alignSelf: 'center', cursor: 'pointer' }}
            onClick={onToggleSidePanel} />}


        <div className={`douhub-list-title ${sidePanel != 'none' ? 'ml-2' : ''}`}>
            {isArray(queries) && queries.length > 0 ?
                <Select
                    labelInValue
                    bordered={false}
                    value={defaultValue}
                    onChange={onChangeQuery}
                >
                    {map(queries, (query, index:number) => <SelectOption key={`${query.value}-${index}`} value={query.value}>{query.name}</SelectOption>)}
                </Select>
                :
                <h1>{entity.uiCollectionName}</h1>
            }
        </div>

        {isArray(entity.statusCode) && entity.statusCode.length > 0 && <Select
            style={{ minWidth: 80 }}
            labelInValue
            placeholder="Status"
            bordered={false}
            value={status}
            onChange={onChangeStatus}
        >
            {map(entity.statusCode,
                (query) => <SelectOption value={query.value}>{query.name}</SelectOption>)}
        </Select>}

        <div className="flex flex-1 flex-cols justify-end">

            {menu ? <Dropdown overlay={menu} className="hidden sm:block">
                <div className="cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                    Create {entity.uiName}
                </div>
            </Dropdown> :
                <div onClick={onClickCreateRecord}
                    className="hidden sm:block cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                    Create {entity.uiName}
                </div>}

            {menu ? <Dropdown overlay={menu} className="block sm:hidden">
                <div className="cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-2 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                    +
                </div>
            </Dropdown> : <div onClick={onClickCreateRecord}
                className="block sm:hidden cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-2 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                +
            </div>}

            {props.children}

            <div onClick={onClickRefresh}
                className="cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-1 py-1 ml-2 border border-gray-200 hover:border-gray-300 rounded-md shadow-sm text-xs font-medium bg-gray-100 hover:bg-gray-200">
                <SVG id="list-refresh-icon" src="/icons/refresh.svg" style={{ width: 22 }} color="#333333" />
            </div>
        </div>
    </div>
};

export default ListHeader;

