import React from 'react';
import {  DefaultForm } from '../../index';
import { _window } from 'douhub-ui-web-basic';
import ListHeader from './list-header';
import { isNumber, isFunction } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';
import ListBase from './list-base';

const BaseList = observer((props: {
    entity: Record<string, any>,
    allowCreate: boolean,
    allowUpload: boolean,
    columns: Record<string, any>,
    height: number,
    width?: number,
    Form?: any,
    Header?: any,
    selectionType?: 'checkbox' | 'radio',
    search?: string,
    webQuery?: Record<string, any>,
    onClickRecord?: (record: Record<string, any>, action: string) => any,
    onRemoveSearch?: (filter: Record<string, any>) => any,
    ListCategoriesTags?: any,
    deleteButtonLabel?: string,
    deleteConfirmationMessage?: string

    children?: any
}) => {
    const { entity, height, width, search, webQuery, columns } = props;
    const selectionType = props.selectionType ? props.selectionType : 'checkbox';
    const allowCreate = props.allowCreate == true && entity.allowCreate != false;
    const allowUpload = props.allowUpload == true && entity.allowUpload == true && allowCreate;
    const Form = props.Form ? props.Form : DefaultForm;
    const Header = props.Header ? props.Header : ListHeader;
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const recordForMembership = context.recordByMembership;
    // const solution = _window.solution;

    const onClickRecord = (record: Record<string, any>, action: string) => {
        if (isFunction(props.onClickRecord)) props.onClickRecord(record, action);
    }

    const onRemoveSearch = (filter: Record<string, any>) => {
        if (isFunction(props.onRemoveSearch)) props.onRemoveSearch(filter);
    }

    return (
        <>
            <ListBase
                {...props}
                recordForMembership={recordForMembership}
                allowUpload={allowUpload}
                allowCreate={allowCreate}
                queryId={webQuery && webQuery.query}
                statusId={webQuery && webQuery.status}
                search={search}
                onRemoveSearch={onRemoveSearch}
                onClickRecord={onClickRecord}
                selectionType={selectionType}
                width={isNumber(width) ? width : 500}
                Header={Header}
                height={height}
                entity={entity}
                columns={columns}
                Form={Form}
            />
            {props.children}
        </>
    )
});


export default BaseList;