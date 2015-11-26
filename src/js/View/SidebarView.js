'use strict';

App.View.Sidebar = Backbone.View.extend({
    
    _template : _.template( $('#sidebar-sidebar_template').html() ),
    _road_route_query: 'SELECT road.name, route_name, road_routes.cartodb_id as route_id  FROM road inner join road_routes on id_road=road.cartodb_id order by road.name, road_routes.route_name',
    _park_routes_query: 'SELECT park.name, route_name, route_park.cartodb_id as route_id  FROM park inner join route_park on id_park=park.cartodb_id order by park.name, route_park.route_name',

    _donwload_road_route_query: 'SELECT road.name as camino, route_name as ruta, road_routes.the_geom FROM road inner join road_routes on id_road=road.cartodb_id order by road.name, road_routes.route_name',
    _donwload_park_routes_query: 'SELECT park.name as parque, route_name as ruta, route_park.the_geom FROM park inner join route_park on id_park=park.cartodb_id',
    
    initialize: function() {
    	App.mapView.show_roads();
        
        this.collection = new App.Collection.Indicators();

        this.collection.url = this.collection.baseUrl + this._road_route_query

        this.listenTo(this.collection,"reset",this.render);

        this.collection.fetch({"reset": true})
    },

    events: {
        'click nav ul li .nav' : 'changeView',
        'click .indicator_list li' : 'toggleLayers',
        'click .add_wms' : 'addWms',
        'click .delete_wms' : 'deleteWms',
        'click .layer_list span' : 'gotToRoute',
    },

    changeView:function(e){
    	e.preventDefault();
    	App.mapView.centerMap();
    	
    	var option = $(e.currentTarget).attr('href');;
    	if(option == 'road'){
    		App.mapView.show_roads();
    		this.collection.url = this.collection.baseUrl + this._road_route_query
    		this.collection.fetch({"reset": true})
    	}else if(option == 'park'){
    		App.mapView.show_parks();
    		this.collection.url = this.collection.baseUrl + this._park_routes_query
    		this.collection.fetch({"reset": true})

    	}else if(option == 'wms'){
    		App.mapView.show_wms_layers();
    		this.collection.reset();
    		this.render_wms();
    	}
    },

    toggleLayers:function(e){
    	$(e.currentTarget).next('.layer_list').toggleClass('hide');
    	$(e.currentTarget).toggleClass('active');
    },

    addWms:function(e){
    	e.preventDefault();
    	var _this = this;
    	$.fancybox($("#fancy_wms_url"), {
			'width':'600',
			"height": "auto",
		    'autoDimensions':false,
		    'autoSize':false,

		    afterShow: function () {
		    	var element = $(this.element);
		    	$(this.element).find('button').unbind("click").click(function(event) {
		    		element.find('.explore').removeClass('hide');
		    		element.find('.error').addClass('hide');
		    		element.find('.wms_list').children().remove();
		    		var server = element.find('input').val() 
		    		// if(server.lastIndexOf("?") >= 0){
		    			if(server.lastIndexOf("?") >= 0){
			            	server = server.slice(0,server.lastIndexOf("?"));
			        	}
			            var url = ((server.lastIndexOf("/") == server.length-1)? server.slice(0,-1):server) + "?REQUEST=GetCapabilities&SERVICE=wms";
			            $.ajax({
	                        url : App.config.PROXY_PATH + encodeURIComponent(url),
	                        // data: { "url": url},
	                        dataType: 'xml',
	                        // type: "POST",  
	                        global: false,         
	                        success: function(xml) {
	                            if(xml){
	                                var layerPadre = $(xml).find("Layer")[0];
	                                var version = $($(xml).find("*")[0]).attr("version");

	                                var html = '<ul>';
	                                
	                                var keyLayerName;
	                                
	                                keyLayerName = "Name"
	                                $(xml).find("Capability > Layer").each(function(){
	                                    $(this).find("Layer").each(function(){
	                                        if($($(this).find("SRS")).text().indexOf("900913") > 0 || $($(this).find("SRS")).text().indexOf("3857")>0 || $(layerPadre).find("SRS").text().indexOf("900913") > 0 || $(layerPadre).find("SRS").text().indexOf("3857")){
	                                            html += _this._createHtmlExternalService($(this).find("Layer > " + keyLayerName).text(),$(this).find("Layer > Title").text(),$(this).find("Layer > Abstract").text());
	                                        }else{
	                                            element.find('.error').removeClass('hide');
	                                        }
	                                    });
	                                });
	                                html += '</ul>';
	                                
	                                element.find('.wms_list').html(html);
	                                $.fancybox.update();

	                                element.find('.wms_list li').unbind("click").click(function(){
										App.mapView.add_wms_layer(server,$(this).find('span').text(), $(this).find('h3').text());
										_this.render_wms();
	                                    $.fancybox.close();
   	                                });
	                                
	                            }else{
	                                element.find('.error').removeClass('hide');
	                            }
	                            element.find('.explore').addClass('hide');
	                        },
	                        error: function(e){
	                            element.find('.error').removeClass('hide');
	                            element.find('.explore').addClass('hide');
	                        }
	                    });
			        // }
		    	});
		    }
		    	
		});
    },

    deleteWms:function(e){
    	var id = $(e.currentTarget).closest('li').attr('id_layer');;
    	App.mapView.remove_wms_layer(id);
    	this.render_wms();
    },

    gotToRoute:function(e){
    	App.mapView.fitToRoute($(e.currentTarget).attr('route_id'));
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
    	var json = this.collection.toJSON(),
    		indicators = Array(),
    		current = null,
    		aux = {'name' : '', 'routes' : Array()};

    	$(json).each(function(index, el) {
    		if(current != el.name){
    			if(current){
    				aux.name = current;
    				indicators.push(aux);
    			}

    			current = el.name;
    			aux = {'name' : '', 'routes' : Array()}
    			aux.routes.push({'name':el.route_name, 'id':el.route_id})

    		}else{
    			aux.routes.push({'name':el.route_name, 'id':el.route_id})
    		}

    	});
    	aux.name = current;
		indicators.push(aux);
        
        this.$el.html(this._template({
        	cartoName: App.config.DATASET_CARTO_NAME,
            indicators : indicators,
            wmsLayers: Array(),
            donwload_road_route_query: this._donwload_road_route_query,
            donwload_park_routes_query: this._donwload_park_routes_query
        }));

        this.$('.add_wms').addClass('hide');

        return this;
    },

    render_wms:function(){
    	var wmsLayers = Array();
    	$(App.mapView.wmsLayer).each(function(index, el) {
    		wmsLayers.push({'id':index, 'name': el.wmsParams.title})
    	});

    	this.$el.html(this._template({
    		cartoName: App.config.DATASET_CARTO_NAME,
            indicators : Array(),
            wmsLayers: wmsLayers,
            donwload_road_route_query: this._donwload_road_route_query,
            donwload_park_routes_query: this._donwload_park_routes_query
        }));

        this.$('.add_wms').removeClass('hide');

		return this;
    },


    _createHtmlExternalService: function(name,title,abstract){
        var html =
            '<li>' +
                '<span>' + name + '</span>' +
                '<h3>' + title + ' - </h3>' +
                '<p>' + ((abstract != "null") ? abstract : '') + '</p>' +
            '</li>';

        return html;
    }
});