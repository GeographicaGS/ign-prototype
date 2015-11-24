'use strict';

App.View.Sidebar = Backbone.View.extend({
    
    _template : _.template( $('#sidebar-sidebar_template').html() ),
    
    initialize: function() {
    	App.mapView.show_roads();
        
        this.collection = new App.Collection.Indicators();

        this.collection.url = this.collection.baseUrl + 'SELECT road.name, route_name, road_routes.cartodb_id as route_id  FROM road inner join road_routes on id_road=road.cartodb_id order by road.name, road.name'

        this.listenTo(this.collection,"reset",this.render);

        this.collection.fetch({"reset": true})
    },

    events: {
        'click nav ul li a' : 'changeView',
        'click .indicator_list li' : 'toggleLayers',
    },

    changeView:function(e){
    	e.preventDefault();
    	var option = $(e.currentTarget).attr('href');;
    	if(option == 'road'){
    		App.mapView.show_roads();
    	}else if(option == 'park'){
    		App.mapView.show_parks();
    	}
    	to
    },

    toggleLayers:function(e){
    	$(e.currentTarget).next('.layer_list').toggleClass('hide');
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
    			aux.routes.push({'name':el.route_name, 'id':'el.route_id'})

    		}else{
    			aux.routes.push({'name':el.route_name, 'id':'el.route_id'})
    		}

    	});
    	aux.name = current;
		indicators.push(aux);
        
        this.$el.html(this._template({
            indicators : indicators
        }));
        return this;
    }
});