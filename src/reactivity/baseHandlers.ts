import { track, trigger } from './effect';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadyonly = false) {
    return function get(target, key) {
        // for example
        // target {foo: 1}
        // key foo
        const res = Reflect.get(target, key);

        // readonly 因没有set功能 所以也不需要进行依赖收集 
        if (!isReadyonly) {
            // 依赖收集
            track(target, key);
        }
        return res;
    }
}

function createSetter() {
    return function (target, key, value) {
        const res = Reflect.set(target, key, value);

        // 触发依赖
        trigger(target, key);
        return res;
    }
}

export const mutableHandles = {
    get: get,
    set: set,
}

// readonly 因没有set功能 所以也不需要进行依赖收集 
export const readonlyHandles = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key:${key} set 失败 因为 target 是 readonly`, target)
        return true;
    }
}