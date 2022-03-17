import React, { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import {  InputTextArea} from '../../index';
import {  _window, setLocalStorage } from 'douhub-ui-web-basic';

const UploadModalStep2 = (props: {
    entity: Record<string,any>,
    onChange?:any,
    modalStyle: Record<string,any>
}) => {

    const [content,setContent] = useState('');

    const updateContent = (newContent:string)=>{
        _window.uploadedCSVFileContent = newContent;
        setLocalStorage('uploadedCSVFileContent', newContent);
        setContent(newContent);
    }

    useEffect(()=>{
        updateContent(_window.uploadedCSVFileContent);
    },[])

    const onChange = (v: any) => {
        const newContent = v.target.value;
        updateContent(newContent);
        if (isFunction(props.onChange)) props.onChange(newContent);
    }

    return <div className="w-full">
    <InputTextArea
        value={content}
        onChange={onChange}
        style={{ height: props.modalStyle.height-150, whiteSpace: 'pre', resize: 'none' }} />
</div>
}

export default UploadModalStep2;