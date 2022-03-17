import React, { useEffect, useState } from 'react';
import { isFunction, without } from 'lodash';
import { FormBase } from '../../index';
import { isObject } from 'douhub-helper-util';
import { _window, _track } from 'douhub-ui-web-basic';

const DISPLAY_NAME = 'DefaultForm';
const DefaultForm = (props: Record<string, any>) => {

    const [data, setData] = useState<Record<string, any> | null>(isObject(props.data) ? props.data : null);

    useEffect(() => {
        setData(isObject(props.data) ? { ...props.data } : null);
    }, [props.data]);

    const onChange = (newData: Record<string, any>) => {
        setData({ ...newData });
        if (isFunction(props.onChange)) props.onChange({ ...newData });
    }

    const form = {
        rows: without([
            {
                fields: [
                    {
                        name: 'name',
                        type: 'text',
                        value: data?.name
                    }
                ]
            }
        ], null)
    }

    return <div className="flex flex-col w-full">
        <FormBase data={data} form={form} onChange={onChange} />
    </div>
};

DefaultForm.displayName = DISPLAY_NAME;
export default DefaultForm;