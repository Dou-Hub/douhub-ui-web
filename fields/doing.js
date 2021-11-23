import _ from '../../../shared/util/base';
import LoadingCircle from '../controls/loading-circle';

const FieldDoing = (props) => {

    const { hidden, text } = props;
    return hidden?null:<LoadingCircle className="field field-doing" size={18} text={text} textSize="inherited"/>
}
export default FieldDoing;
