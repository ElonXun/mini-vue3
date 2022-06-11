import { readonly, isReadonly } from '../reactive';

describe('readonly', () => {
    it('readonly part one', () => {
        // 不能set 的时候去触发依赖

        const original = { foo:1, bar: { baz: 2}};
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(original)).toBe(false);
    });

    it('readonly part two set warning ', () => {
        // mock 一个假的警告方法
        console.warn = jest.fn();

        const user = readonly({
            age: 10
        });

        user.age = 11;

        expect(console.warn).toBeCalled();
    });
});