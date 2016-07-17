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
		},

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
		this.rippleScale_ = 'scale(0.001, 0.001)';
		this.scale_ = 0.001;
		this.offset;
		
		utils.registerEventHandler(this.ele, 'mousedown', function(e) {
			var rect = self.ele.getBoundingClientRect();
			var radius = Math.sqrt(rect.width*rect.width + rect.height*rect.height);
			
			var transformString;
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
			self.offset = 'translate(' + x + 'px, ' + y + 'px)';
			transformString = self.offset + ' translate(-50%, -50%)' + ' scale(0.001, 0.001)'
			
			self.rippleElement_.style.width = radius*2 + 'px';
			self.rippleElement_.style.height = radius*2 + 'px';
			self.rippleElement_.style.transform = transformString;
			self.rippleElement_.style.opacity = '0.4';
			
			requestAnimationFrame(self.ripple.bind(self));
//			self.rippleElement_.style.transform = self.offset + ' translate(-50%, -50%)' + ' scale(1, 1)';
		});
		
		utils.registerEventHandler(this.ele, 'mouseup', function(e) {
			setTimeout(function() {
				self.rippleElement_.style.opacity = '0';
			}, 0)
			
		});
	}
	
	Ripple.prototype.ripple = function() {
		this.scale_ = this.scale_ + 0.03;
		this.rippleElement_.style.transform = this.offset + ' translate(-50%, -50%)' + ' scale('
											+ this.scale_ + ', ' + this.scale_ + ')';
	
		if(this.scale_ < 1) {
				this.rippleElement_.style.backgroundColor = 'blue';
			requestAnimationFrame(this.ripple.bind(this));
		} else {
			this.scale_ = 0.01;
			self.rippleElement_.style.opacity = '0';
		}
		
		
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
