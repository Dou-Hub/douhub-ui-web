import React, { useEffect, useState } from 'react';
import { isFunction, isArray, find, without, uniq} from 'lodash';
import CheckboxField from './checkbox';


const CheckboxGroupField = (props: Record<string,any>) => {

    const { groupValue} = props;

    const defaultValue = isArray(props.defaultValue) ? props.defaultValue : null;
    const [value, setValue] = useState<Array<string|boolean>|undefined|null>(isArray(props.value) ? props.value : defaultValue);
   
    useEffect(()=>{
        setValue(isArray(props.value) ? props.value : defaultValue);
    },[defaultValue, [props.value]]);
    
    const onChangeCheckbox = (selected: boolean)=>{
      
        let newValue:any = value?[...value]:[];
        if (!selected)
        {
            newValue = without(newValue,groupValue);
        }
        else
        {
            newValue = uniq([...newValue,groupValue]);
        }

        if (newValue.length==0) newValue=null;
        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(newValue);
       
    }

    return <CheckboxField {...props} value={find(value,(v)=>v==groupValue)?true:false} onChange={onChangeCheckbox}/>
};

CheckboxGroupField.displayName = 'CheckboxGroupField';
export default CheckboxGroupField;
