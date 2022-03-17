import React from 'react';
import {  Popconfirm, Tooltip } from '../../index';
import { getRecordDisplay } from 'douhub-helper-util';
import { isFunction } from 'lodash';
import { SVG } from 'douhub-ui-web-basic';

const ListFormHeader = (props: Record<string, any>) => {

    const { entity, recordSaving, currentRecord } = props;
    const deleteConfirmationMessage = props.deleteConfirmationMessage ? props.deleteConfirmationMessage : `Are you sure you want to delete the ${entity?.uiName.toLowerCase()}?`;
    const deleteButtonLabel = props.deleteButtonLabel ? props.deleteButtonLabel : `Delete`;
    const display = getRecordDisplay(currentRecord ? currentRecord : {});
    const title = getRecordDisplay(currentRecord ? currentRecord : {}, 30);

    return <div style={{ height: 78 }}
        className="list-form-header absolute bg-gray-50 w-full flex flex-row px-6 py-4 border border-0 border-b">
        <div className="flex-1">
            <p className="pb-0 mb-0 text-xs uppercase">{entity.uiName}</p>
            <h1 className="text-lg text-black mb-0 whitespace-nowrap" title={display}>{title}</h1>
        </div>
        <div className="flex flex-row justify-center">
            {recordSaving != '' && <div className="w-full flex p-4 self-center ">
                <SVG src="/icons/loading.svg" className="spinner" style={{ width: 22, height: 22 }} />
                <span className="pl-2">{recordSaving == 'create' ? 'Creating ...' : 'Updating ...'}</span>
            </div>}
            {recordSaving == '' && <Tooltip color="red" placement='top' title={deleteButtonLabel}>
                <Popconfirm
                    placement="bottom"
                    title={deleteConfirmationMessage}
                    onConfirm={() => { isFunction(props.onClickDeleteRecord) && props.onClickDeleteRecord() }}
                    okText="Yes"
                    cancelText="No">
                    <div
                        style={{ height: 30 }}
                        className="hidden ml-2 sm:flex self-center cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-red-600 rounded-md shadow-sm text-xs font-medium text-white bg-red-500 hover:bg-red-600">
                        <SVG src="/icons/delete.svg" color="#ffffff" style={{ width: 18 }} />
                    </div>
                </Popconfirm>
            </Tooltip>}
            {recordSaving == '' && <Tooltip color="rgb(14 165 233)" placement='top' title="Save">
                <div
                    onClick={() => { isFunction(props.onClickSaveRecord) && props.onClickSaveRecord(false) }} style={{ height: 30 }}
                    className="hidden ml-2 sm:flex self-center cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-sky-600 rounded-md shadow-sm text-xs font-medium text-white bg-sky-500 hover:bg-sky-600">
                    <SVG src="/icons/save.svg" color="#ffffff" style={{ width: 18 }} />
                </div>
            </Tooltip>}
            {recordSaving == '' && <Tooltip color="rgb(14 165 233)" placement='top' title="Save &amp; Close">
                <div
                    onClick={() => { isFunction(props.onClickSaveRecord) && props.onClickSaveRecord(true) }} style={{ height: 30 }}
                    className="hidden ml-2 sm:flex self-center cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-sky-600 rounded-md shadow-sm text-xs font-medium text-white bg-sky-500 hover:bg-sky-600">
                    <SVG src="/icons/save-close.svg" color="#ffffff" style={{ width: 18 }} />
                </div>
            </Tooltip>
            }
            {recordSaving == '' && <Tooltip color="#aaaaaa" placement='top' title="Close">
                <div onClick={() => { isFunction(props.onClickClose) && props.onClickClose() }} style={{ height: 30 }}
                    className="hidden sm:flex self-center ml-2 cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-gray-200 hover:border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">
                    <SVG src="/icons/close.svg" color="#333333" style={{ width: 18 }} />
                </div>
            </Tooltip>}
        </div>
    </div>
}

export default ListFormHeader