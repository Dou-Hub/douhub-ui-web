import React from "react";
import { map } from 'lodash';

const FooterColumnSection = (props: Record<string, any>) => {
    const { data } = props;
    
    return <>
        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{data.title}</h3>
        <ul role="list" className="mt-4 space-y-4">
            {map(data.items, (item) => (
                <li key={item.title}>
                    <a href={item.href} className="text-base text-gray-500 hover:text-gray-900">
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    </>
}

export default FooterColumnSection;