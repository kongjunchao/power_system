/**
 * @author JUNCHAO KONG
 * @date 2017-03-07
 * @description 添加角色模块
 */

import React from 'react';
import ReactDom from 'react-dom';
import { Input, Checkbox, Button, message, Spin } from 'antd';
import Fetch from './common/fetch.js';
import FormReg from './common/form_reg.js';
import CommonFunc from './common/common.js';
import '../css/role_add.scss';

const CheckboxGroup = Checkbox.Group;
const formReg = new FormReg();
const commonFunc = new CommonFunc();

class RoleAdd extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			options : [
				// {
				// 	menu_name : '报表',			//全选框的名称
				// 	per_list : [
				// 		{label : 'Apple1', value : 'Apple1', disabled : false},
				// 		{label : 'Apple2', value : 'Apple2', disabled : false},
				// 		{label : 'Apple3', value : 'Apple3', disabled : false},
				// 		{label : 'Apple4', value : 'Apple4', disabled : false}
				// 	],
				// 	checkedList : [],			//已选中的值
				// 	indeterminate : true,		//全选框的状态
				// 	checkAll : false			//是否全选
				// }
			],
			loading : false,			//提交按钮加载状态
			spinLoading : true
		}
		this.role_id = null;
		this.lock = false;
	}

	onChange(index, checkedList){
		let options = this.state.options.concat();
		options[index].checkedList = checkedList;
		options[index].indeterminate = !!checkedList.length && (checkedList.length < options[index].per_list.length);
		options[index].checkAll = checkedList.length === options[index].per_list.length;
		if(!this.lock){
			this.setState({
				options : options
			})
		}
	}

	//点击全部框
	onCheckAllChange(index, e){
		let options = this.state.options.concat();
		let arr = options[index].per_list.map(function(item, index){
			if(!item.disabled){
				return item.value;
			}
		})
		options[index].checkedList = e.target.checked ? arr : [];
		options[index].indeterminate = false;
		options[index].checkAll = e.target.checked;
		if(!this.lock){
			this.setState({
				options : options
			})
		}
	}

	//改变提交按钮加载状态，status传入true or false
	changeLoading(status){
		if(!this.lock){
			this.setState({
				loading : status
			})
		}
	}

	//点击提交按钮
	submitForm(){
		if(this.state.loading === true){
			return;
		}
		let that = this;
		let rolename = this.refs.rolename.refs.input.value.trim();
		if(formReg.isEmpty(rolename)){
			message.error('角色名不能为空');
			return;
		}
		let per_list = [];
		this.state.options.map(function(item, index){
			per_list = per_list.concat(item.checkedList);
		})
		let info = {
			role_name : rolename,
			per_list : per_list.join()
		}
		if(this.role_id !== null){
			info.role_id = this.role_id;
		}
		this.changeLoading(true);
		const useFetch = new Fetch('role/oper_role', info, function(data){
			console.log(data);
			if(data.status){
				message.success('提交成功');
			}else{
				message.error(data.msg || '添加角色失败');
			}
			setTimeout(function(){
				that.changeLoading(false);
				window.location.href = '#/RoleList';
			}, 1000)
		}, function(){
			message.error('添加角色失败');
			setTimeout(function(){
				that.changeLoading(false);
			}, 1000)
		});
		useFetch.postFetch();
	}

	//点击取消按钮返回上一步
	returnLastStep(){
		window.history.back(-1);
	}

	componentWillMount(){
		let role_id = commonFunc.getUrlParams('role_id');
		if(role_id !== undefined){
			this.role_id = role_id;
		}
	}

	//组件将被卸载
	componentWillUnmount(){
		this.lock = true;
	}

	componentDidMount(){
		let _this = this;
		const useFetch = new Fetch('per/per_list_bind_role', null, function(data){
			console.log(data);
			let options = [];
			data.data.map(function(item, index){
				let per_list = [];
				item.per_list.map(function(it, i){
					per_list.push({
						label : it.per_name,
						value : it.per_id,
						disabled : it.is_valid === 1 ? false : true
					})
				})
				options.push({
					menu_name : item.menu_name,
					per_list : per_list,
					checkedList : [],
					indeterminate : true,
					checkAll : false
				})
			})
			//编辑状态下
			if(_this.role_id !== null){
				console.log(_this.role_id);
				let topNav = document.querySelector('.top-nav');
				topNav.innerHTML = topNav.innerHTML.replace('添加', '编辑');
				let info = {
					role_id : _this.role_id
				}
				const useFetchGetEditInfo = new Fetch('role/edit_role', info, function(data_1){
					console.log(data_1);
					if(data_1.status){
						_this.refs.rolename.refs.input.value = data_1.data.role_name;
						options.map(function(item, index){
							item.per_list.map(function(it, i){
								if(data_1.data.per_list.indexOf(it.value) !== -1){
									item.checkedList.push(it.value);
								}
							})
						})
						if(!_this.lock){
							_this.setState({
								options : options,
								spinLoading : false
							})
						}
					}else{
						message.error(data_1.msg || '获取角色信息失败');
					}
				}, function(){
					message.error('获取角色信息失败');
				});
				useFetchGetEditInfo.getFetch();
			}else{
				if(!_this.lock){
					_this.setState({
						options : options,
						spinLoading : false
					})
				}
			}
		}, function(){
			message.error('权限请求失败');
		});
		useFetch.getFetch();
	}

	render(){
		let _this = this;
		return (
			<div className="main-box">
				<div className="top-nav">
					角色管理 > 添加角色
				</div>
				<div className="div-ul">
					<ul>
						<li>
							<span>角色名</span>
							<Input ref="rolename" />
						</li>
					</ul>
				</div>
				<div className="div-2">
					<p>请选择该角色所拥有的权限</p>
					<Spin spinning={this.state.spinLoading}>
						{
							this.state.options.map(function(data, index){
								return (
									<div className="div-3" key={index}>
										<Checkbox 
											indeterminate = {data.indeterminate}
											onChange = {_this.onCheckAllChange.bind(_this, index)}
											checked = {data.checkAll}
										>{data.menu_name}</Checkbox>
										<CheckboxGroup
											options = {data.per_list}
											value = {data.checkedList}
											onChange = {_this.onChange.bind(_this, index)}
										></CheckboxGroup>
									</div>
								)
							})
						}
					</Spin>
				</div>
				<Button type="primary" loading={this.state.loading} onClick={this.submitForm.bind(this)}>提交</Button>
				<Button onClick={this.returnLastStep.bind(this)}>取消</Button>
			</div>
		);
	}

}

export default RoleAdd;