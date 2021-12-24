import React from 'react';
import ContentLoader from 'react-content-loader';

const PageHeaderLoaderCSS = () => <style global={true} jsx={true}>{`

.header-loader-wrapper
{
    display: flex;
    flex-direction: column;
    border-bottom: solid 1px #eeeeee;
    background-color: #ffffff;
    position: fixed;
    width: 100%;
    min-width: 360px;
    z-index: 100;
    height: 61px;
    overflow: hidden;
}
`}
</style>


const PageHeaderLoader = (props) => {
    const {id} = props;
    return <>
        <PageHeaderLoaderCSS/>
        <div className="header-loader-wrapper">
            <div className="header-loader">
                <div className="logo">
                    <ContentLoader
                        uniqueKey={id}
                        speed={2}
                        width={300}
                        height={60}
                        viewBox="0 0 300 60"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <rect x="10" y="12" rx="3" ry="3" width="300" height="5" />
                        <rect x="10" y="24" rx="3" ry="3" width="200" height="5" />
                        <rect x="10" y="36" rx="3" ry="3" width="100" height="5" />
                    </ContentLoader>
                </div>
            </div>
        </div>
    </>
};

PageHeaderLoader.displayName = 'PageHeaderLoader';
export default PageHeaderLoader;