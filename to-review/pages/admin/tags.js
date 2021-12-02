import React, { useEffect, useState } from 'react';
import _ from '../../../../shared/util/validate';
import FieldTags from '../../fields/tags';
import Button from '../../controls/antd/button';
import { callAPI } from '../../../util/web';
import { solution } from '../../../../shared/metadata/solution';
import LoadingCircle from '../../controls/loading-circle';

export const MainArea = (props) => {

    const { user, query } = props;
    const [tags, setTags] = useState([]);
    const [doing, setDoing] = useState("tags-organization");
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            if (user) {
                const result = await callAPI(`${solution.apis.platform}tags?type=base`,null,'GET');
                setTags(result);
                setDoing(null);
            }
        })();
    }, [user]);



    // const onClickLoadWebPage = () => {

    //     if (!_.isUrl(webPageData.url)) {
    //         setWebPageError('Invalid Url');
    //         return;
    //     }
    //     setWebPageError(null);
    //     setWebSiteError(null);
    //     setDoing('web-page');
    //     setWebPageProgress({ steps: [] });
    //     setWebSiteProgress({ steps: [] });
    //     setReadyToProcessWholeSite(false);
    //     _.delay((async () => {
    //             try {
    //                 await subscribeSyncClientDocument(syncWebPageId, onSyncWebPageUpdated);
    //                 await callAPI(`${solution.apis.web}process-web-page`, _.assign({
    //                     sync: true,
    //                     syncId: syncWebPageId
    //                 }, webPageData), 'POST');
    //             }
    //             catch (error) {
    //                 console.error({ error });
    //                 setWebPageError("Failed to process web page.");
    //             }
    //             finally {
    //                 setDoing(null);
    //             }
    //         }), 1000);
    // }

    const onClickUpdate = () => {

    }

    const onChangeTags = (newTags)=>{
        setTags(newTags.slice());
    }

    return <div style={{ width: '100%', paddingTop: 20 }}>
        {!_.isNonEmptyString(doing) && <FieldTags
            supportAutoSearch={true}
            autoSearch={true}
            alwaysShowLabel={true}
            className="tags" 
            value={tags}
            onChange={onChangeTags}
            label="Tags"
            placeholder="Type tag here" />}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20 }}>
            {_.isNonEmptyString(doing) ? <LoadingCircle size={18} text="Loading tags ..." /> :
                <Button type="primary" onClick={onClickUpdate}>Update Tags</Button>}
        </div>
    </div>
}


export const SideArea = (props) => {
    return <div></div>;
}
