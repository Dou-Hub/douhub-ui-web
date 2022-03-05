import React from 'react';
import { isFunction} from 'lodash';
import { _window, Uploader } from '../../index';

const UploadModalStep1 = (props: {
    entity: Record<string, any>,
    recordId: string,
    onSuccessUpload?: any,
    onStartUpload?: any,
    modalStyle: Record<string, any>
}) => {

    const onSuccessUpload = (uploadResult: Record<string, any>) => {
        _window.uploadedCSVFileContent = uploadResult.content;
        if (isFunction(props.onSuccessUpload)) props.onSuccessUpload();
    }

    const onStartUpload = () => {
        _window.uploadedCSVFileContent = null;
        if (isFunction(props.onStartUpload)) props.onStartUpload();
    }

    return <div className="w-full">
        <Uploader
            accept=".csv"
            resultType="content"
            uiFormat='icon'
            fileType="Document"
            entityName="Upload"
            attributeName="url"
            recordId={props.recordId}
            label="Click here to upload a csv file"
            onStart={onStartUpload}
            onSuccess={onSuccessUpload}
            wrapperStyle={{ height: 100 }} />
    </div>
}

export default UploadModalStep1;