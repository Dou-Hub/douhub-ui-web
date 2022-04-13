import React from 'react';
import { isFunction, without } from 'lodash';
import DefaultForm from '../form/default';
import { BaseList, DEFAULT_EDIT_COLUMN, DEFAULT_ACTION_COLUMN, ListCategoriesTags } from '../../index';

import { _window } from 'douhub-ui-web-basic';
import { hasRole, isNonEmptyString } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';

const DefaultList = observer((props: Record<string, any>) => {
    const { entity, height, search, webQuery, tags, categories } = props;
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const allowCreate = isFunction(props.allowCreate)?props.allowCreate():isNonEmptyString(hasRole(context, 'ORG-ADMIN'));

    const onClickRecord = (record: Record<string, any>, action: string) => {
        isFunction(props.onClickRecord) && props.onClickRecord(record, action);
    }

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

    return (
        <BaseList
            ListCategoriesTags={ListCategoriesTags}
            allowUpload={false}
            allowCreate={allowCreate}
            webQuery={webQuery}
            search={search}
            tags={tags}
            categories={categories}
            onRemoveSearch={props.onRemoveSearch}
            onRemoveTag={props.onRemoveTag}
            onRemoveCategory={props.onRemoveCategory}
            onClickRecord={onClickRecord}
            selectionType="checkbox"
            width={500}
            height={height}
            entity={entity}
            columns={columns}
            Form={DefaultForm}
            maxFormWidth={1000}
        />
    )
})


export default DefaultList;