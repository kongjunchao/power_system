/**
 * @author JUNCHAO KONG
 * @date 2017-03-07
 * @description 权限列表模块
 */

import React from 'react';
import ReactDom from 'react-dom';
import { Icon, Input, Table, Button, Popconfirm, Switch, message } from 'antd';
import Fetch from './common/fetch.js';
import '../css/main.scss';

//可编辑的单元格
class EditableCell extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			value : this.props.value,
			editable : false
		}
		this.lock = false;
	}

	handleChange(e){
		let value = e.target.value;
		if(!this.lock){
			this.setState({
				value : value
			})
		}
	}

	check(){
		if(!this.lock){
			this.setState({
				editable : false
			})
		}
		this.props.handleChangePerName(this.props.value, this.state.value, this.props.id, this.props.index);
	}

	edit(){
		if(!this.lock){
			this.setState({
				editable : true
			})
		}
	}

	//组件将被卸载
	componentWillUnmount(){
		this.lock = true;
	}

	render(){
		return (
			<div className="editable-cell">
				{
					this.state.editable ?
						<div>
							<Input
								value = {this.state.value}
								onChange = {this.handleChange.bind(this)}
							/>
							<Icon
								type = "check"
								onClick = {this.check.bind(this)}
							/>
						</div>
					:
						<div>
							{this.state.value || ''}
							<Icon
								type = "edit"
								onClick = {this.edit.bind(this)}
							/>
						</div>
				}
			</div>
		)
	}
}

class PowerList extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			power_list : [],
			pagination : {},
			loading : false,
			filters : []
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
		const useFetch = new Fetch('per/per_list', null, function(data){
			console.log(data);
			if(data.status){
				let power_list = data.data;
				let new_power_list = [];
				let filters = [];
				power_list.map(function(item){
					filters.push({
						text : item.menu_name,
						value : item.menu_name
					})
					item.per_list.map(function(it){
						it['key'] = it.per_id;
						it['menu_name'] = item.menu_name;
						new_power_list.push(it);
					})
				})
				if(!_this.lock){
					_this.setState({
						power_list : new_power_list,
						pagination : new_power_list.length < 11 ? false : {
							showSizeChanger : true,
							showQuickJumper : true,
							size : 'normal',
							showTotal : (total, range) => {
								return '共' + total + '条数据';
							}
						},
						filters : filters
					})
				}
			}else{
				message.error(data.msg || '获取权限列表失败');
			}
			_this.toggleLoading(false);
		}, function(){
			message.error('获取权限列表失败');
			_this.toggleLoading(false);
		});
		useFetch.getFetch();
	}

	//删除权限
	confirmDelete(power_id, index){
		let _this = this;
		let info = {
			per_id : power_id
		}
		const useFetch = new Fetch('per/del_per', info, function(data){
			console.log(data);
			if(data.status){
				message.success('删除成功');
				let new_power_list = _this.state.power_list.concat();
				new_power_list.splice(index, 1);
				if(!_this.lock){
					_this.setState({
						power_list : new_power_list
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

	//修改权限名称
	handleChangePerName(oldValue, newValue, id, index){
		if(oldValue === newValue){
			message.warning('未做修改');
		}else{
			let _this = this;
			let info = {
				per_id : id,
				per_name : newValue
			}
			const useFetch = new Fetch('per/oper_permiss', info, function(data){
				console.log(data);
				if(data.status){
					message.success('修改成功');
					let new_power_list = _this.state.power_list.concat();
					new_power_list[index].per_name = newValue;
					if(!_this.lock){
						_this.setState({
							power_list : new_power_list
						})
					}
				}else{
					message.error(data.msg || '修改失败');
				}
			}, function(){
				message.error('修改失败');
			});
			useFetch.postFetch();
		}
	}

	//添加权限
	handleAddPower(){
		window.location.href = '#/PowerAdd';
	}

	//切换状态
	handleChangeStatus(id, checked){
		let _this = this;
		let info = {
			per_id : id,
			is_valid : checked ? 1 : 0
		}
		const useFetch = new Fetch('per/oper_permiss', info, function(data){
			console.log(data);
			if(data.status){
				message.success('修改成功');
			}else{
				message.error(data.msg || '修改失败');
				setTimeout(function(){
					window.location.reload();
				}, 1000)
			}
		}, function(){
			message.error('修改失败');
			setTimeout(function(){
				window.location.reload();
			}, 1000)
		});
		useFetch.postFetch();
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
				dataIndex : 'per_id',
				width : 80,
				sorter : (a, b) => a.per_id - b.per_id
			},
			{
				title : '权限名',
				dataIndex : 'per_name',
				width : 350,
				render : (text, record, index) => (
					<EditableCell
						value = {text}
						id = {record.per_id}
						index = {index}
						handleChangePerName = {this.handleChangePerName.bind(this)}
					/>
				)
			},
			{
				title : '权限唯一标识',
				dataIndex : 'code',
				width : 250
			},
			{
				title : '权限分类',
				dataIndex : 'menu_name',
				width : 200,
				filters : this.state.filters,
				onFilter : (value, record) => {
					if(record.menu_name === value){
						return true;
					}else{
						return false;
					}
				}
			},
			{
				title : '创建人',
				dataIndex : 'oper_user',
				width : 200
			},
			{
				title : '创建时间',
				dataIndex : 'create_ts',
				width : 200
			},
			{
				title : '状态',
				dataIndex : 'is_valid',
				width : 100,
				render : (text, record, index) => (
					<Switch defaultChecked={text === 1 ? true : false} onChange={this.handleChangeStatus.bind(this, record.per_id)} />
				)
			},
			{
				title : '操作',
				className : 'action-column',
				width : 100,
				render : (text, record, index) => (
					<span className="table-action">
						<Popconfirm title="确定要删除吗？" onConfirm={this.confirmDelete.bind(this, text.per_id, index)} okText="Yes" cancelText="No">
							<a href="javascript:void(0);">删除</a>
						</Popconfirm>
					</span>
				)
			}
		]
		return (
			<div className="main-box">
				<div className="top-nav">
					权限管理 > 权限列表
				</div>
				<div className="div-1">
					<Input prefix={<Icon type="search" style={{ color : '#d9d9d9' }} />} placeholder="ID、权限名" />
					<Button type="primary">搜索</Button>
					<Button type="primary" onClick={this.handleAddPower}>添加权限</Button>
				</div>
				<div className="table-box">
					<h2><Icon type="menu-unfold" />权限列表</h2>
					<Table 
						columns = {columns}
						dataSource = {this.state.power_list}
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

export default PowerList;