import {defineComponent, ref} from 'vue'

// https://github.com/antfu/reactivue

export const HelloWorld = defineComponent({
    props: {msg: String},
    setup(props) {
        const count = ref(0)

        const inc = () => {
            count.value++;
        };

        return () => (
            <>
                <h1>{props.msg}</h1>
                <div className="card">
                    <button type="button" onClick={inc}>
                        count is {count.value}
                    </button>
                    <p>
                        Edit
                        <code>components/HelloWorld.vue</code> to test HMR
                    </p>
                </div>

                <p>
                    Check out
                    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
                    >create-vue</a
                    >, the official Vue + Vite starter
                </p>
                <p>
                    Learn more about IDE Support for Vue in the
                    <a
                        href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
                        target="_blank"
                    >Vue Docs Scaling up Guide</a
                    >.
                </p>
                <p className="read-the-docs">Click on the Vite and Vue logos to learn more</p>
            </>
        )
    }
})
