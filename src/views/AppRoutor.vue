<template>
  <component :is="is" v-if="render"></component>
</template>

<script>
    export default {
        name: "app-routor",
        props: {
            render: Boolean,
        },
        data() {
            return {
                is: null,
                page : this.$route.current
            }
        },
        watch: {
            page: {
                handler(val, oldVal) {
                    this.is = 'loading';

                    if(val.history) {
                        history.pushState({}, null,
                            val.name === 'home' ? "./" :
                                "./?" + val.name + (val.pointer ? "_" + val.pointer : ""));
                    }

                    setTimeout(()=> {
                        this.is = val.name;
                    }, 300);
                },
                deep: true
            }
        },
        created() {
            window.onpopstate(null);
        },
    }
</script>


