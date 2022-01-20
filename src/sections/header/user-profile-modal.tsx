import React, { useEffect, useState } from 'react';
import BasicModal from '../../controls/modals/basic';
import {_window} from '../../util';
import Uploader from '../../controls/uploader';
import {callAPI} from '../../context/auth-call-api';

import { hasRole } from 'douhub-helper-util';
import { isFunction, map } from 'lodash';
import FormBase from '../form/base';
import { useContextStore } from 'douhub-ui-store';

const UserProfileModal = (props: Record<string, any>) => {

    const { show } = props;
    const title = props.title ? props.title : 'Update User Profile';
    const solution = _window.solution;
    const [data, setData] = useState(props.user ? props.user : {});
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const hasPermissionToChangeRole = (
        hasRole(context,'ORG-ADMIN') || 
        hasRole(context,'ROLE-ADMIN')
    )?true:false;


    useEffect(() => {
        setData(props.user ? props.user : {});
    }, [props.user]);

    const onClose = () => {
        if (isFunction(props.onClose)) props.onClose();
    }

    const onChange = (newData: Record<string, any>) => {
        setData({ ...newData });
        if (isFunction(props.onChange)) props.onChange({ ...newData });
    }

    const formFirstNameLastName = {
        rows: [
            {
                fields: [
                    {
                        name: 'firstName',
                        type: 'text',
                        placeholder: "Type your first name here",
                        label: "First Name",
                        alwaysShowLabel: true,
                        value: data.firstName
                    },
                    {
                        name: 'lastName',
                        type: 'text',
                        placeholder: "Type your last name here",
                        label: "Last Name",
                        alwaysShowLabel: true,
                        value: data.lastName
                    }
                ]
            }
        ]
    }

    const formInfo = {
        rows: [
            {
                fields: [
                    {
                        name: 'email',
                        type: 'text',
                        label: "Email",
                        alwaysShowLabel: true,
                        value: data.email,
                        disabled: true
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'rolesSection',
                        type: 'section',
                        title: "Roles"
                    }
                ]
            },
            ... map(solution.roles, (r: Record<string,any>)=>{
                return {
                    fields: [
                        {
                            name: 'roles',
                            label: r.title,
                            groupValue: r.value,
                            disabled: !hasPermissionToChangeRole,
                            type: 'checkbox',
                            value: data.roles,
                        }
                    ]
                }
            })
        ]
    }

    const onSuccessUploadAvatar = (uploadResult: Record<string, any>) => {
        onChange({ ...data, avatar: uploadResult.cfSignedResult.signedUrl });
    }

    const renderContent = () => {
        if (!data?.id) return null;

        return <div className="flex flex-col">
            <div className="flex b-2">
                <Uploader
                    value={data.avatar}
                    fileType="Photo"
                    entityName="User"
                    attributeName="avatar"
                    recordId={data.id}
                    label="Avatar"
                    signedUrlSize={480}
                    signedUrlFormat="webp"
                    onSuccess={onSuccessUploadAvatar}
                    wrapperStyle={{ height: 120, marginRight: 20, width: 120, minWidth: 120 }} />
                <FormBase data={data} form={formFirstNameLastName} onChange={onChange}
                />
            </div>
            <div className="flex b-2">
                <FormBase data={data} form={formInfo} onChange={onChange} />
            </div>
        </div>
    }

    const onSubmit = () => {
        setProcessing("Updating the user profile ...");
        setError('');
        callAPI(solution, `${solution.apis.organization}update-user`, { data }, 'PUT')
            .then((newUser) => {
                if (isFunction(props.onProfileUpdateSuccess)) props.onProfileUpdateSuccess(newUser);
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to update the user profile.");
                if (isFunction(props.onProfileUpdateFailed)) props.onProfileUpdateFailed(data);
            })
            .finally(() => {
                setProcessing(null);
            })
    }

    return <BasicModal
        titleClassName="text-left"
        show={show}
        onClose={onClose}
        onSubmit={onSubmit}
        title={title}
        processing={processing}
        content={renderContent()}
        error={error}
        buttons={
            [
                {
                    text: "Cancel",
                    type: "cancel",
                    onClick: onClose
                },
                {
                    text: "Update",
                    type: "info"
                }
            ]}
    />
}

export default UserProfileModal;