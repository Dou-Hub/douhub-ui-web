import React, { useEffect, useState } from 'react';
import { getRecordFullName } from 'douhub-helper-util';
import { isFunction, isArray, map, uniqBy, without } from 'lodash';
import { FormBase, BasicModal, SVG, _window, LookupField, Avatar, callAPI } from '../../index';

const SendInvitationModal = (props: Record<string, any>) => {

    const { show, emailTemplate } = props;
    const title = props.title ? props.title : 'Invite User(s)';
    const solution = _window.solution;
    const [data, setData] = useState<Record<string, any>>({ subject: emailTemplate.subject, content: emailTemplate.htmlMessage });
    const [users, setUsers] = useState<Record<string, any>[]>([]);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(()=>{
        setUsers(isArray(props.users)?props.users:[])
    },[props.users])

    const onClose = () => {
        if (isFunction(props.onClose)) props.onClose();
    }

    const onChange = (newData: Record<string, any>) => {
        setData({ ...newData });
        if (isFunction(props.onChange)) props.onChange({ ...newData });
    }

    const form = {
        rows: [
            {
                fields: [
                    {
                        name: 'subject',
                        type: 'text',
                        placeholder: "Type email subject here",
                        label: "Email Subject",
                        alwaysShowLabel: true,
                        value: data.firstName
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'content',
                        type: 'html',
                        placeholder: "Type email content here",
                        label: "Email Content",
                        alwaysShowLabel: true,
                        value: data.lastName
                    }
                ]
            }
        ]
    }

    const onChangeLookupUser=(newUser:Record<string,any>)=>{
        if (newUser)
        {
            setUsers(uniqBy([...users, newUser],'id'));
        }
    }

    const onClickRemoveUser = (removeUser:Record<string,any> )=>{
        setUsers(without(map(users, (user:any)=>(removeUser.id==user.id?null:user)),null));
    }

    const renderUsers = ()=>{
        return map(users, (user:any)=>{
            return <div className="flex w-full overflow-hidden items-center mb-4">
            <div className="flex-shrink-0 mr-2">
                <Avatar data={user} size={30}/>
            </div>
            <div className="text-left flex-1">
                <div className="text-xs  text-gray-900">{getRecordFullName(user)}</div>
                {user.email && <div className="text-2xs text-gray-500">{user.email}</div>}
            </div>
            <div className="pl-2 cursor-pointer">
                <SVG src="/icons/delete.svg" style={{width:14}} onClick={()=>onClickRemoveUser(user)}/>
            </div>
        </div>
        })
    }

    const onSubmitError = () => {
        setError("Failed to send invitation(s).");
        if (isFunction(props.onSubmitFailed)) props.onSubmitFailed(data);
    }

    const renderContent = () => {
        return <div className="flex flex-row">
            <div style={{ width: '50%', maxWidth: 250 }} className="border-r pr-6 mr-6">
                <LookupField
                    placeholder="Search user ..."
                    entityName="User"
                    searchOnly={true}
                    onChange={onChangeLookupUser}
                />
                <div>
                   {renderUsers()}
                </div>
            </div>
            <FormBase data={data} form={form} onChange={onChange} />
        </div>
    }

    const onSubmit = () => {
        setProcessing("Sending ...");
        setError('');
        callAPI(solution, `${solution.apis.organization}send-verification-token-by-user-ids`, { 
            userIds: map(users, (user)=>user.id).join(','),
            action: 'activate-without-password'
         }, 'POST')
            .then(() => {
                if (isFunction(props.onSubmitSucceed)) props.onSubmitSucceed();
            })
            .catch((error:any) => {
                console.error(error);
                return onSubmitError();
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
        style={{ maxWidth: 650, minWidth: 400 }}
        error={error}
        buttons={
            [
                {
                    text: "Cancel",
                    type: "cancel",
                    onClick: onClose
                },
                {
                    text: "Send",
                    type: "info"
                }
            ]}
    />
}

export default SendInvitationModal;