import React, { useEffect, useState } from 'react';
import { isNonEmptyString, uploadToS3, getAcceptExtention } from 'douhub-helper-util';
import { SVG, _window, _track, callAPI } from '../index';
import { Upload } from 'antd';
import { isFunction, isNil } from 'lodash';
//NOTE: 
//If you run into "The bucket does not allow ACLs" error when uploading the file
//Go to the "Edit Object Ownership" page of S3 bucket settings from the url below
//https://s3.console.aws.amazon.com/s3/bucket/bandup-us-prod-document/property/oo/edit?region=us-east-1
//Enable ACL

function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function getContent(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const Uploader = (props: {
    entityName: string,
    fileType: 'Photo' | 'Document' | 'Video' | 'Audio',
    recordId: string,
    attributeName: string,
    wrapperStyle?: Record<string, any>,
    label?: string,
    signedUrlSize?: 'raw' | 120 | 240 | 480 | 960 | 1440,
    signedUrlFormat?: 'original' | 'webp',
    onStart?:any,
    onSuccess?: any,
    onError?: any,
    value?: string,
    uiFormat?: 'photo' | 'icon',
    iconUrl?: string,
    accept?: string,
    fileNamePrefix?: string,
    hideLabel?:boolean,
    onSuccessWithFileContent?:boolean
}) => {

    const { entityName, recordId, attributeName, wrapperStyle, label,
        fileNamePrefix,
        signedUrlFormat, fileType,  iconUrl } = props;

    const solution = _window.solution;
    const [files, setFiles] = useState<Array<any>>([]);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined);
    const [previewValue, setPreviewValue] = useState<string | undefined>(undefined);
    const signedUrlSize = props.signedUrlSize ? props.signedUrlSize : 'raw';
    const hideLabel = props.hideLabel==true?true:false;
    const onSuccessWithFileContent = props.onSuccessWithFileContent==true?true:false;
    const uiFormat = props.uiFormat=='photo'?'photo':'icon';

    useEffect(() => {
        setValue(props.value);
        if (isNil(previewValue)) setPreviewValue(props.value);
    }, [props.value])

    const previewUrl = isNonEmptyString(previewValue) ? previewValue : value;
    const photoStyle = uiFormat=='photo' && fileType == 'Photo' && isNonEmptyString(previewUrl) ? { backgroundImage: `url(${previewUrl})` } : {};

    const onBeforeUpload = (file: Record<string, any>) => {
        if (isFunction(props.onStart)) props.onStart(file);
        return false;
    }

    const getAccept=()=>{
        if (isNonEmptyString(props.accept)) return props.accept;
        return getAcceptExtention(fileType);
    }

    const onAfterUpload = (result: Record<string, any>) => {

        (async () => {
            setFiles(result.fileList);
            try {

                setUploading(true);
                setError('');

                let base64Data: any = await getBase64(result.file);

                //NOTE: Need to replace the data:xxx;base64 for other type of documents
                base64Data = base64Data.replace(/^data:image\/\w+;base64,/, "");
                base64Data = base64Data.replace(/^data:text\/\w+;base64,/, "");
                
                base64Data = Buffer.from(base64Data, 'base64');

                const fileName = fileNamePrefix ? `${fileNamePrefix}.${result.file.name}` : result.file.name;

                const s3Setting = await callAPI(solution, `${solution.apis.file}upload-setting`,
                    { fileName, entityName, recordId, attributeName },
                    'post');

                if (_track) console.log({ s3Setting });
                await uploadToS3(s3Setting.url, s3Setting.s3FileName, base64Data);

                let cfSignedResult = null;
                if (fileType == 'Photo') {
                    const url = `${solution.cloudFront.photo}${s3Setting.s3FileName}${signedUrlSize == 'raw' ? '' : '.resized.' + signedUrlSize + '.jpg'}${signedUrlFormat == 'original' ? '' : '.webp'}`;
                    cfSignedResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                        { url },
                        'GET');

                    //Because photo auto create tables time, the url to setValue should be the raw file
                    if (signedUrlSize != 'raw') {
                        const rawUrl = `${solution.cloudFront.photo}${s3Setting.s3FileName}`;
                        const cfSignedRawResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                            { url: rawUrl },
                            'GET');
                        setPreviewValue(cfSignedRawResult.signedUrl);
                    }
                    setValue(cfSignedResult.signedUrl);
                }
                else {
                    const url = `${solution.cloudFront[fileType.toLocaleLowerCase()]}${s3Setting.s3FileName}`;
                    cfSignedResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                        { url },
                        'GET');
                }


                if (_track) console.log({ cfSignedResult });

                const fileContent = !onSuccessWithFileContent?null: await getContent(result.file);
                if (isFunction(props.onSuccess)) props.onSuccess(assign({ s3Setting, cfSignedResult }, fileContent?{content:fileContent}:{}));
            }
            catch (error) {
                console.error(error);
                setError('Failed to upload.');
                if (isFunction(props.onError)) props.onError(error);
            }
            finally {
                setFiles([]);
                setUploading(false);
            }
            //let uploadRes = await uploadToS3(serverUrl.data.body, base64imageData);  
        })();


    }

    const renderPhotoUI = () => {
        if (uiFormat != 'photo') return null;
        return <>
            {files.length == 0 && <div className="flex flex-col items-center p-2"
                style={{ background: 'rgba(255,255,255,0.8)' }}>
                <SVG src="/icons/upload-to-cloud.svg" style={{ width: 30, height: 30 }} />
                {!isNonEmptyString(error) && !hideLabel && <span className="mt-1 text-sm">{label ? label : 'Upload'}</span>}
                {isNonEmptyString(error)  && !hideLabel && <span className="mt-1 text-center text-xs text-red-600 p-2">{error}</span>}
            </div>}
            {uploading && <div className="flex flex-col items-center p-2"
                style={{ background: 'rgba(255,255,255,0.8)' }}>
                <SVG src="/icons/upload-to-cloud.svg" className="spinner" style={{ width: 30, height: 30 }} />
            </div>}
        </>
    }

    const renderIconUI = () => {
        if (uiFormat != 'icon') return null;
        return <>
            {files.length == 0 && !uploading && <div className="flex flex-col items-center">
                <SVG src={iconUrl ? iconUrl : "/icons/upload-to-cloud.svg"} style={{ width: 30, height: 30 }} color={error?'#ff0000':'#000000'}/>
                {!isNonEmptyString(error) && !hideLabel && <span className="mt-1 text-sm">{label ? label : 'Upload'}</span>}
                {isNonEmptyString(error) && !hideLabel && <span className="mt-1 text-center text-xs text-red-600 p-2">{error}</span>}
            </div>
            }
            {uploading && <div className="flex flex-col items-center">
                <SVG className="spinner" src="/icons/upload-to-cloud.svg" style={{ width: 30, height: 30 }} />
            </div>
            }
        </>
    }

    return <div className="flex flex-col h-full w-full content-center bg-cover bg-center"
        style={{ border: 'dashed 1px #cccccc', ...photoStyle, ...wrapperStyle }}>
        <div className="m-auto">
            <Upload
                accept={getAccept()}
                listType="text"
                onChange={onAfterUpload}
                disabled={files.length > 0}
                beforeUpload={onBeforeUpload}
                fileList={[]}
                maxCount={1}
            >
                {renderPhotoUI()}
                {renderIconUI()}
            </Upload>
        </div>
    </div>
};

export default Uploader;