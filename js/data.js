// 课程数据：小吴手绘汽车
export const SITE_DATA = {
  siteName: "小吴手绘汽车",
  units: [
    {
      id: "unit-1",
      title: "单元一 · 基础入门",
      lessons: [
        {
          id: 1,
          title: "认识汽车的结构",
          goal: "认识一辆车由车身、车轮、车窗、车灯组成。",
          steps: [
            { caption: "先画一条地平线", art: "assets/illustrations/lesson-01-step-01.svg" },
            { caption: "画车身：像一个大大的盒子", art: "assets/illustrations/lesson-01-step-02.svg" },
            { caption: "画两个车轮", art: "assets/illustrations/lesson-01-step-03.svg" },
            { caption: "加上车窗和车灯", art: "assets/illustrations/lesson-01-step-04.svg" },
          ],
          tips: ["先轻轻下笔，错了可以改", "一辆车 = 车身 + 车轮 + 车窗 + 车灯"],
        },
        {
          id: 2,
          title: "画圆与车轮",
          goal: "把轮子画圆，并安排好两个轮子的位置。",
          steps: [
            { caption: "画一个大大的圆", art: "assets/illustrations/lesson-02-step-01.svg" },
            { caption: "在右边再画一个一样大的圆", art: "assets/illustrations/lesson-02-step-02.svg" },
            { caption: "给每个轮子加上中心点", art: "assets/illustrations/lesson-02-step-03.svg" },
            { caption: "检查：两个圆一样大、在一条线上", art: "assets/illustrations/lesson-02-step-04.svg" },
          ],
          tips: ["圆画不好就多画几圈，别急着一次画成", "两个轮子之间留出大约两个轮子的距离"],
        },
        {
          id: 3,
          title: "车身轮廓",
          goal: "用长方形和梯形组合出车身轮廓。",
          steps: [
            { caption: "先画一个长方形", art: "assets/illustrations/lesson-03-step-01.svg" },
            { caption: "前面加一个梯形当车头", art: "assets/illustrations/lesson-03-step-02.svg" },
            { caption: "把尖角改成圆角", art: "assets/illustrations/lesson-03-step-03.svg" },
            { caption: "画出车底，留出车轮的位置", art: "assets/illustrations/lesson-03-step-04.svg" },
          ],
          tips: ["先想好车头朝左还是朝右", "新能源车的车身更圆润，角要圆圆的"],
        },
        {
          id: 4,
          title: "完成第一辆小车",
          goal: "组合车轮、车身、车窗，画出一辆完整的小车。",
          steps: [
            { caption: "先画两个一样大的车轮", art: "assets/illustrations/lesson-04-step-01.svg" },
            { caption: "用车身盖住车轮的上半部分", art: "assets/illustrations/lesson-04-step-02.svg" },
            { caption: "在车身上开一扇车窗", art: "assets/illustrations/lesson-04-step-03.svg" },
            { caption: "加上车灯和车门线", art: "assets/illustrations/lesson-04-step-04.svg" },
            { caption: "检查一下，第一辆小车完成！", art: "assets/illustrations/lesson-04-step-05.svg" },
          ],
          tips: ["车身要盖住车轮的上半部分", "画完退后一步看，哪里不像就改哪里"],
        },
      ],
    },
    {
      id: "unit-2",
      title: "单元二 · 新能源设计元素",
      lessons: [
        {
          id: 5,
          title: "封闭式前脸",
          goal: "了解电车为什么没有大格栅，画简洁的前脸。",
          steps: [
            { caption: "画圆润的车头轮廓", art: "assets/illustrations/lesson-05-step-01.svg" },
            { caption: "画一条下保险杠", art: "assets/illustrations/lesson-05-step-02.svg" },
            { caption: "前脸干干净净，不画格栅", art: "assets/illustrations/lesson-05-step-03.svg" },
            { caption: "记住：电车前脸没有大格栅", art: "assets/illustrations/lesson-05-step-04.svg" },
          ],
          tips: ["电车不需要大格栅散热，所以前脸更简洁", "越简洁，越显高级"],
        },
        {
          id: 6,
          title: "贯穿式大灯",
          goal: "画出又酷又亮的贯穿式大灯。",
          steps: [
            { caption: "在车头画一条横贯的灯带", art: "assets/illustrations/lesson-06-step-01.svg" },
            { caption: "灯带两端微微上扬", art: "assets/illustrations/lesson-06-step-02.svg" },
            { caption: "点几个小亮点当高光", art: "assets/illustrations/lesson-06-step-03.svg" },
            { caption: "用黄色点亮它", art: "assets/illustrations/lesson-06-step-04.svg" },
          ],
          tips: ["贯穿式大灯是新能源车的标志之一", "灯带两端微微上扬，更有精神"],
        },
        {
          id: 7,
          title: "轮毂与细节",
          goal: "画出好看的轮毂、车门线和后视镜。",
          steps: [
            { caption: "在轮子中间画一个大圆环", art: "assets/illustrations/lesson-07-step-01.svg" },
            { caption: "从中心画出轮毂辐条", art: "assets/illustrations/lesson-07-step-02.svg" },
            { caption: "画一条车门线", art: "assets/illustrations/lesson-07-step-03.svg" },
            { caption: "画一个小耳朵——后视镜", art: "assets/illustrations/lesson-07-step-04.svg" },
            { caption: "检查：细节都在该在的位置", art: "assets/illustrations/lesson-07-step-05.svg" },
          ],
          tips: ["细节越多车越精致，但线条要干净", "先画大结构，再加小细节"],
        },
        {
          id: 8,
          title: "充电口与隐藏门把手",
          goal: "画上充电口和隐藏式门把手。",
          steps: [
            { caption: "在车身侧面画一个充电口", art: "assets/illustrations/lesson-08-step-01.svg" },
            { caption: "画上充电盖的弧线", art: "assets/illustrations/lesson-08-step-02.svg" },
            { caption: "画一条细细的隐藏门把手", art: "assets/illustrations/lesson-08-step-03.svg" },
            { caption: "加一个小摄像头", art: "assets/illustrations/lesson-08-step-04.svg" },
          ],
          tips: ["充电口一般在车的侧面或车头", "隐藏门把手让车身更平滑"],
        },
      ],
    },
    {
      id: "unit-3",
      title: "单元三 · 创作进阶",
      lessons: [
        {
          id: 9,
          title: "让车动起来",
          goal: "用地面线、阴影和透视让车有速度感。",
          steps: [
            { caption: "画一条粗粗的地面线", art: "assets/illustrations/lesson-09-step-01.svg" },
            { caption: "轮子下面加椭圆阴影", art: "assets/illustrations/lesson-09-step-02.svg" },
            { caption: "车尾画几条速度线", art: "assets/illustrations/lesson-09-step-03.svg" },
            { caption: "把车身画低一点，更有速度感", art: "assets/illustrations/lesson-09-step-04.svg" },
          ],
          tips: ["阴影和速度线是'动起来'的秘诀", "车身越低，看起来越快"],
        },
        {
          id: 10,
          title: "上色技巧",
          goal: "学会平涂、渐变、高光三种上色方法。",
          steps: [
            { caption: "平涂：均匀地涂满车身", art: "assets/illustrations/lesson-10-step-01.svg" },
            { caption: "渐变：从下往上叠加深色", art: "assets/illustrations/lesson-10-step-02.svg" },
            { caption: "高光：车顶留一条白色弧线", art: "assets/illustrations/lesson-10-step-03.svg" },
            { caption: "车身底部加深色阴影边", art: "assets/illustrations/lesson-10-step-04.svg" },
          ],
          tips: ["涂色方向要一致，别乱涂", "高光让车有反光的高级感"],
        },
        {
          id: 11,
          title: "前后视角",
          goal: "画出车头正脸和车尾。",
          steps: [
            { caption: "画一个圆角梯形的车头", art: "assets/illustrations/lesson-11-step-01.svg" },
            { caption: "左右各画一只大灯", art: "assets/illustrations/lesson-11-step-02.svg" },
            { caption: "用灯带连接两只大灯", art: "assets/illustrations/lesson-11-step-03.svg" },
            { caption: "倒过来画车尾和贯穿式尾灯", art: "assets/illustrations/lesson-11-step-04.svg" },
            { caption: "车尾中间加一个车牌", art: "assets/illustrations/lesson-11-step-05.svg" },
          ],
          tips: ["正脸要左右对称", "两个大灯要一样高"],
        },
        {
          id: 12,
          title: "设计你自己的概念车",
          goal: "综合运用所有技巧，设计你自己的概念车。",
          steps: [
            { caption: "先想好：SUV、跑车还是未来车？", art: "assets/illustrations/lesson-12-step-01.svg" },
            { caption: "大胆画出与众不同的车身", art: "assets/illustrations/lesson-12-step-02.svg" },
            { caption: "加上大大的轮子", art: "assets/illustrations/lesson-12-step-03.svg" },
            { caption: "加上灯带和尾翼", art: "assets/illustrations/lesson-12-step-04.svg" },
            { caption: "上色并写下你的车名", art: "assets/illustrations/lesson-12-step-05.svg" },
          ],
          tips: ["没有'画错'，只有'下一次更好'", "这是你的原创设计，大胆画！"],
        },
      ],
    },
  ],
};
