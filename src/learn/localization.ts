import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { course as englishCourse } from './course'
import { course as frenchCourse } from './course.fr'
import { course as japaneseCourse } from './course.ja'
import { course as koreanCourse } from './course.ko'
import { course as simplifiedChineseCourse } from './course.zh-CN'
import { course as taiwanChineseCourse } from './course.zh-TW'
import { course as hongKongChineseCourse } from './course.zh-HK'
import { contentModules as englishContentModules } from './contentIndex'
import { contentModules as frenchContentModules } from './contentIndex.fr'
import { contentModules as japaneseContentModules } from './contentIndex.ja'
import { contentModules as koreanContentModules } from './contentIndex.ko'
import { contentModules as simplifiedChineseContentModules } from './contentIndex.zh-CN'
import { contentModules as taiwanChineseContentModules } from './contentIndex.zh-TW'
import { contentModules as hongKongChineseContentModules } from './contentIndex.zh-HK'

export function useLocalizedLearnContent() {
  const { i18n } = useDocusaurusContext()
  const isFrench = i18n.currentLocale === 'fr'
  const isKorean = i18n.currentLocale === 'ko'
  const isSimplifiedChinese = i18n.currentLocale === 'zh-CN'
  const isTaiwanChinese = i18n.currentLocale === 'zh-TW'
  const isHongKongChinese = i18n.currentLocale === 'zh-HK'
  const isJapanese = i18n.currentLocale === 'ja'
  const isLocalized = isFrench || isKorean || isSimplifiedChinese || isTaiwanChinese || isHongKongChinese || isJapanese

  return {
    course: isFrench
      ? frenchCourse
      : isKorean
        ? koreanCourse
      : isSimplifiedChinese
      ? simplifiedChineseCourse
      : isTaiwanChinese
        ? taiwanChineseCourse
        : isHongKongChinese
          ? hongKongChineseCourse
          : isJapanese
            ? japaneseCourse
            : englishCourse,
    contentModules: isFrench
      ? frenchContentModules
      : isKorean
        ? koreanContentModules
      : isSimplifiedChinese
      ? simplifiedChineseContentModules
      : isTaiwanChinese
        ? taiwanChineseContentModules
        : isHongKongChinese
          ? hongKongChineseContentModules
          : isJapanese
            ? japaneseContentModules
            : englishContentModules,
    isFrench,
    isKorean,
    isSimplifiedChinese,
    isTaiwanChinese,
    isHongKongChinese,
    isJapanese,
    isLocalized,
  }
}
