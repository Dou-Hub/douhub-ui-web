import React from 'react';
import { Popconfirm, Tooltip } from '../../index';
import { getRecordDisplay, isNonEmptyString } from 'douhub-helper-util';
import { isFunction } from 'lodash';
import { SVG, _window } from 'douhub-ui-web-basic';


const ListFormHeader = (props: Record<string, any>) => {

    const { entity, recordSaving, currentRecord, currentRecordChanged } = props;
    const deleteConfirmationMessage = props.deleteConfirmationMessage ? props.deleteConfirmationMessage : `Are you sure you want to delete the ${entity?.uiName.toLowerCase()}?`;
    const deleteButtonLabel = props.deleteButtonLabel ? props.deleteButtonLabel : `Delete`;
    const display = getRecordDisplay({ ...(currentRecord ? currentRecord : {}), highlight: {} }); //makes ure highlight is not shown as title

    // const title = getRecordDisplay(currentRecord ? currentRecord : {}, 30);

    const onCopyId = () => {
        if (isFunction(_window?.navigator?.clipboard?.writeText)) {
            _window?.navigator?.clipboard?.writeText(currentRecord.id);
        }
    }

    return <div style={{ height: 68 }}
        className="list-form-header relative bg-gray-50 w-full flex flex-row px-8 py-3 border border-0 border-b">
        <div className="flex-1 truncate mr-4">
            <p className="pb-0 mb-0 text-xs uppercase">{entity.uiName}</p>
            <h1 className="text-lg text-black mb-0 whitespace-nowrap" title={display}>{display}</h1>
        </div>
        <div className="flex flex-row justify-center">
            {recordSaving != '' && <div className="w-full flex p-4 self-center ">
                <SVG src="/icons/loading.svg" className="spinner" style={{ width: 22, height: 22 }} />
                <span className="pl-2">{recordSaving == 'create' ? 'Creating ...' : 'Updating ...'}</span>
            </div>}
            {recordSaving == '' && isNonEmptyString(currentRecord._rid) && <Tooltip color="red" placement='top' title={deleteButtonLabel}>
                <Popconfirm
                    placement="left"
                    title={deleteConfirmationMessage}
                    onConfirm={() => { isFunction(props.onClickDeleteRecord) && props.onClickDeleteRecord() }}
                    okType="danger"
                    okText="Yes"
                    cancelText="No">
                    <div
                        style={{ height: 30 }}
                        className="ml-2 flex self-center cursor-pointer inline-flex items-center justify-center px-3 py-1 rounded-md bg-red-50 shadow hover:shadow-lg">
                        <SVG src="/icons/delete.svg" color="#333333" style={{ width: 18 }} />
                    </div>
                </Popconfirm>
            </Tooltip>}
            {recordSaving == '' && currentRecordChanged && <Tooltip color="rgb(14 165 233)" placement='top' title="Save">
                <div
                    onClick={() => { isFunction(props.onClickSaveRecord) && props.onClickSaveRecord(false) }} style={{ height: 30 }}
                    className="ml-2 flex self-center cursor-pointer inline-flex items-center justify-center px-3 py-1 rounded-md bg-sky-50 shadow hover:shadow-lg">
                    <SVG src="/icons/save.svg" color="#333333" style={{ width: 18 }} />
                </div>
            </Tooltip>}
            {recordSaving == '' && currentRecordChanged && <Tooltip color="rgb(14 165 233)" placement='top' title="Save &amp; Close">
                <div
                    onClick={() => { isFunction(props.onClickSaveRecord) && props.onClickSaveRecord(true) }} style={{ height: 30 }}
                    className="ml-2 flex self-center cursor-pointer inline-flex items-center justify-center px-3 py-1 rounded-md bg-sky-50 shadow hover:shadow-lg">
                    <SVG src="/icons/save-close.svg" color="#333333" style={{ width: 18 }} />
                </div>
            </Tooltip>
            }
        </div>
        {recordSaving == '' && <Tooltip color="#aaaaaa" placement='top' title="Close">
            <div onClick={() => { isFunction(props.onClickClose) && props.onClickClose() }} style={{ height: 30, top: 0, right: 0 , width: 20}}
                className="absolute flex self-center cursor-pointer inline-flex items-center justify-center px-1 py-1 border-0 border-b border-l text-xs font-medium text-gray-700">
                <SVG src="/icons/close.svg" color="#333333" style={{ width: 12 }} />
            </div>
        </Tooltip>}
        {recordSaving == '' && <Popconfirm
            placement="left"
            title={currentRecord.id}
            onConfirm={onCopyId}
            okText="Copy"
            cancelText="Canel">
            <Tooltip color="#aaaaaa" placement='bottom' title="ID">
                <div style={{ height: 40, bottom: 0, right: 0, width: 20 }}
                    className="absolute flex self-center cursor-pointer inline-flex items-center justify-center px-1 py-1 border-0 border-l text-xs text-gray-700">
                    ID
                </div>
            </Tooltip>
        </Popconfirm>}
    </div>
}

export default ListFormHeader