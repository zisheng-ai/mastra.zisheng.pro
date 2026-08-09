import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { course as englishCourse } from './course'
import { course as japaneseCourse } from './course.ja'
import { course as simplifiedChineseCourse } from './course.zh-CN'
import { course as hongKongChineseCourse } from './course.zh-HK'
import { contentModules as englishContentModules } from './contentIndex'
import { contentModules as japaneseContentModules } from './contentIndex.ja'
import { contentModules as simplifiedChineseContentModules } from './contentIndex.zh-CN'
import { contentModules as hongKongChineseContentModules } from './contentIndex.zh-HK'

export function useLocalizedLearnContent() {
  const { i18n } = useDocusaurusContext()
  const isSimplifiedChinese = i18n.currentLocale === 'zh-CN'
  const isHongKongChinese = i18n.currentLocale === 'zh-HK'
  const isJapanese = i18n.currentLocale === 'ja'
  const isLocalized = isSimplifiedChinese || isHongKongChinese || isJapanese

  return {
    course: isSimplifiedChinese
      ? simplifiedChineseCourse
      : isHongKongChinese
        ? hongKongChineseCourse
        : isJapanese
          ? japaneseCourse
          : englishCourse,
    contentModules: isSimplifiedChinese
      ? simplifiedChineseContentModules
      : isHongKongChinese
        ? hongKongChineseContentModules
        : isJapanese
          ? japaneseContentModules
          : englishContentModules,
    isSimplifiedChinese,
    isHongKongChinese,
    isJapanese,
    isLocalized,
  }
}
