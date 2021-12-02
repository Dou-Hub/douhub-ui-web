import _ from '../../../shared/util/base';
import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { colorByName } from '../../../shared/util/colors';
import LoadingCircle from '../controls/loading-circle';
import Popconfirm from '../controls/antd/popconfirm';
import Modal from '../controls/antd/modal';
import Tooltip from '../controls/antd/tooltip';
import { callAPI } from '../../util/web';
import { solution } from '../../../shared/metadata/solution';

const HomeFunctionArea = (props) => {

    const { dataChanged, path, slug, data, hideHeader, hideFooter } = props;

    const isEditPage = path.length > 1 && path[1].toLowerCase() == 'edit';
    const [editMode, setEditMode] = useState(isEditPage || props.editMode);
    const [doing, setDoing] = useState(false);
    const [relocateSection, setRelocateSection] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const onClickEdit = () => {
        if (!isEditPage) {
            window.location = `/edit/${_.isNonEmptyString(slug) ? slug : 'home'}?header=${hideHeader ? 'false' : 'true'}&footer=${hideFooter ? 'false' : 'true'}`;
        }
        else {
            setEditMode(true);
            if (_.isFunction(props.onClickEdit)) props.onClickEdit();
        }
    }

    const onClickOpenPage = () => {
        const url = `/page/${_.isNonEmptyString(slug) ? slug : 'home'}?header=${hideHeader ? 'false' : 'true'}&footer=${hideFooter ? 'false' : 'true'}`;
        window.open(url);
    }


    const onClickPreview = () => {
        setEditMode(false);
        if (_.isFunction(props.onClickPreview)) props.onClickPreview();
    }

    const onCancelDelete = () => {
        if (_.isFunction(props.onCancelDelete)) props.onCancelDelete();
    }

    const onConfirmRollback = () => {
        if (_.isFunction(props.onConfirmRollback)) props.onConfirmRollback();
    }

    const onCancelRollback = () => {
        if (_.isFunction(props.onCancelRollback)) props.onCancelRollback();
    }


    const onConfirmDelete = () => {
        (async () => {
            try {
                setDoing(true);
                await callAPI(`${solution.apis.data}/delete`, { id: data.id });
                if (window.location !== window.parent.location) {
                    window.parent.postMessage({
                        action: 'record-deleted',
                        record: data
                    }, "*");
                }
                else {
                    setDeleted(true);
                }
            }
            catch (error) {
                alert("Delete Failed!");
                console.error(error);
            }
            finally {
                setDoing(false);
            }
        })();

    }

    const onClickSave = () => {
        (async () => {
            try {
                setDoing(true);
                const data = _.cloneDeep(props.data);
                data.definition = _.map(data.definition, (section => {
                    delete section.relocateItems;
                    switch (section.type) {
                        case 'columns':
                            {
                                section.data = _.map(section.data, (item) => {
                                    delete item.chosen;
                                    delete item.selected;
                                    return item;
                                });
                                break;
                            }
                    }
                    return section;
                }));
                const result = await callAPI(`${solution.apis.data}/update`, { data });
                if (_.isFunction(props.onSave)) props.onSave(result);
                //setEditMode(false);
                //if (_.isFunction(props.onClickPreview)) props.onClickPreview();
                if (window.location !== window.parent.location) {
                    window.parent.postMessage({
                        action: 'record-saved',
                        record: result
                    }, "*");
                }
            }
            catch (error) {
                alert("Update Failed!");
                console.error(error);
            }
            finally {
                setDoing(false);
            }
        })();
    }

    const onClickRelocateSection = () => {
        setRelocateSection(!relocateSection);
        if (_.isFunction(props.onClickRelocateSection)) props.onClickRelocateSection();
    }


    return _.isEmpty(data) ? [] : [
        doing && <LoadingCircle className="button button-doing" />,
        editMode && !doing && <Tooltip key="open" title="Open the page" color={colorByName('blue', 600)} placement="right">
            <ReactSVG src="/icons/linking.svg" className="button button-external-link" onClick={onClickOpenPage} />
        </Tooltip>,
        !editMode && <Tooltip key="edit" title="Edit the page" color={colorByName('blue', 600)} placement="right">
            <ReactSVG src="/icons/edit.svg" className="button button-edit" onClick={onClickEdit} />
        </Tooltip>,
        editMode && !doing && <Tooltip key="preview" title="Preview the page" color={colorByName('blue', 600)} placement="right">
            <ReactSVG src="/icons/preview.svg" className="button button-preview" onClick={onClickPreview} />
        </Tooltip>,
       
        !doing && dataChanged && <Tooltip key="save" title="Save the page" color={colorByName('green', 600)} placement="right">
            <ReactSVG src="/icons/save.svg" className="button button-save" onClick={onClickSave} />
        </Tooltip>,
        editMode && !doing && _.isArray(data.definition) && data.definition.length > 0 && <Tooltip key="relocate"
            title="Relocate Section"
            color={colorByName('blue', 600)} placement="right">
            <ReactSVG src="/icons/up-down.svg" className={`button button-relocate-${relocateSection}`}
                onClick={onClickRelocateSection} />
        </Tooltip>,
        dataChanged && !doing && <Popconfirm key="rollback" placement="right"
            title="Are you sure to rollback latest changes to this page?"
            onConfirm={onConfirmRollback}
            onCancel={onCancelRollback}
            okText="Yes"
            cancelText="No"
        >
            <Tooltip title="Rollback latest changes" color={colorByName('deepOrange', 600)} placement="right">
                <ReactSVG src="/icons/rollback.svg" className="button button-rollback" />
            </Tooltip>
        </Popconfirm>,
        editMode && !doing && <Popconfirm
            key="page-delete"
            placement="right"
            title="Are you sure to delete this page?"
            onConfirm={onConfirmDelete}
            onCancel={onCancelDelete}
            okType="danger"
            okText="Yes"
            cancelText="No"
        >
            <Tooltip title="Delete the page" color={colorByName('red', 600)} placement="right">
                <ReactSVG src="/icons/delete.svg" className="button button-delete" />
            </Tooltip>
        </Popconfirm>,
        <Modal
            key="page-list-modal"
            title=""
            centered
            visible={deleted}
            closable={false}
            cancelButtonProps={{ style: { display: 'none' } }}
            okText="View Page List"
            onOk={() => {
                window.location = '/list/page';
            }}>
            <div>The page has been deleted.</div>
        </Modal>
    ]
}

HomeFunctionArea.displayName = 'HomeFunctionArea';
export default HomeFunctionArea;