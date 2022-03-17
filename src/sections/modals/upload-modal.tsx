import React, { useEffect, useState } from 'react';
import { isFunction, cloneDeep, map, each, without, isNil } from 'lodash';
import {  callAPI, _window } from 'douhub-ui-web-basic';
import {  BasicModal } from '../../index';
import { getDateTimeString, isNonEmptyString, getPropName } from 'douhub-helper-util';
import Step1 from './upload-modal-step-1';
import Step2 from './upload-modal-step-2';
import Step3 from './upload-modal-step-3';
import Step4 from './upload-modal-step-4';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';

const UploadModal = observer((props: Record<string, any>) => {

    const { show, entity, recordForMembership } = props;
    const solution = _window.solution;
    const [stepIndex, setStepIndex] = useState(0);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);
    const envStore = useEnvStore();
    const { height, width } = envStore;

    useEffect(() => {
        setStepIndex(0);
        setError('');
    }, [props.show])

    const onClose = () => {
        _window.uploadedCSVFileContent = ''
        if (isFunction(props.onClose)) props.onClose();
    }


    const onChangeContent = (v: any) => {
        console.log({ v })
    }

    const STEPS = [
        {
            index: 1, buttons: without([
                {
                    text: "Cancel",
                    type: "cancel",
                    onClick: onClose
                },
                isNonEmptyString(_window.uploadedCSVFileContent) ?
                    {
                        text: "Next",
                        type: "info",
                        onClick: () => { setError(''); setStepIndex(1); }
                    } : null
            ], null),
            title: 'Step 1: Upload the CSV file',
            titleClassName: 'text-left'
        },
        {
            index: 2, buttons: [
                {
                    text: "Cancel",
                    type: "cancel",
                    onClick: onClose
                },
                {
                    text: "Back",
                    type: "info",
                    className: "bg-blue-400 hover:bg-blue-500 focus:ring-blue-300",
                    onClick: () => {
                        setError('');
                        setStepIndex(0)
                    }
                },
                {
                    text: "Next",
                    type: "info",
                    onClick: () => {
                        setError('');
                        setStepIndex(2)
                    }
                }
            ], title: 'Step 2: Review & modify raw content',
            titleClassName: 'text-left'
        },
        {
            index: 3, buttons: [
                {
                    text: "Cancel",
                    type: "cancel",
                    onClick: onClose
                },
                {
                    text: "Back",
                    type: "info",
                    className: "bg-blue-400 hover:bg-blue-500 focus:ring-blue-300",
                    onClick: () => {
                        setError('');
                        setStepIndex(1)
                    }
                },
                {
                    text: "Submit",
                    type: "info"
                }
            ], 
            title: 'Step 3: Review the data in the table',
            titleClassName: 'text-left'
        },
        {
            index: 4, buttons: [
                {
                    text: "Close",
                    type: "info",
                    onClick: onClose
                }
            ], 
            title: `Step 4: ${entity.uiCollectionName} has been submitted`,
            titleClassName: 'text-left'
        }
    ]


    const step = STEPS[stepIndex];

    const getModalStyle = (): Record<string, any> => {
        switch (stepIndex) {
            case 0: return { width: 300 };
            case 1: return { maxWidth: width * 0.8, width: width * 0.8, height: height * 0.8 };
            case 2: return { maxWidth: width * 0.8, width: width * 0.8, height: height * 0.8 };
            case 3: return { width: 400 };
        }
        return {};
    }

    const modalStyle: Record<string, any> = getModalStyle();

    const renderContent = () => {
        console.log({ stepIndex })
        switch (stepIndex) {
            case 0: return <Step1 entity={entity} recordId={`${entity.entityName}${entity.entitytype ? '-' + entity.entitytype : ''}-${getDateTimeString()}`}
                modalStyle={modalStyle}
                onSuccessUpload={onStep1} />
            case 1: return <Step2 entity={entity} modalStyle={modalStyle}
                onChange={onChangeContent} />
            case 2: return <Step3 entity={entity} onError={onErrorStep3} error={error} recordForMembership={recordForMembership} modalStyle={modalStyle} />
            case 3: return <Step4 entity={entity} modalStyle={modalStyle}/>
        }
        return <></>
    }

    const onErrorStep3 = (error: string) => {
        setError(error);
    }


    const onStep1 = () => {
        setStepIndex(1);
    }

    const onSubmit = () => {

        setProcessing("Uploading ...");
        setError('');
        const mapping = _window.uploadedCSVFilePropsMapping;
        const mappingProps = Object.getOwnPropertyNames(mapping);
        const data = cloneDeep(_window.uploadedCSVFileJSON);
        callAPI(solution, `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}import`, {
            data: map(data, (r) => {
                const newRecord: Record<string, any> = {};
                each(mappingProps, (columnName: string) => {
                    newRecord[getPropName(mapping[columnName])] = r[columnName];
                });
                return { ...newRecord, entityName: entity.entityName, entityType: entity.entityType }
            })
        }, 'POST')
            .then(() => {
                setStepIndex(3);
                if (isFunction(props.onSubmitSucceed)) props.onSubmitSucceed();
            })
            .catch((error: any) => {
                console.error(error);
                setError(`Failed to upload ${entity.uiCollectionName}`);
            })
            .finally(() => {
                setProcessing(null);
            })
    }

    return <>
        <BasicModal
            titleClassName={step.titleClassName}
            show={!isNil(show)}
            onClose={onClose}
            onSubmit={onSubmit}
            title={step.title}
            processing={processing}
            content={renderContent()}
            style={modalStyle}
            error={error}
            buttons={step.buttons}
        />
    </>
})

export default UploadModal;