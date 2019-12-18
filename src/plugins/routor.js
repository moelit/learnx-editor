exports.install = function (Vue) {

    const views = require.context('../views', true, /[A-Za-z0-9-_,\s]+\.vue$/i);

    const pages = {};

    views.keys().forEach(key => {
        const component = views(key).default;
        //components[component.name] = item;
        Vue.component(component.name, component);

        if (!isNaN(component.index)) {
            pages[component.name] = component
        }
    });

    const current = { name: null, pointer: 0, history: true };

    const go = function(name, pointer) {
        load(name, pointer, true);
    };

    const load = function(name, pointer, history) {

        if(isNaN(pointer) || pointer < 0) pointer = 0;

        if(pages.hasOwnProperty(name)) {
            current.name = name;
            current.pointer = pointer;
            current.history = history;
        } else {
            current.name = 'home';
            current.pointer = 0;
            current.history = history;
        }
    };

    window.onpopstate = function (event) {
        let page_name = document.location.href.split("?")[1];
        let page_pointer = 0;
        if(page_name && page_name.indexOf("_") > 1) {
            const split = page_name.split("_");
            page_name = split[0];
            page_pointer = parseInt(split[1]);
            if(isNaN(page_pointer)) page_pointer = 0;
        }
        load(page_name, page_pointer, false);
    };

    Vue.prototype.$route = {
        current, pages, go, load
    };
};

