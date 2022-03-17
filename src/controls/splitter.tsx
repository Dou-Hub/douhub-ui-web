import React, { useEffect, useState } from 'react';
import { _window } from 'douhub-ui-web-basic';
import { SPLITTER_CSS } from './splitter-css';
import { CSS } from 'douhub-ui-web-basic'
import SplitterInternal from './splitter-internal';

const Splitter = (props: Record<string, any>) => {

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [_window])

  return <>
    <CSS id="splitter-css" content={SPLITTER_CSS} />
    {show ? <SplitterInternal {...props} /> : <div style={{ display: 'none' }}></div>}
  </>
}

export default Splitter;