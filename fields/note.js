import _ from '../../../shared/util/base';
import FieldCSS from './css';

const FieldNote = (props) => {

    const { text, disabled, hidden } = props;
    return (
        <>
            <FieldCSS />
            {_.isNonEmptyString(text) && !hidden && <div className={`field-note ${disabled ? 'field-disabled' : ''}`} dangerouslySetInnerHTML={{ __html: text }}/>}
        </>
    )
}
export default FieldNote;
