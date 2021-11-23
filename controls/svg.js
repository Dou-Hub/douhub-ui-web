import { ReactSVG } from 'react-svg';
import _ from '../../../shared/util/base';

const SVGCSS = () => <style global jsx>{`
    .svg {
        line-height: 1;
        height: inherit;
        width: inherit;
    }
    .svg div,
    .svg svg
    {
        height: inherit;
        width: inherit;
    }
`}</style>
SVGCSS.displayName = 'SVGCSS';

const SVG = (props) => {
    const {src, style} = props;
    const onClick = ()=>{
       if (_.isFunction(props.onClick)) props.onClick();
    }
    
    return (
        <>
            <SVGCSS />
            <div onClick={onClick} style={style} className={`svg-wrapper ${props.className?props.className:''}`}>
                <ReactSVG src={src} className="svg" />
            </div>
        </>
    )
}
SVG.displayName = 'SVG';
export default SVG;