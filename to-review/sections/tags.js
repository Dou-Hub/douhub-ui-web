
import _ from '../../../shared/util/base';
import FieldRow from '../fields/row';
import { formatText } from '../../../shared/util/format';
import { addHistory, removeHistory } from '../sections/tags-from-history';
import { ReactSVG } from 'react-svg';
import FieldText from '../fields/text';
import FieldContainer from '../fields/container';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';
import TagsSectionCSS from './tags-css';

const DISPLAY_NAME = 'TagsSection';
let FieldTags = null;
let FieldPicklist = null;
const MSG_TAG_TYPE_NOTE = 'Please use the "|" to sperate the Tag and the specific url.';

const TagsSection = (props) => {
    const { editMode, env, format, allowDelete, trackHistory } = props;
    const section = _.isObject(props.section) ? props.section : { data: { tags: [] } };
    const { data, title } = section;
    const anchor = data.anchor == false ? false : true;
    const target = data.target == '_self'?'_self':'_blank';
    const urlType = data.urlType ? data.urlType : 'product-search';
    let urlTemplate = null;

    switch (urlType) {
        case 'product-search':
            {
                urlTemplate = '/search/product?q={TAG}';
                break;
            }
        case 'page-search':
            {
                urlTemplate = '/search/page?q={TAG}';
                break;
            }
        default:
            {
                urlTemplate = data.urlTemplate ? data.urlTemplate : '';
                break;
            }
    }

    const size = env.size;

    const onChangeSection = (fieldName, newValue) => {
        const newSection = _.cloneDeep(section);
        newSection[fieldName] = newValue;
        if (_.isFunction(props.onChange)) props.onChange(newSection);
    }

    const onChangeForm = (name, v) => {
        const newSection = _.cloneDeep(section);
        if (_.isNil(v)) {
            delete newSection.data[name];
        }
        else {
            newSection.data[name] = v;
        }
        if (_.isFunction(props.onChange)) props.onChange(newSection);
    }

    const getUrl = (tag) => {
        const text = _.isObject(tag) ? tag.text : tag;
        let url = _.isObject(tag) ? tag.url : null;
        if (urlType != 'tag') {
            url = _.isNonEmptyString(urlTemplate) ? urlTemplate : null;
        }

        if (_.isNonEmptyString(url)) url = url.replace('{TAG}', encodeURIComponent(text).replace(/'/g, "%27"));

        // if (!_.isNonEmptyString(url)) {
        //     url = setWebQueryValue(`/search/${entity == 'page' ? 'page' : 'product'}`, 'q', text);
        // }

        return url;
    }

    const onClick = (e, tag) => {

        if (e.target.tagName == 'A') return;

        if (_.isFunction(props.onClick)) {
            props.onClick(tag);
        }
        else {
            const text = _.isObject(tag) ? tag.text : tag;
            let url = getUrl(tag);
            if (!_.isNonEmptyString(url)) return null;

            if (trackHistory) addHistory({ text, url });

            window.open(url, url);
        }
    }

    const onClickDelete = (e, tag) => {
        e.stopPropagation();
        const text = _.isObject(tag) ? tag.text : tag;
        const url = _.isObject(tag) ? tag.url : null;
        if (trackHistory) {
            removeHistory({ text, url });
        }
        if (_.isFunction(props.onDelete)) {
            props.onDelete(tag);
        }
    }


    const renderTags = () => {
        return _.uniq(_.map(data.tags, (tag) => {
            return _.isObject(tag) && _.isNonEmptyString(tag.text) ?
                <div className={`tag anchor-${anchor}`} key={tag.text} onClick={(e) => onClick(e, tag)}>
                    {anchor ?
                        <a href={getUrl(tag)} target={target} rel="noreferrer">{formatText(tag.text, format)}</a>
                        : <span>{formatText(tag.text, format)}</span>}
                    {allowDelete && !anchor && <ReactSVG src="/icons/circle-delete.svg" onClick={(e) => onClickDelete(e, tag)} />}
                </div> : null;
        }));
    }

    const renderReadMode = () => {
        if (editMode) return null;
        return <div className="section section-tags">
            {_.isNonEmptyString(title) && <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />}
            {renderTags()}
        </div>
    }

    const renderEditMode = () => {
        if (!editMode) return null;
        if (!FieldTags) FieldTags = logDynamic(dynamic(() => import('../fields/tags'), { ssr: false }), '../fields/tags', DISPLAY_NAME);
        if (!FieldPicklist) FieldPicklist = logDynamic(dynamic(() => import('../fields/picklist'), { ssr: false }), '../fields/picklist', DISPLAY_NAME);

        return <div className="section section-tags">
                <FieldRow size={size}
                fields={
                    [
                        <FieldText
                            key="title"
                            className="section-title"
                            value={title}
                            onChange={(v) => onChangeSection('title', v)}
                            label="Section Title"
                            placeholder="Type the title of the section here" />

                    ]} />
                <FieldRow size={size}
                colStyles={
                    [
                        { flex: 'none', width: 150 },
                        { flex: 1 }
                    ]
                }
                fields={
                    [
                        <FieldPicklist
                            key="urlType"
                            alwaysShowLabel={true}
                            value={urlType}
                            label="Web Address Type"
                            defaultValue="product"
                            options={[
                                { value: 'product-search', text: 'Product Search' },
                                { value: 'page-search', text: 'Page Search' },
                                { value: 'custom', text: 'Custom' },
                                { value: 'tag', text: 'Tag Specific' }
                            ]}
                            onChange={(v) => onChangeForm('urlType', v)} />,
                        urlType != 'tag' ? <FieldText
                            key="urlTemplate"
                            alwaysShowLabel={true}
                            className="url-template"
                            value={urlTemplate}
                            onChange={(v) => onChangeForm('urlTemplate', v)}
                            label="Tag Url Template (use {TAG} as the placeholder)"
                        /> :
                            <FieldContainer key="urlTemplateInfo">
                                <div className="tag-type-note">
                                    {MSG_TAG_TYPE_NOTE}
                                    <br />e.g. Microsoft|https://www.microsoft.com
                                </div>
                            </FieldContainer>

                    ]} />
                    <FieldRow size={size}
                    fields={
                    [<FieldTags
                        key="tags" 
                        className="tags"
                        value={data.tags}
                        supportUrl={urlType == 'tag'}
                        onChange={(v) => {
                            console.log({v})
                            onChangeForm('tags', v)
                        }}
                        label="Tags"
                        placeholder="Tag" />
                    ]} />
        </div>
    }


    return <>
        <TagsSectionCSS />
        <div className="section section-tags">
            {renderReadMode()}
            {renderEditMode()}
        </div>
    </>
}


TagsSection.displayName = DISPLAY_NAME;
export default TagsSection;