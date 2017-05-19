/**
 * @author JUNCHAO KONG
 * @date 2017-03-09
 * @description Fetch模块
 */

import Config from './config.js';

class Fetch extends Config{
	
	constructor(url, params, successFunc, errorFunc){
		super();
		this.url = super()._URL + url;
		this.params = params;
		this.successFunc = successFunc;
		this.errorFunc = errorFunc;
	}

	//发送GET请求
	getFetch(){
		var that = this;
		var str = '';
		if(typeof that.params === 'object' && that.params){
			str += '?';
			Object.keys(that.params).forEach(function(val){
				str += val + '=' + encodeURIComponent(that.params[val]) + '&';
			})
		}
		fetch(this.url + str, {
			method : 'GET'
		}).then(function(res){
			if(res.ok){
				res.json().then(function(data){
					that.successFunc(data);
				})
			}else{
				console.log('请求失败');
				that.errorFunc();
			}
		}).catch(function(e){
			console.log('请求失败');
			that.errorFunc();
		})
	}
	
	//发送POST请求
	postFetch(){
		var that = this;
		var formData = new FormData();
		for(let k in that.params){
			formData.append(k, that.params[k]);
		}
		formData.append('oper_id', '11');
		formData.append('oper_name', 'kong');
		fetch(this.url, {
			method : 'POST',
			mode : 'cors',
			body : formData
		}).then(function(res){
			if(res.ok){
				res.json().then(function(data){
					that.successFunc(data);
				})
			}else{
				console.log('请求失败');
				that.errorFunc();
			}
		}).catch(function(e){
			console.log('请求失败');
			that.errorFunc();
		})
	}
}

export default Fetch;