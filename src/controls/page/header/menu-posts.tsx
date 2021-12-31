import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { map } from 'lodash';

const PageHeaderMenuPosts = (props: Record<string, any>) => {

    const { data, title, moreHref} = props;
    const color = isNonEmptyString(props.color) ? props.color : 'red';
    const moreText = isNonEmptyString(props.moreText) ? props.moreText : 'View all posts';
   
    return <div className="px-5 py-5 bg-gray-50 sm:px-8 sm:py-8">
        <div>
            {isNonEmptyString(title) && <h3 className="text-sm tracking-wide font-medium text-gray-500 uppercase">
                {title}
            </h3>}
            <ul role="list" className="mt-4 space-y-4">
                {map(data, (item:Record<string,any>, idx:number) => {
                    if (!isNonEmptyString(item.title)) {
                        item.title = 'Need title';
                    }
                    return <li key={isNonEmptyString(item.id)?item.id:idx} className="text-base truncate">
                        <a href={item.href} className="font-small text-gray-900 hover:text-gray-700">
                            {item.title}
                        </a>
                    </li>
                })}
            </ul>
        </div>
        {isNonEmptyString(moreHref) && <div className="mt-5 text-sm">
            <a href={moreHref} className={`font-medium text-${color}-600 hover:text-${color}-500`}>
                {' '}
                {moreText} <span aria-hidden="true">&rarr;</span>
            </a>
        </div>}
    </div>
}

export default PageHeaderMenuPosts;
