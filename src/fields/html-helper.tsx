import {  map, isArray, isNil } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';

export const getFirstMarkFromSelectedHTMLSegment = (nodes: Array<Record<string,any>> | Record<string,any>): any=>{
    if (isNil(nodes)) return undefined;
    if (!isArray(nodes)) return getFirstMarkFromSelectedHTMLSegment(nodes?.content);
    
    let mark = null;
    for (let i =0; isArray(nodes) && i<nodes.length && !mark; i++)
    {
        let node  = nodes[i];
        if (isArray(node.marks) && node.marks.length>0) 
        {
            mark = node.marks[0];
        }
        else
        {
            mark = getFirstMarkFromSelectedHTMLSegment(node?.content);
        }
    };
    return mark;
}

export const getTextFromSelectedHTMLSegment = (nodes: Array<Record<string,any>> | Record<string,any>): any=>{
    if (isNil(nodes)) return '';
    if (!isArray(nodes)) return getTextFromSelectedHTMLSegment(nodes?.content);
    
    return map(nodes, (node)=>{
        return isNonEmptyString(node.text)? node.text: getTextFromSelectedHTMLSegment(node);
    }).join(' ');
   
}