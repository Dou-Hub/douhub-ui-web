import React, { useEffect, useState } from 'react';
import { isFunction, map, isNil, cloneDeep } from 'lodash';
import TextField from '../../fields/text';
import CheckboxGroupField from '../../fields/checkbox-group';
import SectionField from '../../fields/section';
import CheckboxField from '../../fields/checkbox';

import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';

const DISPLAY_NAME = 'FormBase';
const FormBase = observer((props: Record<string, any>) => {

    const { form, doing } = props;
    const [data, setData] = useState<Record<string, any> | null>(null);
    const [error, setError] = useState<string>('');

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    useEffect(() => {
        const newData = isObject(props.data) ? props.data : {}
        if (isNil(data) || isObject(data) && newData.id != data.id) {
            setData(newData);
        }
    }, [props.data])

    useEffect(() => {
        setError(props.error);
    }, [props.error])

    const updateData = (newWebPageData: Record<string, any>) => {
        setData(newWebPageData);
        if (isFunction(props.onChange)) props.onChange(newWebPageData);
    }

    const onChangeData = (field: Record<string, any>, value: any) => {
        const newWebPageData = cloneDeep(data);
        if (newWebPageData) newWebPageData[field.name] = value;
        console.log({ newWebPageData })
        updateData(newWebPageData ? newWebPageData : {});
    }

    const renderError = () => {
        if (!isNonEmptyString(error)) return null;
        return <div className="text-red-600 text-left w-full">{error}</div>
    }

    const renderForm = () => {
        return map(form.rows, (row) => {
            return map(row.fields, (field) => {
                const key = field.id || field.name;
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
                    case 'section':
                        {
                            return <SectionField key={key} {...field} onChange={(v: string) => onChangeData(field, v)} />
                        }
                    default:
                        {
                            return <TextField key={key} {...field} onChange={(v: string) => onChangeData(field, v)} />
                        }
                }
            })
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