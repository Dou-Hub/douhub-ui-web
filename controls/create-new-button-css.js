import { colorByName } from '../../../shared/util/colors';

const CreateButtonCSS = () => <style global jsx>{`

.create-new-button
{
    background-color: ${colorByName('lightBlue', 700)} !important;
    border-color: ${colorByName('lightBlue', 800)}  !important;
    color: #ffffff;
    flex-direction: column;
    justify-content: center;

    text-align: center;
    padding: 0px 15px;
    height: 50px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 15px;
    margin-right: 15px;
    margin-left: 15px;
    display: none;
}

.body-xl .create-new-button
{
    width: 256px;
    display: flex;
}

.body-l .create-new-button
{
    width: 186px;
    display: flex;
}

.create-new-button:hover
{
    background-color: ${colorByName('lightBlue', 600)} !important;
}

.create-new-button span
{
    color: #ffffff
}


.ant-drawer-body .create-new-button
{
    width: 100%;
    margin-left: 0;
    font-size: 1rem;
    padding: 0 5px;
    height: 40px;
}

.body-m .create-new-button,
.body-m .header .show-create-new-page-button .ant-select-selector
{

    padding: 0px 5px;
    height: 42px;
    font-size: 20px;
    cursor: pointer;
    width: 175px;
    border-radius: 5px;
    margin-top: 10px;
    margin-right: 10px;
    margin-left: 10px;
}

.header .show-create-new-page-button input
{
    height: 50px !important;
    font-size: 20px;
}

.header .show-create-new-page-button .ant-select-selector
{
    padding-top: 0px;
    height: 50px;
    border-color: #1890ff;
}

.header .show-create-new-page-button .ant-select-arrow
{
    color: #1890ff;
}

.header .show-create-new-page-button .ant-select-selection-item
{
    padding-top: 8px;
}

.header .show-create-new-page-button .ant-select-selection-placeholder
{
    margin-top: 8px;
}
`}
</style>


CreateButtonCSS.displayName = 'CreateButtonCSS';
export default CreateButtonCSS;