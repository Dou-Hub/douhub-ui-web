import React, { useEffect, useRef } from 'react';
import { isEmpty, isFunction, isNumber } from 'lodash';
import { _window } from 'douhub-ui-web-basic';

const ListFormResizer = (props: Record<string, any>) => {

    const { className, style, id, defaultWidth } = props;
    const inputEl = useRef(null);
    const BORDER_SIZE = 4;

    useEffect(()=>{
        if (isNumber(defaultWidth)) 
        {
            console.log({defaultWidth})
            const current: Record<string, any> = inputEl && inputEl.current? inputEl.current : {};
            current.style.width = defaultWidth + 'px';
        }
    },[id]);

    function resize(e: any) {
        const dx = _window.m_pos - e.x;
        _window.m_pos = e.x;
        const current: Record<string, any> = inputEl && inputEl.current? inputEl.current : {};
        if (current.offsetWidth) 
        {
            const newWidth = current.offsetWidth + dx;
            current.style.width = newWidth + "px";
            if (isFunction(props.onChangeSize)) props.onChangeSize(newWidth);
        }
    }

    const onMouseDown = (e: any) => {
        if (e.offsetX < BORDER_SIZE) {
            _window.m_pos = e.x;
            if (_window.removeEventListener) {
                _window.document.addEventListener("mousemove", resize);
            }
            else
            {
                _window.document.attachEvent("mousemove", resize);
            }
        }
    }

    const onMouseUp = () => {
        if (_window.removeEventListener) {
            _window.document.removeEventListener("mousemove", resize);
        }
        else
        {
            _window.document.detachEvent("mousemove", resize);
        }
    }

    useEffect(() => {
        const current: Record<string, any> = inputEl && inputEl.current? inputEl.current : {};
        if (_window.removeEventListener) {
            if (current && !isEmpty(current)) current.addEventListener("mousedown", onMouseDown);
            if (current && !isEmpty(current))  current.addEventListener("mouseup", onMouseUp);
            _window.document.addEventListener("mouseup", onMouseUp);
        }
        else
        {
            if (current && !isEmpty(current)) current.attachEvent("mousedown", onMouseDown);
            if (current && !isEmpty(current))  current.attachEvent("mouseup", onMouseUp);
            _window.document.attachEvent("mouseup", onMouseUp);
        }

        return () => {
            if (_window.removeEventListener) {
                if (current && !isEmpty(current)) current.removeEventListener("mousedown", onMouseDown);
                if (current && !isEmpty(current)) current.removeEventListener("mouseup", onMouseUp);
                _window.document.removeEventListener("mousemove", resize);
                _window.document.removeEventListener("mouseup", onMouseUp);
            } else {
                if (current && !isEmpty(current)) current.detachEvent("mousedown", onMouseDown);
                if (current && !isEmpty(current)) current.detachEvent("mouseup", onMouseUp);
                _window.document.detachEvent("mousemove", resize);
                _window.document.detachEvent("mouseup", onMouseUp);
            }


        }
    }, [])


    return <div
        ref={inputEl}
        className={className}
        style={{ ...style, display: 'flex' }}

    >
        <div className="cursor-col-resize h-full" style={{ width: 4, backgroundColor: '#ffffff' }}></div>
        {props.children}
    </div>
};

export default ListFormResizer;

