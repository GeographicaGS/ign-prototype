'use strict';

App.View.Header = Backbone.View.extend({
    
    _template : _.template( $('#header-header_template').html() ),
    
    initialize: function() {
        this.render();
    },

    events: {
        // 'click .download_link .arcgis' : 'donwloadArcgis'
    },

    // donwloadArcgis:function(){
    // 	alert('');
    // },
    
    onClose: function(){
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    }
});