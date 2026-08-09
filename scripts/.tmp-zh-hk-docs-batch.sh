#!/bin/zsh
set -u

repo="/Users/zisheng/Desktop/mastra.zisheng.pro"
log_dir="/tmp/mastra-zh-hk-docs-logs"
mkdir -p "$log_dir"

groups=(
  "agents"
  "observability"
  "server"
  "memory getting-started browser"
  "workflows capabilities"
  "mastra-platform long-running-agents"
  "workspace evals deployment"
  "connections datasets editor harness mcp studio storage index.mdx license.mdx"
)

run_group() {
  local idx="$1"
  local scope="$2"
  local prompt
  prompt="你是 Mastra 文档香港繁体翻译执行代理。只处理以下 src/content/en/docs 范围：${scope}。目标目录是 i18n/zh-HK/docusaurus-plugin-content-docs/current/，保持源文件的相对路径和扩展名。必须持续工作直到上述范围内每一个 .md/.mdx 英文源文件都有完整的香港繁体译文；不要只报告或给计划。

开始前必须完整阅读 AGENTS.md、CONTRIBUTING.md、.agents/skills/translation/SKILL.md，并逐文件完整阅读英文源。styleguides/STYLEGUIDE.md 与 styleguides/DOC.md 是已失效的符号链接，无法读取，可直接注明并继续。仅翻译指定范围，不要修改英文源、站点配置、其他 locale、其他目录，也不要覆盖其他代理负责的文件。

从英文源独立翻译，严禁从 zh-CN/zh-TW 机械转换。译文要自然、准确、符合香港技术写作习惯。统一使用「項目、依賴套件、編程助手、網絡、伺服器、API 金鑰」；Agent、Workflow、MCP、Studio、Provider、Trace、Evals、Tool、Skill、Sandbox、Workspace 默认保留英文。保留产品名、包名、API、标识符。精确保留 fenced code 内容和 metadata、inline code、命令、路径、URL、链接目标、import/export、MDX/JSX 组件与 props 名、表达式、结构、frontmatter keys、非 prose metadata、model token（所有 __TOKEN__ 形式）。翻译 title/description 等用户可见值、正文、标题、表格、图片 alt、admonition、可见字符串 props。不要遗漏任何段落、限定、警告或列表。

请用 apply_patch 创建/修改目标文件。每完成一页都要与英文源逐段核对。最后检查指定范围的源/目标文件计数一致，并对所写文件运行仓库可用的最窄 Markdown/MDX 格式或语法检查。最终回复列出实际完成文件数、验证结果及任何无法运行的检查。"

  /opt/homebrew/bin/codex exec \
    --ephemeral \
    --ignore-user-config \
    --approve-for-me \
    --color never \
    --cd "$repo" \
    --output-last-message "$log_dir/final-${idx}.txt" \
    "$prompt" >"$log_dir/run-${idx}.log" 2>&1
}

pids=()
idx=1
for scope in "${groups[@]}"; do
  run_group "$idx" "$scope" &
  pids+=("$!")
  idx=$((idx + 1))
done

exit_code=0
for pid in "${pids[@]}"; do
  if ! wait "$pid"; then
    exit_code=1
  fi
done

exit "$exit_code"
