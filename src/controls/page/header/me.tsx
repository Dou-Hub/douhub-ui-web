import React from 'react';
import { observer } from 'mobx-react-lite';
import { isArray, isFunction } from 'lodash';
import { signOut } from '../../../context/auth-cognito';
import { useRouter } from 'next/router';
import { useContextStore } from 'douhub-ui-store';
import UserAvatar from '../../user-avatar';
import {_track} from 'douhub-helper-util';

const PageHeaderMe = observer((props: Record<string, any>) => {

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const user = context.user;

    if (_track) console.log({ user })

    const { solution } = props;
    const router = useRouter();

    const menu = isArray(props.menu) && props.menu.length > 0 ? props.menu :
        [
            {
                title: 'Your Profile', onClick: () => {
                    if (isFunction(props.onClickUserProfile)) return props.onClickUserProfile();
                }
            },
            {
                title: 'Sign Out', onClick: () => {
                    if (isFunction(props.onClickSignOut)) return props.onClickSignOut();
                    (async () => {
                        await signOut(solution);
                        router.push('/auth/sign-in');
                    })();
                }
            },
        ];


    return <UserAvatar {...props} menu={menu} user={user} realtimeStatus={props.realtimeStatus}/>
});

export default PageHeaderMe