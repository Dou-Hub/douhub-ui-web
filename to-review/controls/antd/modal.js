import './css';
import { Modal } from 'antd';
console.log('Load Ant Modal');

const AntModalCSS = () => <style global jsx>{`
    .ant-modal 
    {
        box-shadow: 0px 0px 15px rgb(0 0 0 / 40%) !important;
        padding-bottom: 0 !important;
        border-radius: 10px !important;
        overflow: hidden;
    }

    .ant-modal-header .ant-modal-title
    {
        font-size: 1.2rem;
    }

    .ant-modal.doing .ant-modal-footer,
    .ant-modal.doing .ant-modal-close-x
    {
        display: none !important;
    }
`}</style>
AntModalCSS.displayName = 'AntModalCSS';


const AntModal = (props) => {
    return (
        <>
            <AntModalCSS />
            <Modal {...props} />
        </>
    )
}

AntModal.displayName = 'AntModal';
export default AntModal;