import React from 'react';
import { isFunction } from 'lodash';
import DefaultForm from '../form/default';
import { BaseList, DEFAULT_EDIT_COLUMN, DEFAULT_ACTION_COLUMN, DEFAULT_COLUMNS } from '../../index';

import { _window } from 'douhub-ui-web-basic';
import { hasRole, isNonEmptyString } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';

const DefaultList = observer((props: Record<string, any>) => {
    const { entity, height } = props;
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const allowCreate = isFunction(props.allowCreate)?props.allowCreate():isNonEmptyString(hasRole(context, 'ORG-ADMIN'));


    const columns = (
        onClick: (record: Record<string, any>, action: string) => {},
        entity: Record<string, any>
    ) => {
        return [
            ...DEFAULT_COLUMNS(onClick, entity),
            DEFAULT_EDIT_COLUMN(onClick, entity),
            DEFAULT_ACTION_COLUMN(onClick, entity)
        ]
    };

    return (
        <BaseList
            {...props}
            allowUpload={false}
            allowCreate={allowCreate}
            selectionType="checkbox"
            height={height}
            entity={entity}
            columns={columns}
            Form={DefaultForm}
            maxFormWidth={1000}
        />
    )
})


export default DefaultList;