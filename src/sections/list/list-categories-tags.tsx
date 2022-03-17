import { cloneDeep, each, find } from 'lodash';
import {
    doNothing, isNonEmptyString, newGuid, insertTreeItem,
    updateTreeItem, getTreeItem, isObject, removeTreeItem
} from 'douhub-helper-util';
import {Select, SelectOption,  Popconfirm,
    Dropdown, Menu, TextField,  TagsField, TreeField
} from '../../index';

import { _window,CSS,SVG, callAPI } from 'douhub-ui-web-basic';

import React, { useEffect, useState } from 'react';


const LIST_CATEGORIES_TAGS_CSS = `
    .douhub-list-categories-header .ant-select
    {
        height: 32px;
    }

    .douhub-list-categories-header .ant-select-selector
    {
        padding: 0 !important;
        line-height: 1;
    }

    .douhub-list-categories-header .ant-select-selection-item
    {
        font-weight: bold !important;
        font-size: 1.2rem;
        line-height: 1.4 !important;
        padding-right: 32px !important;
    }
`

const ListCategoriesTags = (props: { entityName: string, entityType?: string, height: number }) => {
    const { entityName, entityType, height } = props;
    const solution = _window.solution;
    const [categoriesExpendedIds, setCategoriesExpendedIds] = useState<Array<string>>([]);
    const [categories, setCategories] = useState<Record<string, any>>({ entityName: 'Category', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [tags, setTags] = useState<Record<string, any>>({ entityName: 'Tag', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [error, setError] = useState('');
    const [doing, setDoing] = useState('Loading data ...');
    const [curTab, setCurTab] = useState({ key: "categories", label: "Categories", value: "categories" });
    const [selectedId, setSelectedId] = useState('');
    const [op, setOp] = useState('');
    const [categoryText, setCategoryText] = useState('');
    const uiName = curTab.value == 'categories' ? 'Categories' : 'Tags';

    useEffect(() => {

        if (isNonEmptyString(entityName)) {
            setDoing('Loading data ...');
            callAPI(solution, `${solution.apis.organization}retrieve-categories-tags`,
                { regardingEntityName: entityName, regardingEntityType: entityType }, 'GET')
                .then((result: Record<string, any>) => {
                    console.log({ result })

                    each(result, (row: Record<string, any>) => {
                        if (row.entityName == 'Category') setCategories(row); //{...row, data: DATA}
                        if (row.entityName == 'Tag') setTags(row);
                    })

                })
                .catch((error) => {
                    console.error(error);
                    setError('Failed to retrieve categories.');
                })
                .finally(() => {
                    setDoing('');
                })
        }
    }, [entityName, entityType])

    const onChangeCategories = (newData: Array<Record<string, any>>) => {

        setDoing('Updating ...');

        callAPI(solution, `${solution.apis.data}${categories.id ? 'update' : 'create'}`,
            { data: { ...categories, data: newData } }, categories.id ? 'PUT' : 'POST')
            .then((result: Record<string, any>) => {
                setCategories(result);
            })
            .catch((error:any) => {
                console.error(error);
                setError('Failed to save categories.');
            })
            .finally(() => {
                setDoing('');
                setOp('');
            })
    }

    const onChangeTags = (newData: Array<Record<string, any>>) => {
        doNothing(newData);
    }

    const onChangeQuery = (newTab: any) => {
        setCurTab(newTab);
    }

    const onClickAddCategory = (type: 'above' | 'below' | 'children' | 'root') => {
        setCategoryText('');
        setOp(`add-${type}`);
    }

    const onClickSubmitCategory = (type: string) => {

        const newId = newGuid();
        const newData = cloneDeep(categories.data);
        switch (type) {
            case 'add-root':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    if (!find(newData, (i: Record<string, any>) => i.text?.toLowerCase() == categoryText.toLowerCase())) {
                        onChangeCategories([{ id: newId, text: categoryText }, ...newData]);
                    }
                    break;
                }
            case 'add-above':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(insertTreeItem(newData, selectedId, { id: newId, text: categoryText }, 'above'));
                    break;
                }
            case 'add-below':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(insertTreeItem(newData, selectedId, { id: newId, text: categoryText }, 'below'));
                    break;
                }
            case 'add-children':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(insertTreeItem(newData, selectedId, { id: newId, text: categoryText }, 'children'));
                    setCategoriesExpendedIds([...categoriesExpendedIds, selectedId]);
                    break;
                }
            case 'delete':
                {
                    onChangeCategories(removeTreeItem(newData, selectedId));
                    break;
                }
            case 'edit':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(updateTreeItem(newData, selectedId, (item?: Record<string, any>) => {
                        return { ...item, text: categoryText };
                    }));
                    break;
                }
        }
        setCategoryText('');
        setOp('');
    }

    const onDropCategory = (newData: Record<string, any>[]) => {
        onChangeCategories(newData);
    }


    const onExpandCategory = (newExpendedIds: string[]) => {
        setCategoriesExpendedIds(newExpendedIds);
    }

    const onSelectCategory = (newSelectId: string) => {
        setSelectedId(newSelectId);
        setOp('');
        setCategoryText('');
    }

    const onClickEditCategory = () => {
        const newSelected = getTreeItem(categories.data, (item?: Record<string, any>) => item?.id == selectedId)
        setCategoryText(isObject(newSelected) ? newSelected?.text : '');
        setOp('edit');
    }

    return <>
        <CSS id='douhub-list-categories-header-css' content={LIST_CATEGORIES_TAGS_CSS} />
        <div className="douhub-list-categories-header h-full overflow-hidden bg-white"
            style={{ height }}>

            <div
                className="w-full flex flex-row border-b p-4 flex flex-row items-center "
                style={{ height: 68, borderColor: '#f0f0f0' }}
            >
                <div className="flex flex-col" style={{width:150}}>
                    <Select
                        // style={{ minWidth: querySelectorMinWidth }}
                        labelInValue
                        bordered={false}
                        value={curTab}
                        disabled={isNonEmptyString(doing)}
                        onChange={onChangeQuery}
                    >
                        <SelectOption key="categories" value="categories">Categories</SelectOption>
                        <SelectOption key="tags" value="tags">Tags</SelectOption>
                    </Select>
                    {isNonEmptyString(doing) && <div className="text-xs">{doing}</div>}
                    {isNonEmptyString(error) && !isNonEmptyString(doing) && <div className="text-xs text-red-700">{error}</div>}
                </div>
                {!isNonEmptyString(doing) && <div className="flex-1 flex flex-row">
                    <div className="flex-1"></div>
                    {isNonEmptyString(selectedId) && <Popconfirm
                        placement="bottom"
                        title="Delete the selected category?"
                        onConfirm={() => onClickSubmitCategory('delete')}
                        okText="Delete"
                        okType="danger"
                        cancelText="Cancel">
                        <button style={{ height: 30 }} onClick={onClickEditCategory}
                            className="cursor-pointer p-1 rounded-md inline-flex mr-1 items-center  self-center justify-center  rounded-sm shadow-sm font-medium text-white bg-white hover:shadow-md">
                            <SVG src="/icons/delete-subnode.svg" style={{ width: 24 }} color="#ff0000" />
                        </button>

                    </Popconfirm>}
                    {isNonEmptyString(selectedId) && <button
                        style={{ height: 30 }} onClick={onClickEditCategory}
                        className="cursor-pointer p-1 rounded-md inline-flex mr-1 items-center  self-center justify-center  rounded-sm shadow-sm font-medium text-white bg-white hover:shadow-md">
                        <SVG src="/icons/edit-node.svg" style={{ width: 24 }} color="rgb(2 132 199)" />
                    </button>}
                    {isNonEmptyString(selectedId) && <Dropdown trigger={['click']} placement="topCenter" overlay={
                        <Menu>
                            <Menu.Item onClick={() => onClickAddCategory('above')}>
                                Above the selected
                            </Menu.Item>
                            <Menu.Item onClick={() => onClickAddCategory('below')}>
                                Below the selected
                            </Menu.Item>
                            <Menu.Item onClick={() => onClickAddCategory('children')}>
                                As a children
                            </Menu.Item>
                        </Menu>}>
                        <button
                            style={{ height: 30 }}
                            className="cursor-pointer p-1 rounded-md inline-flex mr-1 items-center  self-center justify-center rounded-sm shadow-sm font-medium text-white bg-white hover:shadow-md">
                            <SVG src="/icons/add-subnode.svg" style={{ width: 24 }} color="rgb(22 163 74)" />
                        </button>
                    </Dropdown>}
                    {!isNonEmptyString(selectedId) &&
                        <button
                            style={{ height: 30 }} onClick={() => onClickAddCategory('root')}
                            className="cursor-pointer p-1 rounded-md inline-flex mr-1 items-center  self-center justify-center rounded-sm shadow-sm font-medium text-white bg-white hover:shadow-md">
                            <SVG src="/icons/add-subnode.svg" style={{ width: 24 }} color="rgb(22 163 74)" />
                        </button>
                    }
                </div>
                }
            </div>
            {(op.indexOf('add-') >= 0 || op == 'edit') && <div className="w-full flex flex-row py-2 items-center px-4 border-b" style={{ background: 'rgb(249 250 251)', height: 55 }}>
                <TextField
                    inputWrapperStyle={{ marginBottom: 0, borderBottom: 'none' }}
                    inputStyle={{ fontSize: 12, height: 30, background: 'transparent' }}
                    onChange={(v: string) => {
                        console.log({ v })
                        setCategoryText(v)
                    }}
                    type="text"
                    placeholder={`Type ${uiName.toLowerCase()} here`}
                    value={categoryText}
                />
                <button
                    style={{ height: 20 }}
                    className="mr-1 rounded-md cursor-pointer inline-flex mr-1 items-center self-center justify-center py-2 px-1   rounded-sm shadow-md font-medium text-white bg-gray-100 hover:bg-gray-200"
                    onClick={() => setOp('')}>
                    <SVG src="/icons/x.svg" style={{ width: 12 }} />
                </button>
                <button
                    style={{ height: 20 }}
                    className="rounded-md cursor-pointer inline-flex mr-1 items-center self-center justify-center py-2 px-1   rounded-sm shadow-md font-medium text-white bg-sky-600 hover:bg-sky-700"
                    onClick={() => onClickSubmitCategory(op)}>
                    <SVG src="/icons/checkmark.svg" style={{ width: 12 }} color="white" />
                </button>
            </div>}
            <div className="h-full flex flex-col w-full overflow-hidden bg-white p-4" style={{ height: 'calc(100% - 42px)' }}>
                {!isNonEmptyString(error) && curTab.value == 'categories' && <TreeField
                    disabled={isNonEmptyString(doing)}
                    value={categories.data}
                    expendedIds={categoriesExpendedIds}
                    uiName="category"
                    selectedId={selectedId}
                    onExpand={onExpandCategory}
                    onDrop={onDropCategory}
                    uiCollectionName="categories"
                    onSelect={onSelectCategory}
                />}
                {!isNonEmptyString(error) && curTab.value == 'tags' && <TagsField value={tags.data}
                    uiName="tag"
                    uiCollectionName="tags"
                    onChange={onChangeTags} />}
            </div>

        </div>
    </>
};

export default ListCategoriesTags
