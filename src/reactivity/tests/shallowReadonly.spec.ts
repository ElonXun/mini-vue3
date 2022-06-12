import { isReadonly, shallowReadonly } from "../reactive";

describe('shallowReadonly', () => {
    it('shoud not make no-reactive properties reactive', () => {
        const props = shallowReadonly({ n: { foo: 1}});
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.n)).toBe(false);
    });

    it('shallowReadonly part two set warning ', () => {
        // mock 一个假的警告方法
        console.warn = jest.fn();

        const user = shallowReadonly({
            age: 10
        });

        user.age = 11;

        expect(console.warn).toBeCalled();
    });
});