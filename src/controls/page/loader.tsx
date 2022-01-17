import { isNonEmptyString } from 'douhub-helper-util';
import React from 'react';
import SVG from '../svg';

const PageLoader = (props: Record<string, any>) => {
    const iconSrc = isNonEmptyString(props.iconSrc) ? props.iconSrc : '/logo.svg';
    const color = isNonEmptyString(props.color) ? props.color : '#ff0000';
    const showText = props.showText == true;

    return <div className="flex flex-col h-screen my-auto items-center bgimg bg-cover">
        <div className={`border border-gray-100 rounded-xl p-4 m-auto ${showText ? 'max-w-xs w-full' : ''}`}>
            <div className="flex ">
                <SVG id="loader_icon" src={iconSrc} color={color} className="spinner h-8 w-8" />
                {showText && <div className="animate-pulse flex-1 space-y-6 py-1 ml-5">
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                            <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                </div>}
            </div>
        </div>
    </div>
}


export default PageLoader;