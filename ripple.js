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
		this.ele_ = element;
		this.init();
	}
	
	Ripple.Const_ = {
		FRAME_COUNT: 1
	}
	
	Ripple.prototype.init = function() {		
		this.rippleContainer_ = document.createElement('span');// 有overflow hidden的样式，控制波纹的边界
		this.rippleElement_  = document.createElement('span');// 波纹
		utils.addClass(this.rippleContainer_, 'ripple-container');
		utils.addClass(this.rippleElement_, 'ripple');		
		this.rippleContainer_.appendChild(this.rippleElement_);
		this.ele_.appendChild(this.rippleContainer_);
		
		this.frameCount_ = Ripple.Const_.FRAME_COUNT;// 控制点击之后在哪个刷新周期内产生波纹
		
		utils.registerEventHandler(this.ele_, 'mousedown', this.downHandler.bind(this));
		
		utils.registerEventHandler(this.ele_, 'mouseup', this.upHandler.bind(this));
	}
	
	Ripple.prototype.downHandler = function(e) {
		this.initRipple(e);
		this.startRipple();
		
	}
	
	Ripple.prototype.upHandler = function(e) {
		var self = this;
		setTimeout(function() {
			self.rippleElement_.style.opacity = '0';
		}, 0)	
	}
	
	/**
	 * 初始化位置，大小
	 **/
	Ripple.prototype.initRipple = function(e) {
		var rect, x, y, scaleStr, radius;
		
		rect = this.ele_.getBoundingClientRect();
		x = e.clientX - rect.left,
		y = e.clientY - rect.top;
		this.offset_ = 'translate(' + x + 'px, ' + y + 'px)';

		radius = Math.sqrt(rect.width*rect.width + rect.height*rect.height);
		scaleStr = 'scale(0.001, 0.001)';
		
		var transformStr = this.offset_ + ' translate(-50%, -50%)' + ' ' + scaleStr;
		
		this.rippleElement_.style.width = radius*2 + 'px';
		this.rippleElement_.style.height = radius*2 + 'px';
		this.rippleElement_.style.transform = transformStr;
		this.rippleElement_.style.msTransform = transformStr;
        this.rippleElement_.style.transform = transformStr;
		this.rippleElement_.style.opacity = '0.4';
		
		utils.removeClass(this.rippleElement_, 'is-animating');
		
		this.rippleContainer_.style.width = rect.width + 'px';
		this.rippleContainer_.style.height = rect.height + 'px';
	}
	
	
	Ripple.prototype.startRipple = function() {
		this.animationHandler = function() {
			if(this.frameCount_-- > 0) {
				requestAnimationFrame(this.animationHandler.bind(this))
			} else {
				// 开始动画
				var transformStr = this.offset_ + ' translate(-50%, -50%)' + ' ' + 'scale(1, 1)';
				this.rippleElement_.style.transform = transformStr;
				this.rippleElement_.style.msTransform = transformStr;
				this.rippleElement_.style.transform = transformStr;
				utils.addClass(this.rippleElement_, 'is-animating');
				this.frameCount_ = Ripple.Const_.FRAME_COUNT;
			}
		};
		this.animationHandler.bind(this)();
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
