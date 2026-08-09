import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { course as englishCourse } from './course'
import { course as japaneseCourse } from './course.ja'
import { course as simplifiedChineseCourse } from './course.zh-CN'
import { course as taiwanChineseCourse } from './course.zh-TW'
import { course as hongKongChineseCourse } from './course.zh-HK'
import { contentModules as englishContentModules } from './contentIndex'
import { contentModules as japaneseContentModules } from './contentIndex.ja'
import { contentModules as simplifiedChineseContentModules } from './contentIndex.zh-CN'
import { contentModules as taiwanChineseContentModules } from './contentIndex.zh-TW'
import { contentModules as hongKongChineseContentModules } from './contentIndex.zh-HK'

export function useLocalizedLearnContent() {
  const { i18n } = useDocusaurusContext()
  const isSimplifiedChinese = i18n.currentLocale === 'zh-CN'
  const isTaiwanChinese = i18n.currentLocale === 'zh-TW'
  const isHongKongChinese = i18n.currentLocale === 'zh-HK'
  const isJapanese = i18n.currentLocale === 'ja'
  const isLocalized = isSimplifiedChinese || isTaiwanChinese || isHongKongChinese || isJapanese

  return {
    course: isSimplifiedChinese
      ? simplifiedChineseCourse
      : isTaiwanChinese
        ? taiwanChineseCourse
        : isHongKongChinese
          ? hongKongChineseCourse
          : isJapanese
            ? japaneseCourse
            : englishCourse,
    contentModules: isSimplifiedChinese
      ? simplifiedChineseContentModules
      : isTaiwanChinese
        ? taiwanChineseContentModules
        : isHongKongChinese
          ? hongKongChineseContentModules
          : isJapanese
            ? japaneseContentModules
            : englishContentModules,
    isSimplifiedChinese,
    isTaiwanChinese,
    isHongKongChinese,
    isJapanese,
    isLocalized,
  }
}
