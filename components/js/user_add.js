/**
 * @author JUNCHAO KONG
 * @date 2017-03-07
 * @description 添加用户模块
 */

import React from 'react';
import ReactDom from 'react-dom';
import { Input, Button, Select, message } from 'antd';
import Fetch from './common/fetch.js';
import FormReg from './common/form_reg.js';
import CommonFunc from './common/common.js';
import '../css/user_add.scss';

const Option = Select.Option;
const formReg = new FormReg();
const commonFunc = new CommonFunc();

class UserAdd extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			role : [],				//角色列表
			role_checked : [],		//选中的角色
			loading : false			//提交按钮加载状态
		}
		this.user_id = null;
		this.lock = false;
	}

	//改变选择角色下拉框
	handleChangeRoleSelect(value){
		if(!this.lock){
			this.setState({
				role_checked : value
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
		let username = this.refs.username.refs.input.value.trim();
		let role = this.state.role_checked;
		if(formReg.isEmpty(username)){
			message.error('用户名不能为空');
			return;
		}
		if(role.length === 0){
			message.error('请至少选择一个角色');
			return;
		}
		let info = {
			role_id : role,
			user_name : username
		}
		if(this.user_id !== null){
			info.user_id = this.user_id;
		}
		this.changeLoading(true);
		const useFetch = new Fetch('user/oper_user', info, function(data){
			console.log(data);
			if(data.status){
				message.success('提交成功');
			}else{
				message.error(data.msg || '添加用户失败');
			}
			setTimeout(function(){
				that.changeLoading(false);
				window.location.href = '#/UserList';
			}, 1000)
		}, function(){
			message.error('添加用户失败');
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
		let user_id = commonFunc.getUrlParams('user_id');
		if(user_id !== undefined){
			this.user_id = user_id;
		}
	}

	//组件将被卸载
	componentWillUnmount(){
		this.lock = true;
	}

	componentDidMount(){
		let _this = this;
		const useFetch = new Fetch('role/role_list', null, function(data){
			console.log(data);
			//编辑状态下
			if(_this.user_id !== null){
				console.log(_this.user_id);
				let topNav = document.querySelector('.top-nav');
				topNav.innerHTML = topNav.innerHTML.replace('添加', '编辑');
				let info = {
					user_id : _this.user_id
				}
				const useFetchGetEditInfo = new Fetch('user/edit_user', info, function(data_1){
					console.log(data_1);
					if(data_1.status){
						_this.refs.username.refs.input.value = data_1.data.user_name;
						//用户名不可更改
						_this.refs.username.refs.input.setAttribute('disabled', true);
						if(!_this.lock){
							_this.setState({
								role : data.data,
								role_checked : data_1.data.role_list.map(function(item){ return String(item); })
							})
						}
					}else{
						message.error(data_1.msg || '获取用户信息失败');
					}
				}, function(){
					message.error('获取用户信息失败');
				});
				useFetchGetEditInfo.getFetch();
			}else{
				if(!_this.lock){
					_this.setState({
						role : data.data,
						role_checked : []
					})
				}
			}
		}, function(){
			message.error('角色信息请求失败');
		});
		useFetch.getFetch();
	}

	render(){
		return (
			<div className="main-box">
				<div className="top-nav">
					用户管理 > 添加用户
				</div>
				<div className="div-ul">
					<ul>
						<li>
							<span>用户名</span>
							<Input ref="username" />
						</li>
						<li>
							<span>角色</span>
							<Select
								multiple
								placeholder="请选择角色"
								value={this.state.role_checked}
								onChange={this.handleChangeRoleSelect.bind(this)}
							>
								{
									this.state.role.map(function(data, index){
										/* Option组件不支持传入Number类型的value */
										return <Option key={data.id} value={String(data.id)}>{data.role_name}</Option>
									})
								}
							</Select>
						</li>
						<li>
							<Button type="primary" loading={this.state.loading} onClick={this.submitForm.bind(this)}>提交</Button>
							<Button onClick={this.returnLastStep.bind(this)}>取消</Button>
						</li>
					</ul>
				</div>
			</div>
		);
	}

}

export default UserAdd;