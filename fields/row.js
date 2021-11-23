import { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import FieldCol from './col';

const FieldRowCSS = () => <style global jsx>
    {`

    .field-row
    {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .field-row-columns-2,
    .field-row-columns-3,
    .field-row-columns-4,
    .field-row-columns-5
    {
        flex-direction: row;
    }

    .field-row-columns-1 .field-col
    {
        margin-right: 0 !important;
    }
    
`}
</style>

const FieldRow = (props) => {

    const { style, size, fields, className } = props;
    const disableAutoAdjust = _.isBoolean(props.disableAutoAdjust) ? props.disableAutoAdjust : false;
    const columnCount = _.isInteger(props.columnCount) && props.columnCount > 0 ? props.columnCount : 2;
    let curColumnCount = columnCount;

    if (!disableAutoAdjust && size == 's') curColumnCount = _.isInteger(props.columnCountS) && props.columnCountS > 0 ? props.columnCountS : 1;
    if (!disableAutoAdjust && size == 'xs') curColumnCount = _.isInteger(props.columnCountXS) && props.columnCountXS > 0 ? props.columnCountXS : 1;
    if (!disableAutoAdjust && size == 'm') curColumnCount = _.isInteger(props.columnCountM) && props.columnCountM > 0 ? props.columnCountM : 2;
    if (!disableAutoAdjust && size == 'l') curColumnCount = _.isInteger(props.columnCountL) && props.columnCountL > 0 ? props.columnCountL : 2;
    if (!disableAutoAdjust && size == 'xl') curColumnCount = _.isInteger(props.columnCountXL) && props.columnCountXL > 0 ? props.columnCountXL : 2;

    const renderColumns = () => {
        const colStyles = _.isArray(props.colStyles)?props.colStyles:[];
        const colStylesCount = colStyles.length;
        return _.map(fields, (field, i) => {
            const colStyle = i<=colStylesCount-1?colStyles[i]:{};
      
            return <FieldCol key={i} first={i == 0} last={i == fields.length - 1} style={colStyle}>
                {field}
            </FieldCol>
        });
    }

    return (
        <>
            <FieldRowCSS />
            <div style={style} className={`field-row ${className} field-row-columns-${curColumnCount}`}>
                {renderColumns()}
            </div>
        </>
    )
}

FieldRow.displayName = 'FieldRow';
export default FieldRow;
