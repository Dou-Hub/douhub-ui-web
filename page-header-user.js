import { useEffect, useState } from 'react';
import _ from '../../shared/util/base';
import { COLORS } from '../../shared/util/colors';
import { ReactSVG } from 'react-svg';
import dynamic from 'next/dynamic';
import { logDynamic } from './controls/base';
import { getCurrentPoolUser } from '../util/authentication';
import PageHeaderUserCSS from './page-header-user-css'

const DISPLAY_NAME = 'PageHeaderUserCSS';

let UserAPIToken = null;

const styles = {
    countWrapper: { position: 'absolute', top: -5, right: -5, borderRadius: 9, backgroundColor: COLORS.red, justifyContent: 'space-around' },
    count: { fontSize: 8, color: COLORS.white, alignSelf: 'center' }
}


const PageHeaderUser = (props) => {

    const { user, countWrapperStyle, countStyle, count, hide } = props;
    const [showUserAPIToken, setShowUserAPIToken] = useState(false);
    const size = _.isInteger(props.size) ? props.size : 40;
    let { firstName, lastName, display } = user ? user : {};
    const [doing, setDoing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            (async () => {
                try
                {
                    const cognitoUser = await getCurrentPoolUser();
                    if (cognitoUser) {
                        const userInfo = cognitoUser.username.split('.');
                        const user = { organizationId: userInfo[0], id: userInfo[1] }
                        window.postMessage({ action: 'user-session-on', user });
                    }
                    else {
                        window.postMessage({ action: 'user-session-off' });
                    };
                }
                catch(error)
                {
                    console.log({error});
                }
                finally
                {
                    setDoing(false);
                }
            })();
        }, 1000);

        () => {
            return () => {
                clearTimeout(timer)
            }
        }
    }, []);

    const onClick = () => {
        if (_.isFunction(props.onClick)) props.onClick();
    }

    const onCancelUserAPIToken = () => {
        setShowUserAPIToken(false);
    }

    const renderUser = () => {
        if (!user) return <ReactSVG className={`user-avatar-icon user-avatar-icon-user-false ${doing ? 'spinner' : ''}`} src="/icons/circle-user.svg" />;
        return user.avatar ?
            <img className="user-avatar-image" src={user.avatar} title={display} />
            :
            (
                _.isNonEmptyString(firstName) && _.isNonEmptyString(lastName) ?
                    <div className="user-avatar-name">
                        {_.isNonEmptyString(firstName) ? firstName.substring(0, 1).toUpperCase() : ''}
                        {_.isNonEmptyString(lastName) ? lastName.substring(0, 1).toUpperCase() : ''}
                    </div>
                    :
                    <ReactSVG className="user-avatar-icon spinner user-avatar-icon-user-true" src="/icons/circle-user.svg" />
            )
    }

    const renderUserAPIToken = () => {
        if (!showUserAPIToken) return null;
        if (!UserAPIToken) UserAPIToken = logDynamic(dynamic(() => import('./controls/user-api-token'), { ssr: false }), './user-api-token', DISPLAY_NAME);
        return <UserAPIToken onCancel={onCancelUserAPIToken} />
    }

    return hide?null: <>
        <PageHeaderUserCSS />
        <div className={`user-avatar ${user ? 'user-avatar-image-wrapper' : 'user-avatar-icon-wrapper'}`}
            onClick={onClick}
        >

            {renderUser()}
            {_.isNumber(count) && count > 0 &&
                <div style={_.style({ width: size / 2, height: size / 2 }, styles.countWrapper, countWrapperStyle)}>
                    <div style={_.style(styles.count, countStyle)}>{count > 9 ? '9+' : count}</div>
                </div>}
        </div>
        {renderUserAPIToken()}
    </>
}

PageHeaderUser.displayName = DISPLAY_NAME;
export default PageHeaderUser