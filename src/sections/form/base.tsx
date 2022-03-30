import React, { useEffect, useState } from 'react';
import { isFunction, map, without, cloneDeep, isNil, each } from 'lodash';
import {
    CheckboxGroupField, SectionField, DateTimeField,
    CheckboxField, AlertField, PicklistField, TextField, FormFieldEditModal,
    PlaceholderField, HtmlField, LookupField, TagsField, LabelField
} from '../../index';
import { CSS, SVG, Div } from 'douhub-ui-web-basic';
import { isNonEmptyString, isObject, getRecordDisplay } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';
import { ReactSortable } from "react-sortablejs";

const FORM_CSS = `
    .form .form-row > div:first-child,
    .form .form-row > div:nth-child(2),
    .form .form-row > div:nth-child(3)
    {
        margin-right: 20px ;
    }

    .form .form-row.custom > div:first-child
    {
        margin-right: 10px !important;
    }

    .form .form-row > div:last-child
    {
        margin-right: 0px !important;
    }

    .form .form-row .field-label-custom .ant-select-selector
    {
        border: none !important;
        background: transparent !important;
        font-size: 0.75rem;
        line-height: 1;
        outline: none !important;
        box-shadow: none !important;
    }
`

const DISPLAY_NAME = 'FormBase';
const FormBase = observer((props: Record<string, any>) => {

    const wrapperClassName = isNonEmptyString(props.wrapperClassName) ? props.wrapperClassName : '';
    const wrapperStyle = isObject(props.wrapperStyle) ? props.wrapperStyle : {};
    const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
    const { doing } = props;
    const [data, setData] = useState<Record<string, any> | null>({});
    const [form, setForm] = useState<Record<string, any>>({ rows: [] });
    const [error, setError] = useState<string>('');

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const customMode = form.custom == true;
    const Row = customMode ? ReactSortable : Div;

    useEffect(() => {
        const newForm = cloneDeep(props.form);
        setForm(newForm);
    }, [props?.form?.name])

    useEffect(() => {
        const newData = isObject(props.data) ? cloneDeep(props.data) : {}
        setData(newData);
    }, [props.data])

    useEffect(() => {
        setError(props.error);
    }, [props.error])

    const updateData = (newData: Record<string, any>) => {
        setData(newData);
        if (!form.custom && isFunction(props.onChange)) {
            props.onChange(newData);
        }
    }

    const onChangeData = (field: Record<string, any>, value: any) => {

        let newData: any = cloneDeep(data);
        newData[field.name] = value;

        if (isFunction(field.onChange)) {
            newData = field.onChange(field, value, newData);
        }

        updateData(newData);
    }

    const onChangeTags = (field: Record<string, any>, value: any) => {
        const newData: any = isObject(data) ? cloneDeep(data) : {};
        newData[field.name] = cloneDeep(value);
        updateData(newData);
    }

    const onChangePicklist = (field: Record<string, any>, option: { value: number | string, text: string }) => {

        console.log({ option })

        const newData: any = isObject(data) ? cloneDeep(data) : {};
        const attributeName = field.name;
        if (isObject(option)) {
            const { value, text } = option;
            newData[attributeName] = value;
            newData[`${attributeName}_data`] = { value, text };
        }
        else {
            delete newData[attributeName];
            delete newData[`${attributeName}_data`];
        }

        updateData(newData);
    }

    const onChangeCustom = (newData: Record<string, any>) => {
        updateData(newData);
    }

    const onChangeLookupData = (field: Record<string, any>, record: Record<string, any>) => {

        const newData: any = isObject(data) ? cloneDeep(data) : {};
        const attributeName = field.name;
        if (isObject(record)) {
            const display = getRecordDisplay(record);
            const { entityName, entityType, id } = record;

            newData[attributeName] = id;
            newData[`${attributeName}_data`] = { entityName, entityType, id, display };
        }
        else {
            delete newData[attributeName];
            delete newData[`${attributeName}_data`];
        }

        updateData(newData);
    }

    const renderError = () => {
        if (!isNonEmptyString(error)) return null;
        return <div className="text-red-600 text-left w-full">{error}</div>
    }

    const customForm = (updatedForm: Record<string, any>) => {
        const newForm = cloneDeep(updatedForm);
        setForm(newForm);
        if (isFunction(props.onCustomForm)) props.onCustomForm(newForm)
    }

    const sortRows = (rows: Array<Record<string, any>>) => {
        const newForm = cloneDeep(form);
        newForm.rows = rows;
        customForm(newForm);
    }

    const addNewField = (rowIndex: number) => {
        const newForm = cloneDeep(form);
        newForm.rows.splice(rowIndex + 1, 0, {
            fields: [{
                label: 'New Field',
                name: 'newField',
                type: 'text',
                alwaysShowLabel: true
            }]
        });
        customForm(newForm);
        setEditRowIndex(rowIndex + 1);
    }

    const renderForm = () => {
        const rows = form.rows;
        return <Row
            list={rows}
            setList={sortRows}
            animation={200}
            delayOnTouchStart={true}
            handle=".form-row-sortable-handle"
            draggable=".form-row"
            delay={2}
        >
            {map(rows, (row: Record<string, any>, rowIndex: number) => {
                return <div key={`row${rowIndex}`} className={`${customMode ? 'custom' : ''} h-full form-row flex flex-row ${row.hidden == true ? 'hidden' : ''}`}>
                    {
                        [
                            customMode ? <div key="leftCustom" className="flex flex-col">
                                <div className="form-row-sortable-handle cursor-pointer">
                                    <SVG src="/icons/sort.svg" style={{ width: 22 }} />
                                </div>
                            </div> : <></>,
                            ...map(row.fields, (f) => {
                                const field = cloneDeep(f);
                                const key = field.id || field.name;
                                const dataValue = data && data[field.name];
                                const value = !isNil(field.value) && isNil(dataValue) ? field.value : dataValue;

                                switch (field.type) {
                                    case 'checkbox':
                                        {
                                            if (isNonEmptyString(field.groupValue)) {
                                                return <CheckboxGroupField key={`${key}-${field.groupValue}`} {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />
                                            }
                                            else {
                                                return <CheckboxField key={key} {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />
                                            }

                                        }
                                    case 'date':
                                        {
                                            return <DateTimeField key={key} {...field} value={value} record={data} format="date" onChange={(v: string) => onChangeData(field, v)} />

                                        }
                                    case 'time':
                                        {
                                            return <DateTimeField key={key} {...field} value={value} record={data} format="time" onChange={(v: string) => onChangeData(field, v)} />

                                        }
                                    case 'datetime':
                                        {
                                            return <DateTimeField key={key} {...field} value={value} record={data} format="datetime" onChange={(v: string) => onChangeData(field, v)} />

                                        }
                                    case 'html':
                                        {
                                            return <HtmlField key={key} {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />

                                        }
                                    case 'lookup':
                                        {
                                            return <LookupField key={key} {...field} value={data && data[`${field.name}_data`]} onChange={(record: Record<string, any>) => onChangeLookupData(field, record)} />
                                        }
                                    case 'placeholder':
                                        {
                                            return <PlaceholderField key={key} {...field} />
                                        }
                                    case 'tags':
                                        {
                                            return <TagsField key={key} {...field} value={value} record={data} onChange={(v: Array<Record<string, any>>) => onChangeTags(field, v)} />

                                        }
                                    case 'label':
                                        {
                                            return <LabelField key={key} {...field} />
                                        }
                                    case 'alert-info':
                                        {
                                            return <AlertField key={key} {...field} type="info" />
                                        }
                                    case 'alert-success':
                                        {
                                            return <AlertField key={key} {...field} type="success" />
                                        }
                                    case 'alert-error':
                                        {
                                            return <AlertField key={key} {...field} type="error" />
                                        }
                                    case 'section':
                                        {
                                            return <SectionField key={key} {...field} />
                                        }
                                    case 'picklist':
                                        {
                                            return <PicklistField key={key} {...field} value={value}
                                                onChange={(option: { value: number | string, text: string }) => onChangePicklist(field, option)} />
                                        }
                                    case 'custom':
                                        {
                                            const Content = field.content;
                                            return Content && <Content key={key} data={data} name={field.name} onChange={onChangeCustom} />
                                        }
                                    default:
                                        {
                                            return <TextField key={key} {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />

                                        }
                                }
                            }),
                            customMode ? <div className="flex flex-col">
                                <div className="cursor-pointer" onClick={() => { setEditRowIndex(rowIndex) }}>
                                    <SVG src="/icons/edit-property.svg" style={{ width: 18 }} />
                                </div>
                                <div className="cursor-pointer mt-2" onClick={() => addNewField(rowIndex)}>
                                    <SVG src="/icons/add-property.svg" style={{ width: 18 }} />
                                </div>
                            </div> : <></>
                        ]}
                </div>
            })}
        </Row>
    }

    const onSubmitEditedField = (newRowIndex: number, newField: Record<string, any>) => {

        //check duplication
        let duplicated = 0;
        each(form.rows, (row, rowIndex: number) => {
            each(row.fields, (field) => {
                if (field.name == newField.name && rowIndex != newRowIndex) duplicated++;
            })
        });

        if (duplicated > 0) return 'There is already a field with the same name.';

        const newForm = cloneDeep(form);
        newForm.rows[newRowIndex].fields[0] = cloneDeep(newField);
        customForm(newForm);
        setEditRowIndex(null);
        return null;
    }

    const onRemoveEditedField = (rowIndex: number) => {
        const newForm = cloneDeep(form);
        newForm.rows[rowIndex] = null;
        newForm.rows = without(newForm.rows, null);
        customForm(newForm);
        setEditRowIndex(null);
    }

    return <div className={`form-wrapper flex flex-col w-full ${wrapperClassName}`} style={wrapperStyle}>
        <CSS id="form-css" content={FORM_CSS} />
        <div className='form'>
            {isFunction(props.renderForm) ?
                props.renderForm({ onChangeData, data, doing, context }) :
                renderForm()}
        </div>
        {renderError()}
        {customMode && !isNil(editRowIndex) && <FormFieldEditModal
            field={form.rows[editRowIndex].fields[0]}
            onRemove={() => onRemoveEditedField(editRowIndex)}
            onSubmit={(newField: any) => { return onSubmitEditedField(editRowIndex, newField) }}
            onClose={() => setEditRowIndex(null)} />}
    </div>
});

FormBase.displayName = DISPLAY_NAME;
export default FormBase;