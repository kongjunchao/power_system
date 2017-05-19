/**
 * @author JUNCHAO KONG
 * @date 2017-03-07
 * @description 用户列表模块
 */

import React from 'react';
import ReactDom from 'react-dom';
import { Icon, Input, Table, Pagination, Button, Popconfirm, message, Select } from 'antd';
import Fetch from './common/fetch.js';
import '../css/main.scss';

const Option = Select.Option;

class UserList extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			user_list : [],
			user_count : 0,
			isShowPage : true,		//是否显示分页功能
			loading : false,
			search_type_value : '1',
			search_placeholder : '请输入用户ID',
			role : [],				//角色列表
			role_checked : '',		//选中的角色
		}
		this.lock = false;
	}

	toggleLoading(status){
		if(!this.lock){
			this.setState({
				loading : status
			})
		}
	}

	getTableData(page){
		let _this = this;
		let info = {
			page : page || 1
		}
		_this.toggleLoading(true);
		const useFetch = new Fetch('user/user_list', info, function(data){
			console.log(data);
			if(data.status){
				var user_list = data.data.user_list;
				user_list.map(function(item){
					item['key'] = item.user_id;
				})
				if(!_this.lock){
					_this.setState({
						user_list : user_list,
						user_count : data.data.user_count
					})
				}
			}else{
				message.error(data.msg || '获取用户列表失败');
			}
			_this.toggleLoading(false);
		}, function(){
			message.error('获取用户列表失败');
			_this.toggleLoading(false);
		});
		useFetch.getFetch();
	}

	//切换页码
	handleChangePage(num){
		console.log(num);
		this.getTableData(num);
	}

	//删除用户
	confirmDelete(user_id, index){
		let _this = this;
		let info = {
			user_id : user_id
		}
		const useFetch = new Fetch('user/del_user', info, function(data){
			console.log(data);
			if(data.status){
				message.success('删除成功');
				let new_user_list = _this.state.user_list.concat();
				new_user_list.splice(index, 1);
				if(!_this.lock){
					_this.setState({
						user_list : new_user_list
					})
				}
			}else{
				message.error(data.msg || '删除失败');
			}
		}, function(){
			message.error('删除失败');
		});
		useFetch.postFetch();
	}

	//添加用户
	handleAddUser(){
		window.location.href = '#/UserAdd';
	}

	//改变搜索类型
	handleChangeSearchTypeSelect(value){
		if(!this.lock){
			let search_placeholder = '';
			switch(value){
				case '1' : search_placeholder = '请输入用户ID';
					document.getElementsByClassName('ant-input-affix-wrapper')[0].style.display = 'inline-block';
					document.getElementsByClassName('ant-select')[1].style.display = 'none';
					break;
				case '2' : search_placeholder = '请输入用户名';
					document.getElementsByClassName('ant-input-affix-wrapper')[0].style.display = 'inline-block';
					document.getElementsByClassName('ant-select')[1].style.display = 'none';
					break;
				case '3' : document.getElementsByClassName('ant-input-affix-wrapper')[0].style.display = 'none';
					document.getElementsByClassName('ant-select')[1].style.display = 'inline-block';
					break;
			}
			this.setState({
				search_type_value : value,
				search_placeholder : search_placeholder
			})
		}
	}

	//改变选择角色下拉框
	handleChangeRoleSelect(value){
		if(!this.lock){
			this.setState({
				role_checked : value
			})
		}
	}

	//搜索
	handleSearchUser(){
		let _this = this;
		let searchInput;
		if(_this.state.search_type_value === '3'){
			searchInput = _this.state.role_checked;
		}else{
			searchInput = _this.refs.searchInput.refs.input.value.trim();
		}
		if(searchInput === ''){
			message.error('请输入搜索内容');
			return;
		}
		let params = {
			type_id : _this.state.search_type_value,
			search : searchInput
		}
		_this.toggleLoading(true);
		const useFetch = new Fetch('user/search_user', params, function(data){
			console.log(data);
			if(data.status){
				var user_list = data.data.user_list;
				user_list.map(function(item){
					item['key'] = item.user_id;
				})
				if(!_this.lock){
					_this.setState({
						user_list : user_list,
						user_count : data.data.user_count,
						isShowPage : false
					})
				}
			}else{
				message.error(data.msg || '获取搜索列表失败');
				if(!_this.lock){
					_this.setState({
						user_list : [],
						user_count : 0
					})
				}
			}
			_this.toggleLoading(false);
		}, function(){
			message.error('搜索请求失败');
			_this.toggleLoading(false);
		});
		useFetch.getFetch();
	}

	//还原
	handleClearSearch(){
		this.refs.searchInput.refs.input.value = '';
		if(!this.lock){
			this.setState({
				role_checked : '',
				isShowPage : true
			})
		}
		this.getTableData(1);
	}

	componentWillMount(){
		this.toggleLoading(true);
	}

	//组件将被卸载
	componentWillUnmount(){
		this.lock = true;
	}

	componentDidMount(){
		this.getTableData(1);
		let _this = this;
		const useFetch = new Fetch('role/role_list', null, function(data){
			if(!_this.lock){
				_this.setState({
					role : data.data,
					role_checked : ''
				})
			}
		}, function(){
			message.error('角色信息请求失败');
		});
		useFetch.getFetch();
	}

	render(){
		const columns = [
			{
				title : 'ID',
				dataIndex : 'user_id',
				width : 80,
				sorter : (a, b) => a.user_id - b.user_id
			},
			{
				title : '用户名',
				dataIndex : 'user_name',
				width : 300
			},
			{
				title : '角色',
				dataIndex : 'role_name',
				width : 300
			},
			{
				title : '创建人',
				dataIndex : 'oper_name',
				width : 200
			},
			{
				title : '创建时间',
				dataIndex : 'create_ts',
				width : 200
			},
			{
				title : '操作',
				className : 'action-column',
				width : 150,
				render : (text, record, index) => (
					<span className="table-action">
						<a href={'#/UserAdd?user_id=' + text.user_id}>编辑</a>|
						<Popconfirm title="确定要删除吗？" onConfirm={this.confirmDelete.bind(this, text.user_id, index)} okText="Yes" cancelText="No">
							<a href="javascript:void(0);">删除</a>
						</Popconfirm>
					</span>
				)
			}
		]
		return (
			<div className="main-box">
				<div className="top-nav">
					用户管理 > 用户列表
				</div>
				<div className="div-1">
					<Select
						placeholder="请选择类型"
						value={this.state.search_type_value}
						onChange={this.handleChangeSearchTypeSelect.bind(this)}
					>
						<Option value='1'>用户ID</Option>
						<Option value='2'>用户名</Option>
						<Option value='3'>角色</Option>
					</Select>
					<Input prefix={<Icon type="search" style={{ color : '#d9d9d9' }} />} placeholder={this.state.search_placeholder} ref="searchInput" />
					<Select
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
					<Button type="primary" onClick={this.handleSearchUser.bind(this)}>搜索</Button>
					<Button type="primary" onClick={this.handleClearSearch.bind(this)}>还原</Button>
					<Button type="primary" onClick={this.handleAddUser}>添加用户</Button>
				</div>
				<div className="table-box">
					<h2><Icon type="menu-unfold" />用户列表</h2>
					<Table 
						columns = {columns}
						dataSource = {this.state.user_list}
						bordered size = "middle"
						pagination = {false}
						loading = {this.state.loading}
						scroll = {{x:false}}
					></Table>
					{
						(this.state.user_count > 10 && this.state.isShowPage) ?
							<Pagination 
								defaultCurrent={1}
								defaultPageSize={10}
								total={this.state.user_count}
								onChange={this.handleChangePage.bind(this)}
								showTotal={(total, range) => {
									return '共' + total + '条数据';
								}}
							/>
						: ''
					}
				</div>
			</div>
		);
	}

}

export default UserList;