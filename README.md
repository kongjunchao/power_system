## 权限管理系统 前端框架

#### 基于React的权限管理系统前端部分

#### 开发环境
* Node 6.9.4

#### 开发工具
* Sublime

#### 框架
* React 15.3.2

#### UI
* Ant Design 2.4.2

#### 插件
* 根目录下-package.json
* 通过“npm install”自动安装package.json中的所有依赖插件，需要注意的是，各插件工具的版本一直在迭代更新，会出现不兼容的可能性，有时需要自己修改下webpack配置文件中的一些语法规则，install的时候会有报错提示，这个坑我也踩了很多遍了，推荐自己去看一下webpack的使用方法，按照依赖包重新装一遍

#### 打包工具
* Webpack 1.13.3

#### 数据请求
* 项目是使用Fetch作为请求方式，但该项目源码只是初期原型，并没有涉及到真正的请求接口，仅有部分随机生成的模拟数据供展示，需要自己写一下这块内容

#### 测试环境
webpack.config.js为webpack测试环境下的配置文件，package.json文件存放依赖模块
项目根目录下执行命令“npm start”，浏览器访问localhost:7777/login.html即可

#### 生产环境
webpack.production.config.js为webpack生产环境下的配置文件，package.json文件存放依赖模块
项目根目录下执行命令“npm run build”，dist文件夹中会自动生成压缩合并后的js和css文件，注意vendor.min.js仅用于提取公共js文件，并无用途，实际上线可删除

#### 组件相关
项目中所使用的组件存放在components/js文件夹中，其中common文件夹中存放公共组件