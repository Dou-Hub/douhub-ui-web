import React, { useState, useEffect } from 'react';
import _ from '../../../shared/util/base';
import { getItem, setItem } from '../../util/local-db';
import TagsSection from './tags';

export const removeHistory = (removeItem) => {
    const history = getItem('history', { items: [] });
    history.items = _.without(_.map(history.items, (item) => {
        return item.text.toLowerCase() == removeItem.text.toLowerCase() ? null : item;
    }), null);
    setItem('history', history);
}

export const addHistory = (newItem, maxCount) => {

    const history = getItem('history', { items: [] });
    if (!_.find(history.items, (item) => {
        return item.text.toLowerCase() == newItem.text.toLowerCase();
    })) {
        maxCount = _.isInteger(maxCount) && maxCount.length > 0 ? maxCount : 20;
        while (history.items.length >= maxCount) {
            history.items.shift();
        }
        history.items.push(newItem);
        setItem('history', history);
    }
}

const TagsFromHistorySection = (props) => {

    const [tags, setTags] = useState([]);

    const refreshHistory = () => {
        (async () => {
            const history = await getItem('history', { items: [] });
            setTags(history.items);
        })();
    }

    useEffect(() => {
        refreshHistory();
    }, [])

    const onDelete = () => {
        refreshHistory();
    }

    return tags.length > 0 ? <TagsSection {...props} section={{ title: 'History', data: { tags } }} onDelete={onDelete} /> : <></>
}
export default TagsFromHistorySection;