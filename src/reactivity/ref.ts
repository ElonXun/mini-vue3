import { trackEffects, triggerEffects, isTracking } from "./effect";


class RefImpl {
    private _value: any;
    public dep;
    constructor(value){
        this._value = value;
        this.dep = new Set();
    }

    get value(){
        if (isTracking()) {
            trackEffects(this.dep);
        }
        return this._value;
    }

    set value(newValue){
        // 先修改value值 再去触发依赖
        this._value = newValue;
        triggerEffects(this.dep);
    }
}


export function ref (value) {
    return new RefImpl(value);
}