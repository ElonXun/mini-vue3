

export const App = {
    // .vue
    // 非 <template></template> 模式
    // render
    render(){
        return h("div", "hi, " + this.msg);
    },
    setup(){
        // composition api

        return {
            msg: "mini-vue3",
        }
    }
}