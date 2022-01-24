var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as THREE from 'three';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { context as fiberContext, useFrame, useThree } from '@react-three/fiber';
import mergeRefs from 'react-merge-refs';
const context = React.createContext(null);
export function useScroll() {
    return React.useContext(context);
}
export function ScrollControls({ eps = 0.00001, enabled = true, infinite, horizontal, pages = 1, distance = 1, damping = 4, children }) {
    const { gl, size, invalidate, events, raycaster } = useThree();
    const [el] = React.useState(() => document.createElement('div'));
    const [fill] = React.useState(() => document.createElement('div'));
    const [fixed] = React.useState(() => document.createElement('div'));
    const target = gl.domElement.parentNode;
    const scroll = React.useRef(0);
    const state = React.useMemo(() => {
        const state = {
            el,
            eps,
            fill,
            fixed,
            horizontal,
            damping,
            offset: 0,
            delta: 0,
            scroll,
            pages,
            // 0-1 for a range between from -> from + distance
            range(from, distance, margin = 0) {
                const start = from - margin;
                const end = start + distance + margin * 2;
                return this.offset < start ? 0 : this.offset > end ? 1 : (this.offset - start) / (end - start);
            },
            // 0-1-0 for a range between from -> from + distance
            curve(from, distance, margin = 0) {
                return Math.sin(this.range(from, distance, margin) * Math.PI);
            },
            // true/false for a range between from -> from + distance
            visible(from, distance, margin = 0) {
                const start = from - margin;
                const end = start + distance + margin * 2;
                return this.offset >= start && this.offset <= end;
            }
        };
        return state;
    }, [eps, damping, horizontal, pages]);
    React.useEffect(() => {
        el.style.position = 'absolute';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style[horizontal ? 'overflowX' : 'overflowY'] = 'auto';
        el.style[horizontal ? 'overflowY' : 'overflowX'] = 'hidden';
        el.style.top = '0px';
        el.style.left = '0px';
        fixed.style.position = 'sticky';
        fixed.style.top = '0px';
        fixed.style.left = '0px';
        fixed.style.width = '100%';
        fixed.style.height = '100%';
        fixed.style.overflow = 'hidden';
        el.appendChild(fixed);
        fill.style.height = horizontal ? '100%' : `${pages * distance * 100}%`;
        fill.style.width = horizontal ? `${pages * distance * 100}%` : '100%';
        fill.style.pointerEvents = 'none';
        el.appendChild(fill);
        target.appendChild(el);
        // Init scroll one pixel in to allow upward/leftward scroll
        el[horizontal ? 'scrollLeft' : 'scrollTop'] = 1;
        const oldTarget = typeof events.connected !== 'boolean' ? events.connected : gl.domElement;
        requestAnimationFrame(() => { var _a; return (_a = events.connect) === null || _a === void 0 ? void 0 : _a.call(events, el); });
        const oldCompute = raycaster.computeOffsets;
        raycaster.computeOffsets = ({ clientX, clientY }) => ({
            offsetX: clientX - target.offsetLeft,
            offsetY: clientY - target.offsetTop
        });
        return () => {
            var _a;
            target.removeChild(el);
            raycaster.computeOffsets = oldCompute;
            (_a = events.connect) === null || _a === void 0 ? void 0 : _a.call(events, oldTarget);
        };
    }, [pages, distance, horizontal, el, fill, fixed, target]);
    React.useEffect(() => {
        const containerLength = size[horizontal ? 'width' : 'height'];
        const scrollLength = el[horizontal ? 'scrollWidth' : 'scrollHeight'];
        const scrollThreshold = scrollLength - containerLength;
        let current = 0;
        let disableScroll = true;
        let firstRun = true;
        const onScroll = (e) => {
            // Prevent first scroll because it is indirectly caused by the one pixel offset
            if (!enabled || firstRun)
                return;
            invalidate();
            current = el[horizontal ? 'scrollLeft' : 'scrollTop'];
            scroll.current = current / scrollThreshold;
            if (infinite) {
                if (!disableScroll) {
                    if (scroll.current >= 1 - 0.001) {
                        const damp = 1 - state.offset;
                        el[horizontal ? 'scrollLeft' : 'scrollTop'] = 1;
                        scroll.current = state.offset = -damp;
                        disableScroll = true;
                    }
                    else if (current <= 0) {
                        const damp = 1 + state.offset;
                        el[horizontal ? 'scrollLeft' : 'scrollTop'] = scrollLength;
                        scroll.current = state.offset = damp;
                        disableScroll = true;
                    }
                }
                if (disableScroll)
                    setTimeout(() => (disableScroll = false), 40);
            }
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        requestAnimationFrame(() => (firstRun = false));
        const onWheel = (e) => (el.scrollLeft += e.deltaY / 2);
        if (horizontal)
            el.addEventListener('wheel', onWheel, { passive: true });
        return () => {
            el.removeEventListener('scroll', onScroll);
            if (horizontal)
                el.removeEventListener('wheel', onWheel);
        };
    }, [el, size, infinite, state, invalidate, horizontal]);
    let last = 0;
    useFrame((_, delta) => {
        state.offset = THREE.MathUtils.damp((last = state.offset), scroll.current, damping, delta);
        state.delta = THREE.MathUtils.damp(state.delta, Math.abs(last - state.offset), damping, delta);
        if (state.delta > eps)
            invalidate();
    });
    return React.createElement(context.Provider, { value: state }, children);
}
const ScrollCanvas = React.forwardRef(({ children }, ref) => {
    const group = React.useRef(null);
    const state = useScroll();
    const { width, height } = useThree((state) => state.viewport);
    useFrame(() => {
        group.current.position.x = state.horizontal ? -width * (state.pages - 1) * state.offset : 0;
        group.current.position.y = state.horizontal ? 0 : height * (state.pages - 1) * state.offset;
    });
    return React.createElement("group", { ref: mergeRefs([ref, group]) }, children);
});
const ScrollHtml = React.forwardRef((_a, ref) => {
    var { children, style } = _a, props = __rest(_a, ["children", "style"]);
    const state = useScroll();
    const group = React.useRef(null);
    const { width, height } = useThree((state) => state.size);
    const fiberState = React.useContext(fiberContext);
    useFrame(() => {
        if (state.delta > state.eps) {
            group.current.style.transform = `translate3d(${state.horizontal ? -width * (state.pages - 1) * state.offset : 0}px,${state.horizontal ? 0 : height * (state.pages - 1) * -state.offset}px,0)`;
        }
    });
    ReactDOM.render(React.createElement("div", Object.assign({ ref: mergeRefs([ref, group]), style: Object.assign(Object.assign({}, style), { position: 'absolute', top: 0, left: 0, willChange: 'transform' }) }, props),
        React.createElement(context.Provider, { value: state },
            React.createElement(fiberContext.Provider, { value: fiberState }, children))), state.fixed);
    return null;
});
export const Scroll = React.forwardRef((_a, ref) => {
    var { html } = _a, props = __rest(_a, ["html"]);
    const El = html ? ScrollHtml : ScrollCanvas;
    return React.createElement(El, Object.assign({ ref: ref }, props));
});

