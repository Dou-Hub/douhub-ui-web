import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { isFunction, isArray, map, isNil } from 'lodash';
import SVG from '../svg';
import { isNonEmptyString, newGuid } from 'douhub-helper-util';

const BasicModal = (props: Record<string, any>) => {
    //const [open, setOpen] = useState(true)
    const { show, title, content, Content, icon, titleClassName } = props;
    const buttons = isArray(props.buttons) ? props.buttons : [];
    const [processing, setProcessing] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        setProcessing(props.processing);
    },[props.processing]);

    useEffect(()=>{
        setError(props.error);
    },[props.error]);

    const onClose = () => {
        if (isFunction(props.onClose)) props.onClose();
    }

    const onSubmit = () => {
        if (isFunction(props.onSubmit)) props.onSubmit();
    }

    const renderProcessing = ()=>{
        if (isNil(processing)) return null;
       
        return <div className="flex">
            <span className="mr-2 text-blue-400">{processing}</span>
            <SVG src="/icons/loading.svg" className="spinner" color="rgb(96 165 250)" style={{ width: 20, height:20 }} />
        </div>
    }

    const renderButtons = () => {
        if (!isNil(processing)) return null;
       
        return map(buttons, (button) => {
            const text = isNonEmptyString(button.text) ? button.text : newGuid();
            const disabled = button == button.disabled;
            switch (button.type) {
                case 'warning': {
                    if (!isFunction(button.onClick)) button.onClick = onSubmit;
                    return <button
                        key={text}
                        type="button"
                        disabled={disabled}
                        className={`outline-none mx-2 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:ring-orange-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed  ${button.className ? button.className : ''}`}
                        onClick={button.onClick}
                    >
                        {button.text}
                    </button>
                }
                case 'danger': {
                    if (!isFunction(button.onClick)) button.onClick = onSubmit;
                    return <button
                        key={text}
                        type="button"
                        disabled={disabled}
                        className={`outline-none mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:ring-red-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed  ${button.className ? button.className : ''}`}
                        onClick={button.onClick}
                    >
                        {button.text}
                    </button>
                }
                case 'cancel': {
                    if (!isFunction(button.onClick)) button.onClick = onClose;
                    return <button
                        key={text}
                        type="button"
                        disabled={disabled}
                        className={`outline-none mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-400 text-base font-medium text-white hover:bg-gray-600 focus:ring-gray-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed  ${button.className ? button.className : ''}`}
                        onClick={button.onClick}
                    >
                        {button.text}
                    </button>
                }
                default:
                    {
                        if (!isFunction(button.onClick)) button.onClick = onSubmit;
                        return <button
                            key={text}
                            type="button"
                            disabled={disabled}
                            className={`outline-none mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:ring-blue-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed ${button.className ? button.className : ''}`}
                            onClick={button.onClick}
                        >
                            {button.text}
                        </button>
                    }
            }
        })
    }

    return <>
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                {isNonEmptyString(icon) && <div className="mx-auto flex items-center justify-center">
                                    <SVG src={icon} size={20} />
                                </div>}
                                {(isNonEmptyString(title) || isNonEmptyString(content)) && <div className="text-center">
                                    {isNonEmptyString(title) && <Dialog.Title as="h3" className={`text-lg mx-2 leading-6 font-medium text-gray-900 ${titleClassName ? titleClassName : ''}`}>
                                        {title}
                                    </Dialog.Title>}
                                    <div className="my-6 mx-2 text-align">
                                        {content}
                                        {Content && <Content {...props} />}
                                    </div>
                                </div>}
                            </div>
                            {isNonEmptyString(error) && <div className="text-red-600 text-right">{error}</div>}
                            {buttons.length > 0 && <div className="flex mt-6">
                                <div className="flex-1"></div>
                                {renderButtons()}
                                {renderProcessing()}
                            </div>}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    </>
}

export default BasicModal;