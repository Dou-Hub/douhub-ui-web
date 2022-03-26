import { Dropdown, Select, SelectOption, UploadModal } from '../../index';
import React, { useEffect, useState } from 'react';
import { isArray, isFunction, map, find, isInteger, isNil } from 'lodash';
import { isNonEmptyString, shortenString, newGuid } from 'douhub-helper-util';
import { SVG, _window } from 'douhub-ui-web-basic';

const ListHeader = (props: Record<string, any>) => {

    const { sidePanel, queries, statusCodes, entity, maxWidth, queryId,
        statusId, menuForCreateButton, allowCreate, allowUpload, recordForMembership } = props;

    // const querySelectorMinWidth = isInteger(props.querySelectorMinWidth) ? props.querySelectorMinWidth : 150
    const [query, setQuery] = useState<Record<string, any> | null>(null);
    const [status, setStatus] = useState<Record<string, any> | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<string | null>(null);

    const curQueryTitleLength = isNonEmptyString(query?.title) ? query?.title?.length : 16;
    const queryTitleMaxLength = isInteger(props.queryTitleMaxLength) ? props.queryTitleMaxLength : Math.min(curQueryTitleLength, 30);

    const curStatusTitleLength = isNonEmptyString(status?.title) ? status?.title?.length : 16;
    const statusTitleMaxLength = isInteger(props.statusTitleMaxLength) ? props.statusTitleMaxLength : Math.min(curStatusTitleLength, 20);

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
                title: newQuery?.title,
                label: shortenString(newQuery?.title, queryTitleMaxLength)

            };
            setQuery(newQuery);
        }

    }, [queries, queryId])

    useEffect(() => {

        if (isArray(statusCodes) && statusCodes.length > 0) {
            let newStatus: Record<string, any> | null = null;
            if (isNonEmptyString(statusId)) {
                newStatus = find(statusCodes, (s) => { return `${s.id}` == `${statusId}` });
            }
            if (!newStatus) newStatus = statusCodes[0];
            newStatus = {
                value: newStatus?.id,
                key: newStatus?.id,
                title: newStatus?.title,
                label: shortenString(newStatus?.title, statusTitleMaxLength)
            };
            setStatus(newStatus);
        }

    }, [statusCodes, statusId])

    const onClickShowSidePanel = () => {
        if (isFunction(props.onClickShowSidePanel)) props.onClickShowSidePanel();
    }

    const onChangeQuery = (curQuery: Record<string, any>) => {
        const newQuery = { ...curQuery, id: curQuery.key, title: curQuery.label };
        setQuery(newQuery);
        if (isFunction(props.onChangeQuery)) props.onChangeQuery(newQuery);
    }

    const onChangeStatus = (curStatus: Record<string, any>) => {
        const newStatus = { ...curStatus, value: curStatus.key, title: curStatus.label };
        setStatus(newStatus);
        if (isFunction(props.onChangeStatus)) props.onChangeStatus(newStatus);
    }

    const onClickCreateRecord = () => {
        if (isFunction(props.onClickCreateRecord)) props.onClickCreateRecord();
    }

    // const onClickUploadRecords = () => {
    //     if (isFunction(props.onClickUploadRecords)) props.onClickUploadRecords();
    // }

    const onClickRefresh = () => {
        if (isFunction(props.onClickRefresh)) props.onClickRefresh();
    }

    const onClickUpload = () => {
        setShowUploadModal(newGuid());
    }

    // const menu = menuForCreateButton ? menuForCreateButton : isFunction(props.onClickUploadRecords) && <Menu>
    // <Menu.Item key="create">
    //     <div onClick={onClickCreateRecord}>
    //         Create {entity.uiName}
    //     </div>
    // </Menu.Item>
    // <Menu.Item key="upload">
    //     <div onClick={onClickUploadRecords}>
    //         Upload {entity.uiCollectionName}
    //     </div>
    // </Menu.Item></Menu>

    return <div className="douhub-list-header bg-white w-full flex flex-row items-center px-4 py-4 border border-0 border-b"
        style={{ maxWidth, height: 68 }}>

        {sidePanel == false && <SVG src="/icons/show-sidepanel.svg"
            style={{ width: 26, height: 26, alignSelf: 'center', cursor: 'pointer' }}
            onClick={onClickShowSidePanel} />}


        <div className={`douhub-list-title ${sidePanel == false ? 'ml-2' : ''}`}>
            {isArray(queries) && queries.length > 0 ?
                <Select
                    // style={{ minWidth: querySelectorMinWidth }}
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
            style={{ minWidth: isInteger(props.statusSelectorMinWidth) ? props.statusSelectorMinWidth : 100 }}
            labelInValue
            placeholder="Status"
            bordered={false}
            value={status}
            onChange={onChangeStatus}
        >
            {map(statusCodes, (statusCode, index: number) => <SelectOption key={!isNil(statusCode.id) ? statusCode.id : index} value={statusCode.id}>{statusCode.title}</SelectOption>)}
        </Select>}

        <div className="flex flex-1 flex-cols justify-end">

            {allowUpload && allowCreate && <div
                onClick={onClickUpload}
                className={`flex cursor-pointer whitespace-nowrap inline-flex items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700'}`}>
                <SVG id="upload-icon" src="/icons/upload-to-cloud.svg" style={{ width: 18, height: 18 }} color="#ffffff" />
                <span className="hidden sm:block sm:ml-2">Upload</span>
            </div>}

            {menuForCreateButton && allowCreate && <Dropdown overlay={menuForCreateButton}>
                <div className="flex cursor-pointer whitespace-nowrap inline-flex ml-2 items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                    <SVG id="add-row-icon" src="/icons/add-row.svg" style={{ width: 18, height: 18 }} color="#ffffff" />
                    <span className="hidden sm:block sm:ml-2">New</span>
                </div>
            </Dropdown>}


            {!menuForCreateButton && allowCreate && <div className="flex cursor-pointer whitespace-nowrap inline-flex ml-2 items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700"
                onClick={onClickCreateRecord}
            >
                <SVG id="add-row-icon" src="/icons/add-row.svg" style={{ width: 18, height: 18 }} color="#ffffff" />
                <span className="hidden sm:block sm:ml-2">New</span>
            </div>}

            {props.children}

            <div onClick={onClickRefresh}
                className="cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-1 py-1 ml-2 border border-gray-200 hover:border-gray-300 rounded-md shadow-sm text-xs font-medium bg-gray-100 hover:bg-gray-200">
                <SVG id="list-refresh-icon" src="/icons/refresh.svg" style={{ width: 22 }} color="#333333" />
            </div>
        </div>
        <UploadModal
            recordForMembership={recordForMembership}
            onSubmitSucceed={() => { }}
            entity={entity}
            show={showUploadModal}
            onClose={() => { setShowUploadModal(null) }} />
    </div>
};

export default ListHeader;