import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { map } from 'lodash';
import SVG from '../../svg';

const PageHeaderMenuItems = (props: Record<string, any>) => {

    const { data, title, href, mobileView } = props;
    return <div 
        className="relative grid gap-6 bg-white px-5 py-7 sm:gap-8 sm:px-8" 
        style={mobileView?{paddingTop:0}:{}}>
        {isNonEmptyString(title) && 
        <h3 className="text-sm tracking-wide border border-dashed border-t-0 border-l-0  border-r-0 font-medium text-gray-500 pb-2">
            <a href={href}>{title}</a>
        </h3>}
        {map(data, (item:Record<string,any>, idx:number) => {
            if (!isNonEmptyString(item.title) && !isNonEmptyString(item.description)) {
                item.title = 'Need title or description';
            }
            return <a
                key={isNonEmptyString(item.id)?item.id:idx}
                href={item.href}
                className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
            >
                {isNonEmptyString(item.icon) ?
                    <SVG
                        id={`page_header_menu_items_item_${item.title}`}  
                        src={item.icon} 
                        size={16} 
                        className="flex-shrink-0 h-6 w-6 text-blue-600" 
                        aria-hidden="true" />:
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600" aria-hidden="true" />
                }
                <div className="ml-4">
                    {isNonEmptyString(item.title) && <p className="text-base font-medium text-gray-900">{item.title}</p>}
                    {isNonEmptyString(item.description) && <p className="mt-1 text-sm text-gray-500">{item.description}</p>}
                </div>
            </a>
        })}
    </div>
}

export default PageHeaderMenuItems;
