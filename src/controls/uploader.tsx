import React, { useEffect, useState } from 'react';
import { isNonEmptyString, uploadToS3 } from 'douhub-helper-util';
import SVG from './svg';
import { _window, _track } from '../util';
import { callAPI } from '../context/auth-call-api';
import { Upload } from 'antd';
import { isFunction } from 'lodash';

function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const Uploader = (props: {
    entityName: string, 
    fileType: 'Photo'|'Document'|'Video'|'Audio',
    recordId: string, 
    attributeName: string, 
    wrapperStyle?:Record<string,any>, 
    label?:string, 
    signedUrlSize?:'raw'|120|240|480|960|1440,
    signedUrlFormat?:'original'|'webp',
    onSuccess?:any,
    onError?:any,
    value?: string
}) => {

    const {entityName, recordId, attributeName, wrapperStyle, label, signedUrlFormat, fileType } = props;
    
    const solution = _window.solution;
    const [files, setFiles] = useState<Array<any>>([]);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [value, setValue] = useState<string|undefined>(undefined);
    const signedUrlSize = props.signedUrlSize?props.signedUrlSize:'raw';

    useEffect(()=>{
        setValue(props.value)
    },[props.value])

    const photoStyle = fileType=='Photo' && isNonEmptyString(value) ? {background:`url(${value})`,  backgroundSize:'cover'}:{};
   
    const onBeforeUpload = (file: Record<string, any>) => {
        setError('');
        if (!(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
            setError('Require a jpeg, jpg or png file.');
            return false;
        }
        else {
            return false;
        }
    }

    const onAfterUpload = (result: Record<string, any>) => {

        (async () => {
            setFiles(result.fileList);
            try {

                setUploading(true);

                let base64Data: any = await getBase64(result.file);
                base64Data = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64');
 
                const s3Setting = await callAPI(solution, `${solution.apis.file}upload-setting`,
                    { fileName: result.file.name, entityName, recordId, attributeName },
                    'post');

                if (_track) console.log({ s3Setting });
                await uploadToS3(s3Setting.url, s3Setting.s3FileName, base64Data);

                let  cfSignedResult = null;
                if (fileType=='Photo')
                {
                    const url = `${solution.cloudFront.photo}${s3Setting.s3FileName}${signedUrlSize=='raw'?'':'.resized.' + signedUrlSize + '.jpg'}${signedUrlFormat=='original'?'':'.webp'}`;
                    cfSignedResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                    { url },
                    'GET');
                }
                else
                {
                    const url = `${solution.cloudFront.photo}${s3Setting.s3FileName}`;
                    cfSignedResult = await callAPI(solution, `${solution.apis.file}cf-signed-url`,
                    { url },
                    'GET');
                }
                
                setValue(cfSignedResult.signedUrl);

                if (_track) console.log({cfSignedResult});

                
                if (isFunction(props.onSuccess)) props.onSuccess({s3Setting, cfSignedResult});
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

    return <div className="flex flex-col h-full w-full content-center" 
        style={{ border: 'dashed 1px #cccccc', ...photoStyle, ...wrapperStyle }}>
        <div className="m-auto">
            <Upload
                listType="text"
                onChange={onAfterUpload}
                disabled={files.length > 0}
                beforeUpload={onBeforeUpload}
                fileList={[]}
                maxCount={1}
            >
                {files.length == 0 && <div className="flex flex-col items-center p-2" style={{background:'rgba(255,255,255,0.8)'}}>
                    <SVG src="/icons/upload-to-cloud.svg" style={{ width: 30, height: 30 }} />
                    {!isNonEmptyString(error) && <span className="mt-1 text-sm">{label ? label : 'Upload'}</span>}
                    {isNonEmptyString(error) && <span className="mt-1 text-xs text-red-600 p-2">{error}</span>}
                </div>}
                {uploading && <div className="flex flex-col items-center spinner p-2" style={{background:'rgba(255,255,255,0.8)'}}>
                    <SVG src="/icons/upload-to-cloud.svg" style={{ width: 30, height: 30 }} />
                </div>
                }
            </Upload>
        </div>
    </div>
};

export default Uploader;

