import { extend} from '../shared';

let activeEffect;
let shouldTrack;

class ReactiveEffect {
    private _fn: any;
    public scheduler;
    deps = [];
    active = true;
    onStop?: () => void;
    constructor(fn, scheduler?){
        this._fn = fn;
        this.scheduler = scheduler;
    }

    run(){
        if (!this.active) {
            return this._fn();
        }

        // 应该收集依赖的标志
        shouldTrack = true;
        activeEffect = this;

        const result = this._fn();
        // 重置  shouldTrack
        shouldTrack = false;
        return result;
    }

    stop(){
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}

function cleanupEffect(effect) {
    // dep 类型为 Set   
    // Set数据类型 调用 delete 删除 传进stop的effect 自身 而不是全清空deps
    effect.deps.forEach((dep:any) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}

const targetsMap = new Map();
export function track(target, key){
    if (!isTracking()) return;
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
    // 如果dep已经有activeEffect了 就无需在add （Set类型 本身是会自动忽略重复元素的）
    if (dep.has(activeEffect)) return;
    dep.add(activeEffect);
    // activeEffect 反向收集deps
    activeEffect.deps.push(dep);
} 

// 判断是否收集依赖中
function isTracking(){
    return shouldTrack && (activeEffect !== undefined);
}


export function trigger(target, key){
    let depsMap = targetsMap.get(target);
    let dep = depsMap.get(key);
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }else {
            effect.run();
        }
    }
}

export function effect(fn, options:any = {}){

    const scheduler = options.scheduler;
    const _effect = new ReactiveEffect(fn, scheduler);
 
    // options extend
    // _effect.onStop = options.onStop;
    extend(_effect, options)

    _effect.run();

    const runner:any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner){
    runner.effect.stop();
}