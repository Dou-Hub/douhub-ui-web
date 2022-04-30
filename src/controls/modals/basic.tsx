import React from 'react';
import { isFunction } from 'lodash';
import { _window, BasicModal as IBasicModal} from 'douhub-ui-web-basic';
import { isNonEmptyString } from 'douhub-helper-util';
import Popconfirm from '../antd/popconfirm';

const ButtonWrapper = (props: Record<string, any>) => {

    const { onClickConfirm, confirmationOk, confirmationCancel, confirmationOkType,
        confirmationTitle, confirmationPlacement } = props;

    const onConfirm = () => {
        if (isFunction(onClickConfirm)) onClickConfirm();
    }

    return isNonEmptyString(confirmationTitle) ? <Popconfirm
        placement={confirmationPlacement ? confirmationPlacement : "top"}
        title={confirmationTitle}
        okType={confirmationOkType}
        onConfirm={onConfirm}
        okText={confirmationOk ? confirmationOk : 'Ok'}
        cancelText={confirmationCancel ? confirmationCancel : 'Cancel'}>
        {props.children}
    </Popconfirm> : props.children;
}

const BasicModal = (props: Record<string, any>) => {
    
    return <IBasicModal {...props} ButtonWrapper={ButtonWrapper}/>
}

export default BasicModal;