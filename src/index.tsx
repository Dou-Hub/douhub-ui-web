//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

export { getServerSidePropsForPage } from './pages/server';

import AppBase from './app';

//Controls
import View from './controls/view';
import Text from './controls/text';
import Uploader from './controls/uploader';
import SVG from './controls/svg';
import Tags from './controls/tags';
import Triangle from './controls/triangle';
import Logo from './controls/logo';
import CSS from './controls/css';
import Input from './controls/input';
import Div from './controls/div';
import Avatar from './controls/avatar';
import Checkbox from './controls/antd/checkbox';
import Table from './controls/antd/table';
import Tooltip from './controls/antd/tooltip';
import Switch from './controls/antd/switch';
import Slider from './controls/antd/slider';
import InputText from './controls/antd/input';
import InputPassword from './controls/antd/password';
import InputNumber from './controls/antd/number';
import InputTextArea from './controls/antd/textarea';
import Select from './controls/antd/select';
import SelectOption from './controls/antd/select-option';
import SelectProps from './controls/antd/select-props';
import Notification from './controls/antd/notification';
import Popconfirm from './controls/antd/popconfirm';
import Dropdown from './controls/antd/dropdown';
import Menu from './controls/antd/menu';
import Alert from './controls/antd/alert';
import Button from './controls/antd/button';
import Affix from './controls/antd/affix';
import Drawer from './controls/antd/drawer';
import Tree from './controls/antd/tree';

//Sections
import LogosSection from './sections/logos';
import SignInSection from './sections/auth/sign-in';
import SignUpSection from './sections/auth/sign-up';
import SocialIconsSection from './sections/social-icons';
import FooterColumnSection from './sections/footer/column';

//Modals
import BasicModal from './controls/modals/basic';

import FormBase from './sections/form/base';
import DefaultForm from './sections/form/default';

//Fields
import LabelField from './fields/label';
import TreeField from './fields/tree';
import NoteField from './fields/note';
import SectionField from './fields/section';
import PicklistField from './fields/picklist';
import LookupField from './fields/lookup';
import CodesField from './fields/codes';
import TextField from './fields/text';
import MessageField from './fields/message';
import CheckboxField from './fields/checkbox';
import CheckboxGroupField from './fields/checkbox-group';
import AlertField from './fields/alert';
import PlaceholderField from './fields/placeholder';
import HtmlField from './fields/html';
import HtmlFieldCode from './fields/html-code';

//Header Controls
import PageHeaderMe from './controls/page/header/me';
import PageHeaderMenuItem from './controls/page/header/menu-item';
import PageHeaderMenuItems from './controls/page/header/menu-items';
import PageHeaderMenuPosts from './controls/page/header/menu-posts';
import PageHeaderMenuActions from './controls/page/header/meun-actions';
import PageHeaderNotification from './controls/page/header/notification';
import UserProfileMeModal from './sections/header/user-profile-me-modal';
import UserProfileModal from './sections/header/user-profile-modal';
import AppHeaderSearch from './sections/header/search';

import PageLoader from './controls/page/loader';

//Modals
import SendInvitationModal from './sections/modals/user-invitation-modal';

//Pages
import PageBase from './pages/base';
import PageHead from './pages/head';
import SignInPageBody from './pages/auth/sign-in';
import SignUpPageBody from './pages/auth/sign-up';

export { abortCallAPI, callAPIBase, APISettings } from './call-api';
export { callAPI } from './context/auth-call-api';
export { signIn, getAuth, signInCognito, getCurrentPoolUser, signOut, useCurrentContext } from './context/auth-cognito';

export { SignInFields, SignUpFields } from './sections/auth/helper';

export { ARTICLE_CSS } from './fields/article-css';
export { HTML_FIELD_CSS } from './fields/html-css';
export { HTML_FIELD_CODE_CSS } from './fields/html-code-css';

export { SPLITTER_CSS } from './controls/splitter-css';
import Splitter from './controls/splitter';


export {
    View, Text, SVG, Logo, Avatar, Input, InputTextArea, Checkbox, Tags,
    Table, Tooltip, Slider, Switch, Select, SelectOption, SelectProps,
    InputPassword, InputNumber, InputText, Notification, Splitter, Triangle,
    Popconfirm, Dropdown, Menu, Alert, Button,
    Affix, Drawer, Uploader, Tree, Div
};

//List
export { renderIconButtonColumn, 
    DEFAULT_COLUMNS, 
    DEFAULT_EDIT_COLUMN, 
    DEFAULT_ACTION_COLUMN,
    DEFAULT_EMAIL_COLUMN, 
    rendeActionButtonColumn} from './sections/list/list-helper';
export {LIST_CSS}  from './sections/list/list-css';
import ListTable from './sections/list/list-table';
import ListHeader from './sections/list/list-header';
import ListFormResizer from './sections/list/list-resizer';
import ListFormHeader from './sections/list/list-form-header';
import ListFilters from './sections/list/list-filters';
import ListCategoriesTags from './sections/list/list-categories-tags';
import DefaultList from './sections/list/default';

export {
    ListTable, ListFormResizer, ListHeader, DefaultList,
    ListFilters, ListFormHeader, ListCategoriesTags
}

export {
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
    hasErrorType,
    getCookie,
    setCookie,
    removeCookie,
    logDynamic,
    _window,
    _process,
    _track
} from './util';

export {
    getFirstMarkFromSelectedHTMLSegment,
    getTextFromSelectedHTMLSegment

} from './fields/html-helper';

export {
    PageBase, PageHead, AppBase, SignInPageBody, SignUpPageBody
};

export {
    PageHeaderMe,
    PageHeaderMenuItem,
    PageHeaderMenuItems,
    PageHeaderMenuPosts,
    PageHeaderMenuActions,
    PageHeaderNotification,
    PageLoader,
    SendInvitationModal,
    UserProfileMeModal,
    UserProfileModal,
    AppHeaderSearch
};

export {
    LogosSection,
    SignInSection,
    SignUpSection,
    SocialIconsSection,
    FooterColumnSection
}

export {
    BasicModal
}

export {
    FormBase, DefaultForm
}

export {
    LabelField,
    TreeField,
    NoteField,
    SectionField,
    PicklistField,
    LookupField,
    CodesField,
    TextField,
    MessageField,
    CheckboxField,
    CheckboxGroupField,
    AlertField,
    PlaceholderField,
    HtmlField,
    HtmlFieldCode,
    CSS
}

