import React, { Fragment } from 'react';
import { isInteger, isNumber, isObject, isArray, isFunction } from 'lodash';
import SVG from '../../svg';
import { isNonEmptyString, COLORS } from 'douhub-helper-util'
import { Menu, Transition } from '@headlessui/react'
import { map } from 'lodash';
import { signOut } from '../../../context/auth-cognito';
import { useRouter } from 'next/router';

const styles = {
    countWrapper: { position: 'absolute', top: -5, right: -5, borderRadius: 9, backgroundColor: COLORS.red, justifyContent: 'space-around' },
    count: { fontSize: 8, color: COLORS.white, alignSelf: 'center' }
}


const PageHeaderMe = (props: Record<string, any>) => {

    const { countWrapperStyle, countStyle, hide, count, solution } = props;
    const router = useRouter();

    const user: Record<string, any> = isObject(props.user) ? props.user : { firstName: '', lastName: '', display: '' };
    const size = isInteger(props.size) ? props.size : 38;
    let { firstName, lastName } = user;

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

    const renderName = () => {
        if (isNonEmptyString(user.avatar)) return null;
        return (isNonEmptyString(firstName) || isNonEmptyString(firstName)) ?
            <div className="flex flex-row items-center rounded-full border border-black"
                style={{ minWidth: size, minHeight: size }}>
                <div className="flex flex-row justify-center w-full">
                    <span>{isNonEmptyString(firstName) ? firstName.substring(0, 1).toUpperCase() : ''}</span>
                    <span>{isNonEmptyString(lastName) ? lastName.substring(0, 1).toUpperCase() : ''}</span>
                </div>
            </div>
            :
            <SVG
                id="page-header-me"
                style={{ width: size }}
                className="user-avatar-icon"
                src="/icons/circle-user.svg" />
    }

    const renderAvatar = () => {
        return isNonEmptyString(user.avatar) && <img className="rounded-full" src={user.avatar} alt="" style={{ width: size }} />;
    }

    const renderUser = () => {
        return <Menu as="div" className="relative inline-block text-left">
            <Menu.Button
                className="bg-white flex text-sm"
                style={{ minWidth: size, minHeight: size }}
            >
                {renderName()}
                {renderAvatar()}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute z-30 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {map(menu, (item) => {
                            return <Menu.Item key={item.title}>
                                {({ active }) => (
                                    <div
                                        onClick={item.onClick}
                                        className={`${active ? 'bg-gray-100' : ''} cursor-pointer block px-4 py-2 text-sm text-gray-700`}
                                    >
                                        {item.title}
                                    </div>
                                )}
                            </Menu.Item>
                        })}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    }


    return hide ? null : <>

        <div
            className={`user-avatar ${user ? 'user-avatar-image-wrapper' : 'user-avatar-icon-wrapper'}`}
            style={{ width: size, height: size, position: 'relative' }}>

            {renderUser()}
            {isNumber(count) && count > 0 &&
                <div
                    className="flex flex-row justify-center w-full" style={{ width: size / 2, height: size / 2, ...styles.countWrapper, ...countWrapperStyle }}>
                    <div style={{ ...styles.count, ...countStyle }}>{count > 9 ? '9+' : count}</div>
                </div>}
        </div>


    </>
}

export default PageHeaderMe