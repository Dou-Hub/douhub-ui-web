import _ from '../../../shared/util/base';
import SVG from '../controls/svg';
import ToolbarSectionCSS from './toolbar-css';
import Input from '../controls/antd/input';
import Popconfirm from '../controls/antd/popconfirm';
import Menu from '../controls/antd/menu';
import Dropdown from '../controls/antd/dropdown';
import Button from '../controls/antd/button';
import Tooltip from '../controls/antd/tooltip';
import { colorByName } from '../../../shared/util/colors';
import cheerio from 'cheerio';

const ToolbarSection = (props) => {

    const { section, relocateSection, emptyPage, index } = props;

    const relocateItems = section.relocateItems;

    const onConfirmDelete = () => {
        if (_.isFunction(props.onConfirmDelete)) props.onConfirmDelete(section);
    }

    const onClickNewSection = ( key, pos) => {
        if (_.isFunction(props.onClickNewSection)) props.onClickNewSection(key, pos);
    }

    const onClickNewSectionAbove = ({ key }) => {
        onClickNewSection(key, 'above');
    }

    const onClickNewSectionBelow = ({ key }) => {
        onClickNewSection(key, 'below');
    }

    const newSectionMenuAbove = (
        <Menu onClick={onClickNewSectionAbove}>
            <Menu.Item key="comprehensive">New Comprehensive Section</Menu.Item>
            <Menu.Item key="paragraph">New Paragraph Section</Menu.Item>
            <Menu.Item key="banner">New Banner Section</Menu.Item>
            <Menu.Item key="columns">New Items Section</Menu.Item>
            <Menu.Item key="tags">New Tags Section</Menu.Item>
        </Menu>
    );

    const newSectionMenuBelow = (
        <Menu onClick={onClickNewSectionBelow}>
            <Menu.Item key="comprehensive">New Comprehensive Section</Menu.Item>
            <Menu.Item key="paragraph">New Paragraph Section</Menu.Item>
            <Menu.Item key="banner">New Banner Section</Menu.Item>
            <Menu.Item key="columns">New Items Section</Menu.Item>
            <Menu.Item key="tags">New Tags Section</Menu.Item>
        </Menu>
    );

    const onChangeName = (e) => {
        if (_.isFunction(props.onChangeSectionName)) props.onChangeSectionName(e.target.value);
    }

    const onClickRelocateItem = () => {
        if (_.isFunction(props.onChangeSectionRelocateItemsMode)) props.onChangeSectionRelocateItemsMode(!relocateItems);
    }

    const getSectionDisplay = () => {
        let name = section.name;
        if (!_.isNonEmptyString(name) && _.isArray(section.h1) && section.h1.length > 0) name = section.h1[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.h2) && section.h2.length > 0) name = section.h2[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.h3) && section.h3.length > 0) name = section.h3[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.leftAreaH1) && section.leftAreaH1.length > 0) name = section.leftAreaH1[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.leftAreaH2) && section.leftAreaH2.length > 0) name = section.leftAreaH2[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.leftAreaH3) && section.leftAreaH3.length > 0) name = section.leftAreaH3[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.rightAreaH1) && section.rightAreaH1.length > 0) name = section.rightAreaH1[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.rightAreaH2) && section.rightAreaH2.length > 0) name = section.rightAreaH2[0];
        if (!_.isNonEmptyString(name) && _.isArray(section.rightAreaH3) && section.rightAreaH3.length > 0) name = section.rightAreaH3[0];

        if (!_.isNonEmptyString(name) && _.isObject(section.data) && _.isNonEmptyString(section.data.content)) {
            name = cheerio.load(section.data.content.replace(/>/g, '> ').replace(/[ ]{2,}/gi, ' ')).text().trim();
            name = name.substring(0, Math.min(32, name.length)) + ' ...';
        }

        if (!_.isNonEmptyString(name) && _.isObject(section.data) && _.isNonEmptyString(section.data.leftContent)) {
            name = cheerio.load(section.data.leftContent.replace(/>/g, '> ').replace(/[ ]{2,}/gi, ' ')).text().trim();
            name = name.substring(0, Math.min(32, name.length)) + ' ...';
        }

        if (!_.isNonEmptyString(name) && _.isObject(section.data) && _.isNonEmptyString(section.data.rightContent)) {
            name = cheerio.load(section.data.rightContent.replace(/>/g, '> ').replace(/[ ]{2,}/gi, ' ')).text().trim();
            name = name.substring(0, Math.min(32, name.length)) + ' ...';
        }

        if (!_.isNonEmptyString(name)) name = section.id;
        return name;
    }

    // console.log({ editMode, ectionEditMode: section.relocateItems })

    return <>
        <ToolbarSectionCSS />
        <div className={`section-toolbar section-toolbar-relocate-${relocateSection}`}>

            <Button className="button button-relocate-section">
                <SVG src="/icons/up-down.svg" className="button-icon" />
            </Button>

            {_.isInteger(index) && <Button className="button ant-btn-primary button-number">
                <span>{index}</span>
            </Button>}

            {!emptyPage && section.id && <Dropdown overlay={newSectionMenuAbove} className="button button-new-section">
                <Button className="button">
                    <SVG src="/icons/insert-row-above.svg" className="button-icon" />
                </Button>
            </Dropdown>}

            {!emptyPage && section.id && <Dropdown overlay={newSectionMenuBelow} className="button button-new-section">
                <Button className="button">
                    <SVG src="/icons/insert-row-below.svg" className="button-icon" />
                </Button>
            </Dropdown>}

            {!emptyPage && !section.id && <Dropdown overlay={newSectionMenuBelow} className="button button-new-section">
                <Button className="ant-btn ant-btn-success" style={{flexDirection:'row'}}>
                    Add your first section
                </Button>
            </Dropdown>}

            {emptyPage && <Dropdown overlay={newSectionMenuBelow} className="button button-new-section">
                <Button className="button button-add-first-section button-on">
                    <SVG src="/icons/insert-row-below.svg" className="button-icon" />
                    <span style={{marginLeft: 10}}>Add First Section</span>
                </Button>
            </Dropdown>}


            {section.type == 'columns' && <Tooltip key="relocateItems" title="Relocate the items"
                placement="bottom"
                className="button-relocate-item">
                <Button className={`button button-relocate-items-${relocateItems}`}
                    onClick={onClickRelocateItem}>
                    <SVG src="/icons/right-left.svg" className="button-icon" />
                </Button>
            </Tooltip>}

            <div className="section-info">{getSectionDisplay()}</div>

            {section.id && <Input
                className="name"
                value={_.isNonEmptyString(section.name) ? section.name : ''}
                placeholder="Section Name (optional)"
                onChange={onChangeName}
            />}

            {section.id && <Popconfirm key="remove" placement="bottom"
                title="Are you sure to delete this section?"
                okType="danger"
                onConfirm={onConfirmDelete}
                okText="Yes"
                cancelText="No"
            >
                <Tooltip title="Delete the section" color={colorByName('red', 600)} placement="bottom" className="button-delete">
                    <Button className="button button-delete"><SVG src="/icons/delete.svg" className="button-icon" /></Button>
                </Tooltip>
            </Popconfirm>}
        </div>
    </>
}

export default ToolbarSection;