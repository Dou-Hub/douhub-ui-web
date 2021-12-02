import { useState, useRef } from 'react';
import _ from '../../../shared/util/base';
import ReactResizeDetector from 'react-resize-detector';
import BannerSectionStyles from './banner-css';
import FieldText from '../fields/text';
import FieldSlider from '../fields/slider';
import FieldColorPicker from '../fields/color-picker';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';
import SVG from '../controls/svg';

let Popconfirm = null;

const DISPLAY_NAME = 'BannerSection';

const BannerSection = (props) => {

    const contentRef = useRef(null);
    const { env, section, editMode } = props;
    const { data, title } = section;
    const size = env.size;
    const isSmallSize = size == 'xs' || size == 's';
    const [sectionSize, setSectionSize] = useState({ width: 0, height: 0 });
    const item = _.isArray(data) && data.length > 0 ? data[0] : {};
    const infoWidth = isSmallSize ? 100 : _.isNumber(item.infoWidth) && item.infoWidth >= 10 && item.infoWidth <= 90 ? item.infoWidth : 40;

    const contentHeight = contentRef && contentRef.current && contentRef.current.offsetHeight;

    const mediaHeight = isSmallSize ? sectionSize.width * 9 / 16 : Math.max(_.isNumber(contentHeight) ? contentHeight + 100 : 500, 350);

    const onResizeSection = (width, height) => {
        setSectionSize({ width, height });
    }

    const renderServer = () => {
        if (!_.isNil(size)) return null;
        return <>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
        </>
    }

    const renderClient = () => {
        if (_.isNil(size)) return null;
        return editMode ? renderClientEditMode() : renderClientReadMode();
    }

    const onChangeData = (newSection) => {
        if (_.isFunction(props.onChange)) props.onChange(newSection);
    }

    const onChangeItem = (curItem, name, value) => {
        const newSection = _.cloneDeep(section);
        if (newSection.data.length == 0) {
            curItem = { id: _.newGuid() };
            newSection.data = [curItem];
        }
        newSection.data = _.map(newSection.data, (item) => {
            if (curItem.id == item.id) {
                if (_.isNonEmptyString(value) || _.isNumber(value)) {
                    item[name] = value;
                }
                else {
                    delete item[name];
                }
            }
            return item;
        });
        onChangeData(newSection);
    }

    const onConfirmButtonEditor = () => {

    }

    const renderMediaInEditMode = () => {
        if (!Popconfirm) Popconfirm = logDynamic(dynamic(() => import('../controls/antd/popconfirm'), { ssr: false }), '../controls/antd/popconfirm', DISPLAY_NAME);
        return <Popconfirm
            placement="topRight"
            title={
                <FieldText
                    inputStyle={{ minWidth: 300 }}
                    alwaysShowLabel={true}
                    value={item.media}
                    onChange={(v) => onChangeItem(item, `media`, v)}
                    label="Photo Url"
                    placeholder="Photo Url" />
            }
            icon={<></>}
            onConfirm={onConfirmButtonEditor}
            okText="Ok"
            cancelButtonProps={{ style: { display: 'none' } }}
        >
            <div className="media"
                style={_.style(
                    { backgroundImage: `url(${item.media ? item.media : '/default.webp'})`, cursor: 'pointer' },
                    { minHeight: mediaHeight, maxHeight: mediaHeight }
                )}>
                <div className="edit-icon"><img src="/icons/edit.svg" /></div>
            </div>
        </Popconfirm>
    }

    const renderButtonInEditMode = () => {
        if (!Popconfirm) Popconfirm = logDynamic(dynamic(() => import('../controls/antd/popconfirm'), { ssr: false }), '../controls/antd/popconfirm', DISPLAY_NAME);
        return <Popconfirm
            placement="topLeft"
            title={
                <div>
                    <FieldText
                        alwaysShowLabel={true}
                        value={item.buttonText}
                        defaultValue="Button"
                        onChange={(v) => onChangeItem(item, `buttonText`, v)}
                        label="Text of the button" />
                    <FieldColorPicker
                        alwaysShowLabel={true}
                        value={item.buttonBackgroundColor}
                        defaultValue="rgba(0,0,0,0.1)"
                        onChange={(v) => onChangeItem(item, `buttonBackgroundColor`, v)}
                        label="Background color of the button" />
                    <FieldText
                        alwaysShowLabel={true}
                        value={item.buttonUrl}
                        onChange={(v) => onChangeItem(item, `buttonUrl`, v)}
                        label="Web address of the button" />
                </div>
            }
            icon={<></>}
            onConfirm={onConfirmButtonEditor}
            okText="Ok"
            cancelButtonProps={{ style: { display: 'none' } }}
        >
            <a target="_blank"
                rel="noreferrer"
                className="button"
                style={_.style(
                    item.buttonStyle,
                    { backgroundColor: _.isNonEmptyString(item.buttonBackgroundColor) ? item.buttonBackgroundColor : '#000000' })}
            >
                {item.buttonText ? item.buttonText : 'Button'}
                <SVG src="/icons/edit.svg" className="edit-icon" />
            </a>
        </Popconfirm>
    }

    const renderClientEditMode = () => {
        return <>
            <div className="row-edit">
                <div className="info" style={isSmallSize ? { width: '100%' } : { width: `${infoWidth}%` }}>
                    <FieldSlider
                        alwaysShowLabel={true}
                        value={item.infoWidth}
                        defaultValue={40}
                        min={30}
                        max={80}
                        step={5}
                        onChange={(v) => onChangeItem(item, `infoWidth`, v)}
                        label="Width of the context column (%)" />
                </div>
                <div className="media">
                    <FieldColorPicker
                        alwaysShowLabel={true}
                        value={item.backgroundColor}
                        defaultValue="rgba(0,0,0,1)"
                        onChange={(v) => onChangeItem(item, `backgroundColor`, v)}
                        label="Background color for banner"
                        placeholder="The background color for banner" />

                </div>
            </div>
            <div className="row-banner">
                <div className="info" style={{ background: item.backgroundColor, width: `${infoWidth}%` }}>
                    <div className="ph"></div>
                    <FieldText type="textarea"
                        hideLabel={true}
                        className="h2"
                        value={item.title}
                        onChange={(v) => onChangeItem(item, `title`, v)}
                        label="Title"
                        placeholder="Title of the banner" />

                    <FieldText type="textarea"
                        hideLabel={true}
                        className="content"
                        value={item.content}
                        label="Content"
                        onChange={(v) => onChangeItem(item, `content`, v)}
                        placeholder="Title of the banner" />


                    <div className="buttons">
                        {renderButtonInEditMode()}
                        <div style={{ flex: 1, height: 20 }}></div>
                    </div>
                    <div className="ph"></div>
                </div>
                {renderMediaInEditMode()}
                <ReactResizeDetector onResize={onResizeSection} />
            </div>
        </>
    }

    const renderClientReadMode = () => {
        return <>
            <div className="info" style={{ background: item.backgroundColor, width: `${infoWidth}%` }}>
                <div className="ph"></div>
                <div ref={contentRef}>
                    <h2 className="h2" dangerouslySetInnerHTML={{ __html: item.title }} />
                    <p className="content" dangerouslySetInnerHTML={{ __html: item.content }} />
                    <div className="buttons">
                        <a href={item.buttonUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button"
                            style={_.style(
                                item.buttonStyle,
                                { backgroundColor: _.isNonEmptyString(item.buttonBackgroundColor) ? item.buttonBackgroundColor : '#000000' })}
                        >
                            {item.buttonText ? item.buttonText : 'Button'}
                        </a>
                        <div style={{ flex: 1, height: 20 }}></div>
                    </div>
                </div>
                <div className="ph"></div>
            </div>
            <div className="media"
                style={_.style(
                    { backgroundImage: `url(${item.media ? item.media : '/default.webp'})` },
                    { minHeight: mediaHeight, maxHeight: mediaHeight }
                )}>
                {/* <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                        width={'100%'}
                        height={isSmallSize ? sectionSize.width * 9 / 16 : sectionSize.height} /> */}
            </div>
            <ReactResizeDetector onResize={onResizeSection} />
        </>
    }

    const sectionClassName = `section section-banner ${title ? 'section-title-true' : ''} section-banner-edit-${editMode == true} section-loading-${_.isNil(size)?true:false}`;
    return <>
        <BannerSectionStyles />
        {title && <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />}
        <div className={sectionClassName}>
            {renderServer()}
            {renderClient()}
        </div>
    </>
}

BannerSection.displayName = DISPLAY_NAME;
export default BannerSection;