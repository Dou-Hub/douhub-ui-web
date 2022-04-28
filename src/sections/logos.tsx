import React from 'react';
import { map } from 'lodash';

const LogosSection = (props: Record<string, any>) => {

    const { data, title } = props;

    return <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
            {title}
        </p>
        <div className="mt-8 grid grid-cols-3 gap-8 md:grid-cols-6 lg:grid-cols-5">
            {map(data, (item) => <a href={item.href} target={item.target}
                className="flex justify-center">
                <img className="h-12" src={item.img} alt={item.title} />
            </a>)}
        </div>
    </section>
}

export default LogosSection;