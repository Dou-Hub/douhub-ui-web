import React, {useState} from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import Select from '../controls/antd/select';
import SelectOption from '../controls/antd/select-option';
import { map, find } from 'lodash';

const HtmlFieldCode =  (props: Record<string, any>) => {

    const { node, updateAttributes, extension } = props;
    const defaultValue = 'javascript';
    const [value, setValue] = useState(node?.attrs?.language?node?.attrs?.language:defaultValue);
   
    const renderOptions = () => {
        return map(extension.options.lowlight.listLanguages(), (lang: string, index: number) => {
            return <SelectOption key={index} value={lang}>{lang}</SelectOption>
        });
    }

    const onChange = (newValue: any) => {
        console.log({newValue});
        if (find(extension.options.lowlight.listLanguages(), (l:string)=>l==newValue)) {
            setValue(newValue);
            updateAttributes({ language: newValue });
        }
        else
        {
            setValue(defaultValue);
            updateAttributes({ language: defaultValue });
        }
    }


    return <NodeViewWrapper className="code-block">
        <Select
            showSearch={true}
            className="code-block-lang"
            defaultValue={defaultValue}
            onChange={onChange}
            value={value}
        >
            {renderOptions()}
        </Select>
        <pre>
             <NodeViewContent as="code" />
         </pre>
    </NodeViewWrapper>
}

export default HtmlFieldCode