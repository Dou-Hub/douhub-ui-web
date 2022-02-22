import React, { useEffect, useState } from 'react';
import Modal from '../../controls/antd/modal';
import FieldMessage from '../../fields/message';
import { SignInFields } from './helper';
import { isFunction } from 'lodash';

const SignInSection = (props: Record<string, any>) => {
    const { type, alwaysShowLabel } = props;
    const [doing, setDoing] = useState(props.doing);
    const [errorMessage, setErrorMessage] = useState(props.errorMessage);
    const [form, setForm] = useState<Record<string, any>>({});

    useEffect(() => {
        setForm(props.data);
    }, [props.data]);

    useEffect(() => {
        setErrorMessage(props.errorMessage);
    }, [props.errorMessage]);

    useEffect(() => {
        if (props.doing !== doing) setDoing(props.doing);
    }, [props.doing]);

    const onCancel = () => {
        setErrorMessage(null);
        setDoing(null);
        if (isFunction(props.onClose)) props.onClose();
    }

    const onChangeForm = (fieldName: string, value: any) => {
        setErrorMessage('');
        form[fieldName] = value;
        setForm({ ...form });
        if (isFunction(props.onChangeForm)) props.onChangeForm(form);
    }

    const onSubmitPassword = () => {
        if (isFunction(props.onSubmitPassword)) props.onSubmitPassword(form);
    }

    const onSubmitEmail = () => {
        if (isFunction(props.onSubmitEmail)) props.onSubmitEmail(form);
    }

    const onChangeRememberMe = () => {
        onChangeForm('rememberMe', form.rememberMe == true ? false : true);
    }

    const onSubmitModal = () => {
        if (isFunction(props.onSubmitModal)) props.onSubmitModal(form);
    }

    const onClickResendCodes = () => {
        if (isFunction(props.onClickResendCodes)) props.onClickResendCodes(form);
    }

    const renderForm = () => {
        return <>
            <SignInFields
                onClickResendCodes={onClickResendCodes}
                onChangeRememberMe={onChangeRememberMe}
                onSubmitPassword={onSubmitPassword}
                onSubmitEmail={onSubmitEmail}
                alwaysShowLabel={alwaysShowLabel}
                data={form}
                onChangeForm={onChangeForm}
                disabled={doing}/>
            <FieldMessage content={errorMessage} type="error" />
        </>
    }

    return type == 'modal' ? <Modal title="Sign In"
        className={doing ? "doing" : ""}
        visible={true}
        okText={"Submit"}
        onOk={onSubmitModal}
        onCancel={onCancel}>
        {renderForm()}
    </Modal> : renderForm();
};

export default SignInSection;
