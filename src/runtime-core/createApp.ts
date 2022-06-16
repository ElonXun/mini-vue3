
export function createApp(rootComponent) {


    return {
        mount(rootContainer) {

            // 先转换成 vnode
            // component -> vnode
            // 所有的逻辑操作 都基于 vnode 去做处理

            const vnode = createVNode(rootComponent);
        }
    }
}