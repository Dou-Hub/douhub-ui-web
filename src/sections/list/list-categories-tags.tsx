import { each } from 'lodash';
import { doNothing, isNonEmptyString } from 'douhub-helper-util';
import { callAPI, _window } from '../../index';
import React, { useEffect, useState } from 'react';
import TreeField from '../../fields/tree';
import TagsField from '../../fields/tags';

const ListCategoriesTags = (props: { entityName: string, entityType?: string, height: number }) => {
    const { entityName, entityType, height } = props;
    const solution = _window.solution;
    const [categories, setCategories] = useState<Record<string, any>>({ entityName: 'Category', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [tags, setTags] = useState<Record<string, any>>({ entityName: 'Tag', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [error, setError] = useState('');
    const [doing, setDoing] = useState('Loading data ...');
    const [curTab, setCurTab] = useState('categories');

    useEffect(() => {
        if (isNonEmptyString(entityName)) {

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
            .catch((error) => {
                console.error(error);
                setError('Failed to save categories.');
            })
            .finally(() => {
                setDoing('');
            })
    }

    const onChangeTags = (newData: Array<Record<string, any>>) => {
        doNothing(newData);
    }

    const onChangeCurTab = (newTab: string) => {
        if (newTab != curTab) setCurTab(newTab);
    }

    return <div className="section-categroies-tags h-full overflow-hidden bg-white"
        style={{ height, padding: 10, paddingRight: 7 }}>
        <div
            className="w-full flex flex-row border-b pb-2"
            style={{ height: 57, borderColor: '#f0f0f0' }}
        >
            <div className={`flex flex-1 px-4 py-4 items-center justify-center  mr-2 ${curTab == 'categories' ? '' : 'bg-gray-50 cursor-pointer'}`}
                style={curTab == 'categories' ? { background: 'rgb(240 249 255)' } : {}}
                onClick={() => onChangeCurTab('categories')}
            >
                <span className="text-l font-bold text-gray-900">Categories</span>
            </div>
            <div className={`flex flex-1 px-4 py-4 items-center justify-center  ${curTab == 'tags' ? '' : 'bg-gray-50 cursor-pointer'}`}
                style={curTab == 'tags' ? { background: 'rgb(240 249 255)' } : {}}
                onClick={() => onChangeCurTab('tags')}
            >
                <span className="text-l font-bold text-gray-700">Tags</span>
            </div>
        </div>
        <div className="h-full flex flex-col w-full overflow-hidden bg-white py-4" style={{ height: 'calc(100% - 42px)' }}>
            {isNonEmptyString(error) && <div className="px-4 text-red-700">{error}</div>}
            {!isNonEmptyString(error) && curTab =='categories' && <TreeField
                value={categories.data}
                uiName="category"
                uiCollectionName="categories"
                onChange={onChangeCategories}
                doing={doing} />}
            {!isNonEmptyString(error)  && curTab =='tags' && <TagsField value={tags.data}
                uiName="tag"
                uiCollectionName="tags"
                onChange={onChangeTags}
                doing={doing} />}
        </div>

    </div>
};

export default ListCategoriesTags
