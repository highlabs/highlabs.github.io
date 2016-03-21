/*!
 * fastshell
 * Fiercely quick and opinionated front-ends
 * https://HosseinKarami.github.io/fastshell
 * @author Hossein Karami
 * @version 1.0.5
 * Copyright 2016. MIT licensed.
 */
/*
 *  Vide - v0.5.0
 *  Easy as hell jQuery plugin for video backgrounds.
 *  http://vodkabears.github.io/vide/
 *
 *  Made by Ilya Makarov
 *  Under MIT License
 */
!(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }
})(this, function($) {

  'use strict';

  /**
   * Name of the plugin
   * @private
   * @const
   * @type {String}
   */
  var PLUGIN_NAME = 'vide';

  /**
   * Default settings
   * @private
   * @const
   * @type {Object}
   */
  var DEFAULTS = {
    volume: 1,
    playbackRate: 1,
    muted: true,
    loop: true,
    autoplay: true,
    position: '50% 50%',
    posterType: 'detect',
    resizing: true,
    bgColor: 'transparent',
    className: ''
  };

  /**
   * Not implemented error message
   * @private
   * @const
   * @type {String}
   */
  var NOT_IMPLEMENTED_MSG = 'Not implemented';

  /**
   * Parse a string with options
   * @private
   * @param {String} str
   * @returns {Object|String}
   */
  function parseOptions(str) {
    var obj = {};
    var delimiterIndex;
    var option;
    var prop;
    var val;
    var arr;
    var len;
    var i;

    // Remove spaces around delimiters and split
    arr = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',').split(',');

    // Parse a string
    for (i = 0, len = arr.length; i < len; i++) {
      option = arr[i];

      // Ignore urls and a string without colon delimiters
      if (
        option.search(/^(http|https|ftp):\/\//) !== -1 ||
        option.search(':') === -1
      ) {
        break;
      }

      delimiterIndex = option.indexOf(':');
      prop = option.substring(0, delimiterIndex);
      val = option.substring(delimiterIndex + 1);

      // If val is an empty string, make it undefined
      if (!val) {
        val = undefined;
      }

      // Convert a string value if it is like a boolean
      if (typeof val === 'string') {
        val = val === 'true' || (val === 'false' ? false : val);
      }

      // Convert a string value if it is like a number
      if (typeof val === 'string') {
        val = !isNaN(val) ? +val : val;
      }

      obj[prop] = val;
    }

    // If nothing is parsed
    if (prop == null && val == null) {
      return str;
    }

    return obj;
  }

  /**
   * Parse a position option
   * @private
   * @param {String} str
   * @returns {Object}
   */
  function parsePosition(str) {
    str = '' + str;

    // Default value is a center
    var args = str.split(/\s+/);
    var x = '50%';
    var y = '50%';
    var len;
    var arg;
    var i;

    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];

      // Convert values
      if (arg === 'left') {
        x = '0%';
      } else if (arg === 'right') {
        x = '100%';
      } else if (arg === 'top') {
        y = '0%';
      } else if (arg === 'bottom') {
        y = '100%';
      } else if (arg === 'center') {
        if (i === 0) {
          x = '50%';
        } else {
          y = '50%';
        }
      } else {
        if (i === 0) {
          x = arg;
        } else {
          y = arg;
        }
      }
    }

    return { x: x, y: y };
  }

  /**
   * Search a poster
   * @private
   * @param {String} path
   * @param {Function} callback
   */
  function findPoster(path, callback) {
    var onLoad = function() {
      callback(this.src);
    };

    $('<img src="' + path + '.gif">').load(onLoad);
    $('<img src="' + path + '.jpg">').load(onLoad);
    $('<img src="' + path + '.jpeg">').load(onLoad);
    $('<img src="' + path + '.png">').load(onLoad);
  }

  /**
   * Vide constructor
   * @param {HTMLElement} element
   * @param {Object|String} path
   * @param {Object|String} options
   * @constructor
   */
  function Vide(element, path, options) {
    this.$element = $(element);

    // Parse path
    if (typeof path === 'string') {
      path = parseOptions(path);
    }

    // Parse options
    if (!options) {
      options = {};
    } else if (typeof options === 'string') {
      options = parseOptions(options);
    }

    // Remove an extension
    if (typeof path === 'string') {
      path = path.replace(/\.\w*$/, '');
    } else if (typeof path === 'object') {
      for (var i in path) {
        if (path.hasOwnProperty(i)) {
          path[i] = path[i].replace(/\.\w*$/, '');
        }
      }
    }

    this.settings = $.extend({}, DEFAULTS, options);
    this.path = path;

    // https://github.com/VodkaBears/Vide/issues/110
    try {
      this.init();
    } catch (e) {
      if (e.message !== NOT_IMPLEMENTED_MSG) {
        throw e;
      }
    }
  }

  /**
   * Initialization
   * @public
   */
  Vide.prototype.init = function() {
    var vide = this;
    var path = vide.path;
    var poster = path;
    var sources = '';
    var $element = vide.$element;
    var settings = vide.settings;
    var position = parsePosition(settings.position);
    var posterType = settings.posterType;
    var $video;
    var $wrapper;

    // Set styles of a video wrapper
    $wrapper = vide.$wrapper = $('<div>')
      .addClass(settings.className)
      .css({
        position: 'absolute',
        'z-index': -1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflow: 'hidden',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        'background-color': settings.bgColor,
        'background-repeat': 'no-repeat',
        'background-position': position.x + ' ' + position.y
      });

    // Get a poster path
    if (typeof path === 'object') {
      if (path.poster) {
        poster = path.poster;
      } else {
        if (path.mp4) {
          poster = path.mp4;
        } else if (path.webm) {
          poster = path.webm;
        } else if (path.ogv) {
          poster = path.ogv;
        }
      }
    }

    // Set a video poster
    if (posterType === 'detect') {
      findPoster(poster, function(url) {
        $wrapper.css('background-image', 'url(' + url + ')');
      });
    } else if (posterType !== 'none') {
      $wrapper.css('background-image', 'url(' + poster + '.' + posterType + ')');
    }

    // If a parent element has a static position, make it relative
    if ($element.css('position') === 'static') {
      $element.css('position', 'relative');
    }

    $element.prepend($wrapper);

    if (typeof path === 'object') {
      if (path.mp4) {
        sources += '<source src="' + path.mp4 + '.mp4" type="video/mp4">';
      }

      if (path.webm) {
        sources += '<source src="' + path.webm + '.webm" type="video/webm">';
      }

      if (path.ogv) {
        sources += '<source src="' + path.ogv + '.ogv" type="video/ogg">';
      }

      $video = vide.$video = $('<video>' + sources + '</video>');
    } else {
      $video = vide.$video = $('<video>' +
        '<source src="' + path + '.mp4" type="video/mp4">' +
        '<source src="' + path + '.webm" type="video/webm">' +
        '<source src="' + path + '.ogv" type="video/ogg">' +
        '</video>');
    }

    // https://github.com/VodkaBears/Vide/issues/110
    try {
      $video

        // Set video properties
        .prop({
          autoplay: settings.autoplay,
          loop: settings.loop,
          volume: settings.volume,
          muted: settings.muted,
          defaultMuted: settings.muted,
          playbackRate: settings.playbackRate,
          defaultPlaybackRate: settings.playbackRate
        });
    } catch (e) {
      throw new Error(NOT_IMPLEMENTED_MSG);
    }

    // Video alignment
    $video.css({
      margin: 'auto',
      position: 'absolute',
      'z-index': -1,
      top: position.y,
      left: position.x,
      '-webkit-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      '-ms-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      '-moz-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      transform: 'translate(-' + position.x + ', -' + position.y + ')',

      // Disable visibility, while loading
      visibility: 'hidden',
      opacity: 0
    })

    // Resize a video, when it's loaded
    .one('canplaythrough.' + PLUGIN_NAME, function() {
      vide.resize();
    })

    // Make it visible, when it's already playing
    .one('playing.' + PLUGIN_NAME, function() {
      $video.css({
        visibility: 'visible',
        opacity: 1
      });
      $wrapper.css('background-image', 'none');
    });

    // Resize event is available only for 'window'
    // Use another code solutions to detect DOM elements resizing
    $element.on('resize.' + PLUGIN_NAME, function() {
      if (settings.resizing) {
        vide.resize();
      }
    });

    // Append a video
    $wrapper.append($video);
  };

  /**
   * Get a video element
   * @public
   * @returns {HTMLVideoElement}
   */
  Vide.prototype.getVideoObject = function() {
    return this.$video[0];
  };

  /**
   * Resize a video background
   * @public
   */
  Vide.prototype.resize = function() {
    if (!this.$video) {
      return;
    }

    var $wrapper = this.$wrapper;
    var $video = this.$video;
    var video = $video[0];

    // Get a native video size
    var videoHeight = video.videoHeight;
    var videoWidth = video.videoWidth;

    // Get a wrapper size
    var wrapperHeight = $wrapper.height();
    var wrapperWidth = $wrapper.width();

    if (wrapperWidth / videoWidth > wrapperHeight / videoHeight) {
      $video.css({

        // +2 pixels to prevent an empty space after transformation
        width: wrapperWidth + 2,
        height: 'auto'
      });
    } else {
      $video.css({
        width: 'auto',

        // +2 pixels to prevent an empty space after transformation
        height: wrapperHeight + 2
      });
    }
  };

  /**
   * Destroy a video background
   * @public
   */
  Vide.prototype.destroy = function() {
    delete $[PLUGIN_NAME].lookup[this.index];
    this.$video && this.$video.off(PLUGIN_NAME);
    this.$element.off(PLUGIN_NAME).removeData(PLUGIN_NAME);
    this.$wrapper.remove();
  };

  /**
   * Special plugin object for instances.
   * @public
   * @type {Object}
   */
  $[PLUGIN_NAME] = {
    lookup: []
  };

  /**
   * Plugin constructor
   * @param {Object|String} path
   * @param {Object|String} options
   * @returns {JQuery}
   * @constructor
   */
  $.fn[PLUGIN_NAME] = function(path, options) {
    var instance;

    this.each(function() {
      instance = $.data(this, PLUGIN_NAME);

      // Destroy the plugin instance if exists
      instance && instance.destroy();

      // Create the plugin instance
      instance = new Vide(this, path, options);
      instance.index = $[PLUGIN_NAME].lookup.push(instance) - 1;
      $.data(this, PLUGIN_NAME, instance);
    });

    return this;
  };

  $(document).ready(function() {
    var $window = $(window);

    // Window resize event listener
    $window.on('resize.' + PLUGIN_NAME, function() {
      for (var len = $[PLUGIN_NAME].lookup.length, i = 0, instance; i < len; i++) {
        instance = $[PLUGIN_NAME].lookup[i];

        if (instance && instance.settings.resizing) {
          instance.resize();
        }
      }
    });

    // https://github.com/VodkaBears/Vide/issues/68
    $window.on('unload.' + PLUGIN_NAME, function() {
      return false;
    });

    // Auto initialization
    // Add 'data-vide-bg' attribute with a path to the video without extension
    // Also you can pass options throw the 'data-vide-options' attribute
    // 'data-vide-options' must be like 'muted: false, volume: 0.5'
    $(document).find('[data-' + PLUGIN_NAME + '-bg]').each(function(i, element) {
      var $element = $(element);
      var options = $element.data(PLUGIN_NAME + '-options');
      var path = $element.data(PLUGIN_NAME + '-bg');

      $element[PLUGIN_NAME](path, options);
    });
  });

});

(function($, window, document, undefined) {

  'use strict';

  /*
   * Konami-JS ~
   * :: Now with support for touch events and multiple instances for
   * :: those situations that call for multiple easter eggs!
   * Code: http://konami-js.googlecode.com/
   * Examples: http://www.snaptortoise.com/konami-js
   * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
   * Version: 1.4.5 (3/2/2016)
   * Licensed under the MIT License (http://opensource.org/licenses/MIT)
   * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+, Mobile Safari 2.2.1 and Dolphin Browser
   */

  var Konami = function (callback) {
  	var konami = {
  		addEvent: function (obj, type, fn, ref_obj) {
  			if (obj.addEventListener)
  				obj.addEventListener(type, fn, false);
  			else if (obj.attachEvent) {
  				// IE
  				obj["e" + type + fn] = fn;
  				obj[type + fn] = function () {
  					obj["e" + type + fn](window.event, ref_obj);
  				}
  				obj.attachEvent("on" + type, obj[type + fn]);
  			}
  		},
  		input: "",
  		pattern: "38384040373937396665",
  		load: function (link) {
  			this.addEvent(document, "keydown", function (e, ref_obj) {
  				if (ref_obj) konami = ref_obj; // IE
  				konami.input += e ? e.keyCode : event.keyCode;
  				if (konami.input.length > konami.pattern.length)
  					konami.input = konami.input.substr((konami.input.length - konami.pattern.length));
  				if (konami.input == konami.pattern) {
  					konami.code(link);
  					konami.input = "";
  					e.preventDefault();
  					return false;
  				}
  			}, this);
  			this.iphone.load(link);
  		},
  		code: function (link) {
  			window.location = link
  		},
  		iphone: {
  			start_x: 0,
  			start_y: 0,
  			stop_x: 0,
  			stop_y: 0,
  			tap: false,
  			capture: false,
  			orig_keys: "",
  			keys: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "TAP", "TAP"],
  			code: function (link) {
  				konami.code(link);
  			},
  			load: function (link) {
  				this.orig_keys = this.keys;
  				konami.addEvent(document, "touchmove", function (e) {
  					if (e.touches.length == 1 && konami.iphone.capture == true) {
  						var touch = e.touches[0];
  						konami.iphone.stop_x = touch.pageX;
  						konami.iphone.stop_y = touch.pageY;
  						konami.iphone.tap = false;
  						konami.iphone.capture = false;
  						konami.iphone.check_direction();
  					}
  				});
  				konami.addEvent(document, "touchend", function (evt) {
  					if (konami.iphone.tap == true) konami.iphone.check_direction(link);
  				}, false);
  				konami.addEvent(document, "touchstart", function (evt) {
  					konami.iphone.start_x = evt.changedTouches[0].pageX;
  					konami.iphone.start_y = evt.changedTouches[0].pageY;
  					konami.iphone.tap = true;
  					konami.iphone.capture = true;
  				});
  			},
  			check_direction: function (link) {
  				x_magnitude = Math.abs(this.start_x - this.stop_x);
  				y_magnitude = Math.abs(this.start_y - this.stop_y);
  				x = ((this.start_x - this.stop_x) < 0) ? "RIGHT" : "LEFT";
  				y = ((this.start_y - this.stop_y) < 0) ? "DOWN" : "UP";
  				result = (x_magnitude > y_magnitude) ? x : y;
  				result = (this.tap == true) ? "TAP" : result;

  				if (result == this.keys[0]) this.keys = this.keys.slice(1, this.keys.length);
  				if (this.keys.length == 0) {
  					this.keys = this.orig_keys;
  					this.code(link);
  				}
  			}
  		}
  	}

  	typeof callback === "string" && konami.load(callback);
  	if (typeof callback === "function") {
  		konami.code = callback;
  		konami.load();
  	}

  	return konami;
  };

  function isScrolledIntoView(elem){
      var $elem = $(elem);
      var $window = $(window);

      var docViewTop = $window.scrollTop();
      var docViewBottom = docViewTop + $window.height();

      var elemTop = $elem.offset().top;
      var elemBottom = elemTop + $elem.height();

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  function toggleIcons(elem){
    var first = true;
    if (isScrolledIntoView(elem) && first === true) {
      elem.attr('class','svg-animation');
      var id = elem.attr('id');
      console.log(id);
      new Vivus(id, {type: 'async', duration: 200,animTimingFunction: Vivus.EASE});
      first = false;
    } else {
      $(window).scroll(function(){
        if (isScrolledIntoView(elem) && first === true) {
          elem.attr('class','svg-animation');
          var id = elem.attr('id');
          console.log(id);
          new Vivus(id, {type: 'async', duration: 200,animTimingFunction: Vivus.EASE});
          first = false;
        }
      });
    }

  }

  function bestQuotes() {
    var author, text;

    var quotes = [{
      text: 'Im doing a (free) operating system (just a hobby, wont be big and professional like gnu) for 386(486) AT clones.',
      author: 'Linus Torvalds'
    }, {
      text: 'We know everything, okay? We\'re prescient.',
      author: 'Aaron - Primer'
    }, {
      text: '↑ ↑ ↓ ↓ ← → ← → B A',
      author: 'Konami Code'
    }, {
      text: 'You want weapons? We’re in a library! Books! The best weapons in the world!',
      author: 'The Doctor'
    }, {
      text: 'In 900 years of time and space, I’ve never met anyone who wasn’t important',
      author: 'The Doctor'
    }, {
      text: 'Jamais, em hipótese alguma, deixe um Vogon ler poesias para você.',
      author: 'Douglas Adams'
    }, {
      text: 'We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.',
      author: 'Stephen Hawking'
    }, {
      text: 'É um erro acreditar que é possível resolver qualquer problema importante usando batatas.',
      author: 'Douglas Adams'
    }, {
      text: 'Changing the World One Line of Code at a Time',
      author: 'Linux Foundation'
    }];
    var num = Math.floor(Math.random()*quotes.length);

    text = quotes[num].text;
    author = quotes[num].author;

    $('.quotes').html(text + '<br/><small>- ' + author + '</small>');
  }



  $(function() {

    var easter_egg = new Konami();
    easter_egg.code = function() {
      $(function() {
          // var BV = new $.BigVideo();
          // BV.init();
          // BV.show('/assets/video/pirate.mp4',{ambient:true});
          $('.video-bg').vide({
            mp4: '/assets/video/pirate.mp4',
          },
          {
            muted: true,
            loop: false,
            autoplay: true,
            resizing: true, // Auto-resizing, read: https://github.com/VodkaBears/Vide#resizing
            bgColor: 'black', // Allow custom background-color for Vide div,
            className: 'video-embed' // Add custom CSS class to Vide div
          });
          // Get instance of the plugin
          var instance = $('.video-bg').data('vide');

          // Get video element of the background. Do what you want.
          instance.getVideoObject().addEventListener('ended',videoEnded,false);
          function videoEnded(e) {
            var instance = $('.video-bg').data('vide'); // Get the instance
            var video = instance.getVideoObject(); // Get the video object
            instance.destroy(); // Destroy instance
          }

      });
    };
    easter_egg.load();

    bestQuotes();
    toggleIcons($('#svg-animation0'));
    toggleIcons($('#svg-animation1'));
    toggleIcons($('#svg-animation2'));
  });

})(jQuery, window, document);
