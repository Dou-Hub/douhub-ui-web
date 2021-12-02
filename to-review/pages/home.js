import { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import BannerSection from '../sections/banner';
import ColumnsSection from '../sections/columns';
import ComprehensiveSection from '../sections/comprehensive';
import ParagraphSection from '../sections/paragraph';
import { colorByName } from '../../../shared/util/colors';
import { DefaultSideArea } from './base';
import { callAPIBase, callAPI } from '../../util/web';
import { solution } from '../../../shared/metadata/solution';
import FieldText from '../fields/text';
import FieldPicklist from '../fields/picklist';
import FieldAlert from '../fields/alert';
// import FieldHr from '../fields/hr';
import FieldCheckbox from '../fields/checkbox';
import FieldContainer from '../fields/container';
import FieldRow from '../fields/row';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';
import cheerio from 'cheerio';
import TagsSection from '../sections/tags';

const DISPLAY_NAME = 'PageHome';

let ToolbarSection = null;
let Sortable = null;
let HomeFunctionArea = null;
let Alert = null;
let Tooltip = null;

const getSlug = (props) => {

    const { host } = props;
    let slug = _.isNonEmptyString(props.slug) ? props.slug : 'home';
    if (slug == 'home') {
        //we will see whether there is a domain based home page
        const domainBasedDefaultHome = solution.site.home[host];
        if (_.isNonEmptyString(domainBasedDefaultHome)) slug = domainBasedDefaultHome;
    }
    return slug;
}

export const getServerSideProps = async (props) => {

    const { path } = props;

    const editMode = path.length > 1 && path[1].toLowerCase() == 'edit';

    try {

        //let data = null;

        // const cacheKey = slug;
        // data = _.getMemoryCache(cacheKey);T
        // if (_.isObject(data) && !editMode) {
        //     return { data };
        // }

        const result = await callAPIBase(`${solution.apis.page}retrieve`, { slug: getSlug(props), published: true },
            'POST', { skipCognito: true });

        return { result, editMode };
    } catch (error) {
        console.error({error});
        return { result: { status: 'ERROR' }, editMode }
    }
}

export const getPageContent = (page) => {
    let content = '';

    if (page) {
        if (_.isNonEmptyString(page.title)) content = `${content} ${page.title}`;
        if (_.isNonEmptyString(page.description)) content = `${content} ${page.description}`;

        _.each(page.definition, (section) => {
            if (section) {

                if (_.isNonEmptyString(section.title)) content = `${content} ${section.title}. `;

                if (_.isNonEmptyString(section.data.content)) content = `${content} ${section.data.content}. `;
                if (_.isNonEmptyString(section.data.leftAreaContent)) content = `${content} ${section.data.leftAreaContent}. `;
                if (_.isNonEmptyString(section.data.rightAreaContent)) content = `${content} ${section.data.rightAreaContent}. `;

                if (section.type == 'columns') {
                    content = `${content} ${_.map(section.data, (r) => {
                        return `${_.isNonEmptyString(r.title) ? r.title : ''}. ${_.isNonEmptyString(r.content) ? r.content : ''}.`;
                    }).join(' ')}`
                }

                content = cheerio.load(content.replace(/>/g, '> ').replace(/[ ]{2,}/gi, ' ').replace(/[.] [.]/gi, '.').replace(/[/.]{2,}/gi, '.')).text().trim();
            }
        })
    }
    return content;
}


export const getPageMetadata = (page) => {
    let description = '';
    let title = '';
    let image = '';

    if (page) {

        description = page.description;
        title = page.title;
        image = page.image;

        if (!_.isNonEmptyString(description) || !_.isNonEmptyString(title) || !_.isNonEmptyString(image)) {
            //try to find description from sections
            _.each(page.definition, (section) => {
                if (section) {

                    if (!_.isNonEmptyString(title) && _.isNonEmptyString(section.title)) title = section.title;

                    if (!_.isNonEmptyString(title) && _.isArray(section.h1) && section.h1.length > 0 && _.isNonEmptyString(section.h1[0])) title = section.h1[0];
                    if (!_.isNonEmptyString(title) && _.isArray(section.leftAreaH1) && section.leftAreaH1.length > 0 && _.isNonEmptyString(section.leftAreaH1[0])) title = section.leftAreaH1[0];
                    if (!_.isNonEmptyString(title) && _.isArray(section.rightAreaH1) && section.rightAreaH1.length > 0 && _.isNonEmptyString(section.rightAreaH1[0])) title = section.rightAreaH1[0];


                    if (!_.isNonEmptyString(title) && _.isArray(section.h2) && section.h2.length > 0 && _.isNonEmptyString(section.h2[0])) title = section.h2[0];
                    if (!_.isNonEmptyString(title) && _.isArray(section.leftAreaH2) && section.leftAreaH2.length > 0 && _.isNonEmptyString(section.leftAreaH2[0])) title = section.leftAreaH2[0];
                    if (!_.isNonEmptyString(title) && _.isArray(section.rightAreaH2) && section.rightAreaH2.length > 0 && _.isNonEmptyString(section.rightAreaH2[0])) title = section.rightAreaH2[0];

                    if (_.isNonEmptyString(title)) title = cheerio.load(title.replace(/>/g, '> ').replace(/[ ]{2,}/gi, ' ')).text().trim();

                    if (!_.isNonEmptyString(description) && _.isNonEmptyString(section.description)) description = section.description;
                    if (!_.isNonEmptyString(description) && _.isObject(section.data) && _.isNonEmptyString(section.data.content)) description = section.data.content;
                    if (!_.isNonEmptyString(description) && _.isObject(section.data) && _.isNonEmptyString(section.data.leftAreaContent)) description = section.data.leftAreaContent;
                    if (!_.isNonEmptyString(description) && _.isObject(section.data) && _.isNonEmptyString(section.data.rightAreaContent)) description = section.data.rightAreaContent;
                    if (_.isNonEmptyString(description)) description = cheerio.load(description.replace(/>/g, '> ').replace(/[ ]{2,}/gi, ' ')).text().trim();

                    if (!_.isNonEmptyString(image) && _.isNonEmptyString(section.media)) image = section.media;
                    if (!_.isNonEmptyString(image) && _.isObject(section.data) && _.isNonEmptyString(section.data.media)) image = section.data.media;
                    if (!_.isNonEmptyString(image) && _.isObject(section.data) && _.isNonEmptyString(section.data.leftAreaMedia)) image = section.data.leftAreaMedia;
                    if (!_.isNonEmptyString(image) && _.isObject(section.data) && _.isNonEmptyString(section.data.rightAreaMedia)) image = section.data.rightAreaMedia;

                }
            })
        }
    }

    return { title, description, image }
}


export const MainArea = (props) => {

    const { editMode, relocateSection, server, user } = props;
    const [data, setData] = useState(props.result.status == 'SUCCESS' ? props.result.data : {});
    const [loading, setLoading] = useState(false);
    const slug = getSlug(props);
    const [emptyPage, setEmptyPage] = useState(false);

    const [showPublishInfo, setShowPublishInfo] = useState(false);

    useEffect(() => {

        if (props.result.status == 'DATA-EXIST-FALSE') {
            setEmptyPage(true);
            return;
        }

        if (props.result.status == 'SUCCESS') {
            onChange(data, true);
            return;
        }

        setLoading(false);
        callAPI(`${solution.apis.page}retrieve`, { slug, published: false }, 'POST')
            .then((result) => {
                if (result.status == 'SUCCESS') {
                    onChange(result.data, true);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            })

    }, [process.browser])


    const onChange = (newData, init) => {
        setData(newData);
        if (_.isFunction(props.onChange)) props.onChange(newData, init);
    }

    const onChangeData = (name, value) => {
        const newData = _.cloneDeep(data);
        newData[name] = value;
        onChange(newData);
    }

    const onPublish = (value) => {
        const newData = _.cloneDeep(data);
        if (value) {
            newData.publishedBy = user.id;
            newData.publishedOn = _.utcISOString();
            setShowPublishInfo(true);
        }
        else {
            delete newData.publishedBy;
            delete newData.publishedOn;
            setShowPublishInfo(false);
        }
        onChange(newData);
    }

    const onChangeSection = (curSection) => {
        const newData = _.cloneDeep(data);
        newData.definition = _.map(newData.definition, (section) => {
            return _.sameGuid(section.id, curSection.id) ? curSection : section;
        });
        onChange(newData);
    }


    const renderEditSection = () => {
        if (!editMode || server || emptyPage) return null;

        if (!Tooltip) Tooltip = logDynamic(dynamic(() => import('../controls/antd/tooltip'), { ssr: false }), '../controls/antd/tooltip', DISPLAY_NAME);

        const url = `${window.location}`.replace('/edit/', '/page/');
        const noteForPublish = `
        <p>You will need to publish your page for other people to find and read it online. </p>
        <p>Published page are readable for everybody on the Internet. Although you can unpublish it 
        by unselecting the 'Publish the page' checkbox at any time, the content may have been cached by search engines.</p>
        Below is the link you can share to the readers<br/> 
        <a href="${url}">${url}</a>`

        return <>
            <FieldRow size={props.size}
                style={{ marginTop: '1.5rem' }}
                colStyles={
                    [
                        { flex: 'none' },
                        { flex: 'none', width: 150 },
                        { flex: 1, alignItems: 'center', }
                    ]
                }
                fields={[
                    <FieldCheckbox
                        key="showTitle"
                        onChange={onPublish}
                        defaultValue={false}
                        value={_.isNonEmptyString(data.publishedBy)}
                        className="hide-bottom-border"
                        label="Publish the page"
                        onClickInfo={() => { setShowPublishInfo(!showPublishInfo) }}
                    />,
                    <FieldPicklist
                        key="frequency"
                        value={data.frequency}
                        style={{ borderBottom: 'none' }}
                        placeholder="Select the layout of the media"
                        defaultValue="daily"
                        options={[
                            { value: 'daily', text: 'Update Daily' },
                            { value: 'weekly', text: 'Update Weekly' },
                            { value: 'monthly', text: 'Update monthly' }
                        ]}
                        onChange={(v) => onChangeData('frequency', v)} />,
                    <FieldContainer key="id" style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                        {data && data.id && <Tooltip color={colorByName('blue', 600)} placement="bottom" title={data.id}>
                            <span style={{ textDecoration: 'underline', fontSize: 12, cursor: 'pointer' }}>[ID]</span>
                        </Tooltip>}
                    </FieldContainer>,


                ]} />

            {showPublishInfo && <FieldAlert
                type="info"
                description={noteForPublish}
                onClose={() => { setShowPublishInfo(false) }}
            />}

            {/* <FieldHr /> */}

            <FieldRow size={props.size}
                fields={
                    [
                        <FieldText
                            key="title"
                            className="h1"
                            onChange={(v) => onChangeData('title', v)}
                            placeholder="Type the title of the page here"
                            value={data.title}
                            label="Page Title" />]
                } />
            {_.isNonEmptyString(data.title) && <FieldRow size={props.size}
                fields={[
                    <FieldCheckbox
                        key="showTitle"
                        style={{ marginBottom: 30 }}
                        onChange={(v) => onChangeData('showTitle', v)}
                        defaultValue={false}
                        value={data.showTitle}
                        className="hide-bottom-border"
                        label="Show the page title on the page" />

                ]} />
            }

            {/* <FieldHr /> */}

            <FieldRow size={props.size}
                fields={[
                    <FieldText key="description" type="textarea"
                        value={data.description}
                        onChange={(v) => onChangeData(`description`, v)}
                        placeholder="Type the description of the page here"
                        label="Page Description" />

                ]} />
            {_.isNonEmptyString(data.description) && <FieldRow size={props.size}
                fields={[
                    <FieldCheckbox
                        key="showTitle"
                        onChange={(v) => onChangeData('showDescription', v)}
                        defaultValue={false}
                        className="hide-bottom-border"
                        value={data.showDescription}
                        label="Show the page description on the page" />

                ]} />
            }

        </>
    }

    const onClickNewSection = (sectionId, type, change) => {

        if (change == 'above') change = 0; else change = 1;
        const newData = _.cloneDeep(data);
        if (!_.isArray(newData.definition)) newData.definition = [];

        const pos = _.findIndex(newData.definition, function (section) {
            return section.id === sectionId;
        });

        const newSection = { id: _.newGuid(), type, editMode: true, showTitle: true };
        switch (type) {
            case 'comprehensive':
            case 'paragraph':
                {
                    newSection.data = {};
                    break;
                }
            case 'tags':
                {
                    newSection.data = { tags: [] };
                    break;
                }
            default:
                {
                    newSection.data = [{ id: _.newGuid() }];
                    break;
                }
        }

        newData.definition = [
            ...newData.definition.slice(0, pos + change),
            newSection,
            ...newData.definition.slice(pos + change)
        ]
        onChange(newData);
    }

    const onConfirmDeleteSection = (curSection) => {
        const newData = _.cloneDeep(data);
        newData.definition = _.without(_.map(newData.definition, (section) => {
            return _.sameGuid(section.id, curSection.id) ? null : section;
        }), null);
        onChange(newData);
    }

    const onChangeSectionEditMode = (sectionId, newValue) => {
        onChangeSectionValue(sectionId, 'editMode', newValue);
    }

    const onChangeSectionName = (sectionId, newValue) => {
        onChangeSectionValue(sectionId, 'name', newValue);
    }

    const onChangeSectionValue = (sectionId, fieldName, newValue) => {
        const newData = _.cloneDeep(data);
        newData.definition = _.map(newData.definition, (section) => {
            if (_.sameGuid(sectionId, section.id)) {
                section[fieldName] = newValue;
            }
            return section;
        });
        onChange(newData);
    }

    const renderSectionToolbar = (section, index) => {
        if (!editMode) return null;
        if (!ToolbarSection) ToolbarSection = logDynamic(dynamic(() => import('../sections/toolbar'), { ssr: false }), '../sections/toolbar', DISPLAY_NAME);
        return <ToolbarSection
            index={_.isInteger(index) ? index + 1 : null}
            key={`toolbar-${section.id}`}
            emptyPage={emptyPage}
            {...props}
            section={section}
            onConfirmDelete={onConfirmDeleteSection}
            onClickNewSection={(type, pos) => onClickNewSection(section.id, type, pos)}
            relocateSection={relocateSection}
            onChangeSectionEditMode={(newValue) => onChangeSectionEditMode(section.id, newValue)}
            onChangeSectionName={(newValue) => onChangeSectionName(section.id, newValue)}
        />
    }

    const renderEmptyPage = () => {
        if (!emptyPage) return null;
        return !loading && <FieldRow size={props.size}
            style={{ marginTop: '1.5rem' }}
            fields={[<FieldAlert
                key="alert"
                type="error"
                description="There is no page that matches your request or you have no permission to edit this page."
            />]} />
    }

    const renderNoSectionMessageInEditMode = () => {

        if (_.isArray(data.definition) && data.definition.length > 0) return null;

        if (!Alert) Alert = Alert = logDynamic(dynamic(() => import('../controls/antd/alert'), { ssr: false }), '../controls/antd/alert', DISPLAY_NAME);

        const message = `The current page does not have any section.
        Please click the "Add New Section" button below to add your first section.`;
        return <div style={{ marginTop: '1.5rem', width: '100%' }}>
            {/* <p dangerouslySetInnerHTML={{ __html: msg }} /> */}
            <Alert type="error" message={message} />
            {renderSectionToolbar({})}
        </div>
    }

    const renderComprehensiveSection = (section) => {
        if (relocateSection) return null;
        return <ComprehensiveSection
            {...props}
            section={section}
            onChange={onChangeSection}
        />
    }

    const renderBannerSection = (section) => {
        if (relocateSection) return null;
        return <BannerSection
            {...props}
            section={section}
            onChange={onChangeSection}
        />
    }

    const renderColumnsSection = (section) => {
        if (relocateSection) return null;
        return <ColumnsSection
            {...props}
            section={section}
            type="swipe"
            onChange={onChangeSection}
        />
    }

    const renderParagraphSection = (section) => {
        if (relocateSection) return null;
        return <ParagraphSection
            {...props}
            section={section}
            onChange={onChangeSection}
        />
    }

    const renderTagsSection = (section) => {
        if (relocateSection) return null;
        if (!TagsSection) TagsSection = logDynamic(dynamic(() => import('../sections/tags'), { ssr: false }), '../sections/tags', DISPLAY_NAME);
        return <TagsSection
            {...props}
            section={section}
            onChange={onChangeSection}
        />
    }

    const renderSections = () => {

        return <>
            {renderNoSectionMessageInEditMode()}
            {_.map(data.definition, (section, index) => {
                const classNameWrapper = `section-wrapper ${index == 0 ? 'first' : ''} ${relocateSection ? 'relocate-true' : 'relocate-false'}  ${editMode ? 'edit-mode-true' : 'edit-mode-false'}`;
                switch (section.type) {
                    case 'comprehensive':
                        {
                            return <div className={classNameWrapper} key={section.id}>
                                {renderSectionToolbar(section, index)}
                                {renderComprehensiveSection(section)}
                            </div>
                        }
                    case 'paragraph':
                        {
                            return <div className={classNameWrapper} key={section.id}>
                                {renderSectionToolbar(section, index)}
                                {renderParagraphSection(section)}
                            </div>
                        }
                    case 'tags':
                        {
                            return <div className={classNameWrapper} key={section.id}>
                                {renderSectionToolbar(section, index)}
                                {renderTagsSection(section)}
                            </div>
                        }
                    case 'columns':
                        {
                            return <div className={classNameWrapper} key={section.id}>
                                {renderSectionToolbar(section, index)}
                                {renderColumnsSection(section)}
                            </div>
                        }
                    case 'banner':
                        {
                            return <div className={classNameWrapper} key={section.id}>
                                {renderSectionToolbar(section, index)}
                                {renderBannerSection(section)}
                            </div>
                        }
                }
            })}
        </>
    }

    const onSectionRelocated = (definition) => {
        const newData = _.cloneDeep(data);
        newData.definition = definition;
        onChange(newData);
    }

    const renderSortable = () => {
        if (!relocateSection) return null;
        if (!Sortable) Sortable = logDynamic(dynamic(() => import('../controls/sortable'), { ssr: false }), '../controls/sortable', DISPLAY_NAME);
        return <Sortable style={{ width: '100%' }} list={data.definition} setList={onSectionRelocated} delayOnTouchStart={true} delay={2}>
            {renderEmptyPage()}
            {renderSections()}
        </Sortable>
    }

    const renderNonSortable = () => {
        if (relocateSection) return null;
        return <>
            {renderEmptyPage()}
            {renderSections()}
        </>
    }

    return <>
        {!editMode && data.showTitle && _.isNonEmptyString(data.title) && <h1 dangerouslySetInnerHTML={{ __html: data.title }} />}
        {!editMode && data.showDescription && _.isNonEmptyString(data.description) && <p className="description" dangerouslySetInnerHTML={{ __html: data.description }} />}
        {renderEditSection()}
        {renderSortable()}
        {renderNonSortable()}
    </>
}

export const SideArea = (props) => {
    const { data, editMode } = props;
    return !editMode && <DefaultSideArea {...props} content={getPageContent(data)} />
}

export const renderFunctionArea = (props) => {
    if (!HomeFunctionArea) HomeFunctionArea = logDynamic(dynamic(() => import('../pages/home-function-area'), { ssr: false }), '../pages/home-function-area', DISPLAY_NAME);
    return <HomeFunctionArea {...props} />
}

export default { SideArea, MainArea, renderFunctionArea, getServerSideProps, getPageMetadata }