import React, { useState, useEffect } from 'react';
import { isFunction, isArray, isNil, find, map } from 'lodash';
import { LabelField, CSS, Tree, Dropdown, Menu, TextField, SVG, _window } from '../index';
import { isNonEmptyString, newGuid, insertTreeItem, updateTreeItem, getTreeItem, isObject, removeTreeItem } from 'douhub-helper-util';

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

    const { label, disabled, labelStyle, alwaysShowLabel, hideLabel, uiName, doing } = props;

    const defaultValue = isArray(props.defaultValue) ? props.defaultValue : [];
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState<Array<Record<string, any>>>(isArray(props.value) ? props.value : defaultValue);
    const [selectedId, setSelectedId] = useState('');
    const [expendedIds, setExpendedIds] = useState<Array<string>>([]);
    const [op, setOp] = useState('');
    const [text, setText] = useState('');
    const solution = _window.solution;
    const TREE_ITEM_CSS = solution.theme.color ? `
    .field-tree-wrapper .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected
    {
        background-color: ${solution.theme.color["100"]}
    }
    `: '';
    const onDragEnter = (info: Record<string, any>) => {
        console.log(info);
    };


    useEffect(() => {
        setValue([...isArray(props.value) ? props.value : defaultValue]);
    }, [props.value]);


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
        const data = [...value];

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
                item==null;
                ar = arr;
                i = index;
            });

            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        onChange(data, dragObj.id);
    }


    const onChange = (newValue: Array<Record<string, any>> | null, afffectedId: string) => {
        if (isNil(newValue)) return;
        setValue(newValue);
        setSelectedId(afffectedId);
        if (isFunction(props.onChange)) props.onChange(newValue);
    }

    const onSelect = (selectedKeys: React.Key[]) => {
        const newSelectedId = selectedKeys.length > 0 ? `${selectedKeys[0]}` : '';
        setSelectedId(newSelectedId);
        setOp('');
    };

    const onCheck = (checkedKeys: any, info: any) => {
        console.log('onCheck', checkedKeys, info);
    };

    const onExpand = (checkedKeys: React.Key[]) => {
        setExpendedIds(map(checkedKeys, (key: any) => `${key}`));
    };

    const onClickAdd = (type: 'above' | 'below' | 'children' | 'root') => {
        setText('');
        setOp(`add-${type}`);
    }

    const onClickSubmit = (type: string) => {

        const newId = newGuid();

        switch (type) {
            case 'add-root':
                {
                    if (!isNonEmptyString(text)) return;
                    if (!find(value, (i: Record<string, any>) => i.text?.toLowerCase() == text.toLowerCase())) {
                        onChange([{ id: newId, text: text }, ...value], newId);
                    }
                    break;
                }
            case 'add-above':
                {
                    if (!isNonEmptyString(text)) return;
                    onChange(insertTreeItem(value, selectedId, { id: newId, text: text }, 'above'), newId);
                    break;
                }
            case 'add-below':
                {
                    if (!isNonEmptyString(text)) return;
                    onChange(insertTreeItem(value, selectedId, { id: newId, text: text }, 'below'), newId);
                    break;
                }
            case 'add-children':
                {
                    if (!isNonEmptyString(text)) return;
                    onChange(insertTreeItem(value, selectedId, { id: newId, text: text }, 'children'), newId);
                    setExpendedIds([...expendedIds, selectedId]);
                    break;
                }
            case 'delete':
                {
                    onChange(removeTreeItem(value, selectedId), '');
                    break;
                }
            case 'edit':
                {
                    if (!isNonEmptyString(text)) return;
                    onChange(updateTreeItem(value, selectedId, (item?: Record<string, any>) => {
                        return { ...item, text };
                    }), selectedId);
                    break;
                }
        }
        setText('');
        setOp('');
    }


    const onClickEdit = () => {
        if (selectedId) {
            const newSelected = getTreeItem(value, (item?: Record<string, any>) => item?.id == selectedId)
            setText(isObject(newSelected) ? newSelected?.text : '');
            setOp('edit');
        }
    }

    const renderInputs = () => {
        if (op.indexOf('add') < 0 && op != 'edit') return null;
        return <>
            <TextField
                inputWrapperStyle={{ marginBottom: 0, borderBottom: 'none' }}
                inputStyle={{ fontSize: 12, height: 36 }}
                onChange={(v: string) => {
                    console.log({ v })
                    setText(v)
                }}
                type="text"
                placeholder={`Type new ${uiName} here`}
                value={text}
            />
            <button
                style={{ height: 20 }}
                className="cursor-pointer inline-flex ml-2 items-center self-center justify-center py-2 px-1  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-gray-100 hover:bg-gray-200"
                onClick={() => setOp('')}>
                <SVG src="/icons/x.svg" style={{ width: 12 }} />
            </button>
            <button
                style={{ height: 20 }}
                className="cursor-pointer inline-flex ml-2 items-center self-center justify-center py-2 px-1  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-sky-600 hover:bg-sky-700"
                onClick={() => onClickSubmit(op)}>
                <SVG src="/icons/checkmark.svg" style={{ width: 12 }} color="white" />
            </button>
        </>
    }


    const renderDeleteConfirmation = () => {
        if (op != 'delete') return null;
        return <>
            <div className="w-full text-2xs items-center self-center justify-center " style={{ lineHeight: 1.25 }}>
                Are you sure you want to delete the selected {uiName}?
            </div>
            <button
                style={{ height: 20 }}
                className="cursor-pointer inline-flex ml-2 items-center self-center justify-center py-2 px-1  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-gray-100 hover:bg-gray-200"
                onClick={() => setOp('')}>
                <SVG src="/icons/x.svg" style={{ width: 12 }} />
            </button>
            <button
                style={{ height: 20 }}
                className="cursor-pointer inline-flex ml-2 items-center self-center justify-center py-2 px-1  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-red-600 hover:bg-red-700"
                onClick={() => onClickSubmit(op)}>
                <SVG src="/icons/checkmark.svg" style={{ width: 12 }} color="white" />
            </button>
        </>
    }


    const hideButtons = op != '';

    console.log({ expendedIds })

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
                    onExpand={onExpand}
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={value}
                />
            </div>
            <div className="flex py-1 field-tree-buttons border-t" style={{borderColor:'#f0f0f0'}}>
                {!isNonEmptyString(doing) && <>
                    {isNonEmptyString(selectedId) && !hideButtons && <button
                        style={{ height: 20 }}
                        className="cursor-pointer inline-flex items-center  self-center justify-center px-2  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-red-600 hover:bg-red-700"
                        onClick={() => setOp('delete')}
                    >
                        Delete
                    </button>}
                    <div className="flex-1" style={{ height: 36 }}></div>
                    {isNonEmptyString(selectedId) && !hideButtons && <Dropdown placement="topCenter" overlay={
                        <Menu>
                            <Menu.Item onClick={() => onClickAdd('above')}>
                                Add above the selected {uiName}
                            </Menu.Item>
                            <Menu.Item onClick={() => onClickAdd('below')}>
                                Add below the selected {uiName}
                            </Menu.Item>
                            <Menu.Item onClick={() => onClickAdd('children')}>
                                Add as a children {uiName}
                            </Menu.Item>
                        </Menu>}>
                        <button
                            style={{ height: 20 }}
                            className="cursor-pointer inline-flex ml-2 items-center  self-center justify-center px-2  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-green-600 hover:bg-green-700">
                            Add
                        </button>
                    </Dropdown>}

                    {!isNonEmptyString(selectedId) && !hideButtons && <button
                        style={{ height: 20 }}
                        className="cursor-pointer inline-flex ml-2 items-center self-center justify-center py-2 px-1  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-green-600 hover:bg-green-700"
                        onClick={() => onClickAdd('root')}>
                        Add
                    </button>
                    }
                    {renderInputs()}
                    {renderDeleteConfirmation()}
                    {isNonEmptyString(selectedId) && !hideButtons && <button
                        style={{ height: 20 }}
                        className="cursor-pointer inline-flex ml-2 items-center  self-center justify-center px-2  border border-transparent rounded-sm shadow-sm text-2xs font-medium text-white bg-sky-600 hover:bg-sky-700"
                        onClick={onClickEdit}>
                        Edit
                    </button>}
                </>}
                {isNonEmptyString(doing) && <>
                    <div className="my-4 items-center  self-center justify-center">{doing}</div>
                </>}
            </div>
        </div>

    </>
}

export default TreeField;


