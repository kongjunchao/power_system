/**
 * @author JUNCHAO KONG
 * @date 2016-10-19
 * @description 主入口模块
 */

import React from 'react';
import ReactDom from 'react-dom';
//引入路由
import { Router, Route, hashHistory, Link, IndexLink, Redirect, IndexRedirect, IndexRoute } from 'react-router';
//引入子模块
import UserList from './user_list.js';				//用户列表
import UserAdd from './user_add.js';				//添加用户
import RoleList from './role_list.js';				//角色列表
import RoleAdd from './role_add.js';				//添加角色
import PowerList from './power_list.js';			//权限列表
import PowerAdd from './power_add.js';				//添加权限

import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
//引入样式表
import 'antd/dist/antd.css';
import '../css/main.scss';

class Main extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			theme : 'light',
			mode : 'inline',
			username : '',
			current : '1',
			openKeys : [],
			leftDivShow : true
		}
	}
	
	onOpenChange(openKeys){
		const state = this.state;
		const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
		const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
		let nextOpenKeys = [];
		if(latestOpenKey){
			nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
		}
		if(latestCloseKey){
			nextOpenKeys = this.getAncestorKeys(latestCloseKey);
		}
		this.setState({
			openKeys : nextOpenKeys
		})
	}
	
	handleClick(e){
		this.setState({
			current : e.key
		})
	}
	
	getAncestorKeys(key){
		const map = {
		};
		return map[key] || [];
	}
	
	//滚动提示信息
	scrollTips(){
		var tipsBox = document.getElementsByClassName('tips')[0],
			tips = tipsBox.childNodes,
			height = 20;
		if(tips.length < 2){
			return;
		}
		tipsBox.style.position = 'relative';
		for(let i = 0, len = tips.length; i < len; i++){
			tips[i].style.position = 'absolute';
			tips[i].style.top = i * height + 'px';
		}
		setInterval(function(){
			for(let i = 0, len = tips.length; i < len; i++){
				tips[i].style.transition = 'top .6s';
				tips[i].style.top = parseInt(tips[i].style.top) - height + 'px';
				if(parseInt(tips[i].style.top) <= -height){
					tips[i].style.transition = '';
					tips[i].style.top = (len - 1) * height + 'px';
				}
			}
		}, 4000)
	}
	
	//隐藏侧边栏
	toggleLeftStatus(){
		var left = document.getElementById('left'),
			right = document.getElementById('right'),
			toggleBtn = document.getElementsByClassName('hide-left-btn')[0];
		if(this.state.leftDivShow === true){
			left.style.width = '1%';
			right.style.width = '99%';
			toggleBtn.style.left = '1%';
		}else{
			left.style.width = '15%';
			right.style.width = '85%';
			toggleBtn.style.left = '15%';
		}
		this.setState({
			leftDivShow : !this.state.leftDivShow
		})
	}
	
	//退出系统
	loginOut(){
		window.location.href = 'login.html';
	}

	//父组件向子组件传递参数
	renderChildren(props){
		var that = this;
		return React.Children.map(props.children, function(child){
			return React.cloneElement(child, {
				city : that.state.city
			})
		})
	}
	
	componentDidMount(){
		this.scrollTips();
	}
	
	render(){
		return (
			<div className="main">
				<div className="top">
					<img src="./components/images/logo.png" />
					<ul className="tips">
						<li>新版本权限管理系统上线啦!!!</li>
						<li>系统在调试阶段,有任何问题请随时联系开发人员!!!</li>
						<li>建议使用Google Chrome以获得最佳浏览体验</li>
					</ul>
					<div className="top-right">
						<span>xxx</span>|
						<span onClick={this.loginOut.bind(this)}>退出</span>
					</div>
				</div>
				<div className="left" id="left">
					<Menu
						mode = {this.state.mode}
						theme = {this.state.theme}
						openKeys = {this.state.openKeys}
						selectedKeys = {[this.state.current]}
						onOpenChange = {this.onOpenChange.bind(this)}
						onClick = {this.handleClick.bind(this)}
						style = {{width:'100%'}}
					>
						<SubMenu key="sub1" title={<span><Icon type="user" /><span>用户管理</span></span>}>
							<Menu.Item key="1"><Link to="/UserList">用户列表</Link></Menu.Item>
							<Menu.Item key="2"><Link to="/UserAdd">添加用户</Link></Menu.Item>
						</SubMenu>
						<SubMenu key="sub2" title={<span><Icon type="rocket" /><span>角色管理</span></span>}>
							<Menu.Item key="3"><Link to="/RoleList">角色列表</Link></Menu.Item>
							<Menu.Item key="4"><Link to="/RoleAdd">添加角色</Link></Menu.Item>
						</SubMenu>
						<SubMenu key="sub3" title={<span><Icon type="heart-o" /><span>权限管理</span></span>}>
							<Menu.Item key="5"><Link to="/PowerList">权限列表</Link></Menu.Item>
							<Menu.Item key="6"><Link to="/PowerAdd">添加权限</Link></Menu.Item>
						</SubMenu>
					</Menu>
				</div>
				<div className="right" id="right">
					{this.renderChildren(this.props)}
				</div>
				<div className="hide-left-btn" onClick={this.toggleLeftStatus.bind(this)}></div>
			</div>
		);
	}

}

//配置路由
ReactDom.render((
	<Router history={hashHistory}>
		<Route path="/" component={Main}>
			//访问根路由的时候，重定向到首页
			<IndexRedirect to="/UserList" />
			<Route path="/UserList" component={UserList} />
			<Route path="/UserAdd" component={UserAdd} />
			<Route path="/RoleList" component={RoleList} />
			<Route path="/RoleAdd" component={RoleAdd} />
			<Route path="/PowerList" component={PowerList} />
			<Route path="/PowerAdd" component={PowerAdd} />
		</Route>
	</Router>
), document.getElementById('main'))