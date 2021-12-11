import { useEffect, createElement } from 'react';
import { useMessageStore } from 'douhub-ui-store';
import { isEmpty} from 'lodash';

let _window: any = typeof window !== "undefined" ? window : {};
let _process: any = typeof process !== "undefined" ? process : {};;

export const sendMessage = (id: string, type: string, data: Record<string, any>) => {
    //console.log({ postMessage: { source: 'local', id, type, data } });
    if (isEmpty(_window)) return;
    _window.postMessage({ source: 'local', id, type, data });
}

export const MessageCenter = (props: any) => {

    const { stage } = props;
    const messageStore = useMessageStore(null);

    const messageHandler = (message: Record<string, any>) => {
        const data = message.data;
        if (data.source != 'local') {
            console.log({ title: 'non-local message was captured.', message });
            return;
        }
        messageStore.addMessage({ id: data.id, type: data.type, content: JSON.stringify(data.data) });
        if (stage !== 'prod') console.log({ message });
    };

    useEffect(() => {
        
        if (isEmpty(_window)) return ()=>{};

        if (_window.addEventListener) {
            _window.addEventListener("message", messageHandler);
        } else {
            _window.attachEvent("onmessage", messageHandler);
        }

        return () => {
            if (_window.removeEventListener) {
                _window.removeEventListener("message", messageHandler);
            } else {
                _window.detachEvent("onmessage", messageHandler);
            }
        }
    }, [_process?.browser]);

    return createElement('div', null, '');
};

