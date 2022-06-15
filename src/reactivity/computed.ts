import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
    private _getter:any;
    private _dirty: boolean = true;
    private _value: any;
    private _effect:any;
    constructor(getter) {
        this._getter = getter;
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }

    get value(){
        // get 时通过 _dirty 来进行判断
        // 当依赖的响应式对象的值发生改变时需要 触发_dirty为 true 
        // get value -> _dirty true
        // 通过 effect来处理
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }
        return this._value;
    }
}



export function computed(getter){
    return new ComputedRefImpl(getter);
}