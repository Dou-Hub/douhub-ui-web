import {
    DEFAULT_COLUMNS, AlertField,
    Notification, DefaultForm,
    ListCategoriesTags, ListFilters, ListFormHeader,
    Splitter as SplitterInternal, ListTable, LIST_CSS, ListFormResizer
} from '../../index';
import { SVG, hasErrorType, getLocalStorage, _window, CSS, _track, callAPI, setLocalStorage } from 'douhub-ui-web-basic';

import React, { useEffect, useState } from 'react';
import { getRecordDisplay, isObject, isNonEmptyString, newGuid, setWebQueryValue } from 'douhub-helper-util';
import { without, throttle, isNumber, map, isFunction, isArray, find, isNil } from 'lodash';
import { useRouter } from 'next/router';
import ReactResizeDetector from 'react-resize-detector';
import ListHeader from './list-header';
// import ListHeader from 'douhub-ui-web';

const NonSplitter = (props: Record<string, any>) => {
    return <div className="flex flex-row w-full">
        {props.children}
    </div>
}

const FORM_RESIZER_MIN_WIDTH = 500;

const ListBase = (props: Record<string, any>) => {
    const router = useRouter();
    const solution = _window.solution;
    const { height, entity, search, hideListCategoriesTags, selectionType, width, allowCreate, allowUpload, recordForMembership } = props;
    const defaultFormWidth = isNumber(props.defaultFormWidth) ? props.defaultFormWidth : FORM_RESIZER_MIN_WIDTH;

    const loadingMessage = isNonEmptyString(props.loadingMessage) ? props.loadingMessage : 'Loading ...';
    const [firtsLoading, setFirstLoading] = useState(true);

    const sidePanelCacheKey = `list-sidePanel-${entity?.entityName}-${entity?.entityType}`;
    const formWidthCacheKey = `list-form-width-${entity?.entityName}-${entity?.entityType}`;

    const sidePanelCacheValue = getLocalStorage(sidePanelCacheKey, true);
    const [sidePanel, setSidePanel] = useState(!isNil(sidePanelCacheValue) ? sidePanelCacheValue : true);
    const [firstLoadError, setFirstLoadError] = useState('');
    const [reload, setReload] = useState('');
    const [recordSaving, setRecordSaving] = useState('');
    const [areaWidth, setAreaWidth] = useState<number>(0);
    const [result, setResult] = useState<Record<string, any> | null>(null);
    const [notification, setNotification] = useState<{ id: string, message: string, description: string, type: string } | null>(null);
    const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);
    const [selectedRecords, setSelectedRecords] = useState<Record<string, any>>([]);
    const [predefinedFormWidth, setPredefinedFormWidth] = useState(defaultFormWidth);

    const Form = props.Form ? props.Form : DefaultForm;
    const formHeightAdjust = isNumber(props.formHeightAdjust) ? props.formHeightAdjust : 130;
    const Header = props.Header ? props.Header : ListHeader;
    const supportSlitter = props.supportSlitter == true
    const Splitter = supportSlitter ? SplitterInternal : NonSplitter;
    const CurrentListCategoriesTags = props.ListCategoriesTags ? props.ListCategoriesTags : ListCategoriesTags;
    const columns = props.columns ? props.columns : DEFAULT_COLUMNS;
    const maxListWidth = isNumber(props.maxListWidth) ? props.maxListWidth : areaWidth;

    const maxFormWidth = predefinedFormWidth > areaWidth - 20 ? areaWidth - 20 : (isNumber(props.maxFormWidth) ? props.maxFormWidth : 800);

    const [filterSectionHeight, setFilterSectionHeight] = useState(0);
    const scope = isNonEmptyString(props.scope) ? props.scope : 'organization';
    const showSidePanel = sidePanel && !hideListCategoriesTags && !currentRecord;
    const secondaryInitialSize = areaWidth - maxListWidth >= 350 ? areaWidth - 350 : areaWidth - 250;
    const deleteButtonLabel = isNonEmptyString(props.deleteButtonLabel) ? props.deleteButtonLabel : 'Delete';
    const deleteConfirmationMessage = isNonEmptyString(props.deleteConfirmationMessage) ? props.deleteConfirmationMessage : `Are you sure you want to delete the ${entity?.uiName.toLowerCase()}?`;

    const predefinedQueries = isArray(props.queries) && props.queries.length > 0 ? props.queries : entity.queries;
    const formWidth = predefinedFormWidth < maxFormWidth ? predefinedFormWidth : maxFormWidth;
   
    useEffect(() => {
        //init form width from localstorage and props
        const cacheValue = getLocalStorage(formWidthCacheKey);
        console.log({ cacheValue })
        if (isNumber(cacheValue)) {
            setPredefinedFormWidth(cacheValue);
        }
    }, [formWidthCacheKey, currentRecord?.id])


    const queries = isArray(predefinedQueries) && predefinedQueries.length > 0 ? without([
        props.hideQueryForAll == true ? null : {
            title: `All ${entity.uiCollectionName}`,
            id: 'default-all'
        }, ...predefinedQueries
    ], null) : [];
    const queryId = props.queryId ? props.queryId : (queries.length > 0 && queries[0].id);

    const statusCodes = isArray(entity.statusCodes) && entity.statusCodes.length > 0 ? [
        {
            title: `All Status`,
            id: 'default-all'
        }, ...entity.statusCodes
    ] : [];
    const statusId = props.statusId ? props.statusId : (statusCodes.length > 0 && statusCodes[0].id);
    const curStatusCode = isNonEmptyString(statusId) && find(statusCodes, (s) => { return s.id == statusId });

    const filters = without([
        isNonEmptyString(search) ? { type: 'search', search } : null
    ], null);

    const listHeaderHeight = 68;
    const tableHeaderHeight = 55;
    const tableHeight = height - listHeaderHeight - (filters.length == 0 ? 0 : filterSectionHeight);

    without([
        isNonEmptyString(search) ? { id: newGuid(), type: 'search', search } : null
    ], null);



    const onUpdateFormWidth = (newWidth: number) => {
        setPredefinedFormWidth(newWidth);
        setLocalStorage(formWidthCacheKey, newWidth);
    }


    const onChangeQuery = (curQuery: Record<string, any>) => {
        router.push(setWebQueryValue(`${_window.location}`, 'query', curQuery.id));
    }

    const onChangeStatus = (curStatus: Record<string, any>) => {
        console.log({ curStatus })
        router.push(setWebQueryValue(`${_window.location}`, 'status', curStatus.value));
    }

    const onResizeFormDetector = (width?: number) => {
        setAreaWidth(width ? width : 0);
        console.log({ width })
    }

    useEffect(() => {

        setFirstLoadError('');
        setFirstLoading(true);
        setResult(null);

        const query: Record<string, any> = {
            entityName: entity.entityName,
            orderBy: [{ "type": "desc", "attribute": "_ts" }],
            conditions: []
        };

        // if (_track) console.log({ recordForMembership, scope });

        if (isObject(recordForMembership) && isNonEmptyString(recordForMembership.id) && scope == 'membership') {
            query.scope = 'membership';
            query.recordIdForMembership = recordForMembership.id;
        }

        const curQuery = isNonEmptyString(queryId) && find(queries, (q) => q.id == queryId);
        if (isArray(props.conditions)) query.conditions = [...query.conditions, ...props.conditions];
        if (curQuery && isArray(curQuery.conditions)) query.conditions = [...query.conditions, ...curQuery.conditions];
        if (curStatusCode && isArray(curStatusCode.conditions)) query.conditions = [...query.conditions, ...curStatusCode.conditions];

        let apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}query`;
        if (isNonEmptyString(search)) {
            apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}search`;
            query.keywords = search;
        }

        callAPI(solution, apiEndpoint, { query }, 'post')
            .then((newResult: any) => {
                setResult({ ...newResult });
            })
            .catch((error: any) => {
                console.error(error);
                setFirstLoadError('Sorry, the data was failed to load.');
            })
            .finally(() => {
                setFirstLoading(false);
            })
    }, [entity, reload, search, queryId, statusId])

    const onClickCreateRecord = () => {
        const newRecord: Record<string, any> = { id: newGuid(), entityName: entity.entityName };
        if (isNonEmptyString(entity.entityType)) newRecord.entityType = entity.entityType;
        onClickRecord(newRecord, 'create');
    }

    const onClickDeleteRecordFromForm = () => {
        onClickDeleteRecord({ ...currentRecord });
        setCurrentRecord(null);
    }

    const onClickDeleteRecordInternal = async (entity: Record<string, any>, record: Record<string, any>, recordForMembership?: Record<string, any>) => {
        return new Promise((resolve, reject) => {

            const postData: Record<string, any> = { id: record.id }
            if (isNonEmptyString(recordForMembership?.id)) postData.recordIdForMembership = recordForMembership?.id;

            callAPI(solution, `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}delete`, postData, 'delete')
                .then(resolve)
                .catch(reject);
        });
    }

    const onClickDeleteRecord = (record: Record<string, any>) => {

        setResult({
            ...result, data: map(result?.data, (r) => {
                if (r.id == record.id) {
                    r.uiDoing = true;
                    r.uiDisabled = true;
                }
                else {
                    delete r.uiDoing;
                    delete r.uiDisabled;
                }
                return r;
            })
        });

        const callToDelete = isFunction(props.onClickDeleteRecord) ? props.onClickDeleteRecord : onClickDeleteRecordInternal;

        callToDelete(entity, record, recordForMembership)
            .then(() => {
                if (!props.keepRecordInListAfterDelete) {
                    const newResult: Record<string, any> = {
                        ...result, data: without(map(result?.data, (r) => {
                            delete r.uiDoing;
                            delete r.uiDisabled;
                            return r.id == record.id ? null : r;
                        }), null)
                    };
                    setResult(newResult);
                }
                else {
                    setResult({
                        ...result, data: map(result?.data, (r) => {
                            delete r.uiDoing;
                            delete r.uiDisabled;
                            return r;
                        })
                    });
                }

            })
            .catch((error: any) => {
                console.error(error);
                setResult({
                    ...result, data: map(result?.data, (r) => {
                        delete r.uiDoing;
                        delete r.uiDisabled;
                        return r;
                    })
                });
                setNotification({ id: newGuid(), message: 'Error', description: `Sorry, it was failed to delete the ${entity.uiName}.`, type: 'error' });
            })
            .finally(() => {

            })
    }

    const onClickRecord = (record: Record<string, any>, action: string) => {
        switch (action) {
            case 'delete':
                {
                    onClickDeleteRecord(record);
                    break;
                }
            case 'create':
            case 'edit':
                {
                    setCurrentRecord(record);
                    break;
                }
            default:
                {
                    console.log({ record, action })
                }
        }
        if (isFunction(props.onClickRecord)) props.onClickRecord(record, action);
    }

    const renderFirstLoadError = () => {
        if (!isNonEmptyString(firstLoadError)) return null;
        return <div className="w-full flex p-4">
            <AlertField className="pl-2" type="error" message={firstLoadError} />

        </div>
    }

    const renderFirstLoading = () => {
        if (!firtsLoading) return null;
        return <div className="w-full flex p-4">
            <SVG src="/icons/loading.svg" className="spinner" style={{ width: 22, height: 22 }} />
            <span className="pl-2">{loadingMessage}</span>
        </div>
    }

    const onRowSelected = (newSelectedIds: React.Key[], newSelectedRecords: Record<string, any>[]) => {
        setSelectedRecords(newSelectedRecords);
        if (isFunction(props.onRowSelected)) props.onRowSelected(newSelectedIds, newSelectedRecords);
    }

    const renderTable = () => {

        if (firtsLoading || isNonEmptyString(firstLoadError)) return null;
        return <ListTable
            width={width}
            selectionType={selectionType} //undefined|checkbox|radio
            onRowSelected={onRowSelected}
            height={tableHeight - tableHeaderHeight}
            columns={columns(onClickRecord, entity)}
            data={result ? result.data : []} />
    }

    const onClickRefresh = () => {
        setReload(newGuid());
    }

    const onClickSaveRecord = (closeForm: any) => {

        const op = !currentRecord?._rid ? 'create' : 'update'

        if (isArray(entity.requiredFields) && entity.requiredFields.length > 0) {
            const fieldNeedValue = find(entity.requiredFields, (field) => {
                return isNil(currentRecord?.[field.name]);
            });

            if (fieldNeedValue) {
                return setNotification({
                    id: newGuid(),
                    message: 'Error',
                    description: `Please provide the value to the required fields (${fieldNeedValue.label})`, type: 'error'
                });
            }
        }

        setRecordSaving(op);

        const apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}${op}`;


        callAPI(solution, apiEndpoint, { data: currentRecord }, op == 'create' ? 'post' : 'put')
            .then((newRecord: any) => {
                const newResult: Record<string, any> = { ...result };

                if (!find(newResult.data, (r: any) => r.id == newRecord.id)) {
                    newResult.data.unshift(newRecord);
                    newResult.count = newResult.count + 1;
                }
                else {
                    newResult.data = map(newResult.data, (r) => {
                        return r.id == newRecord.id ? newRecord : r;
                    });
                }
                setResult(newResult);
                setCurrentRecord(newRecord);
                if (closeForm) onClickCloseForm();
            })
            .catch((error: any) => {
                console.log({ error })
                if (hasErrorType(error, 'ERROR_API_USEREXISTS')) {
                    setNotification({ id: newGuid(), message: 'Error', description: `Sorry, there's already a user with the same email.`, type: 'error' });
                }
                else {
                    setNotification({ id: newGuid(), message: 'Error', description: `Sorry, it was failed to ${op} the ${entity.uiName}.`, type: 'error' });
                }
            })
            .finally(() => {
                setRecordSaving('');
            })
    }

    const onClickCloseForm = () => {
        setCurrentRecord(null);
    }

    const onChangeCurrentRecord = (newData: Record<string, any>) => {
        setCurrentRecord({ ...newData, display: getRecordDisplay(newData) })
    }

    const onClickShowSidePanel = () => {
        setLocalStorage(sidePanelCacheKey, true);
        setSidePanel(true);
    }

    const onRemoveFilter = (filter: Record<string, any>) => {
        switch (filter.type) {
            case 'search':
                {
                    if (isFunction(props.onRemoveSearch)) props.onRemoveSearch(filter);
                }
        }
    }

    const onClickCloseListCategoriesTags = () => {
        console.log('onClickCloseListCategoriesTags');
        setLocalStorage(sidePanelCacheKey, false);
        setSidePanel(false);
    }

    const renderListCategoriesTags = () => {
        return <div className={`w-full h-full absolute xl:relative z-10 border-r xl:border-0 drop-shadow-md xl:drop-shadow-none  overflow-hidden ${showSidePanel ? '' : 'hidden'}`}
            style={supportSlitter ? {} : { width: 320 }}>
            <CurrentListCategoriesTags height={height} entityName={entity.entityName} entityType={entity.entityType} onClickClose={onClickCloseListCategoriesTags} />
        </div>
    }


    const renderListSection = () => {
        return <div
            className={`w-full h-full flex-1 overflow-hidden  ${showSidePanel ? 'border-l' : ''} ${maxListWidth != areaWidth ? 'pr-2 border-r' : ''}`}
        >
            {notification && <Notification id={notification.id} message={notification.message} description={notification.description} type={notification.type} />}
            <Header
                queryTitleMaxLength={props.queryTitleMaxLength}
                // querySelectorMinWidth={props.querySelectorMinWidth}
                statusSelectorMinWidth={props.statusSelectorMinWidth}
                recordForMembership={recordForMembership}
                allowCreate={allowCreate}
                allowUpload={allowUpload}
                sidePanel={hideListCategoriesTags ? 'none' : sidePanel}
                statusCodes={statusCodes}
                statusId={statusId}
                queries={queries}
                queryId={queryId}
                entity={entity}
                maxWidth={maxListWidth}
                onClickShowSidePanel={onClickShowSidePanel}
                onClickRefresh={onClickRefresh}
                onClickCreateRecord={onClickCreateRecord}
                onChangeQuery={onChangeQuery}
                onChangeStatus={onChangeStatus}
                selectedRecords={selectedRecords}
            />
            {filters.length > 0 && <ListFilters
                onRemoveFilter={onRemoveFilter}
                filters={filters}
                maxWidth={maxListWidth}
                onResizeHeight={(height: number) => setFilterSectionHeight(height)}
            />}
            <div className={`w-full h-full flex bg-white`}
                style={{ maxWidth: maxListWidth, height: tableHeight }}>
                {renderTable()}
                {renderFirstLoading()}
                {renderFirstLoadError()}
            </div>
        </div>
    }


    return <>
        <CSS id={`list-css-${areaWidth == 0 ? 'server' : 'client'}`} content={`
        ${LIST_CSS}
        .douhub-list .layout-pane:last-child
        {
            min-width: ${areaWidth - 350}px;
            ${!sidePanel && 'width: 100% !important;'}
        }
        `} />

        <div className={`douhub-list relative bg-white flex flex-row overflow-hidden douhub-list-${areaWidth < 650 ? 'full' : ''} douhub-list-sidepanel-${showSidePanel ? 'show' : 'hidden'}`}
            style={{ backgroundColor: '#fafafa', minHeight: height }}>
            <Splitter
                secondaryInitialSize={secondaryInitialSize}
                primaryMinSize={250}
                secondaryMinSize={areaWidth - 350}>
                {renderListCategoriesTags()}
                {renderListSection()}
            </Splitter>

            {currentRecord && <div className="relative h-full z-10" style={{ backgroundColor: '#fafafa', minHeight: height }}>
                <ListFormResizer
                    id={currentRecord.id}
                    onChangeSize={onUpdateFormWidth}
                    defaultWidth={formWidth > areaWidth ? areaWidth : formWidth}
                    className="absolute top-0 right-0"
                    style={{
                        height, maxWidth: maxFormWidth, minWidth: FORM_RESIZER_MIN_WIDTH,
                        borderLeft: '100px solid rgba(255, 255, 255, 0.6)', borderImage: 'linear-gradient(to left,#ffffff,transparent) 10 100%'
                    }}>
                    <div className={`list-form w-full h-full overflow-x-hidden overflow-y-auto border border-0 border-l drop-shadow-lg bg-white`}>
                        <ListFormHeader
                            entity={entity}
                            deleteButtonLabel={deleteButtonLabel}
                            deleteConfirmationMessage={deleteConfirmationMessage}
                            currentRecord={currentRecord}
                            recordSaving={recordSaving}
                            onClickClose={onClickCloseForm}
                            onClickSaveRecord={onClickSaveRecord}
                            onClickDeleteRecord={onClickDeleteRecordFromForm}
                        />
                        {isObject(currentRecord) && <div className="list-form-body w-full flex flex-row px-8 pt-4 pb-20 overflow-hidden overflow-y-auto"
                            style={{ borderTop: 'solid 1rem #ffffff', marginTop: 95, height: height - formHeightAdjust }}>
                            <Form
                                wrapperClassName="pb-20"
                                data={currentRecord}
                                onChange={onChangeCurrentRecord}
                                recordForMembership={recordForMembership} />
                        </div>}
                    </div>
                </ListFormResizer>
            </div>
            }

            <ReactResizeDetector onResize={throttle(onResizeFormDetector, 300)} />

        </div>
    </>
};

export default ListBase