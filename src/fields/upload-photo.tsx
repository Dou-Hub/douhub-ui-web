import React, { useEffect, useState } from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction, isNil, isObject } from 'lodash';
import { LabelField as LabelFieldInternal, NoteField, Input, Uploader } from '../index';
import { _window } from 'douhub-ui-web-basic';

const UploadPhotoField = (props: Record<string, any>) => {

    const { label, disabled, uploaderLabel, wrapperStyle, note, labelStyle, record, alwaysShowLabel,
        name, allowEditUrl } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
    const LabelField = isNil(props.LabelField) ? LabelFieldInternal : props.LabelField;
    const defaultValue = isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const [value, setValue] = useState('');
    const signedUrlSize: "raw" | 120 | 240 | 480 | 960 | 1440 = !isNil(props.signedUrlSize) ? props.signedUrlSize : 960;
    const autoPreviewResize = props.autoPreviewResize == true;

    useEffect(() => {
        const newValue = !isNil(props.value) ? props.value : defaultValue;
        if (newValue != value) {
            setValue(newValue);
        }
    }, [props.value, defaultValue]);

    const onChange = (newValue: string | null) => {
        setValue(newValue ? newValue : '');
        if (isFunction(props.onChange)) props.onChange(newValue);
    }


    const onSuccessUpload = (uploadResult: Record<string, any>) => {
        onChange(uploadResult.cfSignedResult.signedUrl);
    }

    const onRemove = () => {
        onChange(null);
    }

    const onChangeUrl = (v: any) => {
        onChange(v);
    }

    return <div className="flex flex-col w-full" style={wrapperStyle}>
        <LabelField {...(isNil(props.LabelField) ? {} : props)}
            text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value)))}
        />
        <div className="field field-upload field-upload-photo" style={{ border: 'none' }}>
            <div className="w-full flex flex-col">
                <Uploader
                    onRemove={onRemove}
                    uiFormat='photo'
                    value={value}
                    fileType="Photo"
                    entityName={record?.entityName}
                    attributeName={name}
                    disabled={disabled}
                    recordId={record?.id}
                    label={uploaderLabel}
                    signedUrlSize={signedUrlSize}
                    signedUrlFormat="webp"
                    onSuccess={onSuccessUpload}
                    autoPreviewResize={autoPreviewResize}
                    wrapperStyle={{ width: '100%', height: 120, ...(isObject(props.uploaderWrapperStyle) ? props.uploaderWrapperStyle : {}) }} />
                {allowEditUrl && <Input className="w-full" style={{
                    fontSize: '0.9rem', padding: '2px 4px',
                    border: 'dashed 1px rgb(204, 204, 204)', borderTop: 'none'
                }}
                    disabled={disabled == true}
                    value={value}
                    onChange={onChangeUrl} placeholder="You can also provide url here" />}
                <NoteField text={note} />
            </div>
        </div>
    </div>
};

export default UploadPhotoField;
