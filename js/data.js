// 课程数据：小吴手绘汽车（重构版：五视角课程 + 流行车辆手绘）
export const SITE_DATA = {
  siteName: "小吴手绘汽车",
  courses: [
    {
      id: "front",
      title: "正视图",
      goal: "从正面掌握汽车比例与前脸造型",
      steps: [
        { caption: "第 1 步 · 起稿定位", art: "assets/new/front/step-01.webp" },
        { caption: "第 2 步 · 车身与前脸轮廓", art: "assets/new/front/step-02.webp" },
        { caption: "第 3 步 · 线条整理", art: "assets/new/front/step-04.webp" },
        { caption: "第 4 步 · 格栅、车灯与细节", art: "assets/new/front/step-03.webp" },
        { caption: "成品图", art: "assets/new/front/final.webp" }
      ],
      tips: ["正视图先定中轴与左右对称", "前脸的重点是比例和层次，不是细节", "画完用中轴检查左右是否对称"]
    },
    {
      id: "side",
      title: "侧视图",
      goal: "用车轮做比例尺，画出完整的车身侧面",
      steps: [
        { caption: "第 1 步 · 地面线与车轮定位", art: "assets/new/side/step-01.webp" },
        { caption: "第 2 步 · 车身外轮廓", art: "assets/new/side/step-02.webp" },
        { caption: "第 3 步 · 车窗与车门框架", art: "assets/new/side/step-03.webp" },
        { caption: "第 4 步 · 腰线与轮拱", art: "assets/new/side/step-04.webp" },
        { caption: "第 5 步 · 轮毂与分件", art: "assets/new/side/step-05.webp" },
        { caption: "第 6 步 · 光影与排线", art: "assets/new/side/step-06.webp" },
        { caption: "第 7 步 · 细节整理", art: "assets/new/side/step-07.webp" },
        { caption: "成品图", art: "assets/new/side/final.webp" }
      ],
      tips: ["轮子直径就是整台车的比例尺", "先轻线找形，再加重定型", "腰线决定整车姿态，务必一笔连贯"]
    },
    {
      id: "rear",
      title: "后视图",
      goal: "从车尾掌握对称、宽体与层次",
      steps: [
        { caption: "第 1 步 · 尾部框架与车轮", art: "assets/new/rear/step-01.webp" },
        { caption: "第 2 步 · 尾灯与后保险杠", art: "assets/new/rear/step-02.webp" },
        { caption: "第 3 步 · 结构整理", art: "assets/new/rear/step-03.webp" },
        { caption: "成品图", art: "assets/new/rear/final.webp" }
      ],
      tips: ["后视图同样要先画中轴，保证左右对称", "尾灯和牌照区域是视觉重点", "宽体感来自轮拱与肩线的对比"]
    },
    {
      id: "oblique",
      title: "斜视图",
      goal: "用透视辅助线画出最有立体感的斜侧角度",
      steps: [
        { caption: "第 1 步 · 透视辅助线", art: "assets/new/oblique/step-01.webp" },
        { caption: "第 2 步 · 几何体定位", art: "assets/new/oblique/step-02.webp" },
        { caption: "第 3 步 · 车身大形", art: "assets/new/oblique/step-03.webp" },
        { caption: "第 4 步 · 座舱与车窗框架", art: "assets/new/oblique/step-04.webp" },
        { caption: "第 5 步 · 轮廓整理", art: "assets/new/oblique/step-05.webp" },
        { caption: "第 6 步 · 轮拱与轮毂", art: "assets/new/oblique/step-06.webp" },
        { caption: "第 7 步 · 前脸与车灯", art: "assets/new/oblique/step-07.webp" },
        { caption: "第 8 步 · 分件与细节", art: "assets/new/oblique/step-08.webp" },
        { caption: "第 9 步 · 线条整理", art: "assets/new/oblique/step-09.webp" },
        { caption: "第 10 步 · 光影调子", art: "assets/new/oblique/step-10.webp" },
        { caption: "第 11 步 · 完成整理", art: "assets/new/oblique/step-11.webp" },
        { caption: "成品图", art: "assets/new/oblique/final.webp" }
      ],
      tips: ["斜视图先画消失点与辅助线，再画车", "透视椭圆的长轴永远水平", "近大远小：前轮比后轮大且低"]
    },
    {
      id: "interior",
      title: "舱内图",
      goal: "从驾驶座视角画出座舱空间与内饰",
      steps: [
        { caption: "第 1 步 · 座舱透视框架", art: "assets/new/interior/step-01.webp" },
        { caption: "第 2 步 · 中控与座椅结构", art: "assets/new/interior/step-02.webp" },
        { caption: "第 3 步 · 方向盘与仪表", art: "assets/new/interior/step-03.webp" },
        { caption: "第 4 步 · 车门内饰", art: "assets/new/interior/step-04.webp" },
        { caption: "第 5 步 · 空间与视野", art: "assets/new/interior/step-05.webp" },
        { caption: "第 6 步 · 细节补充", art: "assets/new/interior/step-06.webp" },
        { caption: "第 7 步 · 光影整理", art: "assets/new/interior/step-07.webp" },
        { caption: "成品图", art: "assets/new/interior/final.webp" }
      ],
      tips: ["舱内先画大透视：中控、座椅、方向盘", "玻璃与屏幕用反光表达", "线条按前实后虚拉开空间"]
    }
  ],
  popular: [
    {
      id: "zunjie",
      name: "尊界",
      note: "三视图：正、后、侧，练完五个视角课程后挑战整台车",
      views: [
        { name: "正视图", art: "assets/new/popular/zunjie/front.webp" },
        { name: "后视图", art: "assets/new/popular/zunjie/rear.webp" },
        { name: "侧视图", art: "assets/new/popular/zunjie/side.webp" }
      ]
    },
    {
      id: "wenjie",
      name: "问界",
      note: "三视图：正、后、侧，观察新能源车的比例与细节",
      views: [
        { name: "正视图", art: "assets/new/popular/wenjie/front.webp" },
        { name: "后视图", art: "assets/new/popular/wenjie/rear.webp" },
        { name: "侧视图", art: "assets/new/popular/wenjie/side.webp" }
      ]
    }
  ]
};