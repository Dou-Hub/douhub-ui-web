
const BannerSectionStyles = () => <style global={true} jsx={true}>
{`
    .section-banner 
    {
        display: flex;
        flex-direction: row;
    }

    .section-banner-server-true
    {
        flex-direction: column;
    }

    .section-banner .button
    {
        padding: 5px 20px;
        font-size: 16px;
        background: rgba(0,0,0,0.8);
        color: #FFFFFF;
        margin-top: 20px;
        display: flex;
    }

    .section-banner .button .edit-icon
    {
        width: 18px;
        height: 18px;
    }

    .section-banner .button .edit-icon
    {
        margin-left: 10px;
        align-self: center;
    }

    .section-banner .button .edit-icon svg
    {
        fill: #ffffff;
    }

    .body-mobile .section-banner,
    .body-s .section-banner,
    .body-xs .section-banner
    {
        flex-direction: column;
    }

    .body-m .section-banner-edit-false,
    .body-l .section-banner-edit-false,
    .body-xl .section-banner-edit-false
    {
        flex-direction: row;
    }

    .body-m .section-banner-edit-true,
    .body-l .section-banner-edit-true,
    .body-xl .section-banner-edit-true
    {
        flex-direction: column;
    }

    .section-banner .info
    {
        padding: 30px 40px;
        display: flex;
        flex-direction: column;
    }

    .body-mobile .section-banner .info,
    .body-s .section-banner .info,
    .body-xs .section-banner .info
    {
        width: 100% ;
    }

    .body-m .section-banner .info,
    .body-l .section-banner .info,
    .body-xl .section-banner .info
    {
        width: auto;
    }

    .section-banner .info .h2
    {
        font-size: 2rem !important;
        line-height: 1.3;
        margin-bottom: 1rem !important;
    }

    .section-banner .info p
    {
        font-size: 0.9rem;
    }


    .section-banner .info .button
    {
        padding: 5px 10px;
        height: auto;
        font-size: 16px;
        margin-top: 20px;
        border: none;
        background-color: #000000;
        color: #ffffff;
    }


    .body-xl .section-banner .info .button
    {
        padding: 10px 15px;
        height: auto;
        font-size: 20px;
        margin-top: 20px;
    }

    .section-banner .info .ph
    {
        flex: 1
    }

    .section-banner .media
    {
        flex: 1;
        max-height: 500px;
        /* min-height: 350px; */
        background-size: cover;
        background-position: center;
    }

    .section-banner .buttons
    {
        display: flex; 
        flex-direction: row;
        margin-top: 10px
    }

    .body-mobile .section-banner .media,
    .body-s .section-banner .media,
    .body-xs .section-banner .media
    {
        width: 100%;
        padding-left: 0px;
        margin-top: 20px;
    }

    .body-m .section-banner .media,
    .body-l .section-banner .media,
    .body-xl .section-banner .media
    {
        width: auto;
        padding-left: 0px;
        margin-top: 0px;
    }

    .section-banner-edit-true
    {
        display: flex;
        flex-direction: column;
    }

    .section-banner-edit-true .row-banner,
    .section-banner-edit-true .row-edit
    {
        display: flex;
        flex-direction: row;
    }

    .body-s .section-banner-edit-true .row-banner,
    .body-xs .section-banner-edit-true .row-banner,
    .body-s .section-banner-edit-true .row-edit,
    .body-xs .section-banner-edit-true .row-edit
    {
        flex-direction: column !important;
    }

    .section-banner-edit-true .row-edit .info,
    .section-banner-edit-true .row-edit .media
    {
        padding: 0 10px 0 0;
    }

    .body-s .section-banner-edit-true .row-edit .media, 
    .body-xs .section-banner-edit-true .row-edit .media
    {
        margin-top: 0;
    }

    .section-banner-edit-true .row-banner .media
    {
        position: relative;
    }

    .section-banner-edit-true .row-banner .media .edit-icon
    {
        position: absolute;
        right: 0;
        top: 0;
        background: #ffffff;
        width: 50px;
        height: 50px;
        padding: 10px;
        border: solid 1px rgba(0,0,0,0.1);
        border: solid 1px rgba(0,0,0,0.1);
    }

    .section-banner-edit-true .row-banner .media .edit-icon img
    {
        width: 30px;
        height: 30px;
    }

    .section-banner-edit-true .info .field-wrapper-input input,
    .section-banner-edit-true .info .field-wrapper-input textarea,
    .section-banner-edit-true .info .field-color-picker input
    {
        background: transparent;
        margin-bottom: 0 !important;
    }

    .section-banner-edit-true .buttons .field-wrapper-input
    {
        border: none !important;
        margin-bottom: 0 !important;
    }

    .section-banner-edit-true .buttons .field-wrapper-input input
    {
        margin-top: 0 !important;
        text-align: center;
        background: #000000;
    }
`}
</style>

BannerSectionStyles.displayName = 'BannerSectionStyles';
export default BannerSectionStyles;