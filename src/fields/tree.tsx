import React from 'react';
import { isFunction, map, cloneDeep } from 'lodash';
import { LabelField, Tree } from '../index';
import { isNonEmptyString } from 'douhub-helper-util';
import { CSS, _window } from 'douhub-ui-web-basic';

const TREE_CSS = `
.field-tree {
    display: flex;
    flex-direction: column !important;
}

.field-tree-wrapper input{
    font-size: 13px !important
}

.field-tree-wrapper .ant-tree-draggable-icon,
.field-tree-wrapper .ant-tree-switcher
{
    line-height: 1.4;
}

.field-tree-wrapper .ant-tree .ant-tree-node-content-wrapper
{
    border-radius: 3px;
    margin-right: 3px;
}

.field-tree-wrapper .ant-tree-draggable-icon
{
    min-width: 18px;
    max-width: 18px;
    width: 18px;
}
`

const TreeField = (props: Record<string, any>) => {

    const { label, disabled, labelStyle, alwaysShowLabel, expendedIds, doing, selectedId, checkedIds, value } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const TREE_ITEM_CSS = `
        .field-tree-wrapper .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected
        {
            background-color: #f1f5f9;
            border-radius: 10px !important;
        }
    `;
    const onDragEnter = (info: Record<string, any>) => {
        console.log(info);
    };

    const onDrop = (info: Record<string, any>) => {
        const dropKey = info.node.id;
        const dragKey = info.dragNode.id;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data: Array<Record<string, any>>, id: string, callback: any) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    return callback(data[i], i, data);
                }
                if (data[i].items) {
                    loop(data[i].items, id, callback);
                }
            }
        };
        const data = cloneDeep(value);

        // Find dragObject
        let dragObj: Record<string, any> = {};
        loop(data, dragKey, (item: Record<string, any>, index: number, arr: Array<Record<string, any>>) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            loop(data, dropKey, (item: Record<string, any>) => {
                item.items = item.items || [];
                item.items.unshift(dragObj);
            });
        } else if (
            (info.node.props.items || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item: Record<string, any>) => {
                item.items = item.items || [];
                item.items.unshift(dragObj);
            });
        } else {
            let ar: Array<Record<string, any>> = [];
            let i: number = 0;

            loop(data, dropKey, (item: Record<string, any>, index: number, arr: Array<Record<string, any>>) => {
                item == null;
                ar = arr;
                i = index;
            });

            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        if (isFunction(props.onDrop)) props.onDrop(data);
    }

    const onSelect = (selectedKeys: React.Key[]) => {
        if (isFunction(props.onSelect)) props.onSelect(selectedKeys.length > 0 ? `${selectedKeys[0]}` : '');
    };

    const onCheck = (checkedKeys: any) => {
        if (isFunction(props.onCheck)) props.onCheck(map(checkedKeys, (key: any) => `${key}`));
    };

    const onExpand = (expendedKeys: React.Key[]) => {
        if (isFunction(props.onExpand)) props.onExpand(map(expendedKeys, (key: any) => `${key}`));
    };

    return <>
        <CSS id='tree-field-css' content={TREE_CSS} />
        {isNonEmptyString(TREE_ITEM_CSS) && <CSS id='tree-field-item-css' content={TREE_ITEM_CSS} />}
        {isNonEmptyString(label) && <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />}
        <div className="field-tree-wrapper h-full overflow-hidden">
            <div className="field-tree overflow-hidden overflow-y-auto" style={{ height: 'calc(100% - 33px)' }}>
                <Tree
                    disabled={isNonEmptyString(doing)}
                    checkable
                    multiple={false}
                    fieldNames={{ title: 'text', key: 'id', children: 'items' }}
                    defaultExpandedKeys={[]}
                    defaultSelectedKeys={[]}
                    defaultCheckedKeys={[]}
                    draggable
                    blockNode
                    selectedKeys={isNonEmptyString(selectedId) ? [selectedId] : []}
                    expandedKeys={expendedIds}
                    checkedKeys={checkedIds}
                    onExpand={onExpand}
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={value}
                />
            </div>

        </div>

    </>
}

export default TreeField;


