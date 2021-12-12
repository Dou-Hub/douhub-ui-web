import { SVG_CSS } from '../controls/svg';
import { Field_CSS } from '../fields/css';

export const PAGE_CSS = (`
        ${SVG_CSS}
        ${Field_CSS}
    `).replace(/\n/g, '').replace(/\r/g, '').replace(/  +/g, ' ');
