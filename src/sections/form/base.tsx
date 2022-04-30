import React, { useEffect, useState } from 'react';
import { isFunction, map, without, cloneDeep, isNil, each, isNumber, isEmpty, isArray } from 'lodash';
import {
    CheckboxGroupField as ICheckboxGroupField,
    SectionField as ISectionField,
    DateTimeField as IDateTimeField,
    UploadPhotoField as IUploadPhotoField,
    CheckboxField as ICheckboxField,
    AlertField as IAlertField,
    PicklistField as IPicklistField,
    TextField as ITextField,
    FormFieldEditModal as IFormFieldEditModal,
    TreeMultiSelectField as ITreeMultiSelectField,
    PlaceholderField as IPlaceholderField,
    HtmlField as IHtmlField,
    LookupField as ILookupField,
    TagsField as ITagsField,
    LabelField as ILabelField,
    TreeSingleSelectField as ITreeSingleSelectField
} from '../../index';
import { CSS, SVG, _window, Div, callAPI } from 'douhub-ui-web-basic';
import { isNonEmptyString, isObject, getRecordDisplay, getEntity } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';
import { ReactSortable } from "react-sortablejs";





export const prepareFormToSave = (form: Record<string, any>) => {
    const version = isNumber(form.version) ? form.version + 1 : 1;
    return {
        ...form,
        rows: map(form.rows, (row: any) => {
            return { ...row, fields: map(row.fields, (field: any) => { return { ...field, autoNaming: false } }) }
        }), custom: false, version
    };
}


const FORM_CSS = `
    .form .form-row .form-col
    {
        margin-right: 20px ;
        width: 100%;
    }

    .form .form-row .form-col-last
    {
        margin-right: 0 !important;
    }

    .form .form-row.custom > div:first-child
    {
        margin-right: 10px !important;
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
export const FormPreviewButton = (props: { 
    data: Record<string,any>, 
    className?: string, 
    style?: Record<string,any>,
    baseUrl?:string
    }) => {
    const { data, className, style } = props;
    const solution = _window.solution;
    const [doing, setDoing] = useState('');
    const baseUrl = isNonEmptyString(props.baseUrl) ? props.baseUrl : '/read/';
    const entity = getEntity(solution, data.entityName, data.entityType);
    const themeColor = solution?.theme?.color;
    const backgroundColor = themeColor && isNonEmptyString(themeColor["100"]) ? themeColor["100"] : '#ffffff';

    const onClick = () => {
        if (data.isGlobal) return _window.open(`${baseUrl}${entity?.slug}/${data.slug}`);

        setDoing('Creating link ...');
        callAPI(solution, `${solution.apis.data}token`, { id: data.id }, 'POST')
            .then((r: any) => {
                _window.open(`${baseUrl}${entity?.slug}/${data.slug}?token=${r.result}`)
            })
            .catch((error) => {
                console.error({ error });
            })
            .finally(() => {
                setDoing('');
            })
    }

    return <button onClick={onClick} style={{ height: 28, marginTop: -5, backgroundColor, ...style }}
        className={`flex flex-col cursor-pointer whitespace-nowrap justify-center py-2 px-8 rounded-md shadow text-xs font-medium hover:shadow-lg ${isNonEmptyString(className)?className:''}`}>
        {isNonEmptyString(doing) ? doing : 'Preview'}
    </button>
}

const DISPLAY_NAME = 'FormBase';
const FormBase = observer((props: Record<string, any>) => {

    const Fields = isObject(props.Fields) ? props.Fields : {};
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
    const Row = customMode ? ReactSortable : (Fields.Row ? Fields.Row : Div);

    const CheckboxGroupField = Fields.CheckboxGroupField ? Fields.CheckboxGroupField : ICheckboxGroupField;
    const SectionField = Fields.SectionField ? Fields.SectionField : ISectionField;
    const DateTimeField = Fields.DateTimeField ? Fields.DateTimeField : IDateTimeField;
    const UploadPhotoField = Fields.UploadPhotoField ? Fields.UploadPhotoField : IUploadPhotoField;
    const CheckboxField = Fields.CheckboxField ? Fields.CheckboxField : ICheckboxField;
    const AlertField = Fields.AlertField ? Fields.AlertField : IAlertField;
    const PicklistField = Fields.PicklistField ? Fields.PicklistField : IPicklistField;
    const TextField = Fields.TextField ? Fields.TextField : ITextField;
    const FormFieldEditModal = Fields.FormFieldEditModal ? Fields.FormFieldEditModal : IFormFieldEditModal;
    const TreeMultiSelectField = Fields.TreeMultiSelectField ? Fields.TreeMultiSelectField : ITreeMultiSelectField;
    const PlaceholderField = Fields.PlaceholderField ? Fields.PlaceholderField : IPlaceholderField;
    const HtmlField = Fields.HtmlField ? Fields.HtmlField : IHtmlField;
    const LookupField = Fields.LookupField ? Fields.LookupField : ILookupField;
    const TagsField = Fields.TagsField ? Fields.TagsField : ITagsField;
    const LabelField = Fields.LabelField ? Fields.LabelField : ILabelField;
    const TreeSingleSelectField = Fields.TreeSingleSelectField ? Fields.TreeSingleSelectField : ITreeSingleSelectField;

    useEffect(() => {
        const newForm = cloneDeep(props.form);
        setForm(newForm);
    }, [props?.form?.name, props?.form?.version, props?.form?.id])

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

        const oldData: any = cloneDeep(data);
        let newData: any = cloneDeep(data);

        if (isNil(value)) {
            delete newData[field.name];
        }
        else {
            newData[field.name] = value;
        }

        if (isFunction(field.onChange)) {
            newData = field.onChange(field, value, newData, oldData);
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

    const onChangeTreeSingleSelectData = (field: Record<string, any>, node: Record<string, any>) => {

        const newData: any = isObject(data) ? cloneDeep(data) : {};
        const attributeName = field.name;
        if (isObject(node) && !isEmpty(node)) {
            const { id, text } = node;
            newData[attributeName] = id;
            newData[`${attributeName}_data`] = { id, text };
        }
        else {
            delete newData[attributeName];
            delete newData[`${attributeName}_data`];
        }

        updateData(newData);
    }

    const onChangeTreeMultiSelectData = (field: Record<string, any>, nodes: Record<string, any>[]) => {

        const newData: any = isObject(data) ? cloneDeep(data) : {};
        const attributeName = field.name;
        if (isArray(nodes) && nodes.length > 0) {
            newData[attributeName] = map(nodes, (node) => { return node.id });
            newData[`${attributeName}_data`] = cloneDeep(nodes);
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
                autoNaming: true,
                alwaysShowLabel: true
            }]
        });
        customForm(newForm);
        setEditRowIndex(rowIndex + 1);
    }

    const renderField = (field: Record<string, any>) => {

        const dataValue = data && data[field.name];
        const value = field.useFieldValue==true ? field.value : dataValue;

        switch (field.type) {
            case 'tree-single-select':
                {
                    return <TreeSingleSelectField
                        {...field}
                        value={value}
                        onChange={(node: Record<string, any>) => onChangeTreeSingleSelectData(field, node)} />
                }
            case 'tree-multi-select':
                {
                    return <TreeMultiSelectField
                        {...field}
                        value={value}
                        onChange={(nodes: Record<string, any>[]) => onChangeTreeMultiSelectData(field, nodes)} />
                }
            case 'upload-photo':
                {
                    return <UploadPhotoField {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />
                }
            case 'checkbox':
                {
                    if (isNonEmptyString(field.groupValue)) {
                        return <CheckboxGroupField  {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />
                    }
                    else {
                        return <CheckboxField {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />
                    }

                }
            case 'date':
                {
                    return <DateTimeField {...field} value={value} record={data} format="date" onChange={(v: string) => onChangeData(field, v)} />
                }
            case 'time':
                {
                    return <DateTimeField {...field} value={value} record={data} format="time" onChange={(v: string) => onChangeData(field, v)} />

                }
            case 'datetime':
                {
                    return <DateTimeField {...field} value={value} record={data} format="datetime" onChange={(v: string) => onChangeData(field, v)} />

                }
            case 'html':
                {
                    return <HtmlField {...field} value={value} record={data} onChange={(v: string) => onChangeData(field, v)} />

                }
            case 'lookup':
                {
                    return <LookupField {...field} value={data && data[`${field.name}_data`]} onChange={(record: Record<string, any>) => onChangeLookupData(field, record)} />
                }
            case 'placeholder':
                {
                    return <PlaceholderField {...field} />
                }
            case 'tags':
                {
                    return <TagsField {...field} value={value} record={data} onChange={(v: Array<Record<string, any>>) => onChangeTags(field, v)} />

                }
            case 'label':
                {
                    return <LabelField {...field} />
                }
            case 'alert-info':
                {
                    return <AlertField {...field} type="info" />
                }
            case 'alert-success':
                {
                    return <AlertField {...field} type="success" />
                }
            case 'alert-warning':
                {
                    return <AlertField {...field} type="warning" />
                }
            case 'alert-error':
                {
                    return <AlertField {...field} type="error" />
                }
            case 'section':
                {
                    return <SectionField {...field} />
                }
            case 'picklist':
                {
                    return <PicklistField {...field} value={value}
                        onChange={(option: { value: number | string, text: string }) => onChangePicklist(field, option)} />
                }
            case 'custom':
                {
                    const Content = field.content;
                    return Content && <Content {...field} data={data} name={field.name} onChange={onChangeCustom} />
                }
            default:
                {
                    return <TextField {...field} value={value} record={data} onChange={(v: any) => onChangeData(field, v)} />

                }
        }
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
            removeProps={['list', 'setList', 'animation', 'delayOnTouchStart', 'delayOnTouchStart', 'handle', 'draggable', 'delay']}
        >
            {map(rows, (row: Record<string, any>, rowIndex: number) => {
                return isNil(row) ? <></> : <div key={`row${rowIndex}`} className={`${customMode ? 'custom' : ''} h-full form-row form-row-${rowIndex} ${rowIndex == 0 ? 'form-row-first' : ''} ${rowIndex == rows.length - 1 ? 'form-row-last' : ''} flex flex-row ${row.hidden == true ? 'hidden' : ''}`}>
                    {
                        [
                            customMode ? <div key="col-leftCustom" className="flex flex-col">
                                <div className="form-row-sortable-handle cursor-pointer">
                                    <SVG src="/icons/sort.svg" style={{ width: 22 }} />
                                </div>
                            </div> : <></>,
                            ...map(row.fields, (field, colIndex: number) => {
                                //const field = cloneDeep(f);
                                return <div key={`col-${rowIndex}-${colIndex}`}
                                    style={isObject(field.colStyle) ? field.colStyle : {}}
                                    className={`form-col flex flex-row  form-col-${colIndex} ${colIndex == 0 ? 'form-col-first' : ''} ${colIndex == row.fields.length - 1 ? 'form-col-last' : ''} ${field.hidden == true ? 'hidden' : ''} ${isNonEmptyString(field.colClassName) ? field.colClassName : ''}`}>
                                    {renderField(field)}
                                </div>
                            }),
                            customMode ? <div key="col-rightCustom" className="flex flex-col ml-2">
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