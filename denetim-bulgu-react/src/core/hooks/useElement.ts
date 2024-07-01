import { useState, useRef, MutableRefObject, useLayoutEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { sampleFunction } from '../utility';



type Arg = HTMLElement | (() => HTMLElement) | null;

type Size = {
    clientWidth?: number;
    clientHeight?: number;
    clientTop?: number;
    clientLeft?: number;
    offsetTop?: number;
    offsetLeft?: number;
    offsetWidth?: number;
    offsetHeight?: number;
    tagName?: string;
    id?: string | number;
    className?: string | number;
    classList: any;
};

function useElement<T extends HTMLElement = HTMLElement>(
    ...args: [Arg] | []
): [Size, MutableRefObject<T>?] {
    const hasPassedInElement = args.length === 1;
    const arg = useRef(args[0]);
    [arg.current] = args;
    const element = useRef<T>();
    const [state, setState] = useState<Size>(() => {
        const initDOM =
            typeof arg.current === 'function' ? arg.current() : arg.current;
        return {
            clientWidth: (initDOM || {}).clientWidth,
            clientHeight: (initDOM || {}).clientHeight,
            clientTop: (initDOM || {}).clientTop,
            clientLeft: (initDOM || {}).clientLeft,
            offsetTop: (initDOM || {}).offsetTop,
            offsetLeft: (initDOM || {}).offsetLeft,
            offsetWidth: (initDOM || {}).offsetWidth,
            offsetHeight: (initDOM || {}).offsetHeight,
            tagName: (initDOM || {}).tagName,
            id: (initDOM || {}).id,
            className: (initDOM || {}).className,
            classList: (initDOM || {}).classList,
        };
    });

    const depend: any =
        typeof arg.current === 'function' ? undefined : arg.current;

    useLayoutEffect(() => {
        const passedInElement =
            typeof arg.current === 'function' ? arg.current() : arg.current;
        const targetElement = hasPassedInElement
            ? passedInElement
            : element.current;
        if (!targetElement) {
            return () => {sampleFunction};
        }

        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach((entry: { target: Size }) => {
                setState({
                    clientWidth: entry.target.clientWidth,
                    clientHeight: entry.target.clientHeight,
                    clientTop: entry.target.clientTop,
                    clientLeft: entry.target.clientLeft,
                    offsetTop: entry.target.offsetTop,
                    offsetLeft: entry.target.offsetLeft,
                    offsetWidth: entry.target.offsetWidth,
                    offsetHeight: entry.target.offsetHeight,
                    tagName: entry.target.tagName,
                    id: entry.target.id,
                    className: entry.target.className,
                    classList: entry.target.classList,
                });
            });
        });

        resizeObserver.observe(targetElement);
        return () => {
            resizeObserver.disconnect();
        };
    }, [element, depend, hasPassedInElement]);

    if (hasPassedInElement) {
        return [state];
    }
    return [state, element as MutableRefObject<T>];
}

export default useElement;

/*
 Usage ----

 const [state] = useElement(() => document.querySelector('#demo2'));
 const [state] = useElement(document.querySelector('body'));

 API ---
 const [ state, ref? ] = useSize(dom);

 Example ---

 export default () => {
  const [state, ref] = useSize<HTMLDivElement>();
  return (
    <div ref={ref}>
      try to resize the preview window <br />
      dimensions -- width: {state.width} px, height: {state.height} px
    </div>
  );
 };



*/
