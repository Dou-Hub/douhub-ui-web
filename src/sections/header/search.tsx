import React, { useState,  useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import {_window,SVG} from 'douhub-ui-web-basic';
import  Input from '../../controls/input';
import  {isNonEmptyString} from 'douhub-helper-util';

const AppHeaderSearch = observer((props:{placeholder?:string}) => {

    const placeholder = isNonEmptyString(props.placeholder)?props.placeholder:'Search ...';
    const [search, setSearch] = useState('');
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);

    useEffect(() => {
        setSearch(envData.search);
    }, [envData.search])

    const onSubmitSearch = () => {
        envStore.setValue('search', search);
    }

    return <div className="flex md:min-w-0 flex-1 md:items-center md:justify-between h-full">
        <div className="min-w-0 flex-1 flex flex-row">
            <div className="flex-1 relative text-gray-400 focus-within:text-gray-500">
                <Input
                    id="header-search"
                    placeholder= {placeholder}
                    style={{ outline: 'none' }}
                    value={search}
                    onChange={(v: string) => setSearch(v)}
                    onSubmit={onSubmitSearch}
                    className="block w-full bg-white border-transparent py-5 pl-12 lg:pl-14 placeholder-gray-500 text-base text-gray-700"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4 lg:pl-6">
                    <SVG src="/icons/search.svg" className="h-5 w-5" aria-hidden="true" />
                </div>
            </div>

        </div>
    </div>
});

export default AppHeaderSearch;