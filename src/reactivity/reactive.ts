
import { mutableHandles, readonlyHandles, shallowReadonlyHandles } from './baseHandlers';


export const enum ReactiveFlags {
    IS_REACTIVE = "__vue_isReactive",
    IS_READONLY = "__vue_isReadonly"
}

function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}

export function reactive (raw){
    return createActiveObject(raw, mutableHandles);
}

export function readonly (raw){
    return createActiveObject(raw, readonlyHandles);
}

export function shallowReadonly(raw){
    return createActiveObject(raw, shallowReadonlyHandles);
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value){
    return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
    return isReadonly(value) || isReactive(value);
}
