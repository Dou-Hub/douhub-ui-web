import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';
import UserProfileModal from './user-profile-modal';
import { isFunction } from 'lodash';

const UserProfileMeModal = observer((props: Record<string, any>) => {

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const user = context.user;

    const onProfileUpdateSuccess=(newUser:Record<string, any>)=>{
        contextStore.setData({...context, user:newUser});
        if (isFunction(props.onClose)) props.onClose();
    }

    return <UserProfileModal {...props}  user={user} onProfileUpdateSuccess={onProfileUpdateSuccess}/>
});

export default UserProfileMeModal