import { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import { numberWithCommas } from '../../../shared/util/format';
import ReactResizeDetector from 'react-resize-detector';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
import Image from '../controls/image';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';
import FieldText from '../fields/text';
import FieldNumber from '../fields/number';
import FieldPicklist from '../fields/picklist';
import ColumnsSectionPagination from './columns-pagination';
import ColumnsSectionCSS from './columns-css';
import FieldRow from '../fields/row';
import FieldPlaceholder from '../fields/placeholder';
import { ReactSVG } from 'react-svg';
import { colorByName } from '../../../shared/util/colors';
import Swipe from 'react-easy-swipe';

const DISPLAY_NAME = 'ColumnsSection';
let _history = {};
let _columns = {};
let Popconfirm = null;
let Tooltip = null;
// let Swipe = null;
let Sortable = null;

const getCount = (size, section) => {

    const { countS, countL, countXL, countM, count } = section;
    if (size == 'xs') return 1;
    if (size == 's') return _.isInteger(countS) && countS > 0 ? countS : 2;
    if (size == 'm') return _.isInteger(countM) && countM > 0 ? countM : 2;
    if (size == 'l') return _.isInteger(countL) && countL > 0 ? countL : 3;
    if (size == 'xl') return _.isInteger(countXL) && countXL > 0 ? countXL : countL;
    return _.isInteger(count) && count > 0 ? count : 3;
}


const getSpace = (props) => {

    const { size, spaceS, spaceL, spaceXL, spaceM } = props;

    let space = _.isInteger(props.space) && props.space >= 0 ? props.space : 30;
    if (size == 's' && _.isInteger(spaceS) && spaceS > 0) space = spaceS;
    if (size == 'm' && _.isInteger(spaceM) && spaceM > 0) space = spaceM;
    if (size == 'l' && _.isInteger(spaceL) && spaceL > 0) space = spaceL;
    if (size == 'xl' && _.isInteger(spaceXL) && spaceXL > 0) space = spaceXL;
    return space;
}

const getColumns = (data, index, count, source) => {

    const result = { count: 0 };
    if (!_.isArray(data)) return { count: 0 };

    const totalItems = data.length;
    if (totalItems == 0) return { count: 0 };
    if (count >= totalItems) index = 0;

    let i = 0;

    while (i < count && i < totalItems) {
        // console.log({ i, count, totalItems })

        if (index < 0) index = totalItems + index;
        if (index >= totalItems) index = index - totalItems;

        const item = data[index];
        const id = item.id;
        _history[id] = { id };
        result[id] = { id, index: i, title: item.title };

        if (i == 0) result.first = id; else delete result.first;
        if (i == count) result.last = id; else delete result.last;


        i++;
        index++;
    }

    result.count = i;
    return result;
}

const ColumnsSection = (props) => {

    const { env, server, supportRecordEdit, editMode, mobile, tablet } = props;
    const section = _.isObject(props.section) ? props.section : {};
    const { data, title } = section;
    const size = env.size;

    const [count, setCount] = useState(1);
    const [space, setSpace] = useState(getSpace(props));
    // const [doing, setDoing] = useState(null);

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [index, setIndex] = useState(0);

    if (!_columns[section.id]) {
        _columns[section.id] = { data: [], count: 0 };
    }

    const updateIndex = (data, newIndex, newCount, source) => {
        _columns[section.id] = getColumns(data, newIndex, newCount, source);
        if (count != newCount) setCount(newCount);
        if (index != newIndex) setIndex(newIndex);
    }

    const onInitResize = () => {
        const newHeight = getColumnsMaxHeight(section.id);
        if (newHeight == 0) {
            setTimeout(onInitResize, 300);
            return;
        }
        setHeight(newHeight);
    }

    useEffect(() => {
        updateIndex(data, 0, count, 'useEffect');
        onInitResize();
    }, [])

    useEffect(() => {
        setHeight(getColumnsMaxHeight(section.id));
    }, [count, index])

    useEffect(() => {
        if (!_.isNil(size)) {
            const newCount = getCount(size, props.section);
            setCount(newCount);
            setSpace(getSpace(props));
            updateIndex(data, 0, newCount, 'useEffect');
            onInitResize();
        }

    }, [size])


    const getColumnsMaxHeight = () => {
        let result = 0;
        _.each(data, (item) => {
            const obj = document.getElementById(`${section.id}-${item.id}`);
            result = Math.max(result, obj ? obj.clientHeight : 0);
        });
        return result > 0 ? result + 10 : 0;
    }


    const onResizeSection = (width, height) => {
        setWidth(width);
        setHeight(getColumnsMaxHeight(section.id));
    }


    const columnsCount = _columns[section.id].count;
    let colWidth = size == 'xs' ? width : (width - (count - 1) * space / 2) / count;
    if (colWidth < 0) colWidth = 0;
    const mediaHeight = size == 'xs' ? width * 2 / 3 : colWidth * 2 / 3;
    let x = 0;

    const onSwipeStart = () => {
        x = 0;
    }

    const onSwipeMove = (position) => {
        x = position.x;
    }

    const onSwipeEnd = () => {
        if (Math.abs(x) < 10) return;
        let newIndex = index + (x < 0 ? 1 : -1);
        const totalItems = data.length;
        if (newIndex < 0) newIndex = totalItems + newIndex;
        if (newIndex >= totalItems) newIndex = newIndex - totalItems;

        onChangeIndex(newIndex);
    }

    const openPage = (item) => {
        window.open(item.url);
    }

    const onChangeIndex = (newIndex) => {
        updateIndex(data, newIndex, count, 'onChangeIndex');
    }



    // const deleteRecord = (r) => {
    //     (async () => {
    //         setDoing(r.id);
    //         try {
    //             await callAPI(`${solution.apis.data}/delete`, { id: r.id, entityName: 'WebPage' });
    //             const newColumns = _.cloneDeep(columns);
    //             newColumns.data = _.without(_.map(newColumns.data, (d) => _.sameGuid(r.id, d.id) ? null : d), null);
    //             setColumns(newColumns);
    //             onDeleteRecord(r.id);
    //         }
    //         catch (ex) {
    //             console.error(ex);
    //         }
    //         finally {
    //             setDoing(null);
    //         }
    //     })();
    // }

    const onConfirmRemove = (curItem) => {
        const newSection = _.cloneDeep(section);
        newSection.data = _.without(_.map(newSection.data, (item) => curItem.id == item.id ? null : item), null);
        const newCount = getCount(size, newSection);
        updateIndex(newSection.data, index - 1 < 0 ? 0 : index - 1, newCount, 'onConfirmRemove');
        onInitResize();
        onChangeData(newSection);
    }

    const onChangeData = (newSection) => {
        setHeight(getColumnsMaxHeight(section.id));
        if (_.isFunction(props.onChange)) props.onChange(newSection);
    }

    const renderServer = () => {
        if (!server) return null;
        return _.map(data, (item) => {
            return <div key={`${server}-${item.id}`}>
                <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
                <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
            </div>
        });
    }

    const onClickAdd = (curItem) => {
        const newSection = _.cloneDeep(section);
        const pos = _.findIndex(newSection.data, function (item) {
            return curItem.id === item.id;
        });

        newSection.data = [
            ...newSection.data.slice(0, pos),
            { id: _.newGuid() },
            ...newSection.data.slice(pos)
        ]

        const newCount = getCount(size, newSection);
        updateIndex(newSection.data, index, newCount, 'onConfirmRemove');
        onChangeData(newSection);
    }


    const onChangeItem = (curItem, name, value) => {

        console.log({ id: curItem.id, name, value })

        const newSection = _.cloneDeep(section);
        newSection.data = _.map(newSection.data, (item) => {
            if (curItem.id == item.id) {
                if (!_.isNil(value)) {
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

    const renderEdit = (item) => {
        if (!editMode) return null;

        if (!Tooltip) Tooltip = logDynamic(dynamic(() => import('../controls/antd/tooltip'), { ssr: false }), '../controls/antd/tooltip', DISPLAY_NAME);
        if (!Popconfirm) Popconfirm = logDynamic(dynamic(() => import('../controls/antd/popconfirm'), { ssr: false }), '../controls/antd/popconfirm', DISPLAY_NAME);

        return <>
            <ReactSVG key="add"
                src="/icons/add-column.svg"
                onClick={() => onClickAdd(item)}
                className="item-edit-button item-add-button"
            />
            {data.length > 1 && <Popconfirm key="remove"
                placement="top"
                title="Are you sure you want to remove this item?"
                icon={<></>}
                onConfirm={() => onConfirmRemove(item)}
                okText="Remove"
                cancelText="Cancel">
                <Tooltip title="Remove the item" color={colorByName('deepOrange', 600)} placement="top">
                    <ReactSVG
                        src="/icons/delete-column.svg"
                        className="item-edit-button item-remove-button"
                    />
                </Tooltip>
            </Popconfirm>}
        </>
    }

    const renderClient = () => {
        if (server || section.relocateItems) return null;
        // if (!Swipe) {
        //     Swipe = logDynamic(dynamic(() => import('react-easy-swipe'), { ssr: false }), 'react-easy-swipe', DISPLAY_NAME);
        // }

        return (
            <>
                <Swipe
                    onSwipeStart={onSwipeStart}
                    onSwipeMove={onSwipeMove}
                    onSwipeEnd={onSwipeEnd}>
                    <div className="slider"
                        style={{
                            width: _.isNumber(width) ? colWidth * columnsCount + (columnsCount - 1) * space : '100%'
                        }}
                    >
                        {renderClientContent()}
                    </div>
                </Swipe>
                <ReactResizeDetector onResize={onResizeSection} />
            </>
        )
    }


    const renderMedia = (item) => {
        switch (item.mediaType) {
            case 1:
                {
                    if (_.isNonEmptyString(item.photoUrl) && item.mediaLayout == 'background') {
                        return <div
                            className="photo-wrapper"
                            onClick={() => openPage(item)}
                            style={_.style(
                                { backgroundImage: `url(${item.photoUrl})` },
                                { height: mediaHeight }
                            )}>
                        </div>
                    }


                    if (_.isNonEmptyString(item.photoUrl) && item.mediaLayout != 'background') {
                        return <div
                            className="photo-wrapper"
                            onClick={() => openPage(item)}
                        >
                            <Image src={item.photoUrl} alt={item.text} title={item.text} />
                        </div>
                    }
                }
            case 2:
            case 3:
                {
                    if (_.isNonEmptyString(item.videoUrl)) {
                        return <div className="video-wrapper">
                            <iframe src={item.videoUrl}
                                frameBorder="0"
                                allow="autoplay; fullscreen;"
                                allowFullScreen
                                playinlilne
                                title={item.text} />
                        </div>
                    }

                }
            case 4:
                {
                    if (_.isNonEmptyString(item.videoUrlM3U8) || _.isNonEmptyString(item.videoUrlMP4)) {
                        if ((mobile || tablet) && _.isNonEmptyString(item.videoCoverUrl)) {
                            return <div
                                className="photo-wrapper"
                                onClick={() => openPage(item)}
                                style={_.style(
                                    { backgroundImage: `url(${item.videoCoverUrl})` },
                                    { height: mediaHeight }
                                )}>
                            </div>
                        }

                        return <div className="video-wrapper"
                            style={_.isNonEmptyString(item.videoRatio) ? { paddingBottom: item.videoRatio } : {}}>
                            <video autoPlay="" loop="" preload="auto" muted="muted"
                                data-setup="{&quot;autoplay&quot;: true, &quot;muted&quot;: true}"
                                x5-playsinline="true"
                                playsInline="playsinline"
                                webkit-playsinline="true">
                                {_.isNonEmptyString(item.videoUrlM3U8) && <source src={item.videoUrlM3U8} type="video/m3u8" />}
                                {_.isNonEmptyString(item.videoUrlMP4) && <source src={item.videoUrlMP4} type="video/mp4" />}
                            </video>
                        </div>
                    }

                }

        }

        return null;
    }

    const renderClientContentInReadMode = (props) => {
        const { colStyle, item, pFontSize, className, buttonFontSize, h3FontSize } = props;
        if (editMode) return null;

        const id = `${section.id}-${item.id}`;
        return <div id={id} key={`read-${id}`}
            className={className}
            style={colStyle}>

            {renderMedia(item)}

            <div className="info" >
                <a className="h3-wrapper" href={item.url} target="_blank" rel="noreferrer">
                    <h3
                        title={item.url}
                        style={{ fontSize: h3FontSize }}
                        dangerouslySetInnerHTML={{ __html: item.title }}>
                    </h3>
                </a>
                <p
                    className="content"
                    style={{ fontSize: pFontSize, marginBottom: pFontSize }}
                    onClick={() => openPage(item)}
                    dangerouslySetInnerHTML={{ __html: item.content }}></p>
                <div className="buttons">
                    {_.isNumber(item.currentPrice) ? <div
                        type="dashed"
                        className="button"
                        size="small"
                        onClick={() => openPage(item)}
                        style={{ fontSize: buttonFontSize }}>
                        <span className="price">${numberWithCommas(item.currentPrice)}</span>
                        <span className="shop">Shop</span>
                    </div> : <div className="button-ph"></div>}
                    {supportRecordEdit && <ReactSVG src="/icons/edit.svg" className="button-edit" />}
                </div>
            </div>
        </div>
    }

    const renderClientContentInEditMode = (props) => {

        const { colStyle, item, className, h3FontSize } = props;
        if (!editMode) return null;
        const mediaType = _.isNumber(item.mediaType) ? item.mediaType : 1;
        const id = `${section.id}-${item.id}`;
        return <div id={id} key={`edit-${id}`}
            className={className}
            style={colStyle}>

            <FieldText
                alwaysShowLabel={true}
                className="url"
                value={item.url}
                onChange={(v) => onChangeItem(item, `url`, v)}
                label="Page Url"
                placeholder="The page url of the item" />


            {renderMedia(item)}

            <FieldPicklist
                value={mediaType}
                defaultValue={1}
                options={[
                    { value: 0, text: 'No Media' },
                    { value: 1, text: 'Photo' },
                    { value: 2, text: 'YouTube Video' },
                    { value: 3, text: 'Vimeo Video' },
                    { value: 4, text: 'MP4/M3U8 Video' },
                ]}
                label="Media Type"
                onChange={(v) => onChangeItem(item, `mediaType`, v)} />

            {mediaType == 1 && <FieldText
                alwaysShowLabel={true}
                value={item.photoUrl}
                onChange={(v) => onChangeItem(item, `photoUrl`, v)}
                label="Photo Url"
                placeholder="Photo Url" />}

            {(mediaType == 4) && <FieldText
                alwaysShowLabel={true}
                value={item.videoCoverUrl}
                onChange={(v) => onChangeItem(item, `videoCoverUrl`, v)}
                label="Video Cover Photo"
                note="The cover photo is used when the video player does not work for example in mobile browser"
                placeholder="Video Cover Photo" />}

            {(mediaType == 2 || mediaType == 3) && <FieldText
                alwaysShowLabel={true}
                value={item.videoUrl}
                onChange={(v) => onChangeItem(item, `videoUrl`, v)}
                label="Video Url"
                placeholder="Video Url" />}

            {mediaType == 4 && <FieldText
                alwaysShowLabel={true}
                value={item.videoUrlMP4}
                onChange={(v) => onChangeItem(item, `videoUrlMP4`, v)}
                label="Video Url (MP4 format)"
                placeholder="Video Url (MP4 format)" />}

            {mediaType == 4 && <FieldText
                alwaysShowLabel={true}
                value={item.videoUrlM3U8}
                onChange={(v) => onChangeItem(item, `videoUrlM3U8`, v)}
                label="Video Url (M3U8 format)"
                placeholder="Video Url (M3U8 format)" />}

            {mediaType == 4 && <FieldPicklist
                value={item.videoRatio}
                defaultValue="56.25%"
                options={[
                    { value: '75%', text: '4:3' },
                    { value: '62.5%', text: '16:10' },
                    { value: '56.25%', text: '16:9' },
                    { value: '48%', text: '25:12' },
                    { value: '42.55%', text: '47:20' }
                ]}
                label="Video Ratio"
                onChange={(v) => onChangeItem(item, `videoRatio`, v)} />}

            {mediaType == 1 && <FieldPicklist
                alwaysShowLabel={true}
                value={item.mediaLayout}
                label="Media Layout"
                placeholder="Select the layout of the media"
                defaultValue="background"
                options={[
                    { value: 'background', text: 'Background' },
                    { value: 'image', text: 'Image' }
                ]}
                onChange={(v) => onChangeItem(item, `mediaLayout`, v)} />}


            <FieldText type="textarea"
                alwaysShowLabel={true}
                className="h3"
                style={{ fontSize: h3FontSize }}
                value={item.title}
                label="Title/Name"
                onChange={(v) => onChangeItem(item, `title`, v)}
                placeholder="The title or name of the item" />


            <FieldText
                type="textarea"
                alwaysShowLabel={true}
                className="content"
                value={item.content}
                onChange={(v) => onChangeItem(item, `content`, v)}
                label="Content"
                placeholder="The description of the item" />


            <FieldNumber
                alwaysShowLabel={true}
                className="price"
                type="money"
                value={item.currentPrice}
                onChange={(v) => onChangeItem(item, `currentPrice`, v)}
                label="Price"
                placeholder="The current price of the item" />

            <div className="info" >
                <div className="buttons">
                    <div className="ph"></div>
                    {renderEdit(item)}
                </div>
            </div>
        </div>
    }

    const onItemRelocated = (newItems) => {
        const newSection = _.cloneDeep(section);
        newSection.data = newItems;
        onChangeData(newSection);
    }

    const renderRelocateItems = () => {
        if (!section.relocateItems) return null;
        if (!Sortable) Sortable = logDynamic(dynamic(() => import('../controls/sortable'), { ssr: false }), '../controls/sortable', DISPLAY_NAME);

        return <div className="section section-columns section-columns-sort">
            <p>Please drag and drop the items below to relocate their positions</p>
            <Sortable style={{ width: '100%' }} list={data} setList={onItemRelocated} delayOnTouchStart={true} delay={2}>
                {_.map(data, (item) => {
                    return <div className="sort-item" key={item.id}>
                        <h3 dangerouslySetInnerHTML={{ __html: item.title ? item.title : item.id }} />
                        {_.isNonEmptyString(item.content) && <p className="content" dangerouslySetInnerHTML={{ __html: item.content }}></p>}
                    </div>
                })}
            </Sortable>
        </div>
    }

    const renderClientContent = () => {

        if (section.relocateItems) return null;

        const pFontSize = `${0.7 + 0.3 / count}rem`;
        const buttonFontSize = `${0.8 + 0.3 / count}rem`;
        const h3FontSize = `${0.9 + 0.4 / count}rem`;

        return _.without(_.map(data, (item, i) => {
            if (!_history[item.id]) return null;
            const col = _columns[section.id][item.id];
            const first = item.id == _columns[section.id].first;
            const last = item.id == _columns[section.id].last;

            const className = `column 
            ${!col ? 'column-hidden' : ''} 
            ${first ? 'column-first' : ''} 
            ${last ? 'column-last' : ''}`

            const colStyle = {
                cursor: 'pointer'
            };

            if (col) {
                colStyle.width = colWidth;
                colStyle.left = (colWidth + space / 2) * col.index;

            }
            else {
                colStyle.flex = 1;
                colStyle.marginRight = last ? 0 : space / 2;
            }

            const colProps = { colStyle, item, pFontSize, className, buttonFontSize, h3FontSize };

            return editMode ? renderClientContentInEditMode(colProps) : renderClientContentInReadMode(colProps);

        }), null);
    }

    const sectionStyle = {
        position: 'relative', minHeight: _.isNumber(height) ? height : 'auto'
    };


    const sectionClassName = `section section-columns ${title ? 'section-title-true' : ''} section-loading-${_.isNil(size) ? true : false}`;

    const onChangeSection = (fieldName, newValue) => {
        const newSection = _.cloneDeep(section);
        newSection[fieldName] = newValue;
        if (fieldName == 'ViewSizeColumnCount' && !_.isNil(newValue)) {
            const vs = newValue.split('.');
            newSection['countS'] = parseInt(vs[0]);
            newSection['countM'] = parseInt(vs[1]);
            newSection['countL'] = parseInt(vs[2]);
            newSection['countXL'] = parseInt(vs[2]);
        }
        onChangeData(newSection);
    }

    const renderSectionEditUI = () => {
        if (!(editMode && !section.relocateItems)) return null;
        return [
            <FieldRow key="title" size={size}
                fields={
                    [
                        <FieldText
                            key="title"
                            className="section-title"
                            value={title}
                            onChange={(v) => onChangeSection('title', v)}
                            label="Section Title"
                            placeholder="Type the title of the section here" />

                    ]} />,
            <FieldRow key="columnItemCount-mediaType" size={size}
                fields={[
                    <FieldPicklist
                        key="columnItemCount"
                        value={section.ViewSizeColumnCount}
                        defaultValue="1.2.3"
                        options={[
                            { value: '1.2.2', text: 'small x 1, medium x 2, large x 2' },
                            { value: '1.2.3', text: 'small x 1, medium x 2, large x 3' },
                            { value: '1.2.4', text: 'small x 1, medium x 2, large x 4' },
                            { value: '2.2.3', text: 'small x 2, medium x 2, large x 3' },
                            { value: '2.2.4', text: 'small x 2, medium x 2, large x 4' },
                            { value: '2.3.2', text: 'small x 2, medium x 3, large x 3' },
                            { value: '2.3.4', text: 'small x 2, medium x 3, large x 4' }
                        ]}
                        label="View Size x Column Count"
                        onChange={(v) => onChangeSection(`ViewSizeColumnCount`, v)} />
                ]} />
        ]
    }


    return <>
        <ColumnsSectionCSS />
        {_.isNonEmptyString(title) && (!editMode || section.relocateItems) && <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />}
        {renderSectionEditUI()}
        {renderRelocateItems()}

        {data.length > count && !server && !section.relocateItems && <ColumnsSectionPagination
            className="section-columns-pagination"
            data={data}
            index={index}
            onChange={onChangeIndex} />}
        <div className={sectionClassName} style={sectionStyle}>
            {renderServer()}
            {renderClient()}
        </div>
    </>
}

ColumnsSection.displayName = DISPLAY_NAME;
export default ColumnsSection;