import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import Select from '../controls/antd/select';
import SelectOption from '../controls/antd/select-option';
import { map, find } from 'lodash';


const HtmlFieldCode = (props: Record<string, any>) => {

    const { node, updateAttributes, extension, readonly } = props;
    const defaultValue = 'javascript';
    const [value, setValue] = useState(node?.attrs?.language ? node?.attrs?.language : defaultValue);
    const langs = extension.options.lowlight.listLanguages();

    const renderOptions = () => {
        return map(langs, (lang: string, index: number) => {
            return <SelectOption key={index} value={lang}>{lang}</SelectOption>
        });
    }

    const onChange = (newValue: any) => {
        if (find(langs, (l: string) => l == newValue)) {
            setValue(newValue);
            updateAttributes({ language: newValue });
        }
        else {
            setValue(defaultValue);
            updateAttributes({ language: defaultValue });
        }
    }

    const getCurrentLang = () => {
        const cur = find(langs, (l: string) => l == value);
        return cur ? cur : 'undefined';
    }

    return <NodeViewWrapper className="code-block">
        {readonly ? <div className="code-block-lang readonly">{getCurrentLang()}</div> :
            <Select
                showSearch={true}
                className="code-block-lang"
                defaultValue={defaultValue}
                onChange={onChange}
                value={value}
            >
                {renderOptions()}
            </Select>}
        <pre>
            <NodeViewContent as="code" />
        </pre>
    </NodeViewWrapper>
}

export default HtmlFieldCode