import './css';
import { notification } from 'antd';
import { useEffect } from 'react';

const AntNotification = (props) => {

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