# 第三方素材范围

`assets/` 中的场景、角色和动画图片沿用了《胡闹厨房 2》（Overcooked! 2）原版游戏相关的视觉素材，不属于本项目原创代码的许可范围，其权利归各自权利人所有。

> ⚠️ 准备公开、转发或商业使用前，应将下列所有文件替换为原创或已获得明确授权的素材，并同步修改本文件下方的来源说明。

## 图片与 Logo

| 文件 | 用途 | 来源 | 权利归属 |
| --- | --- | --- | --- |
| `hero-castle.jpg` | 首页城堡夜景 | Epic Games Store《Overcooked! 2》官方商店截图 | Team17 / Ghost Town Games / MOD 工作室 |
| `ending-bus.jpg` | 结尾气球巴士全景 | Epic Games Store《Overcooked! 2》官方商店截图 | 同上 |
| `kitchen-warm.jpg` | 菜单区后厨营业场景 | Steam 商店《Overcooked! 2》官方截图 | 同上 |
| `logo.png` | OVERCOOKED! 2 透明 Logo | Steam CDN 官方商店素材 | 同上 |
| `onionking.webp` | 洋葱国王（证婚人） | Fandom `static.wikia.nocookie.net` 静态 CDN | 同上 + Fandom 社区（聚合） |
| `chef-platypus.png` | 鸭嘴兽厨师头像 | vhv.rs 透明 PNG 聚合站 | Team17 / Ghost Town Games |
| `chef-crocodile.png` | 鳄鱼厨师头像（去白底处理） | Team17 官方厨师图（白底 PNG，已用 Pillow 自动裁切并去除白底） | 同上 |
| `chef-mouse.png` | 老鼠厨师头像（去白底处理） | 同上 | 同上 |
| `chef-octopus.png` | 章鱼厨师头像（去白底处理） | 同上 | 同上 |

### 替换建议

- **场景图（城堡、巴士、后厨）**：换成自己婚礼场地的实拍照片、插画师原创插图或无版权可商用素材（如 Unsplash / Pexels 上的 CC0 摄影作品）。
- **Logo**：删除该元素或换成新人手写 logo / 字母组合。
- **角色头像**：换成定制婚礼插画（如像素风厨师、Q 版卡通人形），或四个由本地照片裁切而来的圆形头像。
- **洋葱国王（证婚人）**：若证婚人有代表性造型，可换成该造型照片；否则建议换成"婚礼 logo + 装饰圆形"的占位。

替换完成后，请在 README 与本文件顶部同时更新说明，避免误导观看者认为仍是官方素材。

## 背景音乐

`assets/bgm.m4a` 是《Overcooked! 2》主题曲片段，下载自第三方试听资源（iTunes AudioPreview）。该音频不属于 MIT 许可证范围，其权利归相关权利人所有，仅用于个人演示。远程试听链接可能被提供方变更、限制或删除。

长期公开传播或商业使用前，请替换为：

- **原创音乐**（推荐）；
- **CC0 / CC-BY 授权素材**（如 Free Music Archive、YouTube Audio Library 中明确允许相应用途的曲目）；
- **已获得商用授权的版权音乐**。

替换方法：把新文件放进 `assets/`（建议 `.mp3` 或 `.m4a`），然后在 `config.js` 中更新：

```js
musicUrl: './assets/你的文件名.mp3',
```

并同步把 `musicHint` 改成与新曲目一致的提示文案（如"点击播放 / 关闭背景音乐"）。

## 第三方资源聚合站点声明

为方便个人演示，本项目从以下第三方站点下载或参考了游戏相关图片的链接：

- Epic Games Store（商店截图）
- Steam 商店官方页面与相关公开宣传页
- Fandom `static.wikia.nocookie.net`（社区图站静态 CDN）
- vhv.rs（透明 PNG 聚合）
- Apple iTunes（音乐试听）

这些站点本身不拥有游戏素材的版权，仅作为聚合分发渠道；真正权利人仍为 Team17、Ghost Town Games 与 MOD 工作室。
