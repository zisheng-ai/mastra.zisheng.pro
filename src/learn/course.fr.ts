import type { Course } from './types'

export const course: Course = {
  courseId: 'mastra-101',
  title: 'Créez votre premier Agent d’IA en TypeScript',
  description: `Ce cours est votre feuille de route pour devenir ingénieur en IA.

En 90 minutes, vous créerez et déploierez votre premier Agent en TypeScript avec Mastra. Vous découvrirez le fonctionnement interne de la boucle d’Agent, comment les Tools permettent à un Agent d’agir sur d’autres systèmes, comment MCP ouvre l’accès à des ressources externes et comment l’ingénierie du contexte et la mémoire façonnent le comportement au cours d’une conversation.                

À la fin, vous aurez livré votre premier Agent et, surtout, vous saurez créer le suivant par vous-même. Les modèles que vous mettrez en œuvre ici s’appliquent directement à tout ce que vous choisirez de créer ensuite.                                                                              

Les Agents d’IA constituent le prochain changement de plateforme. Savoir les créer est désormais une compétence essentielle pour les ingénieurs, et de réelles opportunités attendent celles et ceux qui s’y mettent tôt. Si vous êtes enthousiaste face aux possibilités offertes et recherchez un parcours clair et pratique, ce cours est fait pour vous.`,
  lessons: [
    // Module 1: Getting Started
    {
      slug: 'what-is-an-agent',
      title: 'Qu’est-ce qu’un Agent ?',
      durationMin: 5,
      status: 'published',
      youtubeId: 'G8tXjcseNjg',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agents',
      preview: {
        intro:
          'Définissez ce qui distingue un Agent d’une expérience de chat élémentaire, découvrez Mastra et les types d’applications propulsées par l’IA que vous pouvez créer avec lui en TypeScript, puis apercevez l’Agent compagnon de parc à thème que vous créerez tout au long du cours.',
        bullets: [
          'Ce qui distingue un Agent d’un chatbot',
          'Les briques essentielles de Mastra : Agents, Tools, Workflows, mémoire, récupération et observabilité',
          'Démonstration d’ensemble de l’Agent final dans Studio',
        ],
      },
      seo: {
        title: 'Qu’est-ce qu’un Agent ? | Mastra',
        description:
          'Découvrez ce que sont les Agents d’IA, en quoi ils diffèrent des chatbots et l’Agent compagnon de parc à thème que vous créerez avec Mastra.',
      },
    },
    {
      slug: 'run-your-first-agent',
      title: 'Exécutez votre premier Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'RaqlPrGBscw',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agents',
      preview: {
        intro:
          'Découvrez les principales façons de démarrer avec Mastra, générez la structure d’un projet et ouvrez Mastra Studio, l’interface interactive qui permet de créer et tester des Agents localement.',
        bullets: [
          'Trois façons de démarrer : intégrer Mastra, générer un projet avec create-mastra ou partir d’un modèle',
          'Créer et exécuter un projet Mastra localement',
          'Naviguer dans Studio : Agents, Workflows, Tools et Traces',
        ],
      },
      seo: {
        title: 'Exécutez votre premier Agent | Mastra',
        description:
          'Générez un projet Mastra, exécutez-le localement et explorez Mastra Studio, l’interface interactive de création et de test des Agents.',
      },
    },
    {
      slug: 'project-structure',
      title: 'Structure du projet',
      durationMin: 4,
      status: 'published',
      youtubeId: 'lDKFFWLmt1Q',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agents',
      preview: {
        intro:
          'Reliez ce que vous voyez dans Studio à la structure du projet créée par create-mastra. Utilisez le Weather Agent, le Workflow et le Tool générés comme points de référence.',
        bullets: [
          'Structure du projet : src/mastra/agents, tools, workflows et index.ts',
          'Ce qu’est l’instance Mastra et pourquoi index.ts est le point d’entrée',
          'Associer les sections de Studio aux dossiers source que vous modifierez ensuite',
        ],
      },
      seo: {
        title: 'Structure du projet | Mastra',
        description:
          'Comprenez la structure d’un projet Mastra : Agents, Tools, Workflows, configuration et correspondance entre Studio et vos fichiers source.',
      },
    },
    {
      slug: 'create-an-agent',
      title: 'Créer un Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'lwhJxPl_loQ',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agents',
      preview: {
        intro:
          'Créez votre propre Agent à partir de zéro dans le code, enregistrez-le dans la configuration Mastra et confirmez son apparition dans Studio. C’est l’Agent que vous étendrez pendant le reste du cours.',
        bullets: [
          'Créer un fichier d’Agent avec un nom, des instructions et un modèle',
          'Enregistrer l’Agent dans src/mastra/index.ts',
          'Premier aperçu d’une Trace : « C’est ici que nous déboguerons tout »',
        ],
      },
      seo: {
        title: 'Créer un Agent | Mastra',
        description:
          'Créez un Agent d’IA personnalisé avec des instructions et une configuration de modèle, enregistrez-le dans Mastra et exécutez-le dans Studio.',
      },
    },

    // Module 2: Tools
    {
      slug: 'create-a-tool',
      title: 'Créer un Tool',
      durationMin: 7,
      status: 'published',
      youtubeId: 'P8voCXTIGVI',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tools',
      preview: {
        intro:
          'Créez un Tool simple, testez-le isolément dans Studio, attachez-le à votre Agent et donnez un prompt à celui-ci afin qu’il appelle le Tool. Ouvrez ensuite Traces pour voir l’appel et son résultat.',
        bullets: [
          'Un Tool est une fonction que l’Agent peut appeler, avec des entrées, des sorties et une description',
          'Tester le Tool dans Studio avant son utilisation par l’Agent',
          'Afficher les entrées et sorties de l’appel de Tool dans la Trace',
        ],
      },
    },
    {
      slug: 'build-with-ai',
      title: 'Développer avec l’IA',
      durationMin: 3,
      status: 'published',
      youtubeId: 'PBtct9tG19k',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tools',
      preview: {
        intro:
          'À noter : si vous utilisez Cursor, Windsurf, Claude Code, VS Code ou Codex — bref, tout outil compatible MCP — Mastra propose un MCP Docs Server qu’il vaut la peine d’activer.',
        bullets: [
          'Ce qu’est le MCP Docs Server de Mastra',
          'Comment l’activer dans votre éditeur',
          'Obtenir la documentation Mastra contextuelle pendant que vous codez',
        ],
      },
    },
    {
      slug: 'fetch-live-data',
      title: 'Récupérer des données en direct',
      durationMin: 7,
      status: 'published',
      youtubeId: 'CMofx-DhpoY',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tools',
      preview: {
        intro:
          'Créez un second Tool qui récupère les temps d’attente en direct à partir du parkId renvoyé par votre premier appel de Tool. Découvrez comment les Tools se composent naturellement lorsque l’Agent les enchaîne.',
        bullets: [
          'Créer un Tool qui appelle une API externe pour récupérer des données en direct',
          'Laisser l’Agent enchaîner plusieurs appels de Tools dans une seule conversation',
          'Vérifier toute la chaîne dans les Traces de Studio',
        ],
      },
    },
    {
      slug: 'connect-to-mcp',
      title: 'Se connecter à MCP',
      durationMin: 7,
      status: 'published',
      youtubeId: 'b8rNHmL4s2s',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tools',
      preview: {
        intro:
          'Connectez votre Agent à des serveurs MCP externes pour accéder aux Tools de l’écosystème MCP. Découvrez comment Mastra relie les capacités des Agents au Model Context Protocol.',
        bullets: [
          'Ce que sont les serveurs MCP et comment ils exposent des Tools',
          'Configurer les connexions aux serveurs MCP dans votre projet Mastra',
          'Utiliser les Tools fournis par MCP avec vos Tools personnalisés',
        ],
      },
    },

    // Module 3: Workflows
    {
      slug: 'build-a-workflow',
      title: 'Créer un Workflow',
      durationMin: 7.5,
      youtubeId: 'Xu0N43frgMs',
      status: 'published',
      module: 'Workflows',
      preview: {
        intro:
          'L’Agent peut appeler un seul Tool, mais certaines tâches nécessitent une séquence reproductible en plusieurs étapes. Créez un Workflow, enchaînez plusieurs étapes et exécutez-le dans Studio.',
        bullets: [
          'Quand utiliser un Workflow : plusieurs étapes dans un ordre fixe',
          'Principes de base de createStep() et createWorkflow()',
          'Entrée et sortie d’étape : les données circulent entre les étapes',
        ],
      },
    },
    {
      slug: 'agents-vs-workflows',
      title: 'Agents et Workflows',
      durationMin: 3,
      youtubeId: 'kiFhVZyHG84',
      status: 'published',
      module: 'Workflows',
      preview: {
        intro: 'Avant de poursuivre, construisez un modèle mental clair pour savoir quand utiliser un Agent et quand utiliser un Workflow.',
        bullets: [
          'Agents : objectif ouvert ; le modèle décide des étapes et du moment où il s’arrête',
          'Workflows : étapes prédéfinies ; vous contrôlez le parcours et la condition d’arrêt',
          'Règle pratique : Agents pour la planification flexible, Workflows pour les processus reproductibles',
        ],
      },
    },
    {
      slug: 'agents-in-workflows',
      title: 'Agents dans les Workflows',
      durationMin: 9,
      youtubeId: 'hHtUcuDqFrY',
      status: 'published',
      module: 'Workflows',
      preview: {
        intro:
          'Rendez le système utilisable : l’utilisateur échange avec un Agent principal, qui délègue le travail en plusieurs étapes à un Workflow. Ajoutez une étape d’approbation Human-in-the-Loop avec suspend et resume.',
        bullets: [
          'Déclencher un Workflow depuis l’Agent comme une capacité unique',
          'Ajouter une porte d’approbation HITL avec suspend(), resume() et bail()',
          'Les Traces affichent les étapes de Workflow, les appels de Tools et les sorties de bout en bout',
        ],
      },
    },

    // Module 4: Memory
    {
      slug: 'how-memory-works',
      title: 'Fonctionnement de la mémoire',
      durationMin: 5.5,
      youtubeId: 'RvtDJJhI8FE',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          'Le modèle est sans état entre les appels. La mémoire permet les échanges de suivi. Tracez une véritable conversation dans Studio pour voir exactement quel contexte l’Agent a reçu et découvrez le réglage lastMessages qui contrôle la quantité d’historique incluse à chaque appel.',
        bullets: [
          'Pourquoi le modèle est sans état et ce que fait Mastra pour y remédier',
          'Ingénierie du contexte : décider ce que le modèle peut voir à chaque appel',
          'lastMessages : le réglage qui contrôle l’historique récent dans la fenêtre de contexte',
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
          'L’historique brut des messages s’accumule rapidement. Activez Observational Memory pour compresser automatiquement l’ancien contexte en observations plus denses, puis testez la mémoire au scope resource afin que les préférences soient conservées d’un thread à l’autre pour un même utilisateur.',
        bullets: [
          'OM compresse l’ancien historique grâce aux Agents d’arrière-plan Observer et Reflector',
          'Scope resource : la mémoire suit l’utilisateur d’un thread à l’autre, et pas seulement dans une conversation',
          'OM remplace le réglage manuel de lastMessages par une gestion automatique du contexte',
        ],
      },
    },
    {
      slug: 'guardrails-with-processors',
      title: 'Guardrails avec des Processors',
      durationMin: 5,
      youtubeId: '9XHVGLld8kk',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          'Dès que de vrais utilisateurs interviennent, vous avez besoin de Guardrails d’entrée. Ajoutez PromptInjectionDetector et ModerationProcessor pour bloquer les requêtes hostiles avant que le modèle ne les voie.',
        bullets: [
          'Les Processors interceptent les messages avant l’appel au modèle et après la réponse',
          'PromptInjectionDetector : bloque les tentatives d’injection, de jailbreak et de remplacement des instructions système',
          'ModerationProcessor : filtre les messages entrants à la recherche de haine et de harcèlement',
        ],
      },
    },

    // Module 5: Production
    {
      slug: 'deploy-to-mastra-platform',
      title: 'Déployer sur la plateforme Mastra',
      durationMin: 4,
      youtubeId: 'O1FnS_qrsPs',
      status: 'published',
      module: 'Production',
      preview: {
        intro:
          'Déployez l’Agent de parc à thème depuis votre environnement Studio local vers un point de terminaison public actif avec Mastra Server.',
        bullets: [
          'Explorez l’interface Swagger pour voir chaque Agent déjà exposé comme point de terminaison HTTP',
          'Exécutez mastra server deploy pour construire, envoyer et obtenir une URL publique stable',
          'Mastra est déjà un serveur HTTP ; Mastra Server le place dans un environnement public',
        ],
      },
    },
    {
      slug: 'chat-with-agent-in-slack',
      title: 'Discuter avec un Agent dans Slack',
      durationMin: 9,
      youtubeId: 'fD6M6n_OdJI',
      status: 'published',
      module: 'Production',
      preview: {
        intro:
          'Connectez l’Agent de parc à thème déployé à Slack afin de pouvoir lui écrire depuis n’importe où, avec les mêmes Tools, mémoire et Workflows, depuis un message privé.',
        bullets: [
          'Ajoutez l’adaptateur Slack et une configuration channels à l’Agent',
          'Mastra expose automatiquement la route du webhook : aucun gestionnaire à écrire',
          'Channels prend aussi en charge Discord et Telegram selon le même modèle',
        ],
      },
    },
  ],
}
