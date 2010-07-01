/*
    
  example:
    $('.slide-out-div').kingSlideTabs({
            tabHandle: '.handle',                         //class of the element that will be your tab -doesnt have to be an anchor
    });

   original version started by William Paoli: http://wpaoli.building58.com
*/


(function($){
  $.fn.kingSlideTabs = function(options) {
    var defaults = {
        tabHandle: '.handle',
        toggleButton: '.tab-opener',
        speed: 300,
        action: 'click',
        tabLocation: 'left',
        topPos: '200px',
        leftPos: '20px',
        fixedPosition: false,
        positioning: 'absolute',
        handleOffset: '0',
        onLoadSlideOut: false,
        onOpen: function(){},
        onClose: function(){}
      };
    var settings = $.extend({}, defaults, options);

    //scope to current object
    var obj = $(this),
        tab = obj.find(settings.tabHandle),
        toggleBtn = obj.find(settings.toggleButton);

    settings.positioning = (settings.fixedPosition === true) ? 'fixed' : 'absolute';

    //ie6 doesn't do well with the fixed option
    if (document.all && !window.opera && !window.XMLHttpRequest) {
      settings.positioning = 'absolute';
    }

    tab.css({
      'display': 'block',
      'textIndent' : '-99999px',
      'outline' : 'none',
      'position' : 'absolute'
    });

    obj.css({
      'line-height' : '1',
      'position' : settings.positioning
    });

    var props = { containerWidth: parseInt(obj.outerWidth(), 10) + 'px',
                  containerHeight: parseInt(obj.outerHeight(), 10) + 'px',
                  tabWidth: parseInt(tab.outerWidth(), 10) + 'px',
                  tabHeight: parseInt(tab.outerHeight(), 10) + 'px' };

    //set calculated css
    if(settings.tabLocation === 'top' || settings.tabLocation === 'bottom') {
      obj.css({'left' : settings.leftPos});
      tab.css({'right' : settings.handleOffset + 'px'});
    }

    if(settings.tabLocation === 'top') {
      obj.css({'top' : '-' + props.containerHeight});
      tab.css({'bottom' : '-' + props.tabHeight});
    }

    if(settings.tabLocation === 'bottom') {
      obj.css({'bottom' : '-' + props.containerHeight, 'position' : 'fixed'});
      tab.css({'top' : '-' + props.tabHeight});
    }

    if(settings.tabLocation === 'left' || settings.tabLocation === 'right') {
      obj.css({
          'height' : props.containerHeight,
          'top' : settings.topPos
      });

      tab.css({'top' : settings.handleOffset + 'px'});
    }

    if(settings.tabLocation === 'left') {
      obj.css({ 'left': '-' + props.containerWidth});
      tab.css({'right' : '-' + props.tabWidth});
    }

    if(settings.tabLocation === 'right') {
      obj.css({ 'right': '-' + props.containerWidth});
      tab.css({'left' : '-' + props.tabWidth});
      $('html').css('overflow-x', 'hidden');
    }

    /* functions for animation events */

    $(tab,toggleBtn).click(function(event){
      event.preventDefault();
    });   

    var slideIn = function() {
      var opts = {},
          loc = settings.tabLocation,
          val = ( loc === 'bottom' || loc === 'top') ?  props.containerHeight : props.containerWidth;

      opts[settings.tabLocation] = '-' + val;
      obj.animate(opts, settings.speed, settings.onClose()).removeClass('open');
    };

    var slideOut = function() {
      var opts = {};
      opts[settings.tabLocation] = '-3px';
      obj.animate(opts,  settings.speed, settings.onOpen()).addClass('open');
    };

    var clickScreenToClose = function() {
      $(obj,toggleBtn).click(function(e){ e.stopPropagation();  });
      $(document).click(function(){ slideIn(); });
    };

    var clickAction = function(){
      $(tab, toggleBtn).click(function(event){
        obj.hasClass('open') ? slideIn() : slideOut();
      });
      clickScreenToClose();
    };

    var hoverAction = function(){
      obj.hover(
        function(){
          if (!obj.hasClass('open')) { slideOut(); }
        },
        function(){
          if (obj.hasClass('open')) { setTimeout(slideIn, 1000); }
       });

      tab.click(function(event){
        if (obj.hasClass('open')) { slideIn(); }
      });

      toggleBtn.click(function(event){
          obj.hasClass('open') ? slideIn() : slideOut();
      });

     clickScreenToClose();
    };

    var slideOutOnLoad = function(){
        slideIn();
        setTimeout(slideOut, 500);
    };

    //choose which type of action to bind
    if (settings.action === 'click') { clickAction(); }
    if (settings.action === 'hover') { hoverAction(); }
    if (settings.onLoadSlideOut) { slideOutOnLoad(); }
  };
})(jQuery);