'use strict';

App.Collection.Indicators = Backbone.Collection.extend({
	baseUrl: 'https://' + App.config.DATASET_CARTO_NAME + '.cartodb.com/api/v2/sql?q=',
	url: 'https://' + App.config.DATASET_CARTO_NAME + '.cartodb.com/api/v2/sql?q=',

    initialize: function(models, options) {
    	
    },

    parse: function(response){
        return response.rows;
    }

    
});