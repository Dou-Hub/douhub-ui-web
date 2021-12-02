import { useState } from 'react';
import _ from '../../../shared/util/base';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';
import FieldText from '../fields/text';
import ComprehensiveSectionCSS from './comprehensive-css';
import FieldHtml from '../fields/html';

const DISPLAY_NAME = 'ComprehensiveSection';
let Slider = null;
let Switch = null;

const AreaReadMode = (props) => {

    const { prefix, areaWraperStyle, widthControl, section, size } = props;

    const media = props[`${prefix}AreaMedia`];
    const content = props[`${prefix}AreaContent`];
    const hasContent = _.isNonEmptyString(content);

    const defaultAreaWidth = 250;

    const h1 = props[`${prefix}AreaH1`];
    const h2 = props[`${prefix}AreaH2`];

    const mediaAlt = _.isNonEmptyString(h1) ? h1 : (_.isNonEmptyString(h2) ? h2 : media);

    const areaWidthControl = props[`${prefix}WidthControl`];
    const areaWidth = _.isNumber(props[`${prefix}Width`]) ? props[`${prefix}Width`] : defaultAreaWidth;

    const getWidthStyle = () => {
        if (!widthControl) return {};
        const areaWidthAdjust = prefix == 'left' ? 1 : 0;//for border
        return areaWidthControl && (size == 'l' || size == 'xl') ? { width: areaWidth + areaWidthAdjust, flex: 'none' } : { width: 'auto', flex: 1 };
    }

    return (
        <div className={`area ${prefix}-area`}
            style={_.style(
                areaWraperStyle,
                getWidthStyle())
            }>

            {_.isNonEmptyString(media) && <img alt={mediaAlt} src={media} width="200" height="150" style={!hasContent ? { marginBottom: 0 } : {}} />}

            {hasContent && <div className="content" dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
    )
}

const AreaEditMode = (props) => {


    const { prefix, data, onChangeForm, areaWraperStyle, widthControl, section, size } = props;

    if (!Slider) Slider = logDynamic(dynamic(() => import('../controls/antd/slider'), { ssr: false }), '../controls/antd/slider', DISPLAY_NAME);
    if (!Switch) Switch = logDynamic(dynamic(() => import('../controls/antd/switch'), { ssr: false }), '../controls/antd/switch', DISPLAY_NAME);

    const defaultAreaWidth = 250;
    const minAreaWidth = 250;

    const media = data[`${prefix}AreaMedia`];
    const areaWidthControl = data[`${prefix}WidthControl`];
    const maxAreaWidth = prefix == 'left' ? 500 : 535;
    const areaWidth = _.isNumber(data[`${prefix}Width`]) ? data[`${prefix}Width`] : defaultAreaWidth;

    const onChangeWidthControl = (value) => {
        if (_.isFunction(props.onChangeWidthControl)) props.onChangeWidthControl(prefix, value);
    }

    const getWidthStyle = () => {
        if (!widthControl) return {};
        const areaWidthAdjust = prefix == 'left' ? 1 : 0;//for border
        return areaWidthControl && (size == 'l' || size == 'xl') ? { width: areaWidth + areaWidthAdjust, flex: 'none' } : { width: 'auto', flex: 1 };
    }


    return (
        <div className={`area ${prefix}-area`}
            style={_.style(
                areaWraperStyle,
                getWidthStyle())
            }>

            <div className="max-width-control">
                <Switch size="small"
                    checked={areaWidthControl}
                    onChange={onChangeWidthControl} />
                <span>Max. Width</span>
                {areaWidthControl && <span>{areaWidth}px</span>}
                {areaWidthControl && <Slider
                    step={5}
                    size="small"
                    min={minAreaWidth}
                    max={maxAreaWidth}
                    tipFormatter={(value) => {
                        return `${value}px`;
                    }}
                    onChange={(v) => onChangeForm(prefix, `Width`, v)}
                    defaultValue={defaultAreaWidth}
                    value={areaWidth} />
                }
            </div>

            <FieldText
                className="media"
                value={media} onChange={(v) => onChangeForm(prefix, `AreaMedia`, v)}
                label="Photo Url"
                placeholder="Photo Url" />

            {_.isNonEmptyString(media) && <img src={media} width="200" height="150" />}

            <FieldHtml
                hideH4={true}
                className="content"
                value={data[`${prefix}AreaContent`]}
                onChange={(v, headers) => onChangeForm(prefix, `AreaContent`, v, headers)}
                placeholder="Please type content here"
                />

        </div>
    )
}

const ComprehensiveSection = (props) => {

    const { rightAreaWraperStyle, leftAreaWraperStyle, section, env, editMode } = props;
    const size = env.size;
    const data = section.data;
    const showRightArea = _.isBoolean(props.showRightArea) ? props.showRightArea : true;
    const widthControl = data[`leftWidthControl`] || data[`rightWidthControl`];

    const onChangeForm = (prefix, name, v, headers) => {
        const newSection = _.cloneDeep(section);
        if (_.isNil(v)) {
            delete newSection.data[`${prefix}${name}`];
        }
        else {
            newSection.data[`${prefix}${name}`] = v;
        }

        if (headers) {
            if (headers.h1.length > 0) newSection[`${prefix}AreaH1`] = headers.h1; else delete newSection[`${prefix}AreaH1`];
            if (headers.h2.length > 0) newSection[`${prefix}AreaH2`] = headers.h2; else delete newSection[`${prefix}AreaH2`];
            if (headers.h3.length > 0) newSection[`${prefix}AreaH3`] = headers.h3; else delete newSection[`${prefix}AreaH3`];
        }

        if (_.isFunction(props.onChange)) props.onChange(newSection);
    }

    const renderReadMode = () => {
        if (editMode) return null;
        return <div className={`section section-comprehensive right-area-${showRightArea} section-loading-${_.isNil(size) ? true : false}`}>
            <AreaReadMode size={size} section={section} {...data} prefix='left' areaWraperStyle={leftAreaWraperStyle} widthControl={widthControl} />
            {showRightArea && <AreaReadMode size={size} section={section} {...data} prefix='right' areaWraperStyle={rightAreaWraperStyle} widthControl={widthControl} />}
        </div>
    }

    const onChangeWidthControl = (prefix, value) => {
        const newSection = _.cloneDeep(section);
        newSection.data[`${prefix}WidthControl`] = value;
        newSection.data[`${prefix == 'left' ? 'right' : 'left'}WidthControl`] = false;
        if (_.isFunction(props.onChange)) props.onChange(newSection);
    }

    const renderEditMode = () => {
        if (_.isNil(size) || !editMode) return null;
        return (
            <div className={`section section-comprehensive right-area-${showRightArea}`}>
                <AreaEditMode
                    section={section}
                    data={data}
                    prefix='left'
                    size={size}
                    widthControl={widthControl}
                    areaWraperStyle={leftAreaWraperStyle}
                    onChangeForm={onChangeForm}
                    onChangeWidthControl={onChangeWidthControl}
                />
                {showRightArea && <AreaEditMode
                    section={section}
                    data={data}
                    size={size}
                    prefix='right'
                    widthControl={widthControl}
                    areaWraperStyle={rightAreaWraperStyle}
                    onChangeForm={onChangeForm}
                    onChangeWidthControl={onChangeWidthControl}
                />}
            </div>
        )
    }

    return <>
        <ComprehensiveSectionCSS />
        {renderReadMode()}
        {renderEditMode()}
    </>
}

ComprehensiveSection.displayName = DISPLAY_NAME;
export default ComprehensiveSection;