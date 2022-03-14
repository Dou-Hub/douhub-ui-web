import React, { useEffect, useState } from 'react';
import { isArray, cloneDeep, map, isNil, each, isBoolean, isFunction, without } from 'lodash';
import {
    _window, Table, Input, PicklistField, CSS, Popconfirm,
    DEFAULT_ACTION_COLUMN, SVG, Tooltip, CheckboxField
} from '../../index';

import { isNonEmptyString, newGuid, csvToJson, isObject, getPropName, doNothing } from 'douhub-helper-util';

const css = `
    .upload-model-step-3 .ant-table-cell
    {
        padding: 5px;
    }

    .upload-model-step-3 .ant-table-thead .ant-table-cell:before
    {
        display: none;
    }

    .upload-model-step-3 .ant-table-thead>tr>th
    {
        background: #f0f9ff !important;
        border-bottom: solid 1px #e0f2fe !important;
    }

    .upload-model-step-3 .field-picklist
    {
        border: none;
        margin-bottom: 0 !important;
        height: 26px;
        border: solid 1px #e5e7eb !important;
    }

    .upload-model-step-3 .field-picklist .ant-select-selector,
    .upload-model-step-3 .field-picklist .ant-select-selection-item
    {
        height: 24px !important;
        font-size: 0.75rem;
        line-height: 1.5rem;
    }

`

//we can always have predefinedColumns for the entities defined in the solution profile 
// {
//     "entityName": "User",
//     "uiName": "User",
//     "uiCollectionName": "Users",
//     "slug": "user",
//     "duplicationCheckPropName": "email",
//     "upload": {
//         "mustReplaceDuplication": true,
//         "data": {
//             "roles": [
//                 "PROJECT-PARTICIPANT"
//             ],
//             "membership":{
//                 "roles": [
//                     "PROJECT-PARTICIPANT"
//                 ]
//             }
//         },
//         "columns": {
//             "roles": {
//                 "title": "Roles",
//                 "type": "picklist",
//                 "valueIsArray": true
//                 "disabled": true,
//                 "options": [
//                     {
//                         "value": "PROJECT-PARTICIPANT",
//                         "text": "Participant"
//                     },
//                     {
//                         "value": "PROJECT-MANAGER",
//                         "text": "Manager"
//                     }
//                 ],
//                 "defaultValue": "PROJECT-PARTICIPANT"
//             }
//         }
//      }
//  }

const UploadModalStep3 = (props: {
    entity: Record<string, any>,
    recordForMembership?: Record<string, any>,
    onChange?: any,
    modalStyle: Record<string, any>,
    error?: string,
    onError?: any
}) => {

    const { entity, recordForMembership } = props;
    const recordIdForMembership = recordForMembership?.id;
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [dataChanged, setDataChanged] = useState<string>('');
    const mustReplaceDuplication = entity?.upload?.mustReplaceDuplication == true;
    const [replaceExisting, setReplaceExisting] = useState<boolean>(isBoolean(entity?.upload?.allowDuplication) ? entity?.upload?.allowDuplication : true || mustReplaceDuplication);
    const [error, setError] = useState('');

    useEffect(() => {
        setError(props.error ? props.error : '');
    }, [props.error])

    const { height } = props.modalStyle;

    const predefinedData = entity?.upload?.data;
    const predefinedColumns = isObject(entity?.upload?.columns) ? entity?.upload?.columns : {};

    useEffect(() => {
        const localData = _window.uploadedCSVFileContent;
        csvToJson(localData)
            .then((result: Array<Record<string, any>>) => {
                if (result.length > 0) {
                    const newData = isObject(predefinedData) ? map(result, (r) => {
                        const newRecord = { ...r, ...predefinedData };
                        if (newRecord.membership && recordIdForMembership) {
                            const membership = cloneDeep(newRecord.membership);
                            newRecord.membership = {};
                            newRecord.membership[recordIdForMembership] = membership;
                        }
                        return newRecord;
                    }) : cloneDeep(result);

                    const firstRow = newData[0];
                    _window.uploadedCSVFilePropsMapping = {}
                    each(Object.getOwnPropertyNames(firstRow), (columnName: string) => {
                        _window.uploadedCSVFilePropsMapping[columnName] = columnName;
                    });
                    updateColumns(firstRow);
                    _window.uploadedCSVFileJSON = newData;
                    console.log({ newData })
                    checkMissingFields();
                    setDataChanged(newGuid());
                }

            })
            .catch((error: any) => {
                console.error(error);
                onError('Sorry, there is issue in the CSV file submitted.');
            })
    }, []);

    useEffect(() => {
        const newData = cloneDeep(_window.uploadedCSVFileJSON ? _window.uploadedCSVFileJSON : []);
        setData(newData);
    }, [dataChanged]);

    const onError = (newError: string) => {
        setError(newError);
        if (isFunction(props.onError)) props.onError(newError)
    }

    const getMissingFields = (entity: Record<string, any>) => {
        const propsMapping = _window.uploadedCSVFilePropsMapping;
        let requiredFieldsString = isArray(entity.requiredFields) ? `,${map(entity.requiredFields, (r) => r.name).join(',')},` : '';
        each(Object.getOwnPropertyNames(propsMapping), (prop: string) => {
            const propName = getPropName(propsMapping[prop]);
            requiredFieldsString = requiredFieldsString.replace(`,${propName},`, ',');
        });
        return requiredFieldsString.replace(/[,]/ig, '').trim();
    }

    const checkMissingFields = () => {
        const missingFields = getMissingFields(entity);
        if (missingFields.length > 0) {
            onError(`The required fields (${missingFields}) are not provided.`);
        }
        else {
            onError('');
        }
    }

    const renderInputField = (columnName: string, propName: string, index: number, value: any) => {

        const predefinedColumn = predefinedColumns[propName];
        if (isObject(predefinedColumn)) {
            switch (predefinedColumn.type) {
                case 'picklist':
                    {

                        return <PicklistField
                            name={propName}
                            value={isArray(value) ? (value.length > 0 ? value[0] : null) : value}
                            {...predefinedColumn}
                            onChange={(newValue: any) => {
                                console.log({ VV: !isNil(newValue) ? (predefinedColumn.isArray ? [newValue] : newValue) : null })
                                onChangeValue(columnName, index, !isNil(newValue) ? (predefinedColumn.isArray ? [newValue] : newValue) : null);
                            }}
                        />
                    }
                default:
                    {
                        return <Input
                            className="w-full border text-xs py-1 px-2"
                            value={value}
                            disabled={predefinedColumn.disabled}
                            onChange={(newValue: string) => onChangeValue(columnName, index, newValue)} />
                    }
            }
        }
        else {
            return <Input className="w-full border text-xs py-1 px-2"
                value={value}
                onChange={(newValue: string) => onChangeValue(columnName, index, newValue)}
            />
        }
    }

    const onRemoveColumn = (columnName: string) => {
        _window.uploadedCSVFileJSON = map(_window.uploadedCSVFileJSON, (row: Record<string, any>) => {
            delete row[columnName];
            return row;
        });
        setDataChanged(newGuid());
        _window.uploadedCSVFileJSON.length>0 && updateColumns(cloneDeep( _window.uploadedCSVFileJSON[0]))
    }

    const updateColumns = (record: Record<string, any>) => {
        _window.uploadedCSVColumns = [
            ...without(map(Object.getOwnPropertyNames(record), (columnName: string, index: number) => {
                const title = _window.uploadedCSVFilePropsMapping[columnName];
                const propName = getPropName(title);
                if (predefinedColumns[propName]?.hidden) return null;
                return {
                    width: 120,
                    title: isNil(predefinedData[propName]) ? <div className="flex flex-col">
                        <div className="flex w-full items-center ">
                            <Input className="w-full border border-sky text-xs py-1 px-2 mr-2"
                            value={title}
                            onChange={(newColumnName: string) => onChangeProp(columnName, newColumnName)}
                        />
                            <Popconfirm
                                placement="topRight"
                                title="Remove this column?"
                                onCancel={() => { }}
                                onConfirm={() => onRemoveColumn(columnName)}
                                okText="Remove"
                                cancelText="Cancel">
                                <Tooltip color="#ff0000" placement='bottom' title={`Remove`}>
                                    <div className="cursor-pointer">
                                        <SVG src="/icons/delete.svg" color="#ff0000" style={{ width: 16 }} />
                                        </div>
                                </Tooltip>
                            </Popconfirm>
                        </div>
                        <div className="flex text-2xs items-center mt-1" style={{ marginRight: 5 }}>
                            <Tooltip color="#999999" placement='bottom' title={`The property name in the system`}>
                                <div><SVG src="/icons/tag-h.svg" style={{ width: 12 }} /></div>
                            </Tooltip>
                            <span className="pl-1">{propName}</span>
                        </div>
                    </div> : <div className="flex flex-col">
                        <div className="w-full border border-sky text-xs py-1 px-2 bg-gray-50 flex items-center">
                            <SVG src="/icons/lock.svg" style={{ width: 12 }} />
                            <span className="ml-1">{isNonEmptyString(predefinedColumns[propName]?.title) ? predefinedColumns[propName]?.title : propName}</span>
                        </div>
                        <div className="flex text-2xs items-center mt-1" style={{ marginRight: 5 }}>
                            <Tooltip color="#999999" placement='top' title={`The property name in the system`}>
                                <div><SVG src="/icons/tag-h.svg" style={{ width: 12 }} /></div>
                            </Tooltip>
                            <span className="pl-1">{propName}</span>
                        </div>
                    </div>
                    ,
                    dataIndex: columnName,
                    key: `col${index}`,
                    render: (v: string, r: Record<string, any>, index: number) => {
                        doNothing(isNil(r));
                        return renderInputField(columnName, propName, index, v);
                    }
                }
            }), null),
            DEFAULT_ACTION_COLUMN(onClickAction, { uiName: 'Row' })
        ];
        setDataChanged(newGuid())
    }



    const onChangeProp = (oldColumnName: string, newColumnName: string) => {
        //console.log({ oldColumnName, newColumnName });
        _window.uploadedCSVFilePropsMapping[oldColumnName] = newColumnName;
        updateColumns(_window.uploadedCSVFileJSON[0]);
        checkMissingFields();
    }

    const onChangeValue = (columnName: string, index: number, newValue: any) => {
        console.log({ columnName, index, newValue })
        _window.uploadedCSVFileJSON = map(_window.uploadedCSVFileJSON, (row: Record<string, any>, rowIndex: number) => {
            const newRow = cloneDeep(row);
            if (index == rowIndex) newRow[columnName] = newValue;
            return newRow;
        });
        setDataChanged(newGuid());
    }

    const onClickAction = (record: Record<string, any>, action: string, entity?: Record<string, any>, rowIndex?: number) => {
        doNothing(isNil({ record, action, entity }));
        const index = rowIndex ? rowIndex : 0;
        const newData = cloneDeep(data);
        _window.uploadedCSVFileJSON = [...newData.slice(0, index), ...newData.slice(index + 1)];
        setDataChanged(newGuid());
    }

    const onChangeReplaceExisting = (v: any) => {
        console.log({ v });
        setReplaceExisting(v);
    }

    const tableHeight = height - 200 - (entity.duplicationCheckPropName ? 70 : 0) - (isNonEmptyString(error) ? 50 : 0);
    const cssTable = `
        .upload-model-step-3 .ant-table-body
        {
            height: ${tableHeight}px;
        }
    `

    console.log({ VVV: _window.uploadedCSVFileJSON })

    return <div className="w-full upload-model-step-3" style={{ height: height - 150 - (isNonEmptyString(error) ? 50 : 0) }}>
        <CSS id='upload-model-step-3' content={css} />
        <style>{cssTable}</style>
        {isNonEmptyString(entity.duplicationCheckPropName) && <CheckboxField
            className="mb-4"
            onChange={onChangeReplaceExisting}
            hideCheckboxWhenDisabled={mustReplaceDuplication}
            value={replaceExisting}
            disabled={mustReplaceDuplication}
            label={`Update any existing ${entity.uiName.toLowerCase()}`}
            subLabel={`After duplication check on the '${entity.duplicationCheckPropName}' field, we’ll automatically replace existing ${entity.uiCollectionName.toLowerCase()} with the data from your import.`}
        />}

        {data.length > 0 && <div className="w-full border border-1"><Table
            pagination={false}
            columns={_window.uploadedCSVColumns}
            ant-table-body
            scroll={{ y: tableHeight }}
            dataSource={data} /></div>}
    </div>
}

export default UploadModalStep3;