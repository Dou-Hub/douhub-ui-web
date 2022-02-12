
import _ from '../../../shared/util/base';
import TextField from '../fields/text';
import ParagraphSectionCSS from './paragraph-css';
import marked from 'marked';
import FieldHtml from '../fields/html';

const DISPLAY_NAME = 'ParagraphSection';

const AreaReadMode = (props) => {

    const { section } = props;
    const media = props[`media`];
    const content = props[`content`];
    const hasContent = _.isNonEmptyString(content);

    return (
        <>
            {section.supportMedia && _.isNonEmptyString(media) && <img src={media} width="200" height="150" style={!hasContent ? { marginBottom: 0 } : {}} />}
            {hasContent && <div className="content" dangerouslySetInnerHTML={{ __html: marked(content) }} />}
        </>
    )
}

const AreaEditMode = (props) => {
    const { data, onChangeForm, section } = props;
    const media = data[`media`];

    return (
        <>

            {section.supportMedia && <TextField
                className="media"
                value={media}
                onChange={(v) => onChangeForm(`media`, v)}
                label="Photo Url"
                placeholder="Photo Url" />}

            {_.isNonEmptyString(media) && <img src={media} width="200" height="150" />}

            {/* <FieldText type="textarea" className="content" value={data[`content`]} onChange={(v) => onChangeForm(`content`, v)} placeholder="Content" /> */}

            <FieldHtml
                hideH1={true}
                value={data[`content`]}
                data={data}
                onChange={(v, headers) => onChangeForm(`content`, v, headers)}
                placeholder="Please type content here"
                style={{ borderBottom: 'none', marginBottom: 0 }}
            />
        </>
    )
}

const ParagraphSection = (props) => {

    const { wraperStyle, section, env, editMode } = props;
    const data = section.data;

    const onChangeForm = (name, v, headers) => {
        const newSection = _.cloneDeep(section);
        if (_.isNil(v)) {
            delete newSection.data[name];
        }
        else {
            newSection.data[name] = v;
        }

        if (headers)
        {
            if (headers.h1.length > 0) newSection.h1 = headers.h1; else delete newSection.h1;
            if (headers.h2.length > 0) newSection.h2 = headers.h2; else delete newSection.h2;
            if (headers.h3.length > 0) newSection.h3 = headers.h3; else delete newSection.h3;
        }
      
        //console.log({ newSection, headers })
        if (_.isFunction(props.onChange)) props.onChange(newSection);
    }

    const renderReadMode = () => {
        if (editMode) return null;
        return <div className="section section-paragraph">
            <AreaReadMode section={section} {...data} env={env} wraperStyle={wraperStyle} />
        </div>
    }

    const renderEditMode = () => {
        if (!editMode) return null;
        return (
            <div className="section section-paragraph">
                <AreaEditMode section={section} data={data} wraperStyle={wraperStyle} onChangeForm={onChangeForm} />
            </div>
        )
    }

    return <>
        <ParagraphSectionCSS />
        {renderReadMode()}
        {renderEditMode()}
    </>
}

ParagraphSection.displayName = DISPLAY_NAME;
export default ParagraphSection;