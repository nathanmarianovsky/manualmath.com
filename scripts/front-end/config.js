require.config({
    baseUrl: "",
    paths: {
        app: "/scripts/front-end",
        dist: "/scripts/dist",
        lib: "/node_modules",
        jquery: "/node_modules/jquery/dist/jquery.min",
        materialize: "/bower_components/materializecss-amd/dist/materialize.amd.min",
        router5: "/scripts/dist/router5-min",
        mathjax: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML"
    },
    shim: {
        materialize: {
            exports: "Materialize",
            deps: ["jquery"]
        },
        mathjax: {
            exports: "MathJax",
            init: function () {
                MathJax.Hub.Config({
                    tex2jax: {inlineMath: [["$","$"], ["\\(","\\)"]]}
                });
                MathJax.Hub.Startup.onload();
                return MathJax;
            }
        }
    }
});

require(["dist/main-min"]);