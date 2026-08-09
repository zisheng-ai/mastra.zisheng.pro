import type { LoadContext, Plugin } from '@docusaurus/types'
import { course } from '../../learn/course'

export default function pluginLearn(context: LoadContext): Plugin {
  const learnBasePath = `${context.baseUrl.replace(/\/$/, '')}/learn`

  return {
    name: 'docusaurus-plugin-learn',
    async contentLoaded({ actions }) {
      const { addRoute } = actions

      addRoute({
        path: learnBasePath,
        component: '@site/src/learn/pages/LearnLandingPage',
        exact: true,
      })

      for (const lesson of course.lessons) {
        if (lesson.status !== 'published') continue
        addRoute({
          path: `${learnBasePath}/${lesson.slug}`,
          component: '@site/src/learn/pages/LessonPage',
          exact: true,
        })
      }
    },
  }
}
