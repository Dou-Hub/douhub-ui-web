import React, { Fragment } from 'react';
import { SVG } from 'douhub-ui-web-basic';
import { Popover, Transition } from '@headlessui/react'
import { isArray, without, map, isNumber } from 'lodash';
import HeaderMenuActions from './meun-actions';
import HeaderMenuItems from './menu-items';
import HeaderMenuPosts from './menu-posts';
import { isNonEmptyString } from 'douhub-helper-util';


const PageHeaderMenuItem = (props: Record<string, any>) => {

    const title = isNonEmptyString(props.title) ? props.title : 'No Name';
    const color = isNonEmptyString(props.color) ? props.color : 'red';
    const href = isNonEmptyString(props.href) ? props.href : '#';
    const maxWidth = isNumber(props.maxWidth) && props.maxWidth > 100 ? props.maxWidth : '';

    const sections = without(map(props.sections, (section: Record<string, any>, idx: number) => {
        switch (section.type) {
            case 'items': return isArray(section.data) && <HeaderMenuItems key={idx} {...section} />
            case 'actions': return isArray(section.data) && <HeaderMenuActions key={idx} {...section} />
            case 'posts': return isArray(section.data) && <HeaderMenuPosts key={idx} {...section} />
            default: return <></>
        }
    }), undefined);



    return !(isArray(sections) && sections.length > 0) ?
        <a href={href} className="text-base text-gray-600 hover:text-gray-900">
            <span>{title}</span>
        </a> :
        <Popover className="relative">
            {({ open }) => {
                console.log({open});
                return <>
                    <Popover.Button
                        className={[
                            'group bg-white rounded-md inline-flex items-center text-base focus:outline-none',
                            open ? `text-red-500 hover:text-${color}-500` : `text-gray-600 hover:text-gray-900`,
                        ].join(' ')}
                    >
                        <span>{title}</span>
                        <SVG 
                            id={`page_header_menu_item_${title}`} 
                            style={{width: 12, marginLeft: 10, marginTop: 2}} 
                            src="/icons/chevron-down-menu.svg" 
                            color={open?color:"#999999"} 
                            className={open?"flip-h":""}
                            aria-hidden="true" />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute -ml-4 mt-3 transform z-10 px-2 w-screen max-w-screen-xs sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2" style={{ maxWidth }}>
                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                {sections}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            }}
        </Popover>
}

export default PageHeaderMenuItem;