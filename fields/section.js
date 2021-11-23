import _ from '../../../shared/util/base';
import FieldCSS from './css';
import marked from 'marked';

const FieldSectionCSS = () => <style global jsx>
{`
    .field-section
    {
        margin-top: 2rem;
        margin-bottom: 1rem;
        border-bottom: solid 1px #1890ff;
        color: #1890ff;
        padding: 0.5rem 0;
    }

    .field-section p
    {
        margin-bottom: 0;
    }

    .field-section .title
    {
        line-height: 1.1;
        font-size: 1.1rem;
    }

    .field-section .sub-label
    {
        font-size: 0.8rem;
        color: rgba(0,0,0,0.8);
        line-height: 1.1;
    }
`}
</style>


const FieldSection = (props) => {
    const { title, subTitle, disabled, style } = props;
    return (
        <>
            <FieldCSS />
            <FieldSectionCSS/>
            <div style={style} className={`field-section ${disabled ? 'field-disabled' : ''}`}>
                <div className="title"  dangerouslySetInnerHTML={{ __html: marked(title) }}/>
                {_.isNonEmptyString(subTitle) && <div className="sub-title" dangerouslySetInnerHTML={{ __html: marked(subTitle) }}/>}
            </div>
        </>
    )
}

FieldSection.displayName = 'FieldSection';
export default FieldSection;
