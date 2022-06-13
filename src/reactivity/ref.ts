import { trackEffects, triggerEffects, isTracking } from "./effect";
import { hasChanged, isObject } from "../shared"; 
import { reactive } from "./reactive";

// ref 主要针对 单个值 string number boolean 监听 
// reactive 主要是利用 object进行 proxy  不适用于单个string number boolean 的值监听
class RefImpl {
    private _value: any;
    public dep;
    private _rawValue: any;
    constructor(value){
        this._rawValue = value;
        // 如果value是Object类型  先要把value值用reactive进行转化    
        this._value = convert(value);

        this.dep = new Set();
    }

    get value(){
        trackRefValue(this);
        return this._value;
    }

    set value(newValue){
        // 如果newValue 和 oldValue 相同直接返回
        // 注意 对比时 如果ref传入的是Object newValue(Object)和this._value(Proxy)为复杂对象 
        if (hasChanged(newValue, this._rawValue)) {
            // 先修改value值 再去触发依赖
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }

    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref){
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}

export function ref (value) {
    return new RefImpl(value);
}