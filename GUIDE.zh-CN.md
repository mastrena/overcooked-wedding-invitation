# 完全零基础定制教程

这份教程写给不会代码的新手。你只需要准备信息、修改一个文件、替换可选素材，就能完成自己的婚礼邀请函。

## 一、先准备这些内容

- 新郎与新娘姓名（用于首页大字与所有文案署名）
- 婚礼日期与开始时间（用于倒计时，建议保留时区 `+08:00`）
- 婚礼地点（含交通说明），以及地图分享链接（高德 / 百度地图的"分享链接"功能）
- 邀请文案（一句开场白），礼物说明（一句给亲友的话）
- 当天流程（4-6 段时间 + 标题 + 一句描述）
- 4 段角色来电台词（保持厨师风格，可轻松可幽默）
- 限时配餐订单（4 道菜的 emoji 配方，如 `['🍞', '🥩', '🧀', '🥬', '🍞']`）
- 可选：替换 BGM（见第六节）

## 二、只修改 `public/config.js`

用记事本、VS Code 或其他文本编辑器打开 `public/config.js`。修改**引号里的中文文字**，保留英文引号、冒号、每行末尾的英文逗号。**不要修改**键名（如 `heroName`、`dateTime`）、**不要修改** `window.WEDDING_INVITATION = { ... }` 包裹层。

例如：

```js
heroName: '李雷 & 韩梅梅',
dateTime: '2027-10-01T18:30:00+08:00',
dateLabel: '2027年10月1日 · 星期五',
timeLabel: '18:30',
venue: '成都市锦江区某酒店 · 二层宴会厅',
mapUrl: '你的高德或百度地图分享链接',
```

### 1. 新人与英文代号

```js
heroName: '新郎名字 & 新娘名字',
englishName: 'CHEFS OF HONOR',
```

- `heroName` 会出现在首页大字、文案署名、登记表预设等位置；用 `&` 或 `&amp;` 连接两人姓名。
- `englishName` 是大写英文代号，5-12 字符最佳，没有可保留 `CHEFS OF HONOR`。

### 2. 时间

```js
dateTime: '2030-10-01T18:30:00+08:00',
dateLabel: '2030年10月1日 · 星期二',
dateShort: '2030.10.01',
timeLabel: '18:30',
```

- `dateTime` **专用于倒计时**，格式必须是 `年-月-日T小时:分钟:秒+时区`。改完务必校对。
- `dateLabel` 是文案里"中文长格式"，需手动同步日期与星期几（可对照日历）。
- `dateShort` 是顶部 HUD 显示的短日期 `YYYY.MM.DD`。
- `timeLabel` 仅显示时间。

### 3. 地点与导航

```js
venue: '示例市婚礼宴会中心 · 主厨大厅',
venueShort: '示例市婚礼宴会中心',
coordinateLabel: 'WEDDING KITCHEN HQ',
transport: '地铁 1 号线 A 口步行 5 分钟，建议绿色出行。',
mapUrl: 'https://ditu.amap.com/',
```

- `venue` 是详细地点（含厅号）；`venueShort` 是简短地点（首页 HUD 显示）。
- `transport` 写明交通方式（地铁 / 公交 / 自驾 + 停车场 / 打车）。
- `mapUrl` 是公开地图分享链接，国内推荐高德或百度地图。

> 怎么拿到高德地图分享链接？打开高德地图 → 搜地点 → 点"分享" → 选"链接" → 复制得到的 `https://uri.amap.com/...` 开头的链接。

### 4. 主文案

```js
questTitle: '解锁厨房婚礼',
invitationText: '婚宴筹备已经进入最后阶段，特邀各位主厨前来后厨报到、协助备菜，并一起见证、分享这道「一生一道」的料理。',
giftNotice: '你来就是最好的调味料，请轻装赴约。',
endingTitle: '婚礼后厨，正式开张',
```

- `questTitle` 是订单卡顶部大字（保持简洁，5-10 字最佳）。
- `invitationText` 是邀请正文（40-80 字），可放你们的相识故事或婚礼主题。
- `giftNotice` 是礼物说明（15-30 字，避免强求红包或礼物的措辞）。
- `endingTitle` 是结尾大标题。

### 5. 当天流程

```js
schedule: [
  { time: '18:30', title: '海面集合', detail: '签到 · 合影 · 与两位主厨会合', stars: '★' },
  ...
],
```

每一组 `{ ... }` 是一条流程：

- `time`：建议 `HH:MM` 24 小时制。
- `title`：流程标题（5-8 字）。
- `detail`：一句话描述，可用 `·` 分隔。
- `stars`：`★` / `★★` / `★★★` 强调重要程度。

可以**复制整行**增加流程；删除时连同 `{` 到 `},` 的完整一行一起删。

### 6. 角色来电文案

```js
crewMessages: [
  { name: 'PLATYPUS', image: './assets/chef-platypus.png', message: '...' },
  ...
],
```

- `name`：厨师代号，可自由替换（保持大写英文字符或短中文名）。
- `image`：建议不要修改，否则头像与姓名错位。
- `message`：一句台词（30-60 字最佳），保持"轻松幽默 + 真挚祝福"的厨房氛围。

修改 `image` 时记得把对应图片放进 `public/assets/`，并同步修改 [THIRD_PARTY_ASSETS.md](./THIRD_PARTY_ASSETS.md)。

### 7. 限时配餐小游戏

```js
gameRecipes: [
  { name: '芝士汉堡',   parts: ['🍞', '🥩', '🧀', '🥬', '🍞'] },
  ...
],
gameBlessings: ['今天也要闪闪发光', '...'],
gameRewards: ['新阶段万事顺意', '...'],
```

- `gameRecipes` 决定小游戏出现哪些订单。每个 `parts` 是食材 emoji 数组，长度 3-6 个最佳。
- `gameBlessings` 是从首页游戏区显示的"积攒好运"小标签（不影响主流程，可选）。
- `gameRewards` 是配餐结算时随机抽取的彩蛋文字，建议 5-10 条，每条 8-16 字。

新增订单的 emoji 可从系统 emoji 选择器复制；保持 emoji 跨平台渲染稳定（建议用主流系统 emoji 而非自造符号）。

### 8. 背景音乐

```js
musicEnabled: true,
musicUrl: './assets/bgm.m4a',
musicHint: '点击播放 / 关闭官方音乐',
```

- `musicEnabled`：是否默认开启音乐（自动播放受浏览器限制，仍需用户首次点击触发）。
- `musicUrl`：音乐文件路径。模板默认使用本地 `public/assets/bgm.m4a`，来自第三方试听资源，**仅作个人演示**。
- `musicHint`：右下角音乐坞的提示文案。

#### 替换为你的音乐

1. 把音乐文件放进 `public/assets/`，建议 `.mp3` 或 `.m4a` 格式，文件大小 5 MB 以内（手机网络友好）。
2. 修改 `musicUrl` 为新文件名，例如：

   ```js
   musicUrl: './assets/wedding-song.mp3',
   ```

3. 修改 `musicHint` 与新曲目一致：

   ```js
   musicHint: '点击播放 / 关闭婚礼背景音乐',
   ```

4. 公开传播前确认音乐为**原创 / 已获商用授权 / CC0**之一，详见 [THIRD_PARTY_ASSETS.md](./THIRD_PARTY_ASSETS.md)。

### 9. 宾客登记演示

项目不提供真实宾客登记、管理后台或数据导出。访客填写的姓名、联系方式、人数和祝福只会保存在**访客当前浏览器**中，不会上传、不会发送给新人；清除浏览器的网站数据后记录也会消失。

因此，公开发布模板时可以放心保留这一段互动演示；不要把它当作正式人数统计工具。

## 三、保存后预览

修改完 `public/config.js`，**保存**后双击 `public/index.html` 即可在默认浏览器打开预览。无需安装任何依赖、无需构建。

预览时建议用 Chrome 开发者工具的设备模拟（iPhone 12 Pro / iPhone 14 / Pixel 7）切换到 390×844 视口检查；正式发给朋友前，请至少在一部真实手机（iOS + Android 各一）上完整打开一次。

## 四、常见错误与排查

### 修改后页面没有变化？

1. 浏览器缓存了旧版本：按 `Ctrl/Cmd + Shift + R` 强制刷新。
2. 修改的不是 `config.js`，而是其他文件 → 恢复原状。
3. JS 语法错误：浏览器开发者工具 Console 会显示 `Unexpected token` → 检查引号、逗号、括号是否成对。
4. `dateTime` 格式错：必须保留 `T` 分隔符与时区 `+08:00`。

### 中文乱码？

打开 `config.js` 时编辑器选择了错误编码（GBK）→ 改用 UTF-8 重新打开。VS Code 右下角点击编码 → "Reopen with Encoding" → "UTF-8"。

### 想隐藏某个章节？

最简单：在 `index.html` 找到对应 `<section>`，整段用 `<!--` 和 `-->` 注释包裹。例如隐藏厨师报到：

```html
<!--
<section class="rsvp-section story-section" id="rsvp">
  ...
</section>
-->
```

### 想删除右下角音乐坞？

在 `index.html` 末尾删除整个 `<div class="music-dock" ...>...</div>`，并把 `config.js` 中 `musicEnabled` 改成 `false`。

## 五、进阶定制（需修改 HTML/CSS/JS）

以下操作需具备基本前端知识，建议交给 AI：

- 增加 / 删除区块
- 调整配色（修改 `style.css` 顶部的 CSS 变量）
- 替换图标字体或主题
- 接入真实数据收集后端

参考 [AI_SETUP_PROMPT.md](./AI_SETUP_PROMPT.md) 中的"如果需要更深度定制"段落。

## 六、把邀请函分享给亲朋好友

请发送**部署后的 HTTPS 网页地址**，不要发 `index.html` 文件、`localhost` 地址或 GitHub 仓库地址。

推荐顺序：

1. 先请 2～3 位朋友分别用苹果和安卓手机试开。
2. 检查首页、音乐、小游戏、地图、底部导航和赴约登记。
3. 再通过微信私聊或群聊发送链接，配一小段邀请文字。
4. 另外做一张带二维码的邀请图，作为朋友圈和现场指示牌的备用入口。

#### 微信分享卡片

把链接发到微信时，会自动取 `<meta property="og:*">` 作为分享卡片。本项目已在 `index.html` 设置好：

- `og:title`：OVERCOOKED WEDDING｜婚礼后厨邀请函
- `og:description`：一份胡闹厨房 2 风格的互动婚礼邀请函。
- `og:image`：`./assets/hero-castle.jpg`（首页城堡夜景）

如果你想换分享图，把对应图片放到 `assets/` 并修改 `og:image` 那一行。

#### 朋友仍看到旧版本？

部署后第一次访问可能拿到浏览器/CDN 缓存：

- 让对方在链接打开后下拉刷新（Android），或在浏览器设置中"清除网站数据"（iOS Safari）；
- 部署平台自带缓存的（如 WorkBuddy 发布、GitHub Pages），通常 30 秒 - 5 分钟内自动更新；
- 如果分享给微信好友看不到新封面图，把链接发给"文件传输助手"打开一次刷新元数据，再发送即可。

## 七、版权与素材替换

⚠️ 模板默认使用《胡闹厨房 2》原版游戏画面作为视觉素材。仅作个人演示与测试可以接受，正式婚礼前请务必替换为原创或已授权素材，否则可能收到权利人下架要求。详见：

- [COPYRIGHT_NOTICE.md](./COPYRIGHT_NOTICE.md)
- [THIRD_PARTY_ASSETS.md](./THIRD_PARTY_ASSETS.md)

## 八、发布成网址

### 方式一：GitHub Pages（推荐，无需服务器或密钥）

本项目是纯静态网页，不会上传任何宾客登记数据，也不需要服务器、数据库、密钥或部署工作流。根目录已经有一个跳转页，GitHub Pages 发布仓库根目录后会自动打开 `public/` 中的邀请函。

首次开启只需操作一次：

1. 打开你自己的 GitHub 仓库页面。
2. 点击顶部 **Settings**。
3. 在左侧找到 **Pages**。
4. 在 **Build and deployment** 的 **Source** 下拉框选择 **Deploy from a branch**。
5. 在 **Branch** 下拉框选择 `main`，右侧目录选择 `/ (root)`，点击 **Save**。
6. 等待 1～3 分钟，点击 Pages 页面显示的网址，或按以下格式打开：

   ```text
   https://你的GitHub用户名.github.io/仓库名/
   ```

以后更新只需：修改 `public/config.js` 或替换 `public/assets/` 中的素材 → 提交并推送到 `main` 分支 → 等待 1～3 分钟刷新网址。网址不会改变。

#### 发布后打开空白页或资源丢失？

1. 确认 Settings → Pages 的 Source 是 **Deploy from a branch**，分支是 `main`，目录是 `/ (root)`。
2. 确认没有删除根目录 `index.html`，以及 `public/index.html`、`public/style.css`、`public/app.js` 或 `public/config.js`。
3. 等待 1～3 分钟后再刷新；首次启用 Pages 有时会更久。
4. 在手机端访问时必须使用带仓库名的完整地址，例如 `https://用户名.github.io/仓库名/`，不要漏掉最后的 `/`。

### 方式二：AI 工具一键发布

不想接触 GitHub 时，可使用支持静态网页发布的 AI 工具。注意它们的账号、额度、地址稳定性和数据政策各不相同；本模板只适合静态展示和本机演示登记。可参考 [AI 工具发布说明](./AI_PUBLISH_GUIDE.zh-CN.md)。

## 九、更新与版本管理

每次修改 `public/config.js` 后：

1. 本地预览确认无误；
2. 重新部署（按你选择的发布方式重新触发）；
3. 通知已收到旧链接的朋友刷新一次。

如果把项目 fork 到 GitHub，建议每次修改按语义化版本提交（`v1.1.0` 之类），并在 README 顶部写当前里程碑，方便日后回滚。
