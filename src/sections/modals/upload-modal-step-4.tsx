import React from 'react';
import { _window } from '../../index';

const UploadModalStep4 = (props: {
    entity: Record<string, any>,
    modalStyle: Record<string, any>
}) => {
    const {entity} = props;
    return <div className="w-full text-left">
       <p>
           There are total {_window.uploadedCSVFileJSON.length} {entity.uiCollectionName.toLowerCase()} uploaded. 
           It may take a while to process all submitted data, please refresh the list to check the latest progress.
        </p>
    </div>
}

export default UploadModalStep4;