

import FieldText from '../fields/text';
import FieldRow from '../fields/row';
import { solution } from '../../../shared/metadata/solution';
import { setCookie } from '../../util/web';

export const getServerSideProps = async (props) => {
    return { header: { hide: true }, footer: { hide: true } }
}

export const MainArea = (props) => {

    const onChange = (code) => {
        if (code == solution.version) {
            setCookie('pre-release-code', code);
            window.location = '/';
        }
    };

    return <div className="section section-form">
        <style global={true} jsx={true}>{`
            .page {
                max-width: 100% !important;
                padding-top: 100px;
            }
            .page .main {
                max-width: 100% !important;
                align-items: center;
            }
            .page .section-form {
                width: 320px;
            }
            .page .field-text{
                text-align: center;
                font-size: 1.5rem !important;
            }
        `}
        </style>
        <FieldRow size={props.size}
            style={{ marginTop: '1.5rem' }}
            fields={[
                <FieldText
                    key="code"
                    placeholder="Type the access code here"
                    onChange={onChange} />
            ]} />
    </div>
}

export default { MainArea, getServerSideProps }