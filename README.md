# 说明

- 基岩版服务器玩家行为监控插件
- 不需要任何加载器,基岩版原生addon.
- 可用在服务器，也可用在单机地图
- 本插件通过网络发送post请求给php服务器来记录日志
- 输出日志全中文
- 带有日志查询/筛选
- 不会改变游戏原生玩法
<br>
# 使用方法

### 打开你的地图的实验性api功能

- 导入世界到你的基岩版客户端
- 世界》编辑》实验性功能》实验版api
- 注意，开启此功能会导致无法获得成就，编辑世界nbt可解决此问题
  
### 复制config文件夹到你的基岩版专用服务器根目录

- ```bedrock-server.exe```所在的目录
  
### 复制worlds/Bedrock level文件夹下的内容到你的服务器地图文件夹

- ```level.dat```所在的目录
  
### 配置您的本地php服务器

- 配置好之后把php文件夹下的内容放在php服务器目录
- 更改```textlog.php```和```log.php```文件里的日志存储位置到你想要的目录
- 更改PlayerLogger文件夹下的main.js里的post请求```const req = new HttpRequest("http://localhost/textlog.php");```地址为你的php服务器的地址
  
### 开启服务器，测试是否生效

- 服务器控制台显示```[SERVER] Pack Stack - [00][PlayerLogger] [packid_ver][8a68d603-8388-4341-bdf2-cf132865728a_1.0.0] [path][worlds/Bedrock level/behavior_packs/PlayerLogger]```即为配置成功
- 在服务器里游玩，检查你设置的日志文件夹下有没有日志文件
- 浏览器访问```你的php服务地址/log.php```进行日志查询

<br>

# 其他

- 插件有圈地标名功能，详见```worlds\Bedrock level\behavior_packs\PlayerLogger\scripts\locsname.js```文件，会在日志输出中对坐标内的事件标记你自定义的地名。
- 全中文物品翻译有一些翻译不准确，在```worlds\Bedrock level\behavior_packs\PlayerLogger\scripts\itemsid.js```文件中，如有需要请自行纠正，当前翻译版本1.21.30
- 有一些不影响使用的小bug，请不要在意
- 欢迎补全功能以及修复bug
