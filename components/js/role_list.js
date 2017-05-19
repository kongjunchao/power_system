/**
 * @author JUNCHAO KONG
 * @date 2017-03-07
 * @description 角色列表模块
 */

import React from 'react';
import ReactDom from 'react-dom';
import { Icon, Input, Table, Button, Popconfirm, message } from 'antd';
import Fetch from './common/fetch.js';
import '../css/main.scss';

class RoleList extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			role_list : [],
			pagination : {},
			loading : false
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

	getTableData(){
		let _this = this;
		_this.toggleLoading(true);
		const useFetch = new Fetch('role/role_list', null, function(data){
			console.log(data);
			if(data.status){
				var role_list = data.data;
				role_list.map(function(item){
					item['key'] = item.id;
				})
				if(!_this.lock){
					_this.setState({
						role_list : role_list,
						pagination : role_list.length < 11 ? false : {
							showSizeChanger : true,
							showQuickJumper : true,
							size : 'normal',
							showTotal : (total, range) => {
								return '共' + total + '条数据';
							}
						}
					})
				}
			}else{
				message.error(data.msg || '获取角色列表失败');
			}
			_this.toggleLoading(false);
		}, function(){
			message.error('获取角色列表失败');
			_this.toggleLoading(false);
		});
		useFetch.getFetch();
	}

	//删除角色
	confirmDelete(role_id, index){
		let _this = this;
		let info = {
			role_id : role_id
		}
		const useFetch = new Fetch('role/del_role', info, function(data){
			console.log(data);
			if(data.status){
				message.success('删除成功');
				let new_role_list = _this.state.role_list.concat();
				new_role_list.splice(index, 1);
				if(!_this.lock){
					_this.setState({
						role_list : new_role_list
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

	//添加角色
	handleAddRole(){
		window.location.href = '#/RoleAdd';
	}

	//搜索
	handleSearchRole(){
		let _this = this;
		let searchInput = _this.refs.searchInput.refs.input.value.trim();
		if(searchInput === ''){
			message.error('请输入搜索内容');
			return;
		}
		let params = {
			role_name : searchInput
		}
		_this.toggleLoading(true);
		const useFetch = new Fetch('role/role_list', params, function(data){
			console.log(data);
			if(data.status){
				var role_list = data.data;
				role_list.map(function(item){
					item['key'] = item.id;
				})
				if(!_this.lock){
					_this.setState({
						role_list : role_list,
						pagination : false
					})
				}
			}else{
				message.error(data.msg || '获取搜索列表失败');
				if(!_this.lock){
					_this.setState({
						role_list : [],
						pagination : false
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
		this.getTableData();
	}

	componentWillMount(){
		this.toggleLoading(true);
	}

	//组件将被卸载
	componentWillUnmount(){
		this.lock = true;
	}

	componentDidMount(){
		this.getTableData();
	}

	render(){
		const columns = [
			{
				title : 'ID',
				dataIndex : 'id',
				width : 80,
				sorter : (a, b) => a.id - b.id
			},
			{
				title : '角色名',
				dataIndex : 'role_name',
				width : 200
			},
			{
				title : '权限',
				dataIndex : 'per_list',
				width : 300,
				render : (text, record, index) => (
					<p title={text}>
						{text.length > 70 ? text.substring(0, 70) + '...' : text}
					</p>
				)
			},
			{
				title : '创建人',
				dataIndex : 'oper_name',
				width : 150
			},
			{
				title : '创建时间',
				dataIndex : 'created_at',
				width : 150
			},
			{
				title : '操作',
				className : 'action-column',
				width : 100,
				render : (text, record, index) => (
					<span className="table-action">
						<a href={'#/RoleAdd?role_id=' + text.id}>编辑</a>|
						<Popconfirm title="确定要删除吗？" onConfirm={this.confirmDelete.bind(this, text.id, index)} okText="Yes" cancelText="No">
							<a href="javascript:void(0);">删除</a>
						</Popconfirm>
					</span>
				)
			}
		]
		return (
			<div className="main-box">
				<div className="top-nav">
					角色管理 > 角色列表
				</div>
				<div className="div-1">
					<Input prefix={<Icon type="search" style={{ color : '#d9d9d9' }} />} placeholder="请输入角色名" ref="searchInput" />
					<Button type="primary" onClick={this.handleSearchRole.bind(this)}>搜索</Button>
					<Button type="primary" onClick={this.handleClearSearch.bind(this)}>还原</Button>
					<Button type="primary" onClick={this.handleAddRole}>添加角色</Button>
				</div>
				<div className="table-box">
					<h2><Icon type="menu-unfold" />角色列表</h2>
					<Table 
						columns = {columns}
						dataSource = {this.state.role_list}
						bordered size = "middle"
						pagination = {this.state.pagination}
						loading = {this.state.loading}
						scroll = {{x:false}}
					></Table>
				</div>
			</div>
		);
	}

}

export default RoleList;