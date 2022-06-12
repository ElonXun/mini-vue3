import { track, trigger } from './effect';
import { reactive, ReactiveFlags, readonly } from './reactive';
import { isObject, extend } from '../shared';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadyonly = false, shallow = false) {
    // for example
    // target {foo: 1}
    // key foo
    return function get(target, key) {
        // 判断是否是reactive 或 readonly的标志
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadyonly;
        }else if (key === ReactiveFlags.IS_READONLY) {
            return isReadyonly;
        }
        const res = Reflect.get(target, key);

        // shallow 标志时 直接返回 res
        if (shallow) {
            return res;
        }

        // 如果res 为Object则继续调用 reactive 或 readonly
        if (isObject(res)) {
            return isReadyonly? readonly(res) :reactive(res);
        }

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

export const shallowReadonlyHandles =  extend({}, readonlyHandles, {
    get: shallowReadonlyGet
})