import React from 'react';
import { DefaultForm, ListHeader as IListHeader, ListBase as ListBaseInternal } from '../../index';
import { _window } from 'douhub-ui-web-basic';
import { isNumber, isFunction, isNil } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';

const BaseList = observer((props: {
    entity: Record<string, any>,
    allowCreate?: boolean,
    allowUpload?: boolean,
    columns: Record<string, any>,
    height?: number,
    width?: number,
    Form?: any,
    ListHeader?: any,
    selectionType?: 'checkbox' | 'radio',
    search?: string,
    tags?: string[],
    categories?: Record<string, any>[],
    showViewToggleButton?: boolean,
    query?: Record<string, any>,
    onClickRecord?: (record: Record<string, any>, action: string) => any,
    onRemoveSearch?: (filter: Record<string, any>) => any,
    onRemoveTag?: (filter: Record<string, any>) => any,
    onRemoveCategory?: (filter: Record<string, any>) => any,
    onClickGridCard?: any,
    ListCategoriesTags?: any,
    deleteButtonLabel?: string,
    deleteConfirmationMessage?: string
    maxFormWidth?: number,
    ListBase?: any,
    Card?: any,
    children?: any
    sidePaneKey?: string,
    view?: 'table' | 'grid',
    FormFields?: Record<string, any>,
    lgScreen?: boolean,
    cardLayout?: string,
    recordForMembership?: Record<string, any>,
    formHeightAdjust?: number
}) => {
    const { entity, search, query, columns, tags, categories, cardLayout,
        view, showViewToggleButton, onClickGridCard } = props;
    const width = isNumber(props.width) ? props.width : 500;
    const height = isNumber(props.height) ? props.height : 500;
    const selectionType = props.selectionType ? props.selectionType : 'checkbox';
    const allowCreate = props.allowCreate == true && entity.allowCreate != false;
    const allowUpload = props.allowUpload == true && entity.allowUpload == true && allowCreate;
    const Form = props.Form ? props.Form : DefaultForm;
    const ListHeader = props.ListHeader ? props.ListHeader : IListHeader;
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const recordForMembership = props.recordForMembership ? props.recordForMembership : context.recordByMembership;
    const ListBase = !isNil(props.ListBase) ? props.ListBase : ListBaseInternal;
    // const solution = _window.solution;

    const onClickRecord = (record: Record<string, any>, action: string) => {
        if (isFunction(props.onClickRecord)) props.onClickRecord(record, action);
    }

    const onRemoveSearch = (filter: Record<string, any>) => {
        if (isFunction(props.onRemoveSearch)) props.onRemoveSearch(filter);
    }

    const onRemoveTag = (filter: Record<string, any>) => {
        if (isFunction(props.onRemoveTag)) props.onRemoveTag(filter);
    }

    const onRemoveCategory = (filter: Record<string, any>) => {
        if (isFunction(props.onRemoveCategory)) props.onRemoveCategory(filter);
    }

    return (
        <>
            <ListBase
                {...props}
                recordForMembership={recordForMembership}
                allowUpload={allowUpload}
                allowCreate={allowCreate}
                queryId={query && query.query}
                statusId={query && query.status}
                search={search}
                tags={tags}
                categories={categories}
                onRemoveSearch={onRemoveSearch}
                onRemoveTag={onRemoveTag}
                onRemoveCategory={onRemoveCategory}
                onClickRecord={onClickRecord}
                selectionType={selectionType}
                width={width}
                ListHeader={ListHeader}
                height={height}
                entity={entity}
                columns={columns}
                cardLayout={cardLayout}
                Form={Form}
                view={view}
                onClickGridCard={onClickGridCard}
                showViewToggleButton={showViewToggleButton}
            />
            {props.children}
        </>
    )
});


export default BaseList;