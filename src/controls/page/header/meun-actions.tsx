import React from 'react';
import { SVG } from 'douhub-ui-web-basic';
import { isNonEmptyString } from 'douhub-helper-util';
import { map } from 'lodash';

const PageHeaderMenuActions = (props: Record<string, any>) => {

  const { data, title } = props;

  return <div className="px-5 py-5 bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
    {isNonEmptyString(title) && <h3 className="text-sm tracking-wide font-medium text-gray-500 uppercase">
      {title}
    </h3>}
    {map(data, (item: Record<string, any>, idx: number) => (
      <div key={isNonEmptyString(item.id) ? item.id : idx} className="flow-root">
        <a
          href={item.href}
          className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
        >
          <SVG
            id={`page_header_menu_actions_action_${item.title}`}
            src={item.icon}
            className="flex-shrink-0 h-6 w-6 text-gray-400"
            aria-hidden="true" />
          <span className="ml-3">{item.title}</span>
        </a>
      </div>
    ))}
  </div>
}

export default PageHeaderMenuActions;