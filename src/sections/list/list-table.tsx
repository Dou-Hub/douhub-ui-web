import Table from '../../controls/antd/table';
import { _window } from 'douhub-ui-web-basic';
import React from 'react';
import { isFunction, isNumber } from 'lodash';

const ListTable = (props: {
    height: number,
    width?: number,
    columns: any,
    selectionType?: 'checkbox' | 'radio',
    onRowSelected?: (selectedIds: React.Key[], selectedRecords: Record<string, any>[]) => void,
    footer?:any,
    data: Record<string, any>[]
}) => {

    const { columns, height, width, selectionType, data } = props;

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: Record<string, any>[]) => {
            if (isFunction(props.onRowSelected)) props.onRowSelected(selectedRowKeys, selectedRows)
        }
    };

    return <Table
        rowKey="id"
        rowSelection={!selectionType ? undefined : {
            type: selectionType,
            ...rowSelection,
        }}
        scroll={isNumber(width) ? { x: width, y: height } : { y: height }}
        sticky={{ offsetHeader: 0 }}
        pagination={false}
        columns={columns}
        footer={props.footer}
        dataSource={[...data]} />
}

export default ListTable;