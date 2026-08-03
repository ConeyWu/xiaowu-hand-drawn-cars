@echo off
chcp 65001 >nul
setlocal

echo ============================================
echo  小吴手绘汽车 - AI 完成稿生成
echo  首次运行会先安装依赖（需要联网），然后生成图片
echo ============================================
echo.

set "PY=C:\Users\WWD\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if not exist "%PY%" set "PY=python"

if "%OPENAI_API_KEY%"=="" (
  set /p OPENAI_API_KEY=请输入你的 OpenAI API Key 后按回车:
)

echo 正在安装依赖（首次约 1 分钟）...
"%PY%" -m pip install --quiet openai pillow
if errorlevel 1 (
  echo 依赖安装失败，请检查网络后重试。
  pause
  exit /b 1
)

set "PROMPTS=C:\Users\WWD\Documents\Deepseek开发\.github\workflows\ai-prompts-first2.jsonl"
if "%~1"=="all" set "PROMPTS=C:\Users\WWD\Documents\Deepseek开发\.github\workflows\ai-prompts.jsonl"

echo 正在生成图片（约 1-2 分钟/张）...
"%PY%" "C:\Users\WWD\Documents\Deepseek开发\.github\workflows\image_gen.py" generate-batch --input "%PROMPTS%" --out-dir "C:\Users\WWD\Documents\Deepseek开发\output\imagegen" --concurrency 2

echo.
echo 生成完成！图片在 output\imagegen 文件夹。
echo 告诉小助手"生成好了"，我来把它们接进网站。
pause
endlocal
