/**
 * @author JUNCHAO KONG
 * @date 2017-03-09
 * @description 通用方法模块
 */

class CommonFunc{
	
	constructor(){
	}
	
	//获取URL地址参数
	getUrlParams(name){
		var $_GET = (function(){
			var url = window.document.location.href.toString();
			var u = url.split("?");
			if(typeof(u[1]) === 'string'){
				u = u[1].split("&");
				var get = {};
				for(var i in u){
					var j = u[i].split("=");
					get[j[0]] = j[1];
				}
				return get;
			}else{
				return {};
			}
		})()
		return $_GET[name];
	}

}

export default CommonFunc;