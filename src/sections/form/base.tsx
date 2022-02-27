import React, { useEffect, useState } from 'react';
import { isFunction, map, isEmpty } from 'lodash';
import TextField from '../../fields/text';
import CheckboxGroupField from '../../fields/checkbox-group';
import SectionField from '../../fields/section';
import CheckboxField from '../../fields/checkbox';
import AlertField from '../../fields/alert';
import PicklistField from '../../fields/picklist';
import PlaceholderField from '../../fields/placeholder';
import HtmlField from '../../fields/html';
import LookupField from '../../fields/lookup';

import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';

const DISPLAY_NAME = 'FormBase';
const FormBase = observer((props: Record<string, any>) => {

    const { form, doing } = props;
    const [data, setData] = useState<Record<string, any> | null>(props.data);
    const [error, setError] = useState<string>('');

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    useEffect(() => {
        if (isEmpty(props.data)) return;
        const newData = isObject(props.data) ? { ...props.data } : {}
        setData(newData);
    }, [props.data])

    useEffect(() => {
        setError(props.error);
    }, [props.error])

    const updateData = (newData: Record<string, any>) => {
        setData(newData);
        if (isFunction(props.onChange)) props.onChange(newData);
    }

    const onChangeData = (field: Record<string, any>, value: any) => {
        const newData = { ...data };
        newData[field.name] = value;
        updateData(newData);
    }

    const onChangeLookupData = (field: Record<string, any>, value: any, record:Record<string,any>) => {
        const newData = { ...data };
        newData[field.name] = value;
        if (isObject(record)) 
        {
            const {id, _ts, display, stateCode} = record;
            newData[`${field.name}_data`] = {id, _ts, display, stateCode};
        }
        updateData(newData);
    }

    const renderError = () => {
        if (!isNonEmptyString(error)) return null;
        return <div className="text-red-600 text-left w-full">{error}</div>
    }

    const renderForm = () => {
        return map(form.rows, (row, index) => {
            return <div key={`row${index}`} className="flex flex-row">{map(row.fields, (field) => {
                const key = field.id || field.name;
                field.value = data && data[field.name];
                field.record = data;
                switch (field.type) {
                    case 'checkbox':
                        {
                            if (isNonEmptyString(field.groupValue)) {
                                return <CheckboxGroupField key={`${key}-${field.groupValue}`} {...field} onChange={(v: string) => onChangeData(field, v)} />
                            }
                            else {
                                return <CheckboxField key={key} {...field} onChange={(v: string) => onChangeData(field, v)} />
                            }

                        }
                    case 'html':
                        {
                            return <HtmlField key={key} {...field} onChange={(v: string) => onChangeData(field, v)}  />
                        }
                    case 'lookup':
                        {
                            return <LookupField key={key} {...field} onChange={(id: string, record:Record<string,any>) => onChangeLookupData(field, id, record)}  />
                        }
                    case 'placeholder':
                        {
                            return <PlaceholderField key={key} {...field} />
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
                            return <PicklistField key={key} {...field} onChange={(v: string) => onChangeData(field, v)} />
                        }
                    default:
                        {
                            return <TextField key={key} {...field} onChange={(v: string) => onChangeData(field, v)} />
                        }
                }
            })}
            </div>
        });
    }

    return <div className="flex flex-col w-full">
        <div>
            {isFunction(props.renderForm) ?
                props.renderForm({ onChangeData, data, doing, context }) :
                renderForm()}
        </div>
        {renderError()}
    </div>
});

FormBase.displayName = DISPLAY_NAME;
export default FormBase;