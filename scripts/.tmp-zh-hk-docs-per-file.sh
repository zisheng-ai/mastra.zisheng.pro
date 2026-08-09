#!/bin/zsh
set -u

repo="/Users/zisheng/Desktop/mastra.zisheng.pro"
log_dir="/tmp/mastra-zh-hk-docs-per-file-2"
mkdir -p "$log_dir"

scopes=(
  "browser"
  "capabilities"
  "getting-started"
  "memory"
  "mastra-platform"
  "long-running-agents"
  "server"
  "workflows"
)

run_one() {
  local src="$1"
  local rel="${src#src/content/en/docs/}"
  local dst="i18n/zh-HK/docusaurus-plugin-content-docs/current/${rel}"
  local key="${rel//\//__}"
  local prompt
  prompt="直接完成一个 Mastra 文档香港繁体翻译文件。英文源：${src}。唯一允许修改的目标：${dst}。即使目标已存在也要从英文源重新完整翻译并覆盖，不能参考或转换 zh-CN/zh-TW；不要修改任何其他文件。

先完整阅读 .agents/skills/translation/SKILL.md、AGENTS.md、CONTRIBUTING.md 和整个英文源文件。styleguides/STYLEGUIDE.md 与 styleguides/DOC.md 是失效符号链接，可记录后继续。使用 apply_patch 写入目标。译文须自然、准确、符合香港技术写作习惯，统一使用「項目、依賴套件、編程助手、網絡、伺服器、API 金鑰」；Agent、Workflow、MCP、Studio、Provider、Trace、Evals、Tool、Skill、Sandbox、Workspace 默认保留英文。

精确保留 fenced code 全部内容及 metadata、inline code、命令、文件路径、标识符、环境变量、JSON key、URL、Markdown 链接目标、imports/exports、MDX/JSX 组件结构、prop 名、表达式、frontmatter keys、非 prose metadata、所有 __TOKEN__。翻译 title/description 等可见 frontmatter 值、正文、标题、列表、表格、图片 alt、admonition、可见字符串 props。不能遗漏或新增内容。写完后逐段核对源/目标，并检查 code fence、链接、MDX 标签和 model token；必须实际完成文件，不要只报告计划或要求进一步确认。"

  /opt/homebrew/bin/codex exec \
    --ephemeral \
    --ignore-user-config \
    --sandbox workspace-write \
    --color never \
    --cd "$repo" \
    --output-last-message "$log_dir/final-${key}.txt" \
    "$prompt" >"$log_dir/run-${key}.log" 2>&1
}

sources=()
for scope in "${scopes[@]}"; do
  if [ -d "src/content/en/docs/$scope" ]; then
    while IFS= read -r src; do
      sources+=("$src")
    done < <(find "src/content/en/docs/$scope" -type f \( -name '*.md' -o -name '*.mdx' \) | sort)
  elif [ -f "src/content/en/docs/$scope" ]; then
    sources+=("src/content/en/docs/$scope")
  fi
done

# Retry two pages whose first isolated translation agents explicitly reported failure.
sources+=(
  "src/content/en/docs/agents/processors.mdx"
  "src/content/en/docs/observability/tracing/overview.mdx"
)

batch_pids=()
overall_exit=0
for src in "${sources[@]}"; do
  run_one "$src" &
  batch_pids+=("$!")
  if (( ${#batch_pids[@]} >= 12 )); then
    for pid in "${batch_pids[@]}"; do
      if ! wait "$pid"; then
        overall_exit=1
      fi
    done
    batch_pids=()
  fi
done

for pid in "${batch_pids[@]}"; do
  if ! wait "$pid"; then
    overall_exit=1
  fi
done

exit "$overall_exit"
