import React, { useEffect, useState } from 'react';
import { isNonEmptyString, uploadToS3, getAcceptExtention } from 'douhub-helper-util';
import { callAPI, _window, _track, SVG } from 'douhub-ui-web-basic';
import { Popconfirm } from '../index';
import { Upload } from 'antd';
import { isFunction,  throttle, assign } from 'lodash';
import ReactResizeDetector from 'react-resize-detector';

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
    iconStyle?: Record<string, any>,
    label?: string,
    signedUrlSize?: 'raw' | 120 | 240 | 480 | 960 | 1440,
    signedUrlFormat?: 'original' | 'webp',
    onStart?: any,
    onSuccess?: any,
    onRemove?: any,
    onError?: any,
    value?: string,
    uiFormat?: 'photo' | 'icon',
    iconUrl?: string,
    accept?: string,
    fileNamePrefix?: string,
    hideLabel?: boolean,
    hideDeleteButton?: boolean,
    autoPreviewResize?: boolean,
    resultType?: "content" | "upload" | "both"
}) => {

    const { entityName, recordId, attributeName, wrapperStyle, label,
        fileNamePrefix, autoPreviewResize, 
        signedUrlFormat, fileType, iconUrl } = props;
    const [width, setWidth] = useState<number>(0);
    const resultType = props.resultType ? props.resultType : 'upload';
    const solution = _window.solution;
    const [files, setFiles] = useState<Array<any>>([]);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [previewValue, setPreviewValue] = useState<string | undefined>(undefined);
    const [previewSizeRatio, setPreviewSizeRatio] = useState<number>(0);
    const signedUrlSize = props.signedUrlSize ? props.signedUrlSize : 'raw';
    const hideLabel = props.hideLabel == true;
    const hideDeleteButton = props.hideDeleteButton == true;
    const iconSyle = { ...{ width: 30, height: 30 }, ...props.iconStyle };

    const uiFormat = props.uiFormat == 'photo' ? 'photo' : 'icon';

    useEffect(() => {
        setPreviewValue(props.value);
    }, [props.value])

    useEffect(() => {

        if (isNonEmptyString(previewValue) && autoPreviewResize == true) {
            const img: any = new Image()
            img.onload = () => {
                setPreviewSizeRatio(1.0 * img.height / img.width);
            }
            img.src = previewValue;
        }
        else {
            setPreviewSizeRatio(0);
        }
    }, [previewValue]);

    const onResize = (newWidth?: number) => {
        setWidth(newWidth ? newWidth : 0);
    }


    const photoStyle = uiFormat == 'photo' && fileType == 'Photo' && isNonEmptyString(previewValue) ? { backgroundImage: `url(${previewValue})` } : {};
    const photoSizeStyle = width > 0 && previewSizeRatio > 0 ? { height: width * previewSizeRatio } : {};

    const onBeforeUpload = (file: Record<string, any>) => {
        if (isFunction(props.onStart)) props.onStart(file);
        return false;
    }

    const getAccept = () => {
        if (isNonEmptyString(props.accept)) return props.accept;
        return getAcceptExtention(fileType);
    }

    const onContentOnly = async (result: Record<string, any>) => {
        setError('');
        const fileContent = await getContent(result.file);
        if (isFunction(props.onSuccess)) props.onSuccess({ content: fileContent });
    }

    const onUpload = async (result: Record<string, any>, includeContent: boolean) => {
        let base64Data: any = await getBase64(result.file);

        //NOTE: Need to replace the data:xxx;base64 for other type of documents
        base64Data = base64Data.replace(/^data:image\/\w+;base64,/, "");
        base64Data = base64Data.replace(/^data:text\/\w+;base64,/, "");

        base64Data = Buffer.from(base64Data, 'base64');

        const fName = (fileNamePrefix ? `${fileNamePrefix}.${result.file.name}` : result.file.name);
        const fNameInfo = fName.split('.');
        const fExt = fNameInfo.pop(0);
        const fileName = (fNameInfo.join('.').replace(/[^a-z0-9-]/gi, '_') + '.' + fExt).toLowerCase();

        if (_track) console.log({ fileName });

        const s3Setting = await callAPI(solution, `${solution.apis.file}upload-setting`,
            { fileName, entityName, recordId, attributeName },
            'post');

        if (_track) console.log({ s3Setting });
        await uploadToS3(s3Setting.url, s3Setting.s3FileName, base64Data);

        let cfSignedResult = null;
        let cfSignedRawResult = null;

        if (fileType == 'Photo') {
            const url = `${solution.cloudFront.photo}${s3Setting.s3FileName}${signedUrlSize == 'raw' ? '' : '.resized.' + signedUrlSize + '.jpg'}${signedUrlFormat == 'original' ? '' : '.webp'}`;
            cfSignedResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                { url },
                'GET');

            //Because photo auto create tables time, the url to setValue should be the raw file
            if (signedUrlSize != 'raw') {
                const rawUrl = `${solution.cloudFront.photo}${s3Setting.s3FileName}`;
                cfSignedRawResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                    { url: rawUrl },
                    'GET');
                setPreviewValue(cfSignedRawResult.signedUrl);
            }
            
        }
        else {
            const url = `${solution.cloudFront[fileType.toLocaleLowerCase()]}${s3Setting.s3FileName}`;
            cfSignedResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                { url },
                'GET');
        }


        if (_track) console.log({ cfSignedResult });

        const fileContent = includeContent == true ? await getContent(result.file) : null;
        if (isFunction(props.onSuccess)) props.onSuccess(assign({ s3Setting, cfSignedResult, cfSignedRawResult }, fileContent ? { content: fileContent } : {}));
    }

    const onAfterUpload = (result: Record<string, any>) => {

        (async () => {

            setFiles(result.fileList);
            try {

                setUploading(true);
                setError('');

                switch (resultType) {
                    case 'content':
                        {
                            await onContentOnly(result);
                            break;
                        }
                    case 'both':
                        {
                            await onUpload(result, true);
                            break;
                        }
                    default:
                        {
                            await onUpload(result, false);
                            break;
                        }
                }

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
                <SVG src="/icons/upload-to-cloud.svg" style={iconSyle} />
                {!isNonEmptyString(error) && !hideLabel && <div className="mt-1 text-sm">{label ? label : 'Upload'}</div>}
                {isNonEmptyString(error) && !hideLabel && <div className="mt-1 text-center text-xs text-red-600 p-2">{error}</div>}
            </div>}
            {uploading && <div className="flex flex-col items-center p-2"
                style={{ background: 'rgba(255,255,255,0.8)' }}>
                <SVG src="/icons/upload-to-cloud.svg" className="spinner" style={iconSyle} />
            </div>}
        </>
    }

    const renderIconUI = () => {
        if (uiFormat != 'icon') return null;
        return <>
            {files.length == 0 && !uploading && <div className="flex flex-col items-center">
                <SVG src={iconUrl ? iconUrl : "/icons/upload-to-cloud.svg"} style={iconSyle} color={error ? '#ff0000' : '#000000'} />
                {!isNonEmptyString(error) && !hideLabel && <div className="mt-1 text-sm">{label ? label : 'Upload'}</div>}
                {isNonEmptyString(error) && !hideLabel && <div className="mt-1 text-center text-xs text-red-600 p-2">{error}</div>}
            </div>
            }
            {uploading && <div className="flex flex-col items-center">
                <SVG className="spinner" src="/icons/upload-to-cloud.svg" style={iconSyle} />
            </div>
            }
        </>
    }

    const onConfirmRemove = () => {
        setPreviewValue('');
        if (isFunction(props.onRemove)) props.onRemove();
    }

    return <div className="flex flex-col h-full w-full content-center bg-cover bg-center  relative"
        style={{ border: 'dashed 1px #cccccc', ...photoStyle, ...wrapperStyle, ...photoSizeStyle }}>
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
        {!isNonEmptyString(error) && isNonEmptyString(previewValue) && !hideDeleteButton && <Popconfirm
            placement="top"
            title="Remove the photo?"
            okType="danger"
            onConfirm={onConfirmRemove}
            okText="Remove"
            cancelText="Canel">
            <div
                className="text-2xs text-white absolute py-1 px-2 cursor-pointer m-1"
                style={{ background: 'rgba(255,0,0,0.5)', right: 0, bottom: 0 }}>Delete</div>
        </Popconfirm>}
        <ReactResizeDetector onResize={throttle(onResize, 300)} />
    </div>
};

export default Uploader;