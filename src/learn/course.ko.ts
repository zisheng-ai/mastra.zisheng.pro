import type { Course } from './types'

export const course: Course = {
  courseId: 'mastra-101',
  title: 'TypeScript로 첫 번째 AI Agent 구축',
  description: `이 과정은 AI 엔지니어가 되기 위한 로드맵입니다.

90분 안에 Mastra를 사용하여 TypeScript에서 첫 번째 Agent를 구축하고 배포하게 됩니다. 그 과정에서 Agent 루프가 내부적으로 작동하는 방식, Tool를 통해 Agent가 다른 시스템에 접근하는 방식, MCP가 외부 리소스에 대한 문을 여는 방식, 컨텍스트 엔지니어링과 Memory가 대화 전반에 걸쳐 동작을 형성하는 방식을 배우게 됩니다.                

마지막에는 첫 번째 Agent를 배송하게 되며, 더 중요한 것은 스스로 다음 Agent를 구축하는 방법을 알게 된다는 것입니다. 여기에서 구현하는 패턴은 다음에 빌드하기로 선택한 항목에 직접 적용됩니다.                                                                              

AI Agent는 차세대 플랫폼 변화입니다. 이를 구축하는 방법을 이해하는 것은 이제 엔지니어의 핵심 기술이며, 일찍 도달하는 사람들에게는 진정한 기회가 있습니다. 무엇이 가능한지 기대하고 거기에 도달하기 위한 명확하고 실용적인 경로를 원한다면 이 과정이 적합합니다.`,
  lessons: [
    // Module 1: Getting Started
    {
      slug: 'what-is-an-agent',
      title: 'Agent란 ​​무엇입니까?',
      durationMin: 5,
      status: 'published',
      youtubeId: 'G8tXjcseNjg',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          'Agent가 기본 채팅 경험과 다른 점을 정의하고, Mastra와 이를 사용하여 TypeScript에서 구축할 수 있는 AI 기반 앱의 종류를 소개하고, 과정 전반에 걸쳐 구축할 Theme Park Companion Agent를 미리 살펴보세요.',
        bullets: [
          'Agent이 챗봇과 다른 점',
          '핵심 Mastra 빌딩 블록: Agent, Tool, Workflow, Memory, 검색, Observability',
          'Studio에서 실행되는 완성된 Agent의 Flyover 데모',
        ],
      },
      seo: {
        title: 'Agent란 ​​무엇입니까? | 마스트라',
        description:
          'AI Agent가 무엇인지, 챗봇과 어떻게 다른지 알아보고, Mastra로 구축할 Theme Park Companion Agent를 미리 살펴보세요.',
      },
    },
    {
      slug: 'run-your-first-agent',
      title: '첫 번째 Agent 실행',
      durationMin: 5,
      status: 'published',
      youtubeId: 'RaqlPrGBscw',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '사람들이 Mastra를 시작하고, 프로젝트를 스캐폴드하고, 로컬에서 Agent를 구축하고 테스트하기 위한 대화형 UI인 Mastra Studio를 여는 주요 방법을 다룹니다.',
        bullets: [
          '세 가지 시작 경로: 통합, create-mastra를 사용한 스캐폴드 또는 템플릿에서 시작',
          '로컬에서 Mastra 프로젝트 생성 및 실행',
          'Studio 탐색: Agent, Workflow, Tool 및 추적',
        ],
      },
      seo: {
        title: '첫 번째 Agent 실행 | 마스트라',
        description:
          'Mastra 프로젝트를 스캐폴드하고, 로컬로 실행하고, Agent 구축 및 테스트를 위한 대화형 UI인 Mastra Studio를 살펴보세요.',
      },
    },
    {
      slug: 'project-structure',
      title: '프로젝트 구조',
      durationMin: 4,
      status: 'published',
      youtubeId: 'lDKFFWLmt1Q',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          'Studio에 보이는 것을 create-mastra로 생성된 프로젝트 레이아웃에 연결하세요. 스캐폴드된 Weather Agent, Workflow 및 Tool를 참조 지점으로 사용하세요.',
        bullets: [
          '프로젝트 구조: src/mastra/agents, Tool, Workflow 및 index.ts',
          'Mastra 인스턴스는 무엇이며 index.ts가 진입점이 되는 이유',
          '다음에 편집할 소스 폴더에 Studio 섹션 매핑',
        ],
      },
      seo: {
        title: '프로젝트 구조 | 마스트라',
        description:
          'Agent, Tool, Workflow, 구성 및 Studio가 소스 파일에 매핑하는 방법 등 Mastra 프로젝트 구조를 이해합니다.',
      },
    },
    {
      slug: 'create-an-agent',
      title: 'Agent 생성',
      durationMin: 5,
      status: 'published',
      youtubeId: 'lwhJxPl_loQ',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '코드에서 처음부터 자신만의 Agent를 구축하고 이를 Mastra 설정에 등록한 후 Studio에 나타나는지 확인하세요. 이는 나머지 과정 동안 계속 연장되는 Agent가 됩니다.',
        bullets: [
          '이름, 지침, Model이 포함된 Agent 파일 만들기',
          'src/mastra/index.ts에 Agent를 등록하세요.',
          '먼저 추적을 살펴보세요. "여기서 모든 것을 디버깅할 것입니다."',
        ],
      },
      seo: {
        title: 'Agent 생성 | 마스트라',
        description:
          '지침과 Model 구성을 사용하여 맞춤형 AI Agent를 구축하고 이를 Mastra에 등록한 후 Studio에서 실행하세요.',
      },
    },

    // Module 2: Tools
    {
      slug: 'create-a-tool',
      title: 'Tool 만들기',
      durationMin: 7,
      status: 'published',
      youtubeId: 'P8voCXTIGVI',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '간단한 Tool 하나를 만들고 Studio에서 별도로 테스트한 후 Agent에 연결하고 Tool를 호출하도록 Agent에 메시지를 표시하세요. 그런 다음 Traces를 열고 Tool 호출과 결과를 확인하세요.',
        bullets: [
          'Tool는 Agent가 입력, 출력 및 설명을 포함하여 호출할 수 있는 기능입니다.',
          'Agent이 Tool를 사용하기 전에 Studio에서 Tool를 테스트하세요.',
          '추적에 Tool 호출 입력/출력 표시',
        ],
      },
    },
    {
      slug: 'build-with-ai',
      title: 'AI로 구축',
      durationMin: 3,
      status: 'published',
      youtubeId: 'PBtct9tG19k',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '참고로 MCP를 지원하는 Cursor, Windsurf, Claude Code, VS Code 또는 Codex를 사용하는 경우 Mastra에는 사용할 가치가 있는 MCP Docs Server가 있습니다.',
        bullets: [
          'Mastra MCP Docs 서버란?',
          '편집기에서 활성화하는 방법',
          '코딩하는 동안 상황에 맞는 Mastra 문서를 받으세요.',
        ],
      },
    },
    {
      slug: 'fetch-live-data',
      title: '실시간 데이터 가져오기',
      durationMin: 7,
      status: 'published',
      youtubeId: 'CMofx-DhpoY',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '첫 번째 Tool 호출에서 반환된 parkId에서 실시간 대기 시간을 가져오는 두 번째 Tool를 만듭니다. Agent가 Tool를 연결할 때 Tool가 어떻게 자연스럽게 구성되는지 보여줍니다.',
        bullets: [
          '실시간 데이터용 외부 API를 호출하는 Tool 구축',
          'Agent이 단일 대화에서 여러 Tool 호출을 연결하도록 허용',
          'Studio 추적에서 전체 체인 확인',
        ],
      },
    },
    {
      slug: 'connect-to-mcp',
      title: 'MCP에 연결',
      durationMin: 7,
      status: 'published',
      youtubeId: 'b8rNHmL4s2s',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          'MCP 에코시스템의 Tool에 액세스하려면 Agent를 외부 MCP 서버에 연결하세요. Mastra가 Model 컨텍스트 프로토콜을 통해 Agent 기능을 연결하는 방법을 보여줍니다.',
        bullets: [
          'MCP 서버란 무엇이며 Tool를 노출하는 방법',
          'Mastra 프로젝트에서 MCP 서버 연결 구성',
          '사용자 정의 Tool와 함께 MCP 제공 Tool를 사용하십시오.',
        ],
      },
    },

    // Module 3: Workflows
    {
      slug: 'build-a-workflow',
      title: 'Workflow 구축',
      durationMin: 7.5,
      youtubeId: 'Xu0N43frgMs',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          'Agent는 단일 Tool를 호출할 수 있지만 일부 작업에는 반복 가능한 다단계 시퀀스가 ​​필요합니다. Workflow를 구축하고, 여러 단계를 연결하고, Studio에서 실행하세요.',
        bullets: [
          'Workflow가 올바른 이동인 경우: 다단계, 고정 순서',
          'createStep() 및 createWorkflow() 기본 사항',
          '단계 입력 및 출력: 단계 간 데이터 흐름',
        ],
      },
    },
    {
      slug: 'agents-vs-workflows',
      title: 'Agent와 Workflow',
      durationMin: 3,
      youtubeId: 'kiFhVZyHG84',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro: '계속 구축하기 전에 언제 Agent를 사용해야 하는지, 언제 Workflow를 사용해야 하는지에 대한 명확한 정신 Model을 확보하세요.',
        bullets: [
          'Agent: 개방형 목표, Model이 단계와 중지 시점을 결정합니다.',
          'Workflow우: 사전 정의된 단계, 경로 및 중지 조건 제어',
          '경험 법칙: 유연한 계획을 위한 Agent, 반복 가능한 프로세스를 위한 Workflow',
        ],
      },
    },
    {
      slug: 'agents-in-workflows',
      title: 'Workflow의 Agent',
      durationMin: 9,
      youtubeId: 'hHtUcuDqFrY',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          '시스템을 사용 가능하게 만듭니다. 사용자는 한 명의 기본 Agent와 채팅하고 Agent는 다단계 작업을 Workflow에 위임합니다. 일시 중지 및 재개를 사용하여 하나의 Human-in-the-Loop 승인 단계를 추가합니다.',
        bullets: [
          'Agent의 Workflow를 단일 기능으로 트리거합니다.',
          'suspens(), 이력서() 및 bail()을 사용하여 HITL 승인 게이트를 추가합니다.',
          '추적은 Workflow 단계, Tool 호출 및 출력을 엔드 투 엔드로 보여줍니다.',
        ],
      },
    },

    // Module 4: Memory
    {
      slug: 'how-memory-works',
      title: '기억의 작동 원리',
      durationMin: 5.5,
      youtubeId: 'RvtDJJhI8FE',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '호출 사이에 Model은 상태 비저장입니다. 기억은 후속 조치가 가능하도록 해줍니다. Studio에서 실제 대화를 추적하여 Agent가 수신한 컨텍스트가 무엇인지 정확히 확인하고 통화당 포함되는 기록의 양을 제어하는 ​​lastMessages 설정을 알아보세요.',
        bullets: [
          'Model이 Stateless인 이유와 Mastra가 이에 대해 수행하는 작업',
          '컨텍스트 엔지니어링: Model이 호출별로 무엇을 보게 될지 결정',
          'lastMessages: 컨텍스트 창에서 최근 기록을 제어하는 ​​설정',
        ],
      },
    },
    {
      slug: 'observational-memory',
      title: '관찰 기억',
      durationMin: 5,
      youtubeId: 'x2UQ7zIdrbI',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '원시 메시지 기록이 빠르게 쌓입니다. 관찰 Memory를 활성화하여 이전 컨텍스트를 더 조밀한 관찰로 자동 압축한 다음 리소스 범위 Memory를 테스트하여 동일한 사용자에 대해 스레드 간에 선호 사항이 전달되도록 합니다.',
        bullets: [
          'OM은 Observer 및 Reflector 백그라운드 Agent를 통해 이전 기록을 압축합니다.',
          '리소스 범위: Memory는 하나의 대화 내에서만이 아니라 스레드 전체에서 사용자를 따릅니다.',
          'OM은 수동 lastMessages 조정을 자동 컨텍스트 관리로 대체합니다.',
        ],
      },
    },
    {
      slug: 'guardrails-with-processors',
      title: '프로세서가 포함된 가드레일',
      durationMin: 5,
      youtubeId: '9XHVGLld8kk',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '실제 사용자가 참여하면 입력 가드레일이 필요합니다. Model이 적대적인 요청을 보기 전에 차단하려면 PromptInjectionDetector 및 ModerationProcessor를 추가하세요.',
        bullets: [
          '프로세서는 Model 호출 전과 응답 후에 메시지를 가로챕니다.',
          'PromptInjectionDetector: 주입, 탈옥 및 시스템 재정의 시도를 차단합니다.',
          'ModerationProcessor: 증오심과 괴롭힘이 있는지 수신 메시지를 선별합니다.',
        ],
      },
    },

    // Module 5: Production
    {
      slug: 'deploy-to-mastra-platform',
      title: 'Mastra 플랫폼에 배포',
      durationMin: 4,
      youtubeId: 'O1FnS_qrsPs',
      status: 'published',
      module: '생산',
      preview: {
        intro:
          'Mastra Server를 사용하여 로컬 Studio 환경에서 라이브 공용 엔드포인트로 Theme Park Agent를 배포합니다.',
        bullets: [
          'Swagger UI를 탐색하여 이미 HTTP 엔드포인트로 노출된 모든 Agent를 확인하세요.',
          'mastra 서버 배포를 실행하여 안정적인 공개 URL을 구축, 업로드 및 가져옵니다.',
          'Mastra는 이미 HTTP 서버입니다. Mastra Server는 이를 공개 위치에 둡니다.',
        ],
      },
    },
    {
      slug: 'chat-with-agent-in-slack',
      title: 'Slack에서 Agent와 채팅',
      durationMin: 9,
      youtubeId: 'fD6M6n_OdJI',
      status: 'published',
      module: '생산',
      preview: {
        intro:
          '배포된 Theme Park Agent를 Slack에 연결하면 DM에서 동일한 Tool, Memory, Workflow 등 어디에서나 메시지를 보낼 수 있습니다.',
        bullets: [
          'Agent에 Slack 어댑터 및 채널 구성 추가',
          'Mastra는 웹훅 경로를 자동으로 노출합니다. 작성할 핸들러가 없습니다.',
          '채널은 동일한 패턴을 통해 Discord와 Telegram도 지원합니다.',
        ],
      },
    },
  ],
}
