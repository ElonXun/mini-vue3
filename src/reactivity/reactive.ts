
import { mutableHandles, readonlyHandles } from './baseHandlers';

function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}

export function reactive (raw){
    return createActiveObject(raw, mutableHandles);
}

export function readonly (raw){
    return createActiveObject(raw, readonlyHandles);
}

