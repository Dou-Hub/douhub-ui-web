const PageHeaderUserCSS = () => <style global={true} jsx={true}>{`

    .header .user-avatar-icon-wrapper,
    .header .user-avatar-image-wrapper
    {
        border-left: solid 1px #eeeeee;
        padding-left: 15px;
        padding-right: 15px;
        height: 60px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;
    }

    .header .user-avatar-image,
    .header .user-avatar-image
    {
        border-radius: 50% !important;
        width: 32px !important;
        height: 32px !important;
    }

    .header .user-avatar-name
    {
        border: solid 1px #333333;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header .user-avatar-icon-user-false > div
    {
        width: 28px;
        height: 28px;
    }

    .header .user-avatar-icon-user-true > div
    {
        width: 24px;
        height: 24px;
    }

    .body-xl .header .user-avatar-icon-wrapper,
    .body-l .header .user-avatar-icon-wrapper,
    .body-xl .header .user-avatar-image-wrapper,
    .body-l .header .user-avatar-image-wrapper
    {
        height: 80px;
        padding-left: 15px;
        padding-right: 15px;
    }

    .body-m .header .user-avatar-icon-wrapper,
    .body-m .header .user-avatar-image-wrapper,
    .body-s .header .user-avatar-icon-wrapper,
    .body-s .header .user-avatar-image-wrapper
    {
       
    }

    .header .user-avatar-icon
    {
        width: 32px;
        height: 32px;
    }

    .header .user-avatar-icon svg
    {
        width: 32px;
        height: 32px;
        align-self: center;
    }

    .header .user-avatar .more
    {
        width: 18px;
        height: 18px;
        align-self: center;
    }
`}</style>

PageHeaderUserCSS.displayName = 'PageHeaderUserCSS';
export default PageHeaderUserCSS