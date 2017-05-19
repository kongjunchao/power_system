/**
 * @author JUNCHAO KONG
 * @date 2017-03-07
 * @description 添加权限模块
 */

import React from 'react';
import ReactDom from 'react-dom';
import { Input, Button, Select, Radio, message } from 'antd';
import Fetch from './common/fetch.js';
import FormReg from './common/form_reg.js';
import '../css/user_add.scss';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formReg = new FormReg();

class PowerAdd extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			menu : [],				//分组列表
			menu_checked : '',		//选中的分组
			status : '1',			//是否生效
			loading : false			//提交按钮加载状态
		}
		this.lock = false;
	}

	//改变选择分组下拉框
	handleChangeMenuSelect(value){
		if(!this.lock){
			this.setState({
				menu_checked : value
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

	//改变状态
	handleChangeStatus(e){
		if(!this.lock){
			this.setState({
				status : e.target.value
			})
		}
	}

	//点击提交按钮
	submitForm(){
		if(this.state.loading === true){
			return;
		}
		let that = this;
		let powername = this.refs.powername.refs.input.value.trim();
		let menu = this.state.menu_checked;
		let status = this.state.status;
		if(formReg.isEmpty(powername)){
			message.error('权限名不能为空');
			return;
		}
		if(formReg.isEmpty(menu)){
			message.error('请选择权限分类');
			return;
		}
		if(formReg.isEmpty(status)){
			message.error('请选择是否生效');
			return;
		}
		let info = {
			menu_id : menu,
			per_name : powername,
			is_valid : status
		}
		this.changeLoading(true);
		const useFetch = new Fetch('per/oper_permiss', info, function(data){
			console.log(data);
			if(data.status){
				message.success('提交成功');
			}else{
				message.error(data.msg || '添加权限失败');
			}
			setTimeout(function(){
				that.changeLoading(false);
				window.location.href = '#/PowerList';
			}, 1000)
		}, function(){
			message.error('添加权限失败');
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
	}

	//组件将被卸载
	componentWillUnmount(){
		this.lock = true;
	}

	componentDidMount(){
		let _this = this;
		const useFetch = new Fetch('per/menu_list', null, function(data){
			console.log(data);
			if(!_this.lock){
				_this.setState({
					menu : data.data,
					menu_checked : [String(data.data[0].id)]
				})
			}
		}, function(){
			message.error('权限分类请求失败');
		});
		useFetch.getFetch();
	}

	render(){
		return (
			<div className="main-box">
				<div className="top-nav">
					权限管理 > 添加权限
				</div>
				<div className="div-ul">
					<ul>
						<li>
							<span>权限名</span>
							<Input ref="powername" />
						</li>
						<li>
							<span>权限分类</span>
							<Select
								placeholder="请选择类别"
								value={this.state.menu_checked}
								onChange={this.handleChangeMenuSelect.bind(this)}
							>
								{
									this.state.menu.map(function(data, index){
										/* Option组件不支持传入Number类型的value */
										return <Option key={data.id} value={String(data.id)}>{data.name}</Option>
									})
								}
							</Select>
						</li>
						<li>
							<span>是否生效</span>
							<RadioGroup value={this.state.status} onChange={this.handleChangeStatus.bind(this)}>
								<RadioButton value="1">有效</RadioButton>
								<RadioButton value="0">无效</RadioButton>
							</RadioGroup>
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

export default PowerAdd;