"use strict";

var app = app || {};

App.Router = Backbone.Router.extend({
   
    /* define the route and function maps for this router */
     routes: {
        
        "" : "sidebar",

        "notfound" : "notfound",
        "error" : "error",
        "*other" : "notfound",
    },

    sidebar: function(){
        App.showView(new App.View.Sidebar());
    },

    notfound: function(){
        App.showView(new App.View.NotFound());
    },

    error: function(){
        App.showView(new App.View.Error());
    }
    
});