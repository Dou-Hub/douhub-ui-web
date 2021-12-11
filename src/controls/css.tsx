import React from 'react';

const CSS = () => {
    const css = `
        .svg {
            line-height: 1;
            height: inherit;
            width: inherit;
        }
        .svg div,
        .svg svg
        {
            height: inherit;
            width: inherit;
        }
    `
    return <style dangerouslySetInnerHTML={{ __html: css }} />
}
CSS.displayName = 'CSS';
export default CSS;

