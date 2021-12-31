//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import View from './controls/view';
import Text from './controls/text';
import SVG from './controls/svg';
import Logo from './controls/logo';
export { getServerSidePropsForPage } from './pages/server';

import AppBase from './app';

//Sections
import LogosSection from './sections/logos';
import SignInSection from './sections/auth/sign-in';
import SocialIconsSection from './sections/social-icons';
import FooterColumnSection from './sections/footer/column';

//Modals
import BasicModal from './controls/modals/basic';

//Fields
import LabelField from './fields/label';
import NoteField from './fields/note';
import SectionField from './fields/section';
import CodesField from './fields/codes';
import TextField from './fields/text';
import MessageField from './fields/message';

//Header Controls
import PageHeaderMe from './controls/page/header/me';
import PageHeaderMenuItem from './controls/page/header/menu-item';
import PageHeaderMenuItems from './controls/page/header/menu-items';
import PageHeaderMenuPosts from './controls/page/header/menu-posts';
import PageHeaderMenuActions from './controls/page/header/meun-actions';
import PageHeaderNotification from './controls/page/header/notification';
import PageLoader  from './controls/page/loader';

//Pages
import PageBase from './pages/base';
import PageHead from './pages/head';
import SignInPageBody from './pages/sign-in/body';

export { abortCallAPI, callAPIBase } from './call-api';
export { callAPI } from './context/auth-call-api';
export { signIn, getAuth, signInCognito, getCurrentPoolUser, signOut, useCurrentUser } from './context/auth-cognito';

export { SignInFields } from './sections/auth/helper';

export {
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
    getCookie,
    setCookie,
    removeCookie,
    getPlatformApiEndpoint, logDynamic
} from './util';

export {
    View, Text, SVG, Logo
};

export {
    PageBase, PageHead, AppBase, SignInPageBody
};

export {
    PageHeaderMe,
    PageHeaderMenuItem,
    PageHeaderMenuItems,
    PageHeaderMenuPosts,
    PageHeaderMenuActions,
    PageHeaderNotification,
    PageLoader
};

export {
    LogosSection,
    SignInSection,
    SocialIconsSection,
    FooterColumnSection
}

export {
    BasicModal
}

export {
    LabelField,
    NoteField,
    SectionField,
    CodesField,
    TextField,
    MessageField
}

