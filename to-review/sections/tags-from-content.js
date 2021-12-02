import React, { useState, useEffect, useMemo } from 'react';
import _ from '../../../shared/util/base';
import { callAPIBase } from '../../util/web';
import { solution } from '../../../shared/metadata/solution';
import TagsSection from './tags';

const TagsFromContent = (props) => {

    const { content } = props;
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (_.isNonEmptyString(content)) {
            setLoading(true);
            callAPIBase(`${solution.apis.page}tags-from-content`, {
                content
            }, 'POST', { skipCognito: true })
                .then((result) => {
                    setTags(_.map(result,(r)=>{
                        r.text = r.text.toLowerCase();
                        return r;
                    }));
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error);
                    setLoading(false);
                });
        }
        else
        {
            setLoading(false);
        }
    }, [content]);

    return useMemo(()=>error?
    <div style={{color:'red'}}>Failed to load tags.</div>:
    <TagsSection {...props} anchor={true} section={{title:'Tags',data:{tags}}} loading={loading} />, [error, tags, content]);
}

TagsFromContent.displayName = 'TagsFromContent';
export default TagsFromContent;