import './css';
import {colorByName} from '../../../../shared/util/colors';
import { Button } from 'antd';

const ButtonCSS = () => <style global jsx>{`

    .ant-btn-success
    {
        background-color: ${colorByName('lightGreen', 700)} !important;
        border-color: ${colorByName('lightGreen', 800)}  !important;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .ant-btn-success:hover
    {
        background-color: ${colorByName('lightGreen', 600)} !important;
    }

    .ant-btn-success span
    {
        color: #ffffff
    }

    .ant-btn-info
    {
        background-color: ${colorByName('lightBlue', 700)} !important;
        border-color: ${colorByName('lightBlue', 800)}  !important;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .ant-btn-info:hover
    {
        background-color: ${colorByName('lightBlue', 600)} !important;
    }

    .ant-btn-info span
    {
        color: #ffffff
    }

`}
</style>

ButtonCSS.displayName = 'ButtonCSS';


const AntButton = (props) => {
    console.log('Load Ant Button');
    return (
        <>
            <ButtonCSS />
            <Button {...props}/>
        </>
    )
}

AntButton.displayName = 'AntButton';
export default AntButton;