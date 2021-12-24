//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import View from './controls/view';
import Text from './controls/text';
import SVG from './controls/svg';
import Logo from './controls/logo';
export { getServerSidePropsForPage } from './page/server';
import PageBase from './page/base';
import PageHead from './page/head';
import AppBase from './app';

//Sections
import LogosSection from './sections/logos';
import SignInSection from './sections/auth/sign-in';

//Fields
import LabelField from './fields/label';
import NoteField from './fields/note';
import SectionField from './fields/section';
import CodesField from './fields/codes';
import TextField from './fields/text';
import MessageField from './fields/message';

export { abortCallAPI, callAPIBase } from './call-api';
export { callAPI } from './context/auth-call-api';
export { signIn, getAuth, signInCognito, getCurrentPoolUser } from './context/auth-cognito';

export {SignInFields} from './sections/auth/helper';

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
    View, Text, SVG, Logo, PageBase, PageHead, AppBase
};

export {
    LogosSection,
    SignInSection
}

export {
    LabelField,
    NoteField,
    SectionField,
    CodesField,
    TextField,
    MessageField
} 

