import React, { useEffect, useState } from 'react';
import BasicModal from '../../controls/modals/basic';
import { _window } from 'douhub-ui-web-basic';
import Uploader from '../../controls/uploader';
import { callAPI } from 'douhub-ui-web-basic';

import { hasRole, isObject, isNonEmptyString } from 'douhub-helper-util';
import { isArray, isFunction, map, uniq } from 'lodash';
import FormBase from '../form/base';
import { useContextStore } from 'douhub-ui-store';
import { observer } from 'mobx-react-lite';

const UserProfileModal = observer((props: Record<string, any>) => {

    const { show } = props;
    const title = props.title ? props.title : 'Update User Profile';
    const solution = _window.solution;
    const [data, setData] = useState(props.user ? props.user : {});
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const hasPermissionToChangeRole = (
        hasRole(context, 'ORG-ADMIN') ||
        hasRole(context, 'ROLE-ADMIN')
    ) ? true : false;


    useEffect(() => {
        const newData = props.user ? {...props.user} : {};
        if (!isArray(newData.roles)) newData.roles=[];
        if (hasRole(context, 'ORG-ADMIN')) newData.roles.push('ORG-ADMIN');
        setData({...newData, roles: uniq(newData.roles)});
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
                    }
                ]
            },
            {
                fields: [
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
            ...map(solution.roles, (r: Record<string, any>) => {
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

    const onSubmitError = () => {
        setError("Failed to update the user profile.");
        if (isFunction(props.onProfileUpdateFailed)) props.onProfileUpdateFailed(data);
    }

    const renderContent = () => {
        if (!data?.id) return null;

        return <div className="flex flex-col">
            <div className="flex mb-6">
                <Uploader
                    hideDeleteButton={true}
                    uiFormat='photo'
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
            <div className="flex">
                <FormBase data={data} form={formInfo} onChange={onChange} />
            </div>
        </div>
    }

    const onSubmit = () => {
        setProcessing("Updating ...");
        setError('');
        callAPI(solution, `${solution.apis.user}update`, { data }, 'PUT')
            .then((newUser) => {
                if (!(isObject(newUser) && isNonEmptyString(newUser.id))) {
                    return onSubmitError();
                }
                if (isFunction(props.onProfileUpdateSuccess)) props.onProfileUpdateSuccess(newUser);
            })
            .catch((error) => {
                console.error(error);
                return onSubmitError();
            })
            .finally(() => {
                setProcessing(null);
            })
    }

    return <BasicModal
        id="user-profile"
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
});

export default UserProfileModal;