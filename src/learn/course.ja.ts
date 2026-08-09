import type { Course } from './types'

export const course: Course = {
  courseId: 'mastra-101',
  title: 'TypeScript で初めての AI Agent を構築する',
  description: `このコースは、AI エンジニアになるためのロードマップです。

90 分で、Mastra と TypeScript を使って初めての Agent を構築し、デプロイします。その過程で、Agent ループの内部動作、Tool を使って Agent をほかのシステムに接続する方法、MCP が外部リソースへの道を開く仕組み、そしてコンテキストエンジニアリングと Memory が会話全体の動作をどう形作るかを学びます。

修了時には、初めての Agent をリリースしているだけでなく、次の Agent を自力で構築する方法も身に付いています。ここで実装するパターンは、この先どのようなものを構築する場合にもそのまま活用できます。

AI Agent は次のプラットフォーム転換です。その構築方法を理解することは、今やエンジニアにとって中核となるスキルです。早く習得した人には、大きな機会があります。可能性に期待し、そこへ到達するための明確で実践的な道筋を求めている方に、このコースは最適です。`,
  lessons: [
    // Module 1: Getting Started
    {
      slug: 'what-is-an-agent',
      title: 'Agent とは？',
      durationMin: 5,
      status: 'published',
      youtubeId: 'G8tXjcseNjg',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          'Agent と基本的なチャット体験の違いを定義し、Mastra と、TypeScript で構築できる AI 搭載アプリを紹介します。さらに、コースを通して構築するテーマパーク案内 Agent の全体像を確認します。',
        bullets: [
          'Agent とチャットボットの違い',
          'Mastra の主要な構成要素: Agent、Tool、Workflow、Memory、Retrieval、Observability',
          '完成した Agent を Studio で実行するデモの概要',
        ],
      },
      seo: {
        title: 'Agent とは？ | Mastra',
        description:
          'AI Agent とは何か、チャットボットとどう違うのかを学び、Mastra で構築するテーマパーク案内 Agent の全体像を確認します。',
      },
    },
    {
      slug: 'run-your-first-agent',
      title: '最初の Agent を実行する',
      durationMin: 5,
      status: 'published',
      youtubeId: 'RaqlPrGBscw',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          'Mastra を始める主な方法を確認し、プロジェクトをスキャフォールドして、ローカルで Agent を構築、テストするための対話型 UI、Mastra Studio を開きます。',
        bullets: [
          '3 つの開始方法: 既存環境への統合、create-mastra によるスキャフォールド、テンプレートの利用',
          'Mastra プロジェクトを作成し、ローカルで実行する',
          'Studio の Agent、Workflow、Tool、Trace を確認する',
        ],
      },
      seo: {
        title: '最初の Agent を実行する | Mastra',
        description:
          'Mastra プロジェクトをスキャフォールドしてローカルで実行し、Agent を構築、テストするための対話型 UI、Mastra Studio を確認します。',
      },
    },
    {
      slug: 'project-structure',
      title: 'プロジェクト構造',
      durationMin: 4,
      status: 'published',
      youtubeId: 'lDKFFWLmt1Q',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          'Studio に表示される内容と、create-mastra が作成したプロジェクト構造を対応付けます。スキャフォールドされた Weather Agent、Workflow、Tool を参照しながら確認します。',
        bullets: [
          'プロジェクト構造: src/mastra/agents、tools、workflows、index.ts',
          'Mastra インスタンスとは何か、index.ts がエントリーポイントである理由',
          'Studio の各セクションと、次に編集するソースフォルダーの対応関係',
        ],
      },
      seo: {
        title: 'プロジェクト構造 | Mastra',
        description:
          'Mastra のプロジェクト構造と、Agent、Tool、Workflow、設定、Studio がソースファイルにどう対応するかを理解します。',
      },
    },
    {
      slug: 'create-an-agent',
      title: 'Agent を作成する',
      durationMin: 5,
      status: 'published',
      youtubeId: 'lwhJxPl_loQ',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '独自の Agent をコードで一から構築し、Mastra の設定に登録して、Studio に表示されることを確認します。この Agent をコースの残りを通して拡張していきます。',
        bullets: [
          'name、instructions、model を指定した Agent ファイルを作成する',
          'src/mastra/index.ts に Agent を登録する',
          'Trace を初めて確認する: 「ここですべてをデバッグします」',
        ],
      },
      seo: {
        title: 'Agent を作成する | Mastra',
        description: 'instructions とモデル設定を持つ独自の AI Agent を構築し、Mastra に登録して Studio で実行します。',
      },
    },

    // Module 2: Tools
    {
      slug: 'create-a-tool',
      title: 'Tool を作成する',
      durationMin: 7,
      status: 'published',
      youtubeId: 'P8voCXTIGVI',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          'シンプルな Tool を 1 つ作成し、Studio で単独テストしてから Agent に接続し、Agent が Tool を呼び出すようプロンプトを設定します。その後 Trace を開き、Tool の呼び出しと結果を確認します。',
        bullets: [
          'Tool は Agent が呼び出せる関数で、入力、出力、説明を持つ',
          'Agent が使用する前に Studio で Tool をテストする',
          'Trace で Tool 呼び出しの入力と出力を確認する',
        ],
      },
    },
    {
      slug: 'build-with-ai',
      title: 'AI を活用して構築する',
      durationMin: 3,
      status: 'published',
      youtubeId: 'PBtct9tG19k',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '補足として、Cursor、Windsurf、Claude Code、VS Code、Codex など、MCP に対応する環境を使っている場合に有効にしたい Mastra MCP Docs Server を紹介します。',
        bullets: [
          'Mastra MCP Docs Server とは何か',
          'エディターで有効にする方法',
          'コーディング中にコンテキストに合った Mastra ドキュメントを取得する',
        ],
      },
    },
    {
      slug: 'fetch-live-data',
      title: 'リアルタイムデータを取得する',
      durationMin: 7,
      status: 'published',
      youtubeId: 'CMofx-DhpoY',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '最初の Tool 呼び出しが返す parkId を使って、リアルタイムの待ち時間を取得する 2 つ目の Tool を作成します。Agent が複数の Tool を連鎖させると、Tool が自然に連携することを確認します。',
        bullets: [
          '外部 API を呼び出してリアルタイムデータを取得する Tool を構築する',
          '1 回の会話で Agent に複数の Tool 呼び出しを連鎖させる',
          'Studio の Trace で処理全体を確認する',
        ],
      },
    },
    {
      slug: 'connect-to-mcp',
      title: 'MCP に接続する',
      durationMin: 7,
      status: 'published',
      youtubeId: 'b8rNHmL4s2s',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          'Agent を外部 MCP サーバーに接続し、MCP エコシステムの Tool を利用します。Mastra が Agent の機能と Model Context Protocol をどのように橋渡しするかを確認します。',
        bullets: [
          'MCP サーバーとは何か、Tool をどのように公開するか',
          'Mastra プロジェクトで MCP サーバー接続を設定する',
          'MCP が提供する Tool と独自の Tool を併用する',
        ],
      },
    },

    // Module 3: Workflows
    {
      slug: 'build-a-workflow',
      title: 'Workflow を構築する',
      durationMin: 7.5,
      youtubeId: 'Xu0N43frgMs',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          'Agent は 1 つの Tool を呼び出せますが、反復可能な複数ステップの処理が必要なタスクもあります。Workflow を構築して複数のステップを連結し、Studio で実行します。',
        bullets: [
          'Workflow が適している場面: 複数ステップ、固定された順序',
          'createStep() と createWorkflow() の基本',
          'ステップの入力と出力: ステップ間のデータフロー',
        ],
      },
    },
    {
      slug: 'agents-vs-workflows',
      title: 'Agent と Workflow',
      durationMin: 3,
      youtubeId: 'kiFhVZyHG84',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro: '構築を続ける前に、Agent と Workflow をそれぞれどの場面で使うべきか、明確な考え方を身に付けます。',
        bullets: [
          'Agent: 目標は自由度が高く、ステップと終了時点をモデルが判断する',
          'Workflow: ステップは事前定義され、経路と終了条件を開発者が制御する',
          '基本原則: 柔軟な計画には Agent、反復可能な処理には Workflow',
        ],
      },
    },
    {
      slug: 'agents-in-workflows',
      title: 'Workflow 内の Agent',
      durationMin: 9,
      youtubeId: 'hHtUcuDqFrY',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          'システムを利用できる形にします。ユーザーは 1 つのメイン Agent と会話し、Agent は複数ステップの処理を Workflow に委任します。suspend と resume を使った Human-in-the-Loop の承認ステップを 1 つ追加します。',
        bullets: [
          'Agent から 1 つの機能として Workflow を起動する',
          'suspend()、resume()、bail() を使って HITL 承認ゲートを追加する',
          'Trace で Workflow のステップ、Tool の呼び出し、出力をエンドツーエンドで確認する',
        ],
      },
    },

    // Module 4: Memory
    {
      slug: 'how-memory-works',
      title: 'Memory の仕組み',
      durationMin: 5.5,
      youtubeId: 'RvtDJJhI8FE',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '呼び出しの間でモデルはステートレスです。フォローアップを可能にするのが Memory です。Studio で実際の会話をトレースし、Agent が受け取ったコンテキストを正確に確認します。また、呼び出しごとに含める履歴の量を制御する lastMessages 設定を学びます。',
        bullets: [
          'モデルがステートレスである理由と、Mastra がどう対処するか',
          'コンテキストエンジニアリング: 呼び出しごとにモデルへ見せる内容を決める',
          'lastMessages: コンテキストウィンドウ内の最近の履歴を制御する設定',
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
          '生のメッセージ履歴はすぐに増えていきます。Observational Memory を有効にして古いコンテキストを密度の高い観察結果へ自動圧縮し、同じユーザーの設定や好みがスレッドをまたいで引き継がれる resource スコープの Memory をテストします。',
        bullets: [
          'OM は Observer と Reflector のバックグラウンド Agent を使って古い履歴を圧縮する',
          'resource スコープ: 1 つの会話内だけでなく、スレッドをまたいでユーザーに Memory が引き継がれる',
          'OM は lastMessages の手動調整を自動コンテキスト管理に置き換える',
        ],
      },
    },
    {
      slug: 'guardrails-with-processors',
      title: 'Processor によるガードレール',
      durationMin: 5,
      youtubeId: '9XHVGLld8kk',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '実際のユーザーが利用するようになったら、入力ガードレールが必要です。PromptInjectionDetector と ModerationProcessor を追加し、モデルが目にする前に悪意のあるリクエストをブロックします。',
        bullets: [
          'Processor はモデル呼び出しの前と応答の後にメッセージを遮断できる',
          'PromptInjectionDetector: インジェクション、脱獄、システム指示の上書きの試行をブロックする',
          'ModerationProcessor: 受信メッセージにヘイトやハラスメントが含まれていないか検査する',
        ],
      },
    },

    // Module 5: Production
    {
      slug: 'deploy-to-mastra-platform',
      title: 'Mastra platform にデプロイする',
      durationMin: 4,
      youtubeId: 'O1FnS_qrsPs',
      status: 'published',
      module: '本番環境',
      preview: {
        intro:
          'Mastra Server を使って、ローカルの Studio 環境にあるテーマパーク Agent を公開エンドポイントへデプロイします。',
        bullets: [
          'Swagger UI を確認し、すべての Agent がすでに HTTP エンドポイントとして公開されていることを確認する',
          'mastra server deploy を実行してビルド、アップロードし、安定した公開 URL を取得する',
          'Mastra はすでに HTTP サーバーであり、Mastra Server はそれを公開された場所で稼働させる',
        ],
      },
    },
    {
      slug: 'chat-with-agent-in-slack',
      title: 'Slack で Agent と会話する',
      durationMin: 9,
      youtubeId: 'fD6M6n_OdJI',
      status: 'published',
      module: '本番環境',
      preview: {
        intro:
          'デプロイ済みのテーマパーク Agent を Slack に接続し、どこからでもメッセージを送れるようにします。DM からでも、同じ Tool、Memory、Workflow を利用できます。',
        bullets: [
          'Slack アダプターと channels 設定を Agent に追加する',
          'Mastra が Webhook ルートを自動的に公開するため、ハンドラーの記述は不要',
          'Channels は同じパターンで Discord と Telegram にも対応する',
        ],
      },
    },
  ],
}
