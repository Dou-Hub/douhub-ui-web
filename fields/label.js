import _ from '../../../shared/util/base';
import FieldCSS from './css';
import marked from 'marked';


const FieldLabelCSS = () => <style global jsx>
    {`
    .field-label
    {
        font-size: 0.8rem !important;
        color: #333333;
        line-height: 1.1 !important;
        margin-bottom: 0 !important;
        min-height: 18px;
    } 

    .field-label p
    {
        margin-bottom: 0;
    }

    .field-label .title
    {
        line-height: 1.1;
    }

    .field-label .sub-label
    {
        font-size: 0.8rem;
        line-height: 1.1;
    }
`}
</style>

const FieldLabel = (props) => {
    const { text, disabled, style, hidden } = props;
    const onClick = (e) => {
        if (_.isFunction(props.onClick)) props.onClick(e);
    }
    return (
        <>
            <FieldCSS />
            <FieldLabelCSS />
            {_.isNonEmptyString(text) && !hidden && <div style={style}
                onClick={onClick}
                className={`field-label ${disabled ? 'field-disabled' : ''}`}
                dangerouslySetInnerHTML={{ __html: marked(text) }} />}
        </>
    )
}

FieldLabel.displayName = 'FieldLabel';
export default FieldLabel;
