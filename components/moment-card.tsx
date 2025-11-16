'use client'

import { Card, Skeleton, Button } from "@heroui/react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { LuMessageCircle, LuMessageSquare } from "react-icons/lu"
import { FiArrowUpRight } from "react-icons/fi"
import Image from "next/image"
import NotionPage from "@/components/notion-page"
import { Comment } from "@/components/comment"
import { Tags } from "@/components/tags"
import { Avatar } from "@/components/avatar"
import type { ExtendedRecordMap } from "notion-types"
import type { PostMetadata } from "@/types/content"
import { formatDate } from "@/lib/format"
import { getPost } from "@/lib/content"

export function MomentCard({ moment }: { moment: PostMetadata }) {
  const isTweet = moment.type === "Tweet"
  const t = useTranslations('Moment')
  const router = useRouter()
  const locale = useLocale()
  const contentRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)
  const collapseButtonRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(isTweet)
  const [isExpanded, setIsExpanded] = useState(true)
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null)
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [shouldScrollToComment, setShouldScrollToComment] = useState(false)
  const [buttonAnimated, setButtonAnimated] = useState(false)

  useEffect(() => {
    if (!isTweet || !moment.id) return
    const fetchPost = async () => {
      try {
        const { recordMap: data } = await getPost(moment.id as string, true)
        setRecordMap(data)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [moment.id, isTweet])

  useEffect(() => {
    if (!isTweet) return
    if (moment.description) setIsExpanded(false)
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      if (height > 148) {
        setIsExpanded(false)
      } else {
        setIsExpanded(true)
      }
    }
  }, [moment.description, isTweet, recordMap])

  // 展开时滚动到评论区
  useEffect(() => {
    if (isDisclosureOpen && shouldScrollToComment && commentRef.current) {
      setTimeout(() => {
        commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setShouldScrollToComment(false)
      }, 300)
    }
  }, [isDisclosureOpen, shouldScrollToComment])

  // 监听滚动，判断按钮是否应该固定在 Card 底部
  useEffect(() => {
    if (!isDisclosureOpen) {
      setButtonAnimated(false)
      return
    }

    const handleScroll = () => {
      if (!collapseButtonRef.current) return

      const buttonPlaceholderRect = collapseButtonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // 当按钮占位符到达视口底部时，切换为 absolute 定位
      if (buttonPlaceholderRect.top <= viewportHeight - 16) {
        setButtonAnimated(true)
      } else {
        setButtonAnimated(false)
      }
    }

    // 初始检查
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isDisclosureOpen])

  if (!moment.id) return null;

  const handleCardClick = () => {
    if (isTweet) {
      setScrollPosition(window.scrollY)
      setIsDisclosureOpen(true)
    } else {
      router.push('/article/' + (moment.slug || moment.id))
    }
  }

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = isTweet ? `/tweet/${moment.slug || moment.id}` : `/article/${moment.slug || moment.id}`
    router.push(url)
  }

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDisclosureOpen) {
      setScrollPosition(window.scrollY)
      setIsDisclosureOpen(true)
    } else {
      setIsDisclosureOpen(false)
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' })
      }, 100)
    }
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDisclosureOpen) {
      setShouldScrollToComment(true)
      setScrollPosition(window.scrollY)
      setIsDisclosureOpen(true)
    } else {
      commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div ref={cardRef} className="relative">
      <Card className="relative">
        <div
          onClick={handleCardClick}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCardClick()
            }
          }}
        >
          <Button
            isIconOnly
            variant="secondary"
            onClick={handleOpenInNewTab}
            className="absolute top-3 right-3 z-30"
            aria-label={t('open-in-new-tab')}
            id={`moment-open-new-tab-${moment.id}`}
          >
            <FiArrowUpRight size={20} />
          </Button>

          {/* Header */}
          <div className="flex gap-3 items-center">
            <Avatar isMe size="sm" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Choneas</span>
              <span className="text-xs text-content3-foreground">
                {formatDate(moment.created_time, locale, true)}
                {!isTweet && " · " + t('article-publish')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <span className="text-xl font-semibold">
              {moment.icon && <span className="mr-1">{moment.icon}</span>}
              {moment.title}
            </span>

            {/* Tags - 显示在标题下方 */}
            {moment.tags && moment.tags.length > 0 && (
              <Tags tags={moment.tags} />
            )}

            {isTweet ? (
              isLoading ? (
                <TweetContentSkeleton
                  hasDescription={moment.description ? true : false}
                  images={moment.photos?.length ? Array(moment.photos.length).fill(0) : undefined}
                />
              ) : recordMap ? (
                <>
                  {/* 未展开时显示预览 */}
                  {!isDisclosureOpen && (
                    <>
                      {!moment.description ? (
                        <div
                          ref={contentRef}
                          className="tweet-preview relative max-h-[178px] overflow-hidden pointer-events-none"
                          tabIndex={-1}
                        >
                          <NotionPage recordMap={recordMap} type="tweet-preview" />
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-foreground/80">
                          <LuMessageCircle size={20} className="shrink-0 mt-0.5" />
                          <p>{moment.description}</p>
                        </div>
                      )}
                      {!isExpanded && !moment.description && (
                        <div className="relative -mt-8 z-10 h-12 flex items-center justify-center bg-linear-to-t from-surface/95 to-transparent">
                          <Button
                            onClick={handleViewAllClick}
                            size="sm"
                            variant="secondary"
                            className="px-4 py-2 bg-surface-secondary/80 backdrop-blur-md"
                          >
                            {t('view-all')}
                          </Button>
                        </div>
                      )}
                      {/* 图片预览 */}
                      <ImagePreview images={moment.photos ?? []} />
                    </>
                  )}

                  {/* 展开时显示完整内容 */}
                  {isDisclosureOpen && (
                    <div className="space-y-4">
                      <NotionPage recordMap={recordMap} type="tweet-details" />
                    </div>
                  )}
                </>
              ) : null
            ) : (
              <p className="text-foreground/80">{moment.description}</p>
            )}
          </div>

          {/* Footer - 仅用于 Tweet 的评论按钮 */}
          {isTweet && !isLoading && !isDisclosureOpen && (
            <Button
              onClick={handleCommentClick}
              variant="secondary"
              className="w-full justify-start gap-2 pl-4 py-2 transition-colors"
            >
              <LuMessageSquare size={18} />
              <span>{t('comment-placeholder')}</span>
            </Button>
          )}
        </div>

        {/* Giscus 评论区 - 展开时显示在 Card 内部 */}
        {isTweet && recordMap && isDisclosureOpen && (
          <div ref={commentRef} className="mt-4 pt-4">
            <Comment type="tweet" metadata={moment} />
          </div>
        )}

        {/* 收起按钮占位符 - 在 Card 最下方 */}
        {isTweet && isDisclosureOpen && (
          <div ref={collapseButtonRef} className="relative mt-4 flex justify-center pb-2 h-14">
            {/* 占位符，实际按钮会动画移动到这里 */}
          </div>
        )}
      </Card>

      {/* 收起按钮 - 固定在视口底部，然后动画移动到 Card 底部 */}
      {isTweet && isDisclosureOpen && (
        <div
          className={`${buttonAnimated ? 'absolute' : 'fixed'} ${buttonAnimated ? 'bottom-2' : 'bottom-4'} left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out`}
        >
          <Button
            onClick={handleViewAllClick}
            size="md"
            variant="secondary"
            className="px-6 py-3 bg-surface/95 backdrop-blur-md shadow-lg"
          >
            {t('collapse')}
          </Button>
        </div>
      )}
    </div>
  )
}

function ImagePreview({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  const displayImages = images.slice(0, 6);

  const gridClass = displayImages.length === 1 ? 'md:grid-cols-1' :
    displayImages.length === 2 ? 'md:grid-cols-2' :
      displayImages.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';

  return (
    <div
      className={`flex flex-col md:grid ${gridClass} gap-2`}
      tabIndex={-1}
    >
      {displayImages.map((image, i) => (
        <div
          key={i}
          className="relative w-full h-36 overflow-hidden"
          tabIndex={-1}
        >
          <Image
            src={image}
            alt=""
            fill
            quality={50}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-[calc(var(--radius-md)*1.5)] object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export function TweetContentSkeleton(
  { images, hasDescription }: { images?: number[]; hasDescription?: boolean }
) {
  const gridClass = !images ? '' :
    images.length === 1 ? 'md:grid-cols-1' :
      images.length === 2 ? 'md:grid-cols-2' :
        images.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';

  return (
    <>
      <Skeleton className="rounded-lg max-w-[24rem] h-6 mt-4" />
      <Skeleton className="rounded-lg max-w-lg mt-2 h-6" />

      {images && images.length > 0 && (
        <div className={`flex flex-col md:grid ${gridClass} gap-2 my-3`}>
          {images.map((_, i) => (
            <Skeleton
              key={i}
              className="rounded-lg w-full h-36"
            />
          ))}
        </div>
      )}

      {hasDescription ?
        <div className="grid lg:grid-cols-6 mt-4 gap-2">
          <Skeleton className="rounded-lg h-10" />
          <Skeleton className="rounded-lg lg:col-span-5 h-10" />
        </div>
        :
        <Skeleton className="rounded-lg w-full mt-2 h-10" />
      }
    </>
  )
}
