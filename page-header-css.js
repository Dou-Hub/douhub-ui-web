const PageHeaderCSS = () => <style global jsx>{`

.header-wrapper
{
    display: flex;
    flex-direction: column;
    border-bottom: solid 1px #eeeeee;
    background-color: #ffffff;
    align-items: center;
    position: fixed;
    width: 100%;
    min-width: 360px;
    z-index: 100;
    top: 0;
}

.header-wrapper-scroll-true
{
    -webkit-box-shadow: 0px 5px 5px 0px #eeeeee;
    -moz-box-shadow: 0px 5px 5px 0px #eeeeee;
    box-shadow: 0px 5px 5px 0px #eeeeee;
    border-bottom: solid 1px #dddddd;
}


.header {
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 60px;
}


.body-xl .header,
.body-l .header 
{
    height: 80px;
}

.header .logo {
    display: flex;
    flex-direction: row;
    padding-left: 30px;
    padding-right: 30px;
    cursor: pointer;
}

.body-m .header .logo {
    padding-left: 8px;
    padding-right: 20px;
}

.header .logo-ph {
    display: none;
}

.body-xl .header .logo,
.body-l .header .logo
{
    width: 390px;
}

.body-s .header .logo,
.body-xs .header .logo {
    width: 50px;
    padding-left: 10px;
    padding-right: 10px;
}

.header .logo-icon 
{
    align-self: center;
    position: absolute;
    padding: 15px 0px;
    width:  40px;
    height: 70px;
    border-radius: 10px;
}

.header .logo-icon div,
.header .logo-icon svg
{
   fill: #f4511e;
   width: 40px;
   height: 40px;
}

.body-s .header .logo-icon,
.body-xs .header .logo-icon
{
    padding: 5px 0;
    width:  40px;
    height: 40px;
}

.body-s .header .logo-icon div,
.body-s .header .logo-icon svg,
.body-xs .header .logo-icon div,
.body-xs .header .logo-icon svg
{
   width: 32px;
   height: 32px;
}

.body-m .header .logo-icon
{
    padding: 12px;
    width:  54px;
    height: 60px;
}

.body-m .header .logo-icon div,
.body-m .header .logo-icon svg
{
   width: 35px;
   height: 35px;
}

.header .logo-text-wrapper {
    display: flex;
    flex-direction: column;
    align-self: center;
    margin-left: 55px;
    
}


.body-s .header .logo-text-wrapper ,
.body-xs .header .logo-text-wrapper 
{
    display: none !important;
}

.body-m .header .logo-text-wrapper 
{
    margin-left: 65px;
}

.header .logo-text-wrapper .logo-text-1 {
    font-size: 1.2rem;
    line-height: 1;
}

.body-xs .header .logo-text-wrapper .logo-text-1 {
    font-size: 1rem;
    line-height: 1;
}

.header .logo-text-wrapper .logo-text-2 {
    font-size: 0.8rem;
    font-weight: 300;
    margin-top: 5px;
    line-height: 1;
}

.body-xs .header .logo-text-wrapper .logo-text-2 {
   display: none;
}


.header .search {
    border-left: solid 1px #eeeeee;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}


.header .search .search-row
{
    height: 35px;
    display: flex;
}

.body-l .header .search .search-row,
.body-xl .header .search .search-row
{
    height: 50px;
}

.header .search .condition-row
{
    height: 25px;
    display: flex;
    flex-direction: row;
    padding: 0 5px;
    border-top: dashed 1px #eeeeee;
}

.body-l .header .search .condition-row,
.body-xl .header .search .condition-row
{
    height: 30px;
    padding: 0 10px;
}

.body-l .header .search,
.body-xl .header .search 
{
    border-right: solid 1px #eeeeee;
}

.header .search .condition-row .condition
{
    display: flex;
    flex-direction: row;
    padding: 5px;
    cursor: pointer;
}

.header .search .condition-row .condition .text
{
    font-size: 0.7rem;
    align-self: center;
    margin-left: 5px;
}

.body-l .header .search .condition-row .condition .text,
.body-xl .header .search .condition-row .condition .text
{
    font-size: 0.8rem;
}

.header .search .condition-row .condition .checkbox
{
    align-self: center;
    width: 14px;
    height: 14px;
}

.body-l .header .search .condition-row .condition .checkbox,
.body-xl .header .search .condition-row .condition .checkbox
{
    width: 18px;
    height: 18px;
}

.header .search-ph
{
    border: none !important;
}

.header .goback
{
    padding: 20px 0 0 0;
}

.header .ph
{
    flex: 1;
    min-height: 30px;
}

.header .search .input
{
    border: none;
    padding: 0 10px;
    font-size: 1rem;
    width: 100%;
    height: 100%;
}

.body-l .header .search .input,
.body-xl .header .search .input
{
    padding: 0 15px;
    font-size: 1.2rem;
}

.header .search .button-search
{
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
    align-self: center;
}

.header .search .button-search div,
.header .search .button-search svg
{
    width: 20px;
    height: 20px;
}

.body-l .header .search .button-search div,
.body-l .header .search .button-search svg,
.body-xl .header .search .button-search div,
.body-xl .header .search .button-search svg
{
    width: 25px;
    height: 25px;
}

.header .search .button-search svg
{
    fill: #666666
}

.header .search:hover .button-search svg
{
    fill: #f44238
}

.header .search .button-x
{
    cursor: pointer;
    height: 35px;
    display: flex;
    flex-direction: row;
}

.body-l .header .search .button-x,
.body-xl .header .search .button-x
{
    height: 50px;
}

.header .search .button-x div
{
    width: 13px;
    height: 13px;
    align-self: center;
}

.header .search .button-x svg
{
     fill: #cccccc;
}

.header .buttons
{
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 50px;
}

.header-drawer .ant-drawer-close
{
    width: 52px;
    padding: 16px;
}

.header-drawer .ant-drawer-close svg
{
    width: 20px;
    height: 20px;
}

.header-drawer .create-new-button,
.header-drawer .show-create-new-page-button
{
    margin-top: 25px;
    margin-bottom: 10px;
}

.header-drawer .ant-drawer-body
{
    display: flex;
    flex-direction: column;
}

.header-drawer .ant-drawer-body .item.section-start
{
    margin-top: 0.6rem;
}

.header-drawer .ant-drawer-body .item.section-end
{
    border-bottom: dashed 1px rgba(0,0,0,0.1);
    padding-bottom: 1.2rem;
}

.header-drawer .ant-drawer-body .item
{
    color: #333333;
    font-size: 1rem;
    padding-top: 0.6rem;
    cursor: pointer;
    padding-bottom: 0.6rem;
}

.header .menu-icon
{
    border-right: solid 1px #eeeeee;
    cursor: pointer;
    height: 80px;
    width: 61px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 16px;
    padding-right: 16px;
}


.body-m .header .menu-icon,
.body-s .header .menu-icon,
.body-xs .header .menu-icon
{
    height: 60px;
}

.header .menu-icon > div
{
    width: 28px;
    height: 28px;
}

.header .buttons .drawer
{
    align-self: center;
    height: 70px;
    padding: 10px 20px;
    font-size: 20px;
    border-radius: 15px;
}
`}
</style>

PageHeaderCSS.displayName = 'PageHeaderCSS';
export default PageHeaderCSS;
