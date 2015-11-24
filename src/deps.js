var deps = {};

deps.templateFolder = 'js/template';

deps.JS = [
    'js/lib/jquery-2.1.4.js',
    'js/lib/underscore-1.8.3.js',
    'js/lib/backbone-1.2.0.js',


    // Namespace
    'js/Namespace.js',
    'js/Config.js',
    "js/Map.js",
   
    
    // --------------------
    // ------  Views ------
    // --------------------
    'js/View/SidebarView.js',
    'js/View/MapView.js',
    'js/View/ErrorView.js',
    'js/View/NotFoundView.js',
    

    // --------------------
    // ------  Models ------
    // --------------------
    

    // --------------------
    // ------  Collections ------
    // --------------------
    'js/collection/IndicatorCollection.js',
    
    
    // router
    'js/Router.js',
    // app
    'js/App.js'
];



deps.lessFile = 'css/styles.less';

if (typeof exports !== 'undefined') {
    exports.deps = deps;
}