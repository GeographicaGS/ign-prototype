'use strict';

var ENTER_KEY = 13;

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  
  if (this.onClose){
    this.onClose();
  }
}

String.prototype.endsWith = function(suffix) {
   return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

App.events = {};

_.extend(App.events , Backbone.Events);

App.events.on("menu", function(id){
    app.$menu.find('li').removeClass('selected');
    app.$menu.find('[data-menu='+id+']').closest('li').addClass('selected');
});


$(function() {
    $(document).ajaxError(function(event, jqxhr) {
        if (jqxhr.status == 404) {
            App.router.navigate('notfound',{trigger: true});
        } 
        else {
            App.router.navigate('error',{trigger: true});
        }
    });

    $('body').on('click','a',function(e){
        var attr = $(this).attr('jslink'),
            href = $(this).attr('href');

        if (attr!= undefined && attr!='undefined'){
            e.preventDefault();
            if (href=='#back') {
                history.back();
            }
            App.router.navigate($(this).attr('href'),{trigger: true});
        }
    });

   
    App.ini();
   

    $(document).resize(function(){
        App.resizeMe();
    });
    
});

App.resizeMe = function(){
    
};

App.ini = function(){

    this.lang = 'es';
    
    this.router = new App.Router({ });

    this.$main = $('main');

    this.mapView = new App.View.Map();
    $('#map_container').append(this.mapView.el);

    $('header').append(new App.View.Header().el);

    Backbone.history.start({pushState: true});

    this.resizeMe();

    
};

App.showView = function(view) {

    if (this.currentView){
      this.currentView.close();
    }
 
    this.currentView = view;
 
    this.$main.html(this.currentView.el);
    this.scrollTop();
}


App.scrollTop = function(){
    var body = $('html, body');
    body.animate({scrollTop:0}, '500', 'swing', function() { 
       
    });
}

App.scrollToEl = function($el){
    $('html, body').animate({
        scrollTop: $el.offset().top
    }, 500);    
}

App.nl2br = function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

App.slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

App.getBrowserInfo = function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

App.formatNumber = function (n,decimals){

    if (n===null){
        return "--";
    }

    if (decimals ===null || decimals === undefined){
        decimals = 2;
    }

    if (typeof n == "number"){
        return parseFloat(sprintf("%."+ decimals + "f",n)).toLocaleString(this.lang, {
            style: 'decimal', 
            minimumFractionDigits: decimals
        });
    }
    else{
        
        if (n.indexOf(".") != -1){
            n = sprintf("%."+ decimals + "f",n);
            return parseFloat(n).toFixed(decimals).toLocaleString(this.lang, {
                style: 'decimal', 
                minimumFractionDigits: decimals
            });   
        }
        else{
            return parseInt(n).toLocaleString(this.lang, {
                style: 'decimal', 
                minimumFractionDigits: decimals 
            });
        }    
    }
};
