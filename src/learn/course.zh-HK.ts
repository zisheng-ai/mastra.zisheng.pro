import type { Course } from './types'

export const course: Course = {
  courseId: 'mastra-101',
  title: '使用 TypeScript 建立你的第一個 AI Agent',
  description: `這個課程是你成為 AI 工程師的路線圖。

你會在 90 分鐘內使用 Mastra，以 TypeScript 建立並部署第一個 Agent。過程中，你會了解 Agent loop 背後的運作方式、Tool 如何讓 Agent 連接其他系統、MCP 如何開啟通往外部資源的大門，以及 context engineering 和 Memory 如何在對話中塑造行為。

完成課程時，你不但已經推出第一個 Agent，更重要的是，你會懂得如何獨力建立下一個 Agent。你在這裏實作的模式，可以直接應用於之後選擇建立的任何項目。

AI Agent 是下一次平台轉變。了解如何建立 Agent，已經成為工程師的核心技能，而率先掌握這項技能的人正面對實在的機遇。如果你對各種可能性感到期待，並希望有一條清晰、實用的學習路徑，這個課程就是為你而設。`,
  lessons: [
    // Module 1: Getting Started
    {
      slug: 'what-is-an-agent',
      title: '甚麼是 Agent？',
      durationMin: 5,
      status: 'published',
      youtubeId: 'G8tXjcseNjg',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '說明 Agent 與基本聊天體驗有何分別、介紹 Mastra，以及你可以使用 TypeScript 建立哪些 AI 應用程式，並預覽整個課程將建立的主題樂園同行 Agent。',
        bullets: [
          'Agent 與 chatbot 有何分別',
          'Mastra 的核心基本元件：Agent、Tool、Workflow、Memory、retrieval 和 observability',
          '在 Studio 中運行完成版 Agent 的快速示範',
        ],
      },
      seo: {
        title: '甚麼是 Agent？ | Mastra',
        description: '了解甚麼是 AI Agent、它與 chatbot 有何分別，並預覽你將使用 Mastra 建立的主題樂園同行 Agent。',
      },
    },
    {
      slug: 'run-your-first-agent',
      title: '執行你的第一個 Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'RaqlPrGBscw',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '介紹開始使用 Mastra 的主要方式、scaffold 一個項目，並開啟 Mastra Studio——這個互動式 UI 可用於在本地建立和測試 Agent。',
        bullets: [
          '三種起步方式：整合、使用 create-mastra 建立 scaffold，或從 template 開始',
          '在本地建立並執行 Mastra 項目',
          '瀏覽 Studio：Agent、Workflow、Tool 和 Trace',
        ],
      },
      seo: {
        title: '執行你的第一個 Agent | Mastra',
        description: 'Scaffold 一個 Mastra 項目、在本地執行，並探索用於建立和測試 Agent 的互動式 UI Mastra Studio。',
      },
    },
    {
      slug: 'project-structure',
      title: '項目結構',
      durationMin: 4,
      status: 'published',
      youtubeId: 'lDKFFWLmt1Q',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '把 Studio 中看到的內容，連繫到 create-mastra 建立的項目配置，並以 scaffold 產生的 Weather Agent、Workflow 和 Tool 作為參考。',
        bullets: [
          '項目結構：src/mastra/agents、tools、workflows 和 index.ts',
          'Mastra instance 是甚麼，以及 index.ts 為何是進入點',
          '把 Studio 各部分對應至接下來要編輯的源檔案資料夾',
        ],
      },
      seo: {
        title: '項目結構 | Mastra',
        description: '了解 Mastra 項目結構，包括 Agent、Tool、Workflow、設定，以及 Studio 如何對應至源檔案。',
      },
    },
    {
      slug: 'create-an-agent',
      title: '建立 Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'lwhJxPl_loQ',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '從零開始以程式碼建立自己的 Agent、在 Mastra 設定中註冊，並確認它出現在 Studio。這個 Agent 會在課程餘下部分持續擴展。',
        bullets: [
          '建立包含名稱、instructions 和模型的 Agent 檔案',
          '在 src/mastra/index.ts 註冊 Agent',
          '初次了解 Trace：「我們會在這裏為所有內容除錯」',
        ],
      },
      seo: {
        title: '建立 Agent | Mastra',
        description: '使用 instructions 和模型設定建立自訂 AI Agent、在 Mastra 中註冊，並於 Studio 執行。',
      },
    },

    // Module 2: Tools
    {
      slug: 'create-a-tool',
      title: '建立 Tool',
      durationMin: 7,
      status: 'published',
      youtubeId: 'P8voCXTIGVI',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '建立一個簡單 Tool、在 Studio 中獨立測試、把它附加至 Agent，再向 Agent 發出 prompt 讓它調用 Tool。然後開啟 Trace，查看 Tool 調用和結果。',
        bullets: [
          'Tool 是 Agent 可以調用的函數，具備輸入、輸出和說明',
          '在 Agent 使用 Tool 之前，先於 Studio 中測試',
          '在 Trace 中顯示 Tool 調用的輸入和輸出',
        ],
      },
    },
    {
      slug: 'build-with-ai',
      title: '使用 AI 建立',
      durationMin: 3,
      status: 'published',
      youtubeId: 'PBtct9tG19k',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '簡短補充：如果你使用 Cursor、Windsurf、Claude Code、VS Code 或 Codex，也就是任何支援 MCP 的編程助手，便值得啟用 Mastra MCP 文件伺服器。',
        bullets: ['Mastra MCP 文件伺服器是甚麼', '如何在編輯器中啟用', '編程時取得符合情境的 Mastra 文件'],
      },
    },
    {
      slug: 'fetch-live-data',
      title: '取得即時數據',
      durationMin: 7,
      status: 'published',
      youtubeId: 'CMofx-DhpoY',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '建立第二個 Tool，使用第一次 Tool 調用傳回的 parkId 取得即時輪候時間，並展示 Agent 串連多個 Tool 時，Tool 如何自然組合。',
        bullets: [
          '建立一個調用外部 API 以取得即時數據的 Tool',
          '讓 Agent 在單次對話中串連多次 Tool 調用',
          '在 Studio Trace 中驗證完整流程',
        ],
      },
    },
    {
      slug: 'connect-to-mcp',
      title: '連接至 MCP',
      durationMin: 7,
      status: 'published',
      youtubeId: 'b8rNHmL4s2s',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '把 Agent 連接至外部 MCP 伺服器，以使用 MCP 生態系統的 Tool，並展示 Mastra 如何透過 Model Context Protocol 擴展 Agent 功能。',
        bullets: [
          'MCP 伺服器是甚麼，以及如何公開 Tool',
          '在 Mastra 項目中設定 MCP 伺服器連線',
          '配合自訂 Tool 使用 MCP 提供的 Tool',
        ],
      },
    },

    // Module 3: Workflows
    {
      slug: 'build-a-workflow',
      title: '建立 Workflow',
      durationMin: 7.5,
      youtubeId: 'Xu0N43frgMs',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          'Agent 可以調用單一 Tool，但有些工作需要可重複執行的多步驟次序。你會建立 Workflow、串連多個步驟，並在 Studio 中執行。',
        bullets: [
          '適合使用 Workflow 的情況：多個步驟、固定次序',
          'createStep() 和 createWorkflow() 基礎',
          '步驟的輸入和輸出：數據在步驟之間流動',
        ],
      },
    },
    {
      slug: 'agents-vs-workflows',
      title: 'Agent 與 Workflow',
      durationMin: 3,
      youtubeId: 'kiFhVZyHG84',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro: '繼續建立之前，先建立清晰概念，了解何時應使用 Agent，以及何時應使用 Workflow。',
        bullets: [
          'Agent：開放式目標，由模型決定步驟和停止時間',
          'Workflow：預先定義步驟，由你控制路徑和停止條件',
          '實用原則：靈活規劃使用 Agent，可重複流程使用 Workflow',
        ],
      },
    },
    {
      slug: 'agents-in-workflows',
      title: '在 Workflow 中使用 Agent',
      durationMin: 9,
      youtubeId: 'hHtUcuDqFrY',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          '令系統真正實用：用戶與一個主要 Agent 對話，而 Agent 把多步驟工作交給 Workflow。你會使用暫停和繼續，加入一個 Human-in-the-Loop 批准步驟。',
        bullets: [
          '由 Agent 以單一功能觸發 Workflow',
          '使用 suspend()、resume() 和 bail() 加入 HITL 批准關卡',
          'Trace 由頭到尾顯示 Workflow 步驟、Tool 調用和輸出',
        ],
      },
    },

    // Module 4: Memory
    {
      slug: 'how-memory-works',
      title: 'Memory 如何運作',
      durationMin: 5.5,
      youtubeId: 'RvtDJJhI8FE',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '模型在不同調用之間是無狀態，Memory 讓後續問題得以運作。你會在 Studio 中追蹤真實對話，查看 Agent 實際收到的情境，並了解控制每次調用包含多少記錄的 lastMessages 設定。',
        bullets: [
          '模型為何是無狀態，以及 Mastra 如何處理',
          'Context engineering：決定每次調用時模型可以看到甚麼',
          'lastMessages：控制 context window 中近期記錄的設定',
        ],
      },
    },
    {
      slug: 'observational-memory',
      title: 'Observational Memory',
      durationMin: 5,
      youtubeId: 'x2UQ7zIdrbI',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '原始訊息記錄會迅速累積。啟用 Observational Memory，自動把較舊的情境壓縮成更密集的 observation，再測試 resource scope 的 Memory，讓同一用戶的偏好可跨 thread 保留。',
        bullets: [
          'OM 透過 Observer 和 Reflector 背景 Agent 壓縮較舊的記錄',
          'Resource scope：Memory 會跨 thread 跟隨用戶，而非只存在於單次對話',
          'OM 以自動情境管理取代手動調整 lastMessages',
        ],
      },
    },
    {
      slug: 'guardrails-with-processors',
      title: '以 Processor 建立 Guardrail',
      durationMin: 5,
      youtubeId: '9XHVGLld8kk',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '當真實用戶開始使用系統，你便需要輸入 guardrail。加入 PromptInjectionDetector 和 ModerationProcessor，在模型看到惡意請求之前將它們封鎖。',
        bullets: [
          'Processor 在調用模型前和產生回應後攔截訊息',
          'PromptInjectionDetector：封鎖 injection、jailbreak 和覆寫系統的嘗試',
          'ModerationProcessor：篩查輸入訊息中的仇恨和騷擾內容',
        ],
      },
    },

    // Module 5: Production
    {
      slug: 'deploy-to-mastra-platform',
      title: '部署至 Mastra 平台',
      durationMin: 4,
      youtubeId: 'O1FnS_qrsPs',
      status: 'published',
      module: '生產環境',
      preview: {
        intro: '使用 Mastra Server，把主題樂園 Agent 從本地 Studio 環境部署至正式公開 endpoint。',
        bullets: [
          '瀏覽 Swagger UI，查看已經公開為 HTTP endpoint 的每個 Agent',
          '執行 mastra server deploy 進行建立和上載，並取得穩定的公開 URL',
          'Mastra 本身已經是 HTTP 伺服器，而 Mastra Server 會把它放到公開位置',
        ],
      },
    },
    {
      slug: 'chat-with-agent-in-slack',
      title: '在 Slack 與 Agent 對話',
      durationMin: 9,
      youtubeId: 'fD6M6n_OdJI',
      status: 'published',
      module: '生產環境',
      preview: {
        intro:
          '將已部署的主題樂園 Agent 連接至 Slack，讓你可以從任何地方向它傳送訊息，並透過私人訊息使用同一套 Tool、Memory 和 Workflow。',
        bullets: [
          '為 Agent 加入 Slack adapter 和 channels 設定',
          'Mastra 自動公開 webhook 路由，毋須編寫 handler',
          'Channels 亦以相同模式支援 Discord 和 Telegram',
        ],
      },
    },
  ],
}
