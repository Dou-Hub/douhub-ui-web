import _ from '../../../shared/util/base';

const styles = {
    onClick: { cursor: 'pointer', textDecoration: 'underline' }
}

const FieldMessage = (props) => {

    const { type, content, style } = props;
    const onClick = () => {
        if (_.isFunction(props.onClick)) props.onClick();
    }
    return _.isNonEmptyString(content) ?
        <div className={`field field-message field-message-${type}`} 
            onClick={onClick}
            style={_.style(_.isFunction(props.onClick) ? styles.onClick : {}, style)}
            dangerouslySetInnerHTML={{ __html: content }} /> : null;
}
export default FieldMessage;
