//  COPYRIGHT:       DouHub Inc. (C) 2021 All Right Reserved
//  COMPANY URL:     https://www.douhub.com/
//  CONTACT:         developer@douhub.com
// 
//  This source is subject to the DouHub License Agreements. 
// 
//  Our EULAs define the terms of use and license for each DouHub product. 
//  Whenever you install a DouHub product or research DouHub source code file, you will be prompted to review and accept the terms of our EULA. 
//  If you decline the terms of the EULA, the installation should be aborted and you should remove any and all copies of our products and source code from your computer. 
//  If you accept the terms of our EULA, you must abide by all its terms as long as our technologies are being employed within your organization and within your applications.
// 
//  THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY
//  OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT
//  LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
//  FITNESS FOR A PARTICULAR PURPOSE.
// 
//  ALL OTHER RIGHTS RESERVED

import React, { useState, useEffect } from 'react';
import _ from '../../../shared/util/base';
import Button from '../controls//antd/button';
import Input  from '../controls//antd/input';
import SVG from '../controls/svg';
import TreeCSS from './tree-css';
import Label from './label';

const styles = {
    wrapper: {
        marginLeft: 0, marginRight: 0, marginBottom: 8, height: 22,
        cursor: 'pointer', display: 'flex', flexDirection: 'row'
    },
    text: { fontSize: 14, fontWeight: '400', flex: 1, textAlign: 'left', alignSelf: 'center' },
    inputWrapper: { flex: 1, borderWidth: 0, borderBottomWidth: 1, borderBottomStyle: 'solid', height: 22, paddingBottom: 2 },
    input: { width: '100%', fontSize: 13, fontWeight: '400', textAlign: 'left', borderWidth: 0, paddingLeft: 3, paddingRight: 3 },
    icon: { fontSize: 16, lineHeight: 1 },
    folderIcon: { fontSize: 8, lineHeight: 1, alignSelf: 'center' },
    iconWrapper: { width: 16, height: 20, marginRight: 10 },
    toDeleteWrapper: { width: '100%', display: 'flex', flexDirection: 'row', paddingLeft: 26 },
    toDeleteText: { color: 'red', marginRight: 10 },
}

const DISPLAY_NAME = 'FieldTree';

const FieldTree = (props) => {

    const { label, disabled,  labelStyle, alwaysShowLabel, hideLabel } = props;

    const defaultValue = _.isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(_.isNonEmptyString(props.value) ? props.value : defaultValue);
  
    useEffect(() => {
        const newValue = _.isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue);
    }

    return <>
        <TreeCSS />
        <Label text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || _.isNonEmptyString(value) || !_.isNonEmptyString(placeholder)))}
        />
        <div className="field-tree">
            <TreeNodes {...props} items={items} level={0}/>
        </div>
    </>
}

const TreeNodes = (props) => {

    const {items} = props;

    return _.map(items, (item) => {
        return <TreeNode  {...props} item={item} key={item.id} />
    });
}


const TreeNode = (props) => {

    const { item, level, itemWrapperStyle, itemTextStyle, folderIconStyle, iconStyle,
        itemIconWrapperStyle, editMode, borderColor } = props;

    const [selected, setSelected] = useState(_.find(_.isArray(props.selected) && props.selected.length > 0 ? props.selected : [], (v) => _.sameGuid(v.id, item.id)) ? true : false);
    const [status, setStatus] = useState(_.isArray(item.items) && item.items.length > 0 ? (item.isOpened == true ? 'opened' : 'closed') : 'none');
    const [editing, setEditing] = useState(props.editing && props.editing.id == item.id);
    const [toDelete, setToDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setEditing(props.editing && props.editing.id == item.id);
    }, [props.editing])

    useEffect(() => {
        setStatus(_.isArray(item.items) && item.items.length > 0 ? (item.isOpened == true ? 'opened' : 'closed') : 'none');
    }, [item.isOpened])

    const onClickCheckbox = () => {
        const newSelected = !selected;
        setSelected(newSelected);
        if (_.isFunction(props.onClickCheckbox)) props.onClickCheckbox(item, newSelected);
    }

    const onClickFolder = () => {
        const newStatus = status == 'opened' ? 'closed' : 'opened';
        setStatus(newStatus);
        if (_.isFunction(props.onClickFolder)) props.onClickFolder(item, newStatus == 'opened');
    }

    const onClickEdit = () => {
        const newEditing = !editing;
        setEditing(newEditing);
        if (_.isFunction(props.onClickEdit)) props.onClickEdit(item);
    }

    const onClickText = () => {
        if (editMode) {
            onClickEdit();
        }
        else {
            onClickCheckbox();
        }

        if (_.isFunction(props.onClickText)) props.onClickText(item);
    }

    const onClickMoveUp = () => {
        if (_.isFunction(props.onClickMoveUp)) props.onClickMoveUp(item);
    }

    const onClickMoveDown = () => {
        if (_.isFunction(props.onClickMoveDown)) props.onClickMoveDown(item);
    }

    const onClickInsert = () => {
        if (_.isFunction(props.onClickInsert)) props.onClickInsert(item);
    }

    const onClickAddChild = () => {
        if (_.isFunction(props.onClickAddChild)) props.onClickAddChild(item);
    }

    const onClickDelete = () => {
        setToDelete(true);
    }

    const renderFolderIcon = () => {
        if (toDelete) return null;
        switch (status) {
            case 'opened':
                {
                    return <SVG src="/icons/treenode-opened"
                        iconStyle={_.style(styles.folderIcon, folderIconStyle)}
                        wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)}
                        onClick={onClickFolder}
                    />
                }
            case 'closed':
                {
                    return <SVG src="/icons/treenode-closed"
                        iconStyle={_.style(styles.folderIcon, folderIconStyle)}
                        wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)}
                        onClick={onClickFolder} />
                }
            default:
                {
                    return <div style={_.style(styles.iconWrapper, itemIconWrapperStyle)} />
                }
        }
    }

    const onChangeText = (text) => {
        item.text = text;
        if (_.isFunction(props.onChangeText)) props.onChangeText(item);
    }

    const onClickYesDelete = () => {
        if (_.isFunction(props.onClickYesDelete)) props.onClickYesDelete(item);
    }

    const onClickNoDelete = () => {
        setToDelete(false);
        if (_.isFunction(props.onClickNoDelete)) props.onClickNoDelete(item);
    }

    const renderToDelete = () => {
        if (!toDelete) return null;
        return <div style={styles.toDeleteWrapper}>
            <div style={styles.toDeleteText}>Delete {item.text}?</div>
            <Button text="Yes" wrapperStyle={{ backgroundColor: 'red', marginRight: 5 }} textStyle={{ fontSize: 12 }} onClick={onClickYesDelete} />
            <Button text="No" wrapperStyle={{ backgroundColor: '#cccccc' }} textStyle={{ fontSize: 12, color: '#333333' }} onClick={onClickNoDelete} />
        </div>

    }

    const itemProps = {
        level, itemWrapperStyle, itemTextStyle, folderIconStyle, iconStyle,
        editing: props.editing,
        selected,
        itemIconWrapperStyle,
        onClickCheckbox: props.onClickCheckbox,
        onClickFolder: props.onClickFolder,
        editMode, borderColor,
        onClickText: props.onClickText,
        onClickEdit: props.onClickEdit,
        onClickMoveUp: props.onClickMoveUp,
        onClickMoveDown: props.onClickMoveDown,
        onClickInsert: props.onClickInsert,
        onClickAddChild: props.onClickAddChild,
        onClickDelete: props.onClickDelete,
        onChangeText: props.onChangeText,
        onClickYesDelete: props.onClickYesDelete,
        onClickNoDelete: props.onClickNoDelete
    }

    return <>
        <div className="douhub-tree-item" style={_.style(styles.wrapper, item.style, { marginLeft: level * 28 }, itemWrapperStyle)} >

            {renderFolderIcon()}
            {renderToDelete()}

            {!editMode && !toDelete && !deleting && <SVG src={`/icons/checknode-${selected ? 'checked' : 'unchecked'}`}
                iconStyle={_.style(styles.icon, iconStyle)}
                wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)} onClick={onClickCheckbox} />}

            {editMode && !toDelete && !deleting && <SVG src="/icons/checknode-edit"
                iconStyle={_.style(styles.icon,  iconStyle)}
                wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)} onClick={onClickEdit} />}

            {editing && !toDelete && !deleting && <SVG src="/icons/checknode-up" onClick={onClickMoveUp}
                iconStyle={_.style(styles.icon, iconStyle)}
                wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)} />}

            {editing && !toDelete && !deleting && <SVG src="/icons/checknode-down" onClick={onClickMoveDown}
                iconStyle={_.style(styles.icon, iconStyle)}
                wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)} />}

            {editing && !toDelete && !deleting && <SVG src="/icons/checknode-insert" onClick={onClickInsert}
                iconStyle={_.style(styles.icon, iconStyle)}
                wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)} />}

            {editing && !toDelete && !deleting && <SVG src="/icons/checknode-add-sub" onClick={onClickAddChild}
                iconStyle={_.style(styles.icon, iconStyle)}
                wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)} />}

            {editing && !toDelete && !deleting && <SVG src="/icons/checknode-delete" onClick={onClickDelete}
                iconStyle={_.style(styles.icon, { color: 'red' }, iconStyle)}
                wrapperStyle={_.style(styles.iconWrapper, itemIconWrapperStyle)} />}

            {!editing && !toDelete && !deleting && <div style={_.style(styles.text, itemTextStyle)} onClick={onClickText}>{_.isNonEmptyString(item.text) ? item.text : 'Undefined'}</div>}

            {editing && !toDelete && !deleting &&
                <div style={styles.inputWrapper}>
                    <Input style={_.style(styles.input, { borderColor })}
                        onChangeText={onChangeText}
                        value={item.text}
                        editable={true}
                        placeholder={"Type category here"}
                        onChange={onChangeText} />
                </div>}
        </div>
        {status == 'opened' && <TreeNodes {...itemProps} level={level + 1} items={item.items} />}
    </>
}

FieldTree.displayName = DISPLAY_NAME;
export default FieldTree;


