// Map = {
	
// 	layers: [],
// 	markers: {},
// 	iniLat: 37.08640561029597,
// 	iniLng: -5.3276824951171875,	
// 	iniZoom: 10,
// 	__map:null,
// 	featureApplies: null,
// 	featureIndicators: null,
// 	maxIndicatorRadius: 100,
	
// 	initialize: function(){
// 		$("#map").outerHeight($("#map").outerHeight()-$("footer").outerHeight());
			
// 			this.__map = new L.Map('map', {
// 				  center: new L.LatLng(this.iniLat, this.iniLng),
// 				  zoom: this.iniZoom,
// 				  fadeAnimation: false,
// 				  zoomControl: false,
// 				  attributionControl: true
// 			});

// 			var zoomControl = new L.Control.Zoom({
// 				position : 'topright'
// 			});		
		
// 			zoomControl.addTo(this.__map);
			
// 			// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// 			//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// 			// }).addTo(this.__map);
// 			var ggl = new L.Google('ROADMAP');
// 			// var ggl = new L.Google('SATELLITE');
// 			// var ggl = new L.Google('HYBRID');
// 			this.__map.addLayer(ggl);
// 			this.featureApplies = L.markerClusterGroup({spiderfyOnMaxZoom: true, showCoverageOnHover: false,
// 				iconCreateFunction: function(cluster) {
// 					var markers = cluster.getAllChildMarkers();
// 					var n = 0;
// 					for (var i = 0; i < markers.length; i++) {
// 						n++;
// 					}
// 					return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
// 				}
// 			});
// 			this.featureIndicators = L.featureGroup();

// 			var activeMenu = $('.main-nav li.active').attr('menu')
// 			if(activeMenu == 1){
// 				this.featureApplies.addTo(this.__map);
// 			}else if(activeMenu == 2){
// 				this.featureIndicators.addTo(this.__map);
// 			}
// 	},

// 	drawApplies:function(rows){
// 		this.featureApplies.clearLayers();
// 		$(rows).each(function(index, row) {
// 			if(!row.coord_x || !row.coord_y){
// 				row.coord_x = row.coord_x_m;
// 				row.coord_y = row.coord_y_m;
// 			}

// 			var styleAccept = 	{
// 									radius: 10,
// 									fillColor: "#009e68",
// 									color: "#ffffff",
// 									weight: 1,
// 									opacity: 0.8,
// 									fillOpacity: 1
// 								};

// 			var styleNotAccept = 	{
// 										radius: 10,
// 										fillColor: "#8a9197",
// 										color: "#ffffff",
// 										weight: 1,
// 										opacity: 0.8,
// 										fillOpacity: 1
// 									};

// 			var stylePending = 	{
// 										radius: 10,
// 										fillColor: "#018be2",
// 										color: "#ffffff",
// 										weight: 1,
// 										opacity: 0.8,
// 										fillOpacity: 1
// 									};


// 			if(row.coord_x && row.coord_y){
// 				var marker = L.circleMarker([row.coord_y, row.coord_x], (row.estado == 'Aprobado y finalizado' ? styleAccept: (row.estado == 'Pendiente' ? stylePending:styleNotAccept)));

// 				marker.bindPopup('<div class="header"><span>Expediente<br></span>' + row.solicitud + ' ' + row.denominacion + '</div>' +
//                            '<div class="content"><a jslink href=program/' + App.programView.current + '/apply/' + row.id + '>Ver datos<br></a></div>', {className: 'apply_poup'});

// 				marker.on('mouseover', function (e) {
// 		            this.openPopup();
// 		        });
				
// 				Map.featureApplies.addLayer(marker);
// 			}
// 		});
// 	},

// 	drawIndicators:function(data,keyValue,title){
// 		this.getMap().setView([this.iniLat,this.iniLng],this.iniZoom);
// 		this.featureIndicators.clearLayers();
// 		var _this = this;
// 		var maxValue = 1;
// 		var style = 	{
// 								// radius: 10,
// 								fillColor: "#b13330",
// 								color: "#b13330",
// 								weight: 1,
// 								opacity: 1,
// 								fillOpacity: 0.8
// 							};
// 		$.each(data, function(){
// 			var value = parseFloat(this[keyValue]);
// 			if(value > maxValue){
// 				maxValue = value;
// 			}
// 		});

// 		$.each(data, function(){
// 			var name = title;
// 			if(this['#0#y'] && this['#0#x']){
				
// 				$.each(this, function(key, value){
// 					if(key!='#0#y' && key!='#0#x' && key!=keyValue){
// 						name = title + ' - ' + value;
// 					}
// 				});
				
// 				style.radius = (this[keyValue] * _this.maxIndicatorRadius)/maxValue;
// 				var marker = L.circleMarker([this['#0#y'], this['#0#x']], style);

// 				marker.bindPopup('<div class="content">' + name + ': ' + this[keyValue] + '</div>', {className: 'apply_poup'});

// 				marker.on('mouseover', function (e) {
// 		            this.openPopup();
// 		        });
// 		        // marker.on('mouseout', function (e) {
// 		        //     this.closePopup();
// 		        // });

// 				_this.featureIndicators.addLayer(marker);
// 			}
// 		});
// 	},

// 	drawTowns:function(towns){
// 		var geoJSON = Array();
// 		var coordinates;

// 		var style = {
// 		    "color": "#566163",
// 		    "weight": 1,
// 		    "opacity": 0.8
// 		};

// 		$.each(towns, function(){
// 			coordinates = JSON.parse(this.geom).coordinates;
// 			if(coordinates.length > 0){
// 				geoJSON.push({
// 					'type': 'Feature',
// 					'properties': {
// 						'name':this.name
// 					},
// 					'geometry': {
// 						'type': "Polygon",
// 	        			'coordinates': coordinates
// 					}
// 				});
// 			}
// 		});

// 		L.geoJson(geoJSON,{
// 			style: style,
// 			onEachFeature: onEachFeature
// 		}).addTo(this.__map);


// 	},

// 	getMap: function() {
// 		return this.__map;
// 	}
// }


// function onEachFeature(feature, layer) {
//     if (feature.properties && feature.properties.name) {
//         layer.bindPopup('<div class="header" style="border:none;"><span>Municipio:<br></span>' + feature.properties.name + '</div>', {className: 'apply_poup'});
//     }
// }



