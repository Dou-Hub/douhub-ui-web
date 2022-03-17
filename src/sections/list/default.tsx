import React from 'react';
import BaseList from './base';
import { doNothing, hasRole, isNonEmptyString } from 'douhub-helper-util';
import { without, isNil, find } from 'lodash';
import { DEFAULT_EDIT_COLUMN,  DEFAULT_ACTION_COLUMN, DefaultForm } from '../../index';
import { _window } from 'douhub-ui-web-basic';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';

const DefaultList = observer((props: Record<string, any>) => {
    const { entity, height, search, webQuery, width, allowUpload } = props;
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const allowCreate = hasRole(context, 'ORG-ADMIN') || find(entity.allowCreateRoles,(role:string)=>isNonEmptyString(hasRole(context, role)))?true:false;

    const columns = (
        onClick: (record: Record<string, any>, action: string) => {},
        entity: Record<string, any>
    ) => {
        return without([
            {
                title: 'Title',
                dataIndex: 'display',
                id: 'display',
                render: (v: string, data: Record<string, any>) => {
                    const text = data.highlight?.searchDisplay ? data.highlight?.searchDisplay : v;
                    const searchDetail = data.highlight?.searchContent ? data.highlight?.searchContent : [];

                    return <div className="flex flex-col items-start">
                        <div className="text-sm font-normal text-gray-900" dangerouslySetInnerHTML={{ __html: text }}></div>
                        {searchDetail.length > 0 && <div className="mt-1 text-xs font-light text-gray-900" dangerouslySetInnerHTML={{ __html: searchDetail[0] }}></div>}
                    </div>
                },
            },
            DEFAULT_EDIT_COLUMN(onClick, entity),
            DEFAULT_ACTION_COLUMN(onClick, entity)
        ], undefined);
    };

    const onClickRecord = (record: Record<string, any>, action: string) => {
       doNothing(isNil({record, action}))
    }

    return (
        <BaseList
            entity={entity}
            allowUpload={allowUpload}
            allowCreate={allowCreate}
            webQuery={webQuery}
            search={search}
            onRemoveSearch={props.onRemoveSearch}
            onClickRecord={onClickRecord}
            selectionType="checkbox"
            width={width}
            height={height}
            columns={columns}
            Form={DefaultForm}
            Header={DefaultForm}
        />
    )
})


export default DefaultList;