import { useEffect, useState } from 'react';
import _ from '../../../../shared/util/base';
import { solution } from '../../../../shared/metadata/solution';
import { MessageContent, PAGE_SIZE, loadData, LoadMore, Loading } from '../list-helper';
import BaseCSS from './base-css';
import ReactResizeDetector from 'react-resize-detector';
import Table from '../../controls/antd/table';
import Affix from '../../controls/antd/affix';
import SVG from '../../controls/svg';
// import Dropdown from '../../controls/antd/dropdown';
import Menu from '../../controls/antd/menu';
import Drawer from '../../controls/antd/drawer';
import Modal from '../../controls/antd/modal';
import FormHeader from '../../forms/header';
import Button from '../../controls/antd/button';
import dynamic from 'next/dynamic';
import { logDynamic } from '../../controls/base';
import { callAPI } from '../../../util/web';
//import CreateForm from '../../../metadata/forms/web-feed-product';

const apiEndpoint = `${solution.apis.data}query`;
const autoLoadMore = true;
let EditForm = null;
let CreateForm = null;
const DISPLAY_NAME = 'List.Default';

const processColumns = (columns) => {
    return _.map(columns, (column) => {
        if (column.renderDangerouslySetInnerHtml) {
            column.render = (text, record, index) => {
                const html = column.renderDangerouslySetInnerHtml(text, record, index);
                return <div dangerouslySetInnerHTML={{ __html: html }} />
            }
        }
        return column;
    })
}

export const MainArea = (props) => {

    const { env, user, server, title, metadata } = props;

    const [keywords, setKeywords] = useState(props.keywords);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showEditDrawer, setShowEditDrawer] = useState(null);
    const [showIframeDrawer, setShowIframeDrawer] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [result, setResult] = useState({});
    const [error, setError] = useState(props.error);
    const { data } = result;
    const [width, setWidth] = useState(null);
    const [columns, setColumns] = useState(null);

    const editDrawerWidthRatio = _.isNumber(metadata.editDrawerWidthRatio) && metadata.editDrawerWidthRatio < 1 ? editDrawerWidthRatio : 1 / 2.0;
    const iframeDrawerWidthRatio = _.isNumber(metadata.iframeDrawerWidthRatio) && metadata.iframeDrawerWidthRatio < 1 ? editDrawerWidthRatio : 3 / 4.0;

    const editDrawerMaxWidth = _.isNumber(metadata.editDrawerMaxWidth) ? metadata.editDrawerMaxWidth : 600;
    const editDrawerWidth = Math.max(_.isNumber(metadata.editDrawerMinWidth) ? metadata.editDrawerMinWidth : 0, Math.min(env && _.isNumber(env.width) && env.width * editDrawerWidthRatio > 360 ? env.width * editDrawerWidthRatio : 360, editDrawerMaxWidth));

    const iframeDrawerMaxWidth = _.isNumber(metadata.iframeDrawerMaxWidth) ? metadata.iframeDrawerMaxWidth : 980;
    const iframeDrawerWidth = Math.max(_.isNumber(metadata.iframeDrawerMinWidth) ? metadata.iframeDrawerMinWidth : 0, Math.min(env && _.isNumber(env.width) && env.width * iframeDrawerWidthRatio > 360 ? env.width * iframeDrawerWidthRatio : 360, iframeDrawerMaxWidth));
    const headerHeight = env ? env.headerHeight : 81;
    const footerHeight = env ? env.footerHeight : 53;
    const offsetHeader = 105;
    const height = env ? env.height - headerHeight - footerHeight : 600;
    const tableHeight = height - offsetHeader - 20;

    const allowCreate = !loading && !error && _.isNonEmptyString(metadata.entityName);
    const metadataColumns = metadata.columns && _.isArray(metadata.columns(props)) ? processColumns(metadata.columns(props)) : [];

    const newRecordButtonCaption = `New ${metadata.displayName}`;

    useEffect(() => {
        if (window.addEventListener) {
            window.addEventListener("message", messageHandler);
        } else {
            window.attachEvent("onmessage", messageHandler);
        }

        return () => {
            if (window.removeEventListener) {
                window.removeEventListener("message", messageHandler);
            } else {
                window.detachEvent("onmessage", messageHandler);
            }
        }
    }, [result]);


    const messageHandler = (e) => {

        const data = e && e.data;
        const action = data && data.action;
        if (!_.isNonEmptyString(action)) return;

        switch (action) {
            case 'record-deleted':
                {
                    const newResult = { count: result.count - 1 };
                    newResult.data = _.without(_.map(result.data, (record) => {
                        return data.record && record.id == data.record.id ? null : record;
                    }), null);
                    setResult(newResult);
                    setShowIframeDrawer(null);
                    break;
                }
            case 'record-saved':
                {
                    const newResult = { count: result.count };
                    newResult.data = _.map(result.data, (record) => {
                        return data.record && record.id == data.record.id ? data.record : record;
                    });
                    setResult(newResult);
                    break;
                }
        }


    }

    const onClickSlug = (slug) => {
        window.open(metadata.slugUrl.replace('[PH.SLUG]', slug));
    }

    useEffect(() => {
        setColumns(_.union(metadataColumns,
            metadata.slugUrl ? [
                {
                    title: '',
                    key: 'slug',
                    width: 50,
                    fixed: 'right',
                    render: (record) => {
                        return <SVG onClick={() => { onClickSlug(record.slug) }} className="cell-icon list-slug-icon" src="/icons/external-link.svg" />
                    }
                }
            ] : [],
            [
                {
                    title: '',
                    key: 'menu',
                    width: 50,
                    fixed: 'right',
                    render: (record) => {
                        return <SVG onClick={() => { onClickEdit(record, "onClickEditRecord") }} className="cell-icon list-edit-icon" src="/icons/edit.svg" />
                    }
                }
                // {
                //     title: '',
                //     key: 'menu',
                //     width: 50,
                //     fixed: 'right',
                //     render: (text, record, index) => {
                //         return <Dropdown overlay={menu(record)} className="menu">
                //             <SVG className="cell-icon" src="/icons/menu-squared.svg" />
                //         </Dropdown>
                //     }
                // }
            ]));
        console.log('once');
    }, [])

    const onClickEdit = (curRecord, funcPropName) => {
        if (_.isNonEmptyString(funcPropName) && _.isFunction(metadata[funcPropName])) {
            const result = metadata[funcPropName](curRecord);
            switch (result && result.type) {
                case 'iframe-drawer':
                    {
                        result.record = curRecord;
                        setShowIframeDrawer(result);
                        break;
                    }
                case 'modal':
                    {
                        result.record = curRecord;
                        setShowModal(result);
                        break;
                    }
            }
        }
        else {
            setShowEditDrawer({ record: curRecord });
        }
    }

    const menu = (curRecord) => {
        return <Menu>
            <Menu.Item key="edit" onClick={() => onClickEdit(curRecord)}>Edit Web Page</Menu.Item>
        </Menu>
    }

    const onStart = (props) => {
        setLoading(true);
        setError(null);
    };

    const onFinish = (newResult) => {
        setLoading(false);
        if (newResult.error && newResult.error.type != 'list-no-data') {
            setError(newResult.error);
        }
        else {
            setResult(newResult);
        }
    }

    useEffect(() => {
        if (!server && !result.data && _.isNonEmptyString(metadata.entityName)) {
            const query = {
                "entityName": metadata.entityName,
                "orderBy": [{ "type": "desc", "attribute": "_ts" }]
            };
            if (_.isNonEmptyString(metadata.entityType)) query.entityType = metadata.entityType;
            loadData({
                apiEndpoint, result,
                query,
                onStart, onFinish
            });
        }
        else {
            setLoading(false);
        }
    }, [server])

    const onCloseEditDrawer = () => {
        setShowEditDrawer(null);
    }

    const onCloseIframeDrawer = () => {
        setShowIframeDrawer(null);
    }

    const onResize = (newWidth, newHeight) => {
        setWidth(newWidth);
    }

    const onChangeFormInEditDrawer = (changedRecord) => {
        const newShowEditDrawer = _.cloneDeep(showEditDrawer);
        newShowEditDrawer.record = changedRecord;
        setShowEditDrawer(newShowEditDrawer);
    }

    const onChangeFormInModal = (changedRecord) => {
        const newShowModal = _.cloneDeep(showModal);
        newShowModal.record = changedRecord;
        setShowModal(newShowModal);
    }

    const onClickNewRecord = () => {
        let newRecord = { entityName: metadata.entityName };
        if (_.isNonEmptyString(metadata.entityType)) newRecord.entityType = metadata.entityType;
        if (_.isObject(metadata.newRecord)) newRecord = _.assign(newRecord, metadata.newRecord);

        onClickEdit(newRecord, "onClickNewRecord");
    }

    const renderForm = (record, onChange) => {

        if (!_.isNonEmptyString(record.id)) {
            const createFormPropName = _.isNonEmptyString(metadata.createFormName) ? metadata.createFormName : metadata.editFormName;

            if (!CreateForm) {
                if (_.isNonEmptyString(createFormPropName)) {
                    CreateForm = logDynamic(dynamic(() => import(`../../../metadata/forms/${createFormPropName}`), { ssr: false }), `../../../metadata/forms/${createFormPropName}`, DISPLAY_NAME);
                }
                else {
                    CreateForm = logDynamic(dynamic(() => import(`../../../metadata/forms/default`), { ssr: false }), `../../../metadata/forms/default`, DISPLAY_NAME);
                }
            }

            return <CreateForm
                onChange={onChange}
                user={user}
                data={record}
            />
        }
        else {
            if (!EditForm) {
                EditForm = logDynamic(dynamic(() => import(`../../../metadata/forms/${metadata.editFormName ? metadata.editFormName : '../../forms/default'}`), { ssr: false }), metadata.editFormName ? `../../../metadata/forms/${metadata.editFormName}` : '../../forms/default', DISPLAY_NAME);
            }

            return <EditForm
                onChange={onChange}
                user={user}
                data={record}
            />
        }

    }

    const onDeleteRecord = (deletedRecord) => {
        const newResult = { count: result.count - 1 };
        newResult.data = _.without(_.map(result.data, (record) => {
            return record.id == deletedRecord.id ? null : record;
        }), null);
        setResult(newResult);
    }

    const onCreateRecord = (newRecord) => {
        //call api to create record
        (async () => {
            const newShowModal = _.cloneDeep(showModal);
            newShowModal.record = newRecord;
            newShowModal.doing = true;
            setShowModal(newShowModal);
            try {
                const result = await callAPI(`${solution.apis.data}create`, { data: newRecord }, 'POST');
                onSaveRecord(result, true);
                setShowModal(null);
            }
            catch (ex) {
                if (ex.name && ex.name.indexOf('DUPLICATION')>0)
                {
                    alert('Failed to creat the record. Duplication check failed.');
                }
                else
                {
                    alert('Failed to creat the record.');
                }
                delete newShowModal.doing;
                setShowModal(newShowModal);
            }
        })();
        
    }

    const onSaveRecord = (newRecord, isCreate) => {
        //setShowEditDrawer({ record: newRecord });
        let found = false;
        const newResult = { count: result.count };
        newResult.data = _.map(result.data, (record) => {
            if (record.id == newRecord.id) {
                found = true;
                newResult.count++;
                return newRecord;
            }
            else {
                return record;
            }
        });
        if (!found) newResult.data.unshift(newRecord);
        setResult(newResult);

        if (isCreate) onClickEdit(newRecord, "onClickEditRecord");
    }

    const renderIframeDrawer = () => {
        if (_.isNil(showIframeDrawer)) return null;
        return <Drawer
            className="page-list-iframe-drawer"
            width={iframeDrawerWidth}
            placement="right"
            closable={true}
            onClose={onCloseIframeDrawer}
            visible={true}
        >
            <iframe src={showIframeDrawer.url} />
        </Drawer>
    }

    const renderModal = () => {
        if (_.isNil(showModal)) return null;

        return <Modal
            title={_.isNonEmptyString(showModal.title) ? showModal.title : newRecordButtonCaption}
            visible={true}
            okText={showModal.doing?'Creating ...':'Create'}
            onOk={() => {
                if (showModal.doing) return;
                onCreateRecord(showModal.record);
                setShowModal(null);
            }}
            onCancel={() => {
                if (showModal.doing) return;
                setShowModal(null)
            }}>
            {renderForm(showModal.record, onChangeFormInModal)}
        </Modal>
    }

    return <>
        <div className="page-list" style={{ height }}>
            <BaseCSS />
            <Affix className="page-list-header" offsetTop={headerHeight}>
                <h1>{title}</h1>
                {allowCreate && <Button type="success" onClick={onClickNewRecord}>{newRecordButtonCaption}</Button>}
            </Affix>
            {_.isArray(columns) && <div className="table">
                {!loading && !error && <Table
                    rowKey="id"
                    scroll={{ y: tableHeight }}
                    style={{ width }}
                    sticky={{ offsetHeader }}
                    // scroll={{ y: env.height - env.footerHeight - headerHeight - 150}}
                    pagination={false}
                    dataSource={data}
                    columns={columns} />}
                {!autoLoadMore && !loading && <LoadMore onClick={onLoadMore} />}
                {loading && !error && <Loading />}
                <MessageContent {...error} keywords={keywords} pageNumber={pageNumber} />
            </div>}
            {!_.isNil(showEditDrawer) && <Drawer
                className="page-list-editor-drawer"
                width={editDrawerWidth}
                placement="right"
                closable={true}
                onClose={onCloseEditDrawer}
                visible={true}
                title={<FormHeader metadata={metadata}
                    data={showEditDrawer.record}
                    onClose={onCloseEditDrawer}
                    onDelete={onDeleteRecord}
                    onSave={onSaveRecord} />}
            >
                {renderForm(showEditDrawer.record, onChangeFormInEditDrawer)}
            </Drawer>}
            {renderIframeDrawer()}
            {renderModal()}
        </div>
        <ReactResizeDetector onResize={onResize} />
    </>
}

export const SideArea = (props) => {
    return <div className="side"></div>
}

export default { SideArea, MainArea }