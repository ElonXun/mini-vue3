

class ReactiveEffect {
    private _fn: any;
    constructor(fn){
        this._fn = fn;
    }

    run(){
        activeEffect = this;
        this._fn();
    }
}

const targetsMap = new Map();
export function track(target, key){
    // new Map    
    // target -> key(每个对象中 key 对应的 依赖数组deps)
    //           new Map
    //           key -> dep(new Set)

    let depsMap = targetsMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetsMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep  = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect);
} 

export function trigger(target, key){
    let depsMap = targetsMap.get(target);
    let dep = depsMap.get(key);
    for (const effect of dep) {
        effect.run();
    }
}

let activeEffect;
export function effect(fn){
    const _effect = new ReactiveEffect(fn);
    _effect.run();
}