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

		this.currentLayer = Array();
		this.wmsLayer = Array();

        this.render();
    },

    events: {
        'mousemove input[type="range"]' : 'changeLong',
        'change input[type="range"]' : 'filterLong',
        'change select' : 'filterDifficulty',
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    },

    changeLong:function(e){
    	this.$('input[type="text"]').val(App.formatNumber($(e.currentTarget).val()));
    },

    filterLong:function(e){
    	var longitude = $(e.currentTarget).val();
    	this.$('select').val('elevacion_media >0');
    	
    	this.currentLayer[this.currentLayer.length - 1].getSubLayer(0).setSQL('select * from ' + App.config.DATASET_CARTO_NAME + '.' + this.currentTable + ' where longitud <=' + longitude);
    },

    filterDifficulty:function(e){
    	var elevation = $(e.currentTarget).val();
    	var longitude = this.$('input[type="range"]').attr('max');
    	this.$('input[type="range"]').val(longitude);
		this.$('input[type="text"]').val(App.formatNumber(longitude));

    	this.currentLayer[this.currentLayer.length - 1].getSubLayer(0).setSQL('select * from ' + App.config.DATASET_CARTO_NAME + '.' + this.currentTable + ' where ' + elevation);
    },

    add_wms_layer:function(server,name,title){
    	
    	var layer = L.tileLayer.wms(server, {
			layers: name,
			format: 'image/png',
			transparent: true,
			title:title,
			zIndex:1
		});
		layer.addTo(this.map);

		this.wmsLayer.push(layer);
		var a = 0;

    },

    remove_wms_layer:function(id){
    	this.map.removeLayer(this.wmsLayer[id]);
    	this.wmsLayer.splice(id,1);
    },

    show_roads:function(){
		var _this = this;
		this._remove_current_layers();
		this.currentTable = 'road_routes';

		$.getJSON('https://'+ App.config.DATASET_CARTO_NAME +'.cartodb.com/api/v2/sql/?q='+ 'SELECT min(longitud) as min, max(longitud) as max FROM ' + this.currentTable, 
			function(data) {
	  		$.each(data.rows, function(key, val) {
	  			_this.$('input[type="range"]').attr('min', val.min);
	  			_this.$('input[type="range"]').attr('max', 67000);
	  			_this.$('input[type="range"]').val(67000);
	  			_this.$('input[type="text"]').val(App.formatNumber(67000));
	  			_this.$('select').val('elevacion_media >0');

	  			_this.$('select').removeClass('hide');
				_this.$('input[type="text"]').removeClass('hide');
				_this.$('input[type="range"]').removeClass('hide');

			    _this._add_layer('http://' + App.config.VIZ_CARTO_NAME + '.cartodb.com/api/v2/viz/757dc916-9353-11e5-9d5b-0e31c9be1b51/viz.json', true, null);
		  	});
		});

  		
    },

    show_parks:function(){
    	var _this = this;
    	this._remove_current_layers();
    	this.currentTable = 'route_park';
		
		$.getJSON('https://'+ App.config.DATASET_CARTO_NAME +'.cartodb.com/api/v2/sql/?q='+ 'SELECT min(longitud) as min, max(longitud) as max FROM ' + this.currentTable, 
			function(data) {
	  		$.each(data.rows, function(key, val) {
	  			_this.$('input[type="range"]').attr('min', 0);
	  			_this.$('input[type="range"]').attr('max', Math.floor(val.max + 1));
	  			_this.$('input[type="range"]').val(Math.floor(val.max + 1));
	  			_this.$('input[type="text"]').val(App.formatNumber(Math.floor(val.max + 1)));
			    _this.$('select').val('elevacion_media >0');

				_this.$('select').removeClass('hide');
				_this.$('input[type="text"]').removeClass('hide');
				_this.$('input[type="range"]').removeClass('hide');

			    _this._add_layer('http://' + App.config.VIZ_CARTO_NAME + '.cartodb.com/api/v2/viz/6eadb29e-934f-11e5-9195-0ea31932ec1d/viz.json', false, null);
				_this._add_layer('http://' + App.config.VIZ_CARTO_NAME + '.cartodb.com/api/v2/viz/20f4ae50-9353-11e5-a3e8-0e31c9be1b51/viz.json', true, null);
		  	});
		});

    },

    show_wms_layers:function(){
    	// this._remove_current_layers();
    	// $(this.wmsLayer).each(function(index, el) {
    	// 	el.setOpacity(1);
    	// });

    	this.$('select').addClass('hide');
    	this.$('input[type="text"]').addClass('hide');
    	this.$('input[type="range"]').addClass('hide');
    },

    fitToRoute:function(id){
    	var _this = this;
    	$.getJSON('https://'+ App.config.DATASET_CARTO_NAME +'.cartodb.com/api/v2/sql/?q='+ 'select st_ymin(the_geom) as latMin, st_ymax(the_geom) as latMax, st_xmin(the_geom) as lngMin, st_xmax(the_geom) as lngMax, ST_X(ST_Centroid(the_geom)) as lngCenter, ST_Y(ST_Centroid(the_geom)) as latCenter FROM ' + this.currentTable + ' where cartodb_id=' + id, 
			function(data) {
	  		$.each(data.rows, function(key, val) {
	  			_this.map.fitBounds([[val.latmin, val.lngmin],[val.latmax, val.lngmax]])
	  			setTimeout(function(){ 
	  				_this.currentLayer[_this.currentLayer.length-1].trigger('featureClick', null, [val.latcenter,val.lngcenter], null, { cartodb_id: id }, 0);
	  			 }, 500);
		  	});
		});
    },


    centerMap:function(){
    	this.map.setView([40,-5],6);
    },

    _add_layer:function(url,legend,sql){

    	var _this = this;
    	cartodb.createLayer(this.map,url, {'legends' : legend, 'zIndex':2}).addTo(this.map).on('done', function(layer) {
    		if(sql){
    			layer.getSubLayer(0).setSQL(sql);
    		}
    		_this.currentLayer.push(layer);
    	});
    },

    _remove_current_layers:function(){
    	$(this.currentLayer).each(function(index, el) {
    		el.getSubLayer(0).hide();
    		el.remove();
    	});
    	this.currentLayer = Array();

    	// $(this.wmsLayer).each(function(index, el) {
    	// 	el.setOpacity(0);
    	// });

    },

});