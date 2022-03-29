import React, { useEffect, useState } from 'react';
import { cloneDeep, isFunction } from 'lodash';
import {  isObject } from 'douhub-helper-util';
import FormBase from './base';
import { _window } from 'douhub-ui-web-basic';

const DISPLAY_NAME = 'DefaultForm';

const DefaultForm = (props: Record<string, any>) => {

    const [data, setData] = useState<Record<string, any>>({});

    useEffect(() => {
        const newData = isObject(props.data) ? cloneDeep(props.data) : {};
        setData(newData);
    }, [props.data]);

    const onChange = (changedData: Record<string, any>) => {
        const newData = changedData ? cloneDeep(changedData) : {};
        setData(newData);
        if (isFunction(props.onChange)) props.onChange(newData);
    }

    const form = {
        rows: [
            {
                fields: [
                    {
                        name: 'title',
                        type: 'text',
                        placeholder: `Type title here`,
                        label: "Title",
                        alwaysShowLabel: true
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'tags',
                        type: 'tags',
                        label: "Tags",
                        placeholder: `Type and press enter to create tags here`,
                        alwaysShowLabel: true
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'description',
                        type: 'textarea',
                        label: "Description",
                        placeholder: "Type description here",
                        alwaysShowLabel: true
                    }
                ]
            }
        ]
    }

    return <div className="flex flex-col w-full">
        <FormBase {...props} data={data} form={form} onChange={onChange} />
    </div>
};

DefaultForm.displayName = DISPLAY_NAME;
export default DefaultForm;