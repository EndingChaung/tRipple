(function() {
	var utils = {
		registerEventHandler: function(element, eventType, handler) {
			if(element.addEventListener) {
				element.addEventListener(eventType, handler, false);
			} else if(element.attachEvent) {
				element.addEventListener('on' + eventType, function(event) {
					handler.call(element, event);
				});
			}
		},
		addClass : function(element, className) {
			if(utils.hasClass(element, className)) return ;
			element.className = (element.className || "") + " " + className;
		},
		removeClass : function(element, className) {
			var names = (element.className || "").split(/\s+/);
			var resultArray = [];
			for(var i = 0, len = names.length;i < len;i++) {
				if(names[i] !== className) resultArray.push(names[i]);
			}
			element.className = resultArray.join(' ');
		},
		hasClass : function(element, className) {
			var currentClassNames = (element.className || "").split(/\s+/);
			return utils.arrayIndexOf(currentClassNames, className) >= 0 ? true : false;
			
		},
		arrayIndexOf : function(array, item) {
			if(typeof array.indexOf === 'function') {
				return array.indexOf(item);
			} else {
				for(var i = 0, len = array.length;i < len;i++) {
					if(array[i] === item) {
						return i;
					}
				}
			}
			return -1;
		}

	}
	
	var rippleClassName = 'js-effect-ripple';
	
	function Ripple(element) {
		if( !(this instanceof Ripple) ) {
			return new Ripple(element);
		}
		this.ele = element;
		this.init();
	}
	
	Ripple.prototype.init = function() {
		var self = this;
		
		var rippleContainer = document.createElement('span');
		var rippleElement = document.createElement('span');
		utils.addClass(rippleContainer, 'ripple-container');
		utils.addClass(rippleElement, 'ripple');
		rippleContainer.appendChild(rippleElement);
		this.ele.appendChild(rippleContainer);
		
		this.rippleElement_ = rippleElement;
		
		utils.registerEventHandler(this.ele, 'mousedown', this.downHandler.bind(this));
		
		utils.registerEventHandler(this.ele, 'mouseup', this.upHandler.bind(this));
	}
	
	Ripple.prototype.downHandler = function(e) {
		var rect = this.ele.getBoundingClientRect();
		var radius = Math.sqrt(rect.width*rect.width + rect.height*rect.height);
		
		var transformString;
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
		this.offset = 'translate(' + x + 'px, ' + y + 'px)';
		transformString = this.offset + ' translate(-50%, -50%)' + ' scale(0.001, 0.001)'
		
		this.rippleElement_.style.width = radius*2 + 'px';
		this.rippleElement_.style.height = radius*2 + 'px';
		this.rippleElement_.style.transform = transformString;
		this.rippleElement_.style.opacity = '0.4';
		
		this.setRippleStyle(true);
		utils.removeClass(this.rippleElement_, 'ani');
		this.frameCount = 1;
		this.animationHandler = function() {
			if(this.frameCount-- > 0) {
				requestAnimationFrame(this.animationHandler.bind(this))
			} else {
				this.setRippleStyle(false);
				utils.addClass(this.rippleElement_, 'ani');
			}
		};
		this.animationHandler.bind(this)();
	}
	
	Ripple.prototype.upHandler = function(e) {
		var self = this;
		setTimeout(function() {
			self.rippleElement_.style.opacity = '0';
		}, 0)	
	}
	
	
	Ripple.prototype.setRippleStyle = function(start) {
		var scaleStr = 'scale('+ this.scale_ + ', ' + this.scale_ + ')';
		if(start) {
			scaleStr = 'scale(0.001, 0.001)';
		} else {
			scaleStr = 'scale(1, 1)';
		}
		this.rippleElement_.style.transform = this.offset + ' translate(-50%, -50%)' + ' ' + scaleStr;
	}
		
	function upgradeElements() {
		var eles = document.querySelectorAll('.' + rippleClassName);
		for(var i=0;i < eles.length;i++) {
			Ripple(eles[i]);
		}
	}
	
	utils.registerEventHandler(window, 'load', function() {
		upgradeElements();
	})
	
	
	
})()
