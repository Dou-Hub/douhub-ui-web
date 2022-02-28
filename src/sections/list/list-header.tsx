import { Menu, Dropdown, SVG, Select, SelectOption, _window } from '../../index';
import React, { useEffect, useState } from 'react';
import { isArray, isFunction, map, find, isInteger, isNil } from 'lodash';
import { isNonEmptyString, shortenString } from 'douhub-helper-util';

const ListHeader = (props: Record<string, any>) => {

    const { sidePanel, queries, statusCodes, entity, maxWidth, queryId, statusId, menuForCreateButton } = props;
    const [query, setQuery] = useState<Record<string, any> | null>(null);
    const [status, setStatus] = useState<Record<string, any> | null>(null);
    const queryTitleMaxLength = isInteger(props.queryTitleMaxLength) ? props.queryTitleMaxLength : 0;

    useEffect(() => {
        if (isArray(queries) && queries.length > 0) {
            let newQuery: Record<string, any> | null = null;
            if (isNonEmptyString(queryId)) {
                newQuery = find(queries, (query) => { return `${query.id}` == `${queryId}` });
            }
            if (!newQuery) newQuery = queries[0];
            newQuery = {
                value: newQuery?.id,
                key: newQuery?.id,
                label: queryTitleMaxLength > 15 ? shortenString(newQuery?.title, queryTitleMaxLength) : queryTitleMaxLength

            };
            setQuery(newQuery);
        }

    }, [queries, queryId])

    useEffect(() => {
       
        if (isArray(statusCodes) && statusCodes.length > 0) {
            let newStatus: Record<string, any> | null = null;
            if (isNonEmptyString(statusId)) {
                newStatus = find(statusCodes, (s) => { return `${s.id}` == `${statusId}`});
            }
            if (!newStatus) newStatus = statusCodes[0];
            newStatus = {
                value: newStatus?.id,
                key: newStatus?.id,
                label: newStatus?.title
            };
            setStatus(newStatus);
        }

    }, [statusCodes, statusId])

    const onToggleSidePanel = () => {
        if (isFunction(props.onToggleSidePanel)) props.onToggleSidePanel();
    }

    const onChangeQuery = (curQuery: Record<string, any>) => {
        const newQuery = { ...curQuery, id: curQuery.key, title: curQuery.label };
        setQuery(newQuery);
        if (isFunction(props.onChangeQuery)) props.onChangeQuery(newQuery);
    }

    const onChangeStatus = (curStatus: Record<string, any>) => {
        const newStatus = { ...curStatus, value: curStatus.key, name: curStatus.label };
        setStatus(newStatus);
        if (isFunction(props.onChangeStatus)) props.onChangeStatus(newStatus);
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
                    style={{ minWidth: 150 }}
                    labelInValue
                    bordered={false}
                    value={query}
                    onChange={onChangeQuery}
                >
                    {map(queries, (query, index: number) => <SelectOption key={!isNil(query.id) ? query.id : index} value={query.id}>{query.title}</SelectOption>)}
                </Select>
                :
                <h1>{entity.uiCollectionName}</h1>
            }
        </div>

        {isArray(statusCodes) && statusCodes.length > 0 && <Select
            style={{ minWidth: 100 }}
            labelInValue
            placeholder="Status"
            bordered={false}
            value={status}
            onChange={onChangeStatus}
        >
            {map(statusCodes, (statusCode, index: number) => <SelectOption key={!isNil(statusCode.id) ? statusCode.id : index} value={statusCode.id}>{statusCode.title}</SelectOption>)}
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

