import _ from '../../../shared/util/base';

const FieldColCSS = () => <style global jsx>
{`
    .field-col
    {
        flex: 1;
        margin-right: 30px;
        align-items: flex-end;
        display: flex;
    }

    .field-col-last
    {
        margin-right: 0px !important;
    }

    .field-col-content
    {
        width: 100%;
    }
    
`}
</style>

const FieldCol = (props) => {

    const { style, first, last } = props;

    return (
        <>
            <FieldColCSS />
            <div style={style} className={`field-col ${first ? 'field-col-first' : ''} ${last ? 'field-col-last' : ''}`}>
                <div className='field-col-content'>
                    {props.children}
                </div>
            </div>
        </>
    )
}

FieldCol.displayName = 'FieldCol';
export default FieldCol;
