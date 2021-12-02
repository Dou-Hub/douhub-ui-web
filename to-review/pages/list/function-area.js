import _ from '../../../../shared/util/base';
import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { solution } from '../../../../shared/metadata/solution';
import LoadingCircle from '../../controls/loading-circle';
import Popconfirm from '../../controls/antd/popconfirm';
import Tooltip from '../../controls/antd/tooltip';
import Search from '../../controls/search';

const ListFunctionArea = (props) => {

    const { dataChanged, path, slug } = props;
    const isEditPage = path.length > 1 && path[1].toLowerCase() == 'edit';
    const [editMode, setEditMode] = useState((isEditPage || props.editMode) && true);
    const [doing, setDoing] = useState(false);
    const [keywords, setKeywords] = useState('');
   
    const entity = _.find(solution.entities, (entity) => {
        return entity.slug === slug;
    });

    const onClickCategories = () => {

    }

    const onConfirmSearch = () => {

    }

    const onChangeKeywords = (newKeywords) => {
        setKeywords(newKeywords);
    }

    const onSubmitSearch = () => {
        
    }

    return [
        doing && <LoadingCircle className="button button-doing" />,
        <Popconfirm key="search" placement="right"
            title={<Search
                id="list_search"
                autoFocus={true}
                keywords={keywords}
                placeholder = {entity && _.isNonEmptyString(entity.collectionName)?
                    `Search ${entity.collectionName} ...`:
                    `Search ...`}
                entity={entity}
                onChange={onChangeKeywords}
                onSubmit={onSubmitSearch}
            />}
            onConfirm={onConfirmSearch}
            okText="Search"
            cancelText="Cancel"
        >
            <Tooltip title="Search" placement="right">
                <ReactSVG src="/icons/search.svg" className="button button-search" onClick={onClickCategories} />
            </Tooltip>
        </Popconfirm>
        ,
        <Tooltip key="categories" title="Categories" placement="right">
            <ReactSVG src="/icons/file-explorer.svg" className="button button-categories" onClick={onClickCategories} />
        </Tooltip>,
        <Tooltip key="tags" title="Tags" placement="right">
            <ReactSVG src="/icons/tags.svg" className="button button-tags" onClick={onClickCategories} />
        </Tooltip>
    ]
}

ListFunctionArea.displayName = 'ListFunctionArea';
export default ListFunctionArea;