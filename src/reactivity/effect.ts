import { extend} from '../shared';

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
        activeEffect = this;
        return this._fn();
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
    effect.deps.forEach((dep:any) => {
        dep.delete(effect);
    });
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

    if(!activeEffect) return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
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

let activeEffect;
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