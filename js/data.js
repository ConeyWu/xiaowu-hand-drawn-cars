// 课程数据：小吴手绘汽车（汽车设计手绘预科课程）
export const SITE_DATA = {
  siteName: "小吴手绘汽车",
  units: [
    {
      id: "unit-1",
      title: "单元一 · 比例与结构",
      lessons: [
        {
          id: 1,
          title: "汽车比例系统",
          goal: "用轮径 D 作为基准，掌握真实汽车的车长、轴距与车高比例。",
          steps: [
            { caption: "画两个轮径圆，作为比例的基准尺", art: "assets/illustrations/lesson-01-step-01.svg" },
            { caption: "定出轴距与前悬、后悬的位置", art: "assets/illustrations/lesson-01-step-02.svg" },
            { caption: "用 D 校核车长与车高：车长约 7D、车高约 2.2D", art: "assets/illustrations/lesson-01-step-03.svg" },
            { caption: "画出带轮拱的整体轮廓", art: "assets/illustrations/lesson-01-step-04.svg" },
          ],
          tips: ["比例是设计的骨架，先定 D 再画细节", "画完用 D 量一遍：轴距≈4.3D、车高≈2.2D"],
        },
        {
          id: 2,
          title: "透视基础",
          goal: "理解视平线与轮子的透视椭圆，让车稳稳立在纸面上。",
          steps: [
            { caption: "先画视平线和地面线", art: "assets/illustrations/lesson-02-step-01.svg" },
            { caption: "画前轮与后轮的透视椭圆（前大后小）", art: "assets/illustrations/lesson-02-step-02.svg" },
            { caption: "确定轮毂圆心的透视位置", art: "assets/illustrations/lesson-02-step-03.svg" },
            { caption: "加地面投影，确认整车的姿态", art: "assets/illustrations/lesson-02-step-04.svg" },
          ],
          tips: ["视平线越高，看到的车顶越多", "透视椭圆的长轴永远是水平的"],
        },
        {
          id: 3,
          title: "侧视造型",
          goal: "从真实轮廓出发，练习腰线、座舱与悬垂的姿态控制。",
          steps: [
            { caption: "先定轮距与轮径，再起整体轮廓", art: "assets/illustrations/lesson-03-step-01.svg" },
            { caption: "座舱位置：控制 A 柱与 C 柱的倾斜", art: "assets/illustrations/lesson-03-step-02.svg" },
            { caption: "让腰线（beltline）贯穿整个车身", art: "assets/illustrations/lesson-03-step-03.svg" },
            { caption: "调整前后悬与姿态（stance）", art: "assets/illustrations/lesson-03-step-04.svg" },
          ],
          tips: ["腰线是侧视的灵魂线，先轻后重", "轮拱越贴近车轮，姿态越有运动感"],
        },
        {
          id: 4,
          title: "线稿质量控制",
          goal: "练习长线一笔过，区分结构线与造型线。",
          steps: [
            { caption: "用轻结构线定位比例", art: "assets/illustrations/lesson-04-step-01.svg" },
            { caption: "造型线：外轮廓尽量一笔画过", art: "assets/illustrations/lesson-04-step-02.svg" },
            { caption: "分件线：门缝、引擎盖、保险杠", art: "assets/illustrations/lesson-04-step-03.svg" },
            { caption: "在转折与受光处加重线", art: "assets/illustrations/lesson-04-step-04.svg" },
            { caption: "完成一张干净的侧视线稿", art: "assets/illustrations/lesson-04-step-05.svg" },
          ],
          tips: ["画长线用手臂发力，不要用手腕", "先轻后重：轻线找形，重线定型"],
        },
      ],
    },
    {
      id: "unit-2",
      title: "单元二 · 新能源设计语言",
      lessons: [
        {
          id: 5,
          title: "前脸与封闭式格栅",
          goal: "理解 EV 前脸设计语言：封闭格栅、曲面与分件线。",
          steps: [
            { caption: "观察真实 EV 前脸的封闭式处理", art: "assets/illustrations/lesson-05-step-01.svg" },
            { caption: "画前脸曲面与下保险杠的分件", art: "assets/illustrations/lesson-05-step-02.svg" },
            { caption: "用连续长线表现干净的曲面", art: "assets/illustrations/lesson-05-step-03.svg" },
            { caption: "对比油车格栅与电车封闭前脸", art: "assets/illustrations/lesson-05-step-04.svg" },
          ],
          tips: ["没有格栅意味着元素更少，曲面必须更准确", "分件线要顺着曲面走势画"],
        },
        {
          id: 6,
          title: "灯光设计",
          goal: "画出贯穿式灯带与日行灯，理解灯具与品牌语言的关系。",
          steps: [
            { caption: "定位灯带：一条贯穿前脸的横线", art: "assets/illustrations/lesson-06-step-01.svg" },
            { caption: "画出灯组上扬的'眼神'", art: "assets/illustrations/lesson-06-step-02.svg" },
            { caption: "表现灯腔的高光与层次", art: "assets/illustrations/lesson-06-step-03.svg" },
            { caption: "用留白强调发光感", art: "assets/illustrations/lesson-06-step-04.svg" },
          ],
          tips: ["灯带是新能源车的品牌签名", "高光靠留白表现，不要涂白"],
        },
        {
          id: 7,
          title: "轮毂与细节",
          goal: "设计轮毂：辐条布局、轮拱关系与细节层级。",
          steps: [
            { caption: "先定轮毂圆与轮拱的间距", art: "assets/illustrations/lesson-07-step-01.svg" },
            { caption: "画辐条布局（奇数辐更显运动）", art: "assets/illustrations/lesson-07-step-02.svg" },
            { caption: "表现轮拱阴影与轮胎侧壁", art: "assets/illustrations/lesson-07-step-03.svg" },
            { caption: "加门缝、后视镜等二级细节", art: "assets/illustrations/lesson-07-step-04.svg" },
            { caption: "检查细节层级：先大形，后细节", art: "assets/illustrations/lesson-07-step-05.svg" },
          ],
          tips: ["细节要有主次：第一眼先看到整体比例", "辐条从轮毂中心放射，注意透视"],
        },
        {
          id: 8,
          title: "草图迭代",
          goal: "用五分钟快稿，在同一比例下画出多个方案。",
          steps: [
            { caption: "固定比例基准：D 圆与轴距", art: "assets/illustrations/lesson-08-step-01.svg" },
            { caption: "快速画两三个不同姿态的方案", art: "assets/illustrations/lesson-08-step-02.svg" },
            { caption: "对比方案，圈出最强的一个", art: "assets/illustrations/lesson-08-step-03.svg" },
            { caption: "在选中方案上加设计细节", art: "assets/illustrations/lesson-08-step-04.svg" },
          ],
          tips: ["快稿不追求干净，追求数量与想法", "先求差异，再求完善"],
        },
      ],
    },
    {
      id: "unit-3",
      title: "单元三 · 渲染与创作",
      lessons: [
        {
          id: 9,
          title: "马克笔渲染",
          goal: "掌握平涂、渐变、叠色与高光留白四种基本技法。",
          steps: [
            { caption: "平涂：均匀快速地铺色", art: "assets/illustrations/lesson-09-step-01.svg" },
            { caption: "渐变：从深到浅过渡", art: "assets/illustrations/lesson-09-step-02.svg" },
            { caption: "叠色：建立阴影层次", art: "assets/illustrations/lesson-09-step-03.svg" },
            { caption: "高光留白与局部提亮", art: "assets/illustrations/lesson-09-step-04.svg" },
          ],
          tips: ["马克笔要快速扫过，不要来回涂", "先浅后深，控制叠色次数"],
        },
        {
          id: 10,
          title: "光影与材质",
          goal: "表现车身反光、玻璃与轮胎的材质差异。",
          steps: [
            { caption: "车身：上明下暗的柱面反光", art: "assets/illustrations/lesson-10-step-01.svg" },
            { caption: "玻璃：斜向的反射带", art: "assets/illustrations/lesson-10-step-02.svg" },
            { caption: "轮胎：哑光深色加一条高光弧", art: "assets/illustrations/lesson-10-step-03.svg" },
            { caption: "地面接触阴影定住整车", art: "assets/illustrations/lesson-10-step-04.svg" },
          ],
          tips: ["玻璃与车身的反光方向要保持一致", "哑光与亮面靠明度差区分"],
        },
        {
          id: 11,
          title: "3/4 视角",
          goal: "掌握设计稿最常用的 3/4 前视角画法。",
          steps: [
            { caption: "画透视盒：视平线与消失方向", art: "assets/illustrations/lesson-11-step-01.svg" },
            { caption: "前脸梯形与侧面的透视关系", art: "assets/illustrations/lesson-11-step-02.svg" },
            { caption: "轮子透视椭圆与轮拱", art: "assets/illustrations/lesson-11-step-03.svg" },
            { caption: "灯组与前脸曲面", art: "assets/illustrations/lesson-11-step-04.svg" },
            { caption: "完成 3/4 视角线稿", art: "assets/illustrations/lesson-11-step-05.svg" },
          ],
          tips: ["3/4 视角同时看到前脸和侧面两个面", "轮子椭圆长轴的角度决定透视强度"],
        },
        {
          id: 12,
          title: "概念车创作",
          goal: "完成一个完整流程：灵感→比例→造型→渲染→命名。",
          steps: [
            { caption: "定主题与灵感方向", art: "assets/illustrations/lesson-12-step-01.svg" },
            { caption: "用 D 圆定比例，画两三个方案", art: "assets/illustrations/lesson-12-step-02.svg" },
            { caption: "定稿造型与关键线条", art: "assets/illustrations/lesson-12-step-03.svg" },
            { caption: "渲染光影与材质", art: "assets/illustrations/lesson-12-step-04.svg" },
            { caption: "加背景、写车名与设计说明", art: "assets/illustrations/lesson-12-step-05.svg" },
          ],
          tips: ["设计说明写三句话：灵感、比例、目标用户", "命名要短，有画面感"],
        },
      ],
    },
  ],
};
