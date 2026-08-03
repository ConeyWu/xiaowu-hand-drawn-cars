# AI 完成稿范例 — 提示词与使用说明

目标：为每节课生成一张"专业手绘设计稿"级别的完成稿范例图（共 12 张），
与程序画的步骤图互补：步骤图教过程，AI 完成稿当"榜样"。

## 统一风格基线

所有提示词共用以下风格描述（保证 12 张风格一致）：

> professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, confident loose sketch lines, realistic car proportions, subtle marker shading, educational drawing tutorial illustration, no text, no logos, no watermark

## 使用方法

需要 `OPENAI_API_KEY` 环境变量，并且网络能访问 `api.openai.com`。

1. 把下面的 JSONL 内容存为 `tmp/imagegen/prompts.jsonl`；
2. 运行：

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
python "$CODEX_HOME/skills/.system/imagegen/scripts/image_gen.py" generate-batch \
  --input tmp/imagegen/prompts.jsonl \
  --out-dir output/imagegen \
  --concurrency 4
```

3. 生成结果按文件名对应课程，确认后替换到 `assets/illustrations/` 或用作完成稿展示。

## 12 条提示词（JSONL）

```jsonl
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, close-up study of two large wheel circles with center crosshairs and proportion guide lines, realistic car proportions, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"wheel proportion study, centered","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-01-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, two large wheels drawn as perfect circles with center crosshairs, wheel design practice, realistic proportions, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"two wheel circles side by side","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-02-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, car body silhouette outline with construction rectangles and wedge guide lines, realistic sedan proportions, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"side view body sketch with construction lines","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-03-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, complete side view of a sleek modern electric sedan, realistic proportions, wheels with detailed rims, windows with reflection, marker shading on lower body, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"full side view, car centered","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-04-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, front nose detail of an electric car with closed grille and clean face, smooth aerodynamic surfaces, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"front fascia detail, three-quarter front view","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-05-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, front three-quarter view of a modern electric car with a full-width LED light bar highlighted, sleek headlights, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"front three-quarter view","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-06-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, close-up wheel and rim detail study with spokes, brake disc, door line and side mirror, realistic proportions, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"side view detail study, large wheel close-up","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-07-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, side view detail of an electric car showing charging port with lid and flush door handles, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"side view detail, charging port area","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-08-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, side view of an electric sedan with motion speed lines behind the rear wheel, ground shadows, low sporty stance, dynamic feel, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"full side view with motion effect","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-09-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, side view of an electric car demonstrating marker rendering technique: flat tone, vertical gradient, white highlight line along the shoulder, dark shadow at the bottom, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"full side view showing shading technique","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-10-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, front view and rear view of a modern electric sedan side by side, headlights and tail light bar, license plate, symmetrical, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"two views side by side, front and rear","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-11-example.png"}
{"prompt":"professional automotive design hand sketch, graphite pencil and gray marker on warm cream paper, futuristic electric concept car, low wedge silhouette, large wheels, full-width light bar, rear wing, confident design sketch style, educational drawing tutorial illustration, no text, no logos, no watermark","use_case":"scientific-educational","composition":"full side view concept car","constraints":"no text, no logos, no watermark","size":"1536x1024","out":"lesson-12-example.png"}
```

## 验收建议

第一次先只生成 `lesson-04-example.png` 和 `lesson-12-example.png` 两张验收，
风格确认后再生成全套，避免浪费。
