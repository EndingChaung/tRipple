# myRipple
## 开始使用
### 使用方式
ripple有两种使用方式：一种是加`js-effect-ripple`样式；一种是用js触发。第二种方式要保证dom元素的position是relative。
1. 
``` html
<div class="js-effect-ripple" style="height: 50px;width: 100px;">
</div>
```
2. 
``` javascript
Ripple(element);
```
### 变更波纹颜色
变更颜色需要自己将波纹颜色的样式覆盖。   

``` css
.ripple {
	background-color: blue;
}
```
