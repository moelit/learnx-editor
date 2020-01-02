exports.install = function (Vue) {
    const CryptoJS = require("crypto-js");
    const OSS = require('ali-oss');

    const prefix = "LearnX:";

    Vue.prototype.$site = {
        name: "",
        url: "",
        language: "",
        platform: null,
        ready: false,
        index: {
            name: "",
            language: "",
            version: 1,
            posts: []
        }
    };

    const site = Vue.prototype.$site;
    const index = Vue.prototype.$site.index;

    //==============================================================
    //index
    //==============================================================


    function init(name, language, posts) {
        index.name = name;
        index.language = language;
        if (Array.isArray(posts)) {
            index.posts = posts;
        }
        site.ready = true;
    }

    function add(id, type, banner, title, summary, keys, vip) {
        const obj = {id, type, banner, title, summary, keys};
        if(vip) obj.vip = 1;
        index.posts.unshift(obj);
    }

    function del(id) {
        index.posts = index.posts.filter(function(post){
            return post.id !== id;
        });
    }

    function get(id) {
        for(let i=0; i< index.posts.length; i++) {
            const post = index.posts[i];
            if(post.id === id) {
                return post;
            }
        }
    }

    function update(id, banner, title, summary, keys, vip) {
        for(let i=0; i< index.posts.length; i++) {
            const post = index.posts[i];
            if(post.id === id) {
                post.banner = banner;
                post.title = title;
                post.summary = summary;
                post.keys = keys;
                if(vip) {
                    post.vip = 1;
                } else if(post.vip) {
                    delete post.vip;
                }
                post.etime= Date.now();
                return;
            }
        }
    }

    Vue.prototype.$index = {init, add, del, get, update};

    //==============================================================
    //token
    //==============================================================
    const platforms = {
        "aliyun OSS": {
            require: {
                region: "",
                bucket: "",
                accessKeyId: "",
                accessKeySecret: "",
            },
            help: "https://help.aliyun.com/document_detail/64047.html?spm=a2c4g.11174283.6.1241.4bd17da2Rixuth",
            upload : async (filepath, file, isvip) => {
                const require = platforms["aliyun OSS"].require;

                const temp = console.warn;
                console.warn = () => {};
                //todo VIP permissions

                const client = new OSS({
                    region: require.region,
                    accessKeyId: require.accessKeyId,
                    accessKeySecret: require.accessKeySecret,
                    bucket: require.bucket
                });

                let result = Buffer.isBuffer(file) ? await client.put(filepath, file) :
                    await client.put(filepath, file);

                console.warn = temp;
                return result;
            },

            del : async (filepath) => {
                const require = platforms["aliyun OSS"].require;

                const temp = console.warn;
                console.warn = () => {};

                const client = new OSS({
                    region: require.region,
                    accessKeyId: require.accessKeyId,
                    accessKeySecret: require.accessKeySecret,
                    bucket: require.bucket
                });

                await client.delete(filepath);

                console.warn = temp;
            }
        }
    };

    const build = function (name, url, language, platform_name, platform_require, password) {
        const token_obj = { name, url, language, platform_name, platform_require };
        return prefix + CryptoJS.AES.encrypt(JSON.stringify(token_obj), password).toString();
    };

    const bind = function(token_txt, password) {
        if(token_txt && token_txt.startsWith(prefix)) {
            try {
                const bytes  = CryptoJS.AES.decrypt(token_txt.substring(prefix.length), password);
                const token_obj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                site.name = token_obj.name;
                site.url = token_obj.url.endsWith("/") ? token_obj.url : token_obj.url + "/" ;
                site.language = token_obj.language;
                site.platform = platforms[token_obj.platform_name];
                site.platform.require = token_obj.platform_require;
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    const clear = function() {

        site.name = "";
        site.url = "";
        site.language = "";
        if(site.platform) {
            Object.getOwnPropertyNames(site.platform.require).forEach((name) => {
                site.platform.require[name] = "";
            });
        }
        site.platform = null;
        site.ready = false;
    };

    Vue.prototype.$token = {
        platforms, build, bind, clear
    }
};