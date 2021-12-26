import React from "react";
import { map } from 'lodash';
import SVG from '../controls/svg';

const SocialIconsSection = (props: Record<string, any>) => {
    const { data } = props;
    return <div className="flex space-x-6">
        {map(data, (item) => {
            return <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{item.name}</span>
                <SVG src={item.icon} className="h-6 w-6" aria-hidden="true" />
            </a>
        })}
    </div>
}
export default SocialIconsSection;