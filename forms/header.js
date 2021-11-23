
import React, { useState } from 'react';
import _ from '../../../shared/util/base';
import SVG from '../controls/svg';
import Popconfirm from '../controls/antd/popconfirm';
import Tooltip from '../controls/antd/tooltip';
import { callAPI } from '../../util/web';
import { solution } from '../../../shared/metadata/solution';
import { colorByName } from '../../../shared/util/colors';
import LoadingCircle from '../controls/loading-circle';
import Notification from '../controls/antd/notification';

const DISPLAY_NAME = 'FormHeader';
const FormHeader = (props) => {

    const { data, metadata } = props;

    const [doing, setDoing] = useState(null);
    const [error, setError] = useState(null);

    const onSave = (close) => {
        (async () => {
            setDoing('Saving the record ...');
            setError(null);
            try {
                const result = await callAPI(data.id?`${solution.apis.data}update`:`${solution.apis.data}create`,
                 { data }, 'POST');
                if (_.isFunction(props.onSave)) props.onSave(result, !_.isNonEmptyString(data.id));
                if (close && _.isFunction(props.onClose)) props.onClose();
            }
            catch (ex) {
                if (ex.name && ex.name.indexOf('DUPLICATION')>0)
                {
                    setError('Failed to save the record. Duplication check failed.');
                }
                else
                {
                    setError('Failed to save the record.');
                }
                
            }
            finally {
                setDoing(null);
            }
        })();
    }



    const onConfirmDelete = () => {
        (async () => {
            setDoing('Deleting the record ...');
           
            try
            {
                await callAPI(`${solution.apis.data}delete`, { id: data.id }, 'POST');
                if (_.isFunction(props.onDelete)) props.onDelete(data);
                if (_.isFunction(props.onClose)) props.onClose();
            }
            catch (ex) {
                setError('Failed to delete the record.');
            }
            finally
            {
                setDoing(null);
            }
            
        })();
    }

    const renderError = ()=>{
        if (!error) return null;
        return <Notification message={error} type="error"/>
    }

    return <div className="header">
        {doing && <LoadingCircle size={14} text={doing} />}
        {!doing && <FormHeaderButtons data={data} onSave={onSave} onConfirmDelete={onConfirmDelete} />}
        {renderError()}
    </div>
}


export const FormHeaderButtons = (props) => 
{
    const {data} = props;

    const onSave = (close) => {
        if (_.isFunction(props.onSave)) props.onSave(close);
    }

    const onConfirmDelete = () => {
        if (_.isFunction(props.onConfirmDelete)) props.onConfirmDelete();
    }

    const onCancelDelete = () => {
        if (_.isFunction(props.onCancelDelete)) props.onCancelDelete();
    }

    return <div className="buttons">
        <div className="button" onClick={()=>onSave(false)}>
            <SVG src="/icons/save.svg" className="button-icon button-icon-save" />
        </div>
        <div className="button" onClick={()=>onSave(true)}>
            <SVG src="/icons/save-close.svg" className="button-icon button-icon-save" />
        </div>
        {_.isNonEmptyString(data.id) && <div className="button">
            <Popconfirm key="remove" placement="right"
                title="Are you sure to delete this record?"
                onConfirm={onConfirmDelete}
                onCancel={onCancelDelete}
                okType="danger"
                okText="Yes"
                cancelText="No"
            >
                <Tooltip title="Delete the record" color={colorByName('red', 600)} placement="right">
                    <SVG src="/icons/delete.svg" className="button-icon button-icon-delete" />
                </Tooltip>
            </Popconfirm>
        </div>}
    </div>
}

FormHeader.displayName = DISPLAY_NAME;
export default FormHeader;