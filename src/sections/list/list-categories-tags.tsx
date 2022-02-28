import { each } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';
import { callAPI, _window } from '../../index';
import React, { useEffect, useState } from 'react';
import TreeField from '../../fields/tree';

const ListCategoriesTags = (props: { entityName: string, entityType?: string, height: number }) => {
    const { entityName, entityType, height } = props;
    const solution = _window.solution;
    const [categories, setCategories] = useState<Record<string, any>>({ entityName: 'Category', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [tags, setTags] = useState<Record<string, any>>({ entityName: 'Tag', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [error, setError] = useState('');
    const [doing, setDoing] = useState('Loading data ...');

    console.log({tags, error});

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

    return <div className="section-categroies-tags h-full overflow-hidden bg-white"
        style={{ height, padding: 10, paddingRight: 7 }}>
        <div
            className="w-full flex flex-row border-b pb-2"
            style={{ height: 57, borderColor: '#f0f0f0' }}
        >
            <div className="flex flex-1 px-4 py-4 items-center justify-center bg-gray-100 mr-2"
                style={{ background: 'rgb(240 249 255)' }}>
                <span className="text-l font-bold text-gray-900">Categories</span>
            </div>
            <div className="flex flex-1 px-4 py-4 items-center justify-center bg-gray-50">
                <span className="text-l font-bold text-gray-700">Tags</span>
            </div>
        </div>
        <div className="h-full flex flex-col w-full overflow-hidden bg-white py-4" style={{ height: 'calc(100% - 42px)' }}>
            <TreeField value={categories.data} uiName="category"
                uiCollectionName="categories"
                onChange={onChangeCategories}
                doing={doing} />
        </div>
        {/* <div className="h-full flex flex-col w-full ">
            <div className="w-full z-10 px-4 pt-3 pb-2 font-bold text-base ">Tags</div>
            <div className="px-4 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>

            </div>
        </div> */}
    </div>
};

export default ListCategoriesTags
