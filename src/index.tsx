//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import View from './controls/view';
import Text from './controls/text';
import SVG from './controls/svg';
import {PAGE_CSS} from './page/css';
import Logo from './controls/logo';
export {getServerSidePropsForPage} from './page/server';

export {abortCallAPI, callAPI} from './call-api';
export {
    getSession, 
    setSession, 
    removeSession,
    getPlatformApiEndpoint, logDynamic} from './util';

export {
    View, Text, SVG, PAGE_CSS, Logo
};