import React, { useEffect, useState } from 'react';
import { solution } from '../../shared/metadata/solution';
import NetworkConnection from '../components/controls/network-connection';
import { View } from '../components/controls/base';
import _ from '../../shared/util/base';
// import { connect, getPublicKeyFromSeed } from '../../bandup-blockchain/solana/network';

const PageFooterCSS = () => <style global={true} jsx={true}>{`
    .footer-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border-top: solid 1px rgba(0,0,0,0.05);
        background-color: #ffffff;
        padding: 10px 20px;
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 100;
    }

    .footer {
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .footer .content-1 {
        font-size: 0.8rem;
        color: rgba(0,0,0,0.8);
        margin: 0;
    }

    .footer .content-2 {
        font-size: 0.5rem;
        color: rgba(0,0,0,0.6);
        margin: 0;
    }

    .footer .copyright
    {
        display: flex;
        flex-direction: column;
    }
`}</style>
PageFooterCSS.displayName = 'PageFooterCSS';

const PageFooter = React.forwardRef((props, ref) => {
    const { hide, mobile, env, host, tablet } = props;
    const { size } = env;
    const blockchainNode = solution.site.blockchain.nodes['staging'];
    const [networkStatus, setNetworkStatus] = useState('doing');
    const [networkVersion, setNetworkVersion] = useState(null);
    const networkName = blockchainNode.name;

    // useEffect(() => {
    //     try {
    //         connect(blockchainNode.url, { version: true })
    //             .then(({ version }) => {
    //                 setNetworkStatus('on');
    //                 setNetworkVersion(version);
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //                 setNetworkStatus('off');
    //             });
            
    //        }
    //     catch (error) {
    //         console.error(error);
    //         setNetworkStatus('off');
    //     }
    // }, [])

    return (
        hide ? null : <>
            <PageFooterCSS />
            <footer ref={ref} className="footer-wrapper">
                <View className="footer">
                    <div className="copyright">
                        <p className="content-1">2021 © PrimeObjects Software Inc.</p>
                        <p className="content-2">
                            VER: {solution.version},
                            STAGE: {solution.stage.toLowerCase() + ', '}
                            SIZE: {size && size.toLowerCase() + ', '}
                            {mobile && 'SCREEN: mobile, '}
                            {tablet && 'SCREEN: tablet, '}
                            {!tablet && !mobile && 'SCREEN: desktop, '}
                            HOST: {host ? host.toLowerCase() : 'unknown'}
                        </p>
                    </div>
                    <div>
                        {/* <NetworkConnection name={networkName} status={networkStatus} version={networkVersion} /> */}
                    </div>
                </View>
            </footer>
        </>
    )
})


PageFooter.displayName = 'PageFooter';
export default PageFooter;