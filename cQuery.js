
(function(window, undefined) {
	
	var cQuery, len, elms;
	
	var cQuery = function(selector) {
		
		elms = document.querySelectorAll(selector);
		len = elms.length;
		
		this.remove = function() {
			for ( var i = 0 ; i < len; i++ ) {
				elms[i].parentNode.removeChild(elms[i]);
			};
		};
		
		var _hasClass = function(elm, $class) {
			if ( elm.className.replace(' ') == elm.className ) {
				return elm.className == $class;
			} else {
				var $data = elm.className.split(' ');
				for ( var i = 0; i < $data.length; i++ ) {
					if ( $data[i] == $class ) {
						return true;
					};
				};
			};
			return false;
		};
		
		this.hasClass = function($class) {
			return _hasClass(elms[0], $class);
		};
		
		var _addClass = function(elm, $class) {
			if ( !_hasClass(elm, $class) ) {
				if ( elm.className && elm.className == '' ) {
					elm.className = $class;
				} else {
					elm.className = elm.className + ' ' + $class;
				};
			};
		};
		
		this.addClass = function($class) {
			for ( var i = 0; i < len; i++ ) {
				_addClass(elms[i], $class);
			};
			return this;
		};
		
		var _removeClass = function(elm, $class) {
			if ( _hasClass(elm, $class) ) {
				if ( elm.className.replace(' ') == elm.className ) {
					elm.className = "";
				} else {
					var reg = new RegExp('(\\s|^)'+$class+'(\\s|$)');
					elm.className = elm.className.replace(reg,' ');
				};
			};
		};
		
		this.removeClass = function($class) {
			for ( var i = 0; i < len; i++ ) {
				_removeClass(elms[i], $class);
			};
			return this;
		};
		
		var _toggleClass = function(elm, $class) {
			if ( _hasClass(elm, $class) ) {
				_removeClass(elm, $class);
			} else {
				_addClass(elm, $class);
			};
		};
		
		this.toggleClass = function($class) {
			for ( var i = 0; i < len; i++ ) {
				_toggleClass(elms[i], $class);
			};
			return this;
		};
		
		this.show = function() {
			for ( var i = 0; i < len; i++ ) {
				elms[i].style.display = "block";
			};
		};
		
		this.hide = function() {
			for ( var i = 0; i < len; i++ ) {
				elms[i].style.display = "none";
			};
		};
		
		this.toggle = function() {
			for ( var i = 0; i < len; i++ ) {
				if ( elms[i].style.display == "block" || elms[i].style.display == "" ) {
					elms[i].style.display = "none";
				} else {
					elms[i].style.display = "block";
				};
			};
		};
		
		return this;
	};
	
	cQuery.ajax = function(opts) {
		if ( !opts ) {
			opts = {};
		};
		
		var http = false;
		
		if( typeof ActiveXObject != 'undefined' ) {
			try {
				http = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					http = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (E) {
					http = false;
				};
			};
		} else if ( window.XMLHttpRequest ) {
			try {
				http = new XMLHttpRequest();
			} catch (e) {
				http = false;
			};
		};
		
		if ( !http ) {
			return;
		};
		
		var opt = {
			'type'			:	'GET',
			'url'				:	'',
			'data'			:	'',
			'cache'			:	false,
			'success'		:	false,
			'async'			:	true,
			'dataType'	:	'text',
			'loader'		:	false
		};
		
		for ( var key in opt ) {
			if ( opts.hasOwnProperty(key) ) {
				opt[key] = opts[key];
			};
		};
		
		var url = opt.url;
		var parameters = opt.data;
		var callback = opt.success;
		var type = opt.type.toUpperCase();
		
		if ( !opt.cache ) {
			var ts = +new Date();
			ts = "timestamp=" + ts;
			url += (url.indexOf("?")+1) ? "&" : "?";
			url += ts;
		};
		
		function removeLoader() {
			$("#ajax_loader").remove();
		};
		
		if ( opt.loader ) {
			if ( $("#ajax_loader") ) {
				removeLoader();
			}
			var $elm = document.createElement("div");
			var $body = $("body");
			$elm.id = "ajax_loader";
			$elm.innerHTML = opt.loader;
			var $style = $elm.style;
			$style.position = "absolute";
			$style.top = 0;
			$style.left = 0;
			$style.width = "100%";
			$style.height = $body.scrollHeight + "px";
			$style.backgroundColor = "rgba(0,0,0,.8)";
			$style.color = "#FFFFFF";
			$style.textShadow = "0 1px 1px #000";
			$style.fontSize = "20px";
			$style.textAlign = "center";
			$style.lineHeight = "100%";
			$body.appendChild($elm);
		};
		
		http.open(type, url, opt.async);
		http.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		if ( type == "POST" ) {
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			//http.setRequestHeader("Content-length", parameters.length);
			//http.setRequestHeader("Connection", "close");
		};
		if ( opt.async ) {
			http.onreadystatechange = function () {
				if ( http.readyState == 4 ) {
					if ( http.status == 200 ) {
						if ( opt.loader ) {
							removeLoader();
						};
						if ( callback ) {
							var response;
							if ( opt.dataType == 'json' ) {
								response = eval('(' + http.responseText + ')');
							} else if ( opt.dataType == 'xml' ) {
								response = http.responseXML;
							} else {
								response = http.responseText;
							};
							callback(response);
						};
					};
				};
			};
		};
		http.send(parameters);
		if ( !opt.async ) {
			var response;
			if ( opt.dataType == 'json' ) {
				response = eval('(' + http.responseText + ')');
			} else if ( opt.dataType == 'xml' ) {
				response = http.responseXML;
			} else {
				response = http.responseText;
			};
			if ( opt.loader ) {
				removeLoader();
			};
			if ( callback ) {
				return callback(response);
			} else {
				return response;
			};
		};
		
	};
	
	window.cQuery = window.$ = cQuery;
	
})(window);
