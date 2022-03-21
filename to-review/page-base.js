
import { useState, useRef } from 'react';
import _ from '../../shared/util/base';
import PageHead from './page-head';
import { solution } from '../../shared/metadata/solution';
import { recordOwnedByUser, recordOwnedByOrganization } from '../../shared/util/auth';
import PageHeaderLoader from './page-header-loader';
import PageBaseCSS from './page-base-css';
import PageHeader from './page-header';
import PageFooter from './page-footer';
import PageEnv from './page-env';

const PageBase = (props) => {

    const { header, footer, entity, tablet, host, url,
        renderFunctionArea, MainArea, SideArea, mobile,
        hideSideArea, mainStyle, pageStyle, bodyStyle,
        userAgent, slug, query, getPageMetadata,
        hideHeader, hideFooter } = props;
 
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(props.editMode);
    const [relocateSection, setRelocateSection] = useState(false);
    const [oriData, setOriData] = useState(_.cloneDeep(props.data));
    const [data, setData] = useState(_.cloneDeep(props.data));
    const [env, setEnv] = useState({});
    const server = !_.isNonEmptyString(env.size);

    const metadata = _.isFunction(getPageMetadata) ? getPageMetadata(data) : props.metadata;

    const dataChanged = JSON.stringify(oriData) != JSON.stringify(data);

    const baseProps = {
        mobile, server, entity, tablet,
        userAgent, user, slug, host,
        data, editMode, dataChanged, relocateSection,
        query, env, url
    };

    const headProps = _.assign({}, baseProps, metadata);
    const headerProps = _.assign({}, baseProps, { hide: hideHeader }, header);
    const footerProps = _.assign({}, baseProps, { hide: hideFooter }, footer);
    const newProps = { ...props, ...baseProps, ...metadata };

    const pageRef = useRef(null);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const [sideAreaData, setSideAreaData] = useState(null);

    const showFunctionArea = editMode && _.isFunction(renderFunctionArea) || _.isFunction(renderFunctionArea) && !_.isEmpty(data) && recordOwnedByOrganization(user, data) || recordOwnedByUser(user, data);

    const minHeight = env.size && (env.height - env.headerHeight - 1 + env.footerHeight);
    const showSideArea = env.size == 'xl' && SideArea && !hideSideArea;

    const onSendToSideArea = (newSideAreaData) => {
        setSideAreaData(newSideAreaData);
    }

    const onClickEdit = () => {
        setEditMode(true);
    }

    const onClickPreview = () => {
        setEditMode(false);
    }

    const onChange = (newData, init) => {
        if (init) setOriData(newData);
        setData(newData);
    }

    const onConfirmRollback = () => {
        setData(_.cloneDeep(oriData));
    }

    const onClickRelocateSection = () => {
        setRelocateSection(!relocateSection);
    }

    const onSave = (newData) => {
        setOriData(newData);
        setData(newData);
    }

    const onEnvUpdated = (newEnv) => {
        setEnv(newEnv);
    }

    const onUserUpdated = (newUser) => {
        setUser(newUser);
    }

    return <>
        <PageBaseCSS />
        <div id="body"
            className={`body body-${mobile ? 'mobile' : 'desktop'}`}
            style={_.style(solution.styles.body, bodyStyle)} >
            <PageHead {...headProps} />
            <div ref={pageRef} className={`page-wrapper ${headerProps.hide ? 'header-hide' : ''}  ${footerProps.hide ? 'footer-hide' : ''}`} id="page_wrapper" style={env ? { minHeight } : {}}>
                <div className={`page function-${showFunctionArea} side-area-${showSideArea} page-loading-${_.isNil(env.size) ? true : false}`}
                    style={_.style(env ? { minHeight, paddingBottom: env.footerHeight } : {}, pageStyle)}>
                    {showFunctionArea && <div className="function" style={env ? { minHeight } : {}}>
                        {renderFunctionArea({
                            ...newProps,
                            editMode,
                            dataChanged,
                            onClickEdit,
                            onClickPreview,
                            onConfirmRollback,
                            onClickRelocateSection,
                            onSave
                        })}
                    </div>}
                    <div className="main" style={mainStyle}>
                        {MainArea && <MainArea {...newProps} onSendToSideArea={onSendToSideArea} onChange={onChange} />}
                    </div>
                    {showSideArea && <div className="side" style={env ? { minHeight } : {}}>
                        <SideArea {...newProps} sideAreaData={sideAreaData} />
                    </div>}
                </div>
            </div>
            {_.isNil(env.size) && !hideHeader ?
                <PageHeaderLoader id="header-loader" /> :
                <PageHeader ref={headerRef} {...headerProps} />
            }
            <PageFooter ref={footerRef} {...footerProps} />
            <PageEnv {...baseProps}
                onEnvUpdated={onEnvUpdated} onUserUpdated={onUserUpdated}
                headerRef={headerRef}
                footerRef={footerRef} />
        </div>
    </>
}

PageBase.displayName = 'PageBase';
export default PageBase;