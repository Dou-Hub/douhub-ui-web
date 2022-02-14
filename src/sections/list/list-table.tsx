import Table from '../../controls/antd/table';
import { _window } from '../../util';
import React from 'react';
import { isFunction } from 'lodash';

const ListTable = (props: {
    height: number,
    columns: any,
    selectionType?: 'checkbox' | 'radio',
    onRowSelected?: (selectedIds: React.Key[], selectedRecords: Record<string, any>[]) => void,
    data: any
}) => {

    const { columns, height, data, selectionType } = props;

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
        scroll={{ y: height }}
        sticky={{ offsetHeader: 0 }}
        pagination={false}
        columns={columns}
        dataSource={data} />
}

export default ListTable;