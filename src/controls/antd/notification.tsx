
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { _track } from '../../util';
if (_track) console.log('Load Ant Notification');

const AntNotification = (props: Record<string,any>) => {

    const { message, description, type, placement } = props;

    useEffect(() => {
        notification[type ? type : 'info']({
            message,
            description,
            placement: placement ? placement : 'topRight'
        });
    }, [message, description, type])

    return <></>
}

AntNotification.displayName = 'AntNotification';
export default AntNotification;