import { colorByName } from '../../../shared/util/colors';
const ColumnsSectionCSS = ()=> <style global={true} jsx={true}>
    {`    
        .section-columns {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: hidden;
        }

        .section-columns .buttons
        {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .section-columns .buttons .button-edit,
        .section-columns .buttons .button-edit svg
        {
            width: 25px;
            height: 25px;
            cursor: pointer;
        }

        .section-columns .buttons .ph
        {
            height: 25px;
            flex: 1;
        }

        .section-columns .buttons .action
        {
            
            height: 25px;
        }

        .section-columns-pagination 
        {
            display: flex;
            margin-bottom: 1rem;
        }

        .section-columns-pagination .item
        {
            padding: 5px;
            min-width: 20px;
            border: none !important;
            background-color: rgba(0,0,0,0.03) !important;
            margin-right: 5px;
            font-size: 0.7rem;
            cursor: pointer;
            text-align: center;
        }

        .section-columns-pagination .item-current
        {
            background-color: #f44238 !important;
            color: #ffffff !important;
        }

        .section-columns-server-true
        {
            flex-direction: column;
        }

        .section-columns .slider
        {
            position: absolute;
            top: 0;
            display: flex;
            max-width: 100% !important;
        }


        .section-columns .slider .column {
            flex: 1;
            overflow: hidden;
            position: absolute;
        }

        .section-columns .column-hidden {
           display: none;
        }

        .section-columns .video-wrapper
        {
            position: relative;
            overflow: hidden;
            width: 100%;
            padding-bottom: 56.25%;
            height: 0;
            height: auto;
            margin-bottom: 20px;
        }

        .section-columns .video-wrapper iframe,
        .section-columns .video-wrapper video
        {
            position: absolute;
            top: 0;
            left: 0;
            width: calc(100%);
            height: calc(100%);
        }

        .section-columns .column .photo-wrapper
        {
            margin-bottom: 20px;
            background-size: cover;
            background-position: center;
            border: solid 1px #cccccc;
            line-height: 0 !important;
            max-width: 100% !important;
        }


        .section-columns .column .photo-wrapper img
        {
            max-width: 100%;
        }

        
        .section-columns .column .h3-wrapper
        {
            color: #000000;
            text-decoration: underline;
        }

        .section-columns .column h3
        {
            line-height: 1.3;
            margin-bottom: 0.7rem;
        }

        .section-columns .column p 
        {
            line-height: 1.2;
            margin-top: 0;
            color: rgba(0,0,0,0.7);
        }

        .section-columns .column .search-highlight
        {
            color: #1890ff;
            font-weight: bold;
        }

        .body-xs .section-columns {
            display: flex;
            flex-direction: column;
        }
     
        .section-columns .button
        {
            padding: 2px;
            height: auto;
            border: solid 1px rgba(0,0,0,0.1);
        }

        .section-columns .button-ph
        {
            padding: 2px;
            height: auto;
        }

        
        .section-columns .button .shop
        {
            border-left: dashed 1px #d9d9d9;
            padding: 2px 8px;
            line-height: 1;
        }

        .section-columns .button .price
        {
            color: #f15d22;
            font-weight: 500;
            line-height: 1;
            padding: 2px 8px;
        }

        .section-columns .setting-icon svg {
            width: 25px;
            height: 25px;
        }

        .section-columns-sort
        {
            flex-direction: column !important;
        }

        .section-columns .sort-item
        {
            border: dashed 1px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
            padding: 8px;
            display: flex;
            flex-direction: column;
            cursor: grab;
        }

        .section-columns .sort-item h3
        {
            font-size: 1rem
        }

        .section-columns .sort-item .content
        {
            font-size: 0.8rem;
            margin-bottom: 0px;
        }

        .section-columns .item-edit-button svg {
            width: 25px;
            height: 25px;
        }

        .section-columns .item-add-button svg {
            fill: ${colorByName('green',600)};
            margin-right: 10px;
        }

        .section-columns .item-remove-button svg {
            fill: ${colorByName('red',600)}
        }
`}
</style>

ColumnsSectionCSS.displayName = 'ColumnsSectionCSS';
export default ColumnsSectionCSS;