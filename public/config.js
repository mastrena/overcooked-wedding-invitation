/**
 * ================================================================
 *  新手只需要修改这个文件。其他文件不要动，也能完成一份婚礼邀请函。
 *  修改引号里的文字即可；每一行末尾的英文逗号请保留。
 * ================================================================
 */

window.WEDDING_INVITATION = {
  // 1. 新郎与新娘信息（占位符）
  heroName: '新郎&新娘',
  englishName: 'CHEFS OF HONOR',

  // 2. 时间：dateTime 用于倒计时，必须保持 2030-10-01T18:30:00+08:00 这种格式
  dateTime: '2030-10-01T18:30:00+08:00',
  dateLabel: '2030年10月1日 · 星期二',
  dateShort: '2030.10.01',
  timeLabel: '18:30',

  // 3. 地点与导航
  venue: '示例市婚礼宴会中心 · 主厨大厅',
  venueShort: '示例市婚礼宴会中心',
  coordinateLabel: 'WEDDING KITCHEN HQ',
  transport: '地铁 1 号线 A 口步行 5 分钟，建议绿色出行。',
  mapUrl: 'https://ditu.amap.com/',

  // 4. 主文案
  questTitle: '解锁厨房婚礼',
  invitationText: '婚宴筹备已经进入最后阶段，特邀各位主厨前来后厨报到、协助备菜，并一起见证、分享这道「一生一道」的料理。',
  giftNotice: '你来就是最好的调味料，请轻装赴约。',
  endingTitle: '婚礼后厨，正式开张',

  // 5. 当天流程：可以增加或删除整组 { ... }
  schedule: [
    { time: '18:30', title: '海面集合', detail: '签到 · 合影 · 与两位主厨会合', stars: '★' },
    { time: '19:00', title: '限定主菜', detail: '晚宴 · 碰杯 · 自由聊天', stars: '★★' },
    { time: '20:30', title: '隐藏关卡', detail: '婚礼蛋糕 · 切蛋糕 · 撒糖惊喜', stars: '★★★' },
    { time: '21:00', title: '派对时间', detail: '敬酒 · 合影 · 通宵大乱炖', stars: '★★★' },
  ],

  // 6. 角色来电文案。image 与 message 可自由替换
  crewMessages: [
    { name: 'PLATYPUS', image: './assets/chef-platypus-v2.png', message: '婚礼订单已派发，新人和亲友都已就位，请准时到后厨报到！' },
    { name: 'CROCODILE', image: './assets/chef-crocodile.webp', message: '主菜已备齐，今晚的菜单是「一生一道」，记得带好胃口和祝福。' },
    { name: 'MOUSE', image: './assets/chef-mouse.webp', message: '蛋糕已下单，蜡烛已备好，就差你的那一颗许愿之心。' },
    { name: 'OCTOPUS', image: './assets/chef-octopus-v2.png', message: '香槟已冰好，今晚我们只负责举杯、碰杯、把快乐值拉满。' },
  ],

  // 7. 限时配餐小游戏：可配置订单与食材
  gameRecipes: [
    { name: '芝士汉堡',   parts: ['🍞', '🥩', '🧀', '🥬', '🍞'] },
    { name: '番茄肉丸',   parts: ['🍅', '🥩', '🧅', '🍅'] },
    { name: '凯撒沙拉',   parts: ['🥬', '🧀', '🍞', '🥬'] },
    { name: '甜蜜蛋糕',   parts: ['🍰', '🎂', '🍰'] },
  ],
  gameBlessings: ['今天也要闪闪发光', '快乐补给已到账', '好运正在靠近', '愿望能量 +100', '新阶段继续勇敢', '百年好合，永远开心'],
  gameRewards: ['新阶段万事顺意', '幸福值永久 MAX', '好运连击 +100', '健康能量已补满', '愿望正在加速实现', '爱意已永久附魔'],

  // 8. 背景音乐：使用胡闹厨房 2 官方主题曲试听链接（已下载到 ./assets/bgm.m4a）
  musicEnabled: true,
  musicUrl: './assets/bgm.m4a',
  musicHint: '点击播放 / 关闭官方音乐',

  // 9. 宾客登记仅为本机演示：内容只保存在访客自己的浏览器中，不会上传
}
