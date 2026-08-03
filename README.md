# 小吴手绘汽车

指导 8 岁孩子画出更好的新能源汽车设计图的分步教程网站。

## 本地运行

    npm start
    # 打开 http://localhost:8000

## 测试

    npm test

## 重新生成步骤插画

    node scripts/generate_car_svgs.js

## 部署

推送到 GitHub 仓库后，在仓库 Settings → Pages 选择分支 `master`、目录 `/` 即可。访问地址为 `https://<用户名>.github.io/<仓库名>/`。

## 目录

- `index.html` / `lessons.html` / `lesson.html`：三个页面
- `js/data.js`：课程数据
- `js/progress.js`：本地进度
- `js/app.js`：渲染与交互
- `assets/illustrations/`：步骤插画
