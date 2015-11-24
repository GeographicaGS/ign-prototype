'use strict';

App.View.Map = Backbone.View.extend({
    
    _template : _.template( $('#map-map_template').html() ),
    
    initialize: function() {

		this.map = new L.Map('map', {
			center: [40,-5],
			zoom: 6,
			zoomControl : false,
			minZoom : 2
		});

		new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		}).addTo(this.map);

		this.currentLayer = null;

        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    },

    show_roads:function(){

    	var opts = {
		  user_name: App.config.CARTO_NAME,
		  type: 'cartodb',
		  sublayers: [
			  {
			    sql: "SELECT * FROM road_routes", 
			    cartocss: $('#road_routes_css').html()
			  }
		  ]
		};

    	this._show_layer(opts);
    },

    show_parks:function(){

    	var opts = {
		  user_name: App.config.CARTO_NAME,
		  type: 'cartodb',
		  sublayers: [
		  		{
			    sql: "SELECT * FROM park_boundary", 
			    cartocss: $('#park_boundary_css').html()
			  },
			  {
			    sql: "SELECT * FROM route_park", 
			    cartocss: $('#route_park_css').html()
			  }
		  ]
		};

		this._show_layer(opts);
    },

    _show_layer:function(opts){
    	if(this.currentLayer){
    		this.currentLayer.remove()
    	}
    	var _this = this;
    	cartodb.createLayer(this.map,opts).addTo(this.map).on('done', function(layer) {
    		_this.currentLayer = layer;
    	});
    }

});