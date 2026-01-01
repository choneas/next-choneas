'use client'

import { Card, Skeleton, Button, Tooltip } from "@heroui/react"
import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { LuMessageCircle, LuMessageSquare } from "react-icons/lu"
import { FiArrowUpRight } from "react-icons/fi"
import { FaXTwitter } from "react-icons/fa6"
import { SiBluesky } from "react-icons/si"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Tags } from "@/components/tags"
import { Avatar } from "@/components/avatar"
import { TweetModal } from "@/components/tweet-modal"
import type { ExtendedRecordMap } from "notion-types"
import type { PostMetadata, Platform } from "@/types/content"
import { formatDate } from "@/lib/format"
import { getPostRecordMap } from "@/lib/content"

const NotionPage = dynamic(() => import("@/components/notion-page"), {
  loading: () => <NotionPageSkeleton />,
  ssr: false
})

interface MomentCardProps {
  moment: PostMetadata;
}

function PlatformIcon({ platform, size = 20 }: { platform?: Platform; size?: number }) {
  switch (platform) {
    case 'x':
      return <FaXTwitter size={size} />;
    case 'bluesky':
      return <SiBluesky size={size} />;
    default:
      return <FiArrowUpRight size={size} />;
  }
}

export function MomentCard({ moment }: MomentCardProps) {
  const isTweet = moment.type === "Tweet"
  const isNotionPost = moment.platform === 'notion' || !moment.platform
  const t = useTranslations('Moment')
  const router = useRouter()
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(isTweet && isNotionPost)
  const [isExpanded, setIsExpanded] = useState(false)
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [needsExpansion, setNeedsExpansion] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check if content needs expansion after loading
  useEffect(() => {
    if (!contentRef.current || isLoading) return

    const contentHeight = contentRef.current.scrollHeight
    const visibleHeight = contentRef.current.clientHeight
    const maxHeight = 200 // Maximum height before showing expand button

    setNeedsExpansion(contentHeight > maxHeight)
  }, [recordMap, isLoading, moment.description])

  // Only fetch Notion posts, social posts have content in description
  useEffect(() => {
    if (!isTweet || !isNotionPost || !moment.id) return
    const fetchPost = async () => {
      try {
        // Use getPostRecordMap for client-side fetching (no translation needed)
        const { recordMap: data } = await getPostRecordMap(moment.id as string, true)
        setRecordMap(data)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [moment.id, isTweet, isNotionPost])

  if (!moment.id) return null;

  // Get tooltip text based on platform
  const getTooltipText = () => {
    if (moment.platform === 'x') {
      return t('view-on-x');
    }
    if (moment.platform === 'bluesky') {
      return t('view-on-bluesky');
    }
    return t('open-in-new-tab'); // For notion posts
  };

  // Get external URL for social platforms
  const getExternalUrl = () => {
    if (moment.platform === 'x' && moment.social?.postId && moment.social?.username) {
      return `https://x.com/${moment.social.username}/status/${moment.social.postId}`;
    }
    if (moment.platform === 'bluesky' && moment.social?.postId && moment.social?.username) {
      return `https://bsky.app/profile/${moment.social.username}/post/${moment.social.postId}`;
    }
    return null;
  };

  const handleCardClick = () => {
    const externalUrl = getExternalUrl();
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    } else if (isTweet) {
      setIsModalOpen(true)
    } else {
      router.push('/article/' + (moment.slug || moment.id))
    }
  }

  const handleOpenInNewTab = () => {
    const externalUrl = getExternalUrl();
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      const url = isTweet ? `/tweet/${moment.slug || moment.id}` : `/article/${moment.slug || moment.id}`
      router.push(url)
    }
  }

  const handleViewAllClick = () => {
    if (isTweet) {
      setIsModalOpen(true)
    } else {
      setIsExpanded(true)
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
          layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
        }}
      >
        <Card
          onClick={handleCardClick}
          tabIndex={0}
          role="article"
          className="relative focus:outline-none focus:ring-2 ring-accent"
          aria-label={`${moment.title} - ${formatDate(moment.created_time, locale, true)}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCardClick()
            }
          }}
        >
          <Tooltip delay={0}>
            <Button
              isIconOnly
              variant="secondary"
              onPress={handleOpenInNewTab}
              className="absolute top-3 right-3"
              aria-label={getTooltipText()}
            >
              <PlatformIcon platform={moment.platform} size={20} />
            </Button>
            <Tooltip.Content offset={7} placement="right">
              <p>{getTooltipText()}</p>
            </Tooltip.Content>
          </Tooltip>

          {/* Header */}
          <div className="flex gap-3 items-center">
            <Avatar size="sm" name="Choneas" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Choneas</span>
              <span className="text-xs text-content3-foreground">
                {/* Handle for social platforms */}
                {moment.platform && moment.platform !== 'notion' && moment.social?.username && (
                  <>
                    <span className="text-xs">@{moment.social.username}</span>
                    <span> · </span>
                  </>
                )}
                <span>{formatDate(moment.created_time, locale, true)}</span>
                {/* Reading Time */}
                {!isTweet && moment.readingTime && " · " + moment.readingTime}
              </span>
            </div>
          </div>

          {/* Content */}
          <motion.div
            className={`space-y-3 moment-card-content ${isLoading ? 'loading' : 'loaded'}`}
            layout
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Title */}
            {(isNotionPost || moment.title) && (
              <span className="text-xl font-semibold">
                {moment.icon && <span className="mr-1" aria-hidden="true">{moment.icon}</span>}
                {moment.title}
              </span>
            )}

            {/* Tags */}
            {moment.tags && moment.tags.length > 0 && (
              <Tags className="pt-1" tags={moment.tags} />
            )}

            <AnimatePresence mode="wait">
              {isTweet ? (
                !isNotionPost ? (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="relative min-h-16">
                      <motion.div
                        className="tweet-preview relative pointer-events-none"
                        layout
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <p className="text-foreground/90 text-base whitespace-pre-wrap">{moment.description}</p>
                      </motion.div>
                    </div>
                    <ImagePreview images={moment.photos ?? []} />
                  </motion.div>
                ) : isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TweetContentSkeleton
                      hasDescription={moment.description ? true : false}
                      images={moment.photos?.length ? Array(moment.photos.length).fill(0) : undefined}
                    />
                  </motion.div>
                ) : recordMap ? (
                  <motion.div
                    key="loaded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="relative">
                      {moment.description ? (
                        <div className="flex items-start gap-2 text-foreground/80">
                          <LuMessageCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
                          <p>{moment.description}</p>
                        </div>
                      ) : (
                        <div className="relative min-h-16">
                          <motion.div
                            ref={contentRef}
                            className={`tweet-preview relative ${needsExpansion && !isExpanded
                              ? 'max-h-[200px] overflow-hidden'
                              : ''
                              } pointer-events-none`}
                            layout
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            inert={!isExpanded}
                            aria-hidden={!isExpanded}
                            tabIndex={-1}
                            role="presentation"
                          >
                            <Suspense fallback={<NotionPageSkeleton />}>
                              <NotionPage recordMap={recordMap} type="tweet-preview" />
                            </Suspense>
                          </motion.div>
                          {needsExpansion && !isExpanded && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-center pb-2"
                              style={{
                                background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 100%)'
                              }}
                            >
                              <Button
                                onPress={handleViewAllClick}
                                size="sm"
                                variant="secondary"
                                className="px-4 py-2 bg-surface-secondary/80 backdrop-blur-md"
                              >
                                {t('view-all')}
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Image preview */}
                    <ImagePreview images={moment.photos ?? []} />
                  </motion.div>
                ) : null
              ) : (
                <motion.p
                  key="article"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-foreground/80"
                >
                  {moment.description}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          {isTweet && (isNotionPost ? !isLoading : true) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                onPress={() => {
                  const externalUrl = getExternalUrl();
                  if (externalUrl) {
                    window.open(externalUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                variant="secondary"
                className="w-full justify-start gap-2 pl-4 py-2 transition-colors"
              >
                <LuMessageSquare size={18} aria-hidden="true" />
                <span>{t('comment-placeholder')}</span>
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Modal for Tweet details */}
      {isTweet && (
        <TweetModal
          isLoading={isLoading && isNotionPost}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          recordMap={isNotionPost ? (recordMap || undefined) : undefined}
          metadata={moment}
        />
      )}
    </>
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
      role="list"
      aria-label="Images"
    >
      {displayImages.map((image, i) => (
        <div
          key={i}
          role="listitem"
          className="relative w-full h-36 overflow-hidden"
        >
          <Image
            src={image}
            alt=""
            fill
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-[calc(var(--radius-md)*1.5)] object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function NotionPageSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-5/6 rounded-lg" />
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

interface MomentCardSkeletonProps {
  moment: PostMetadata;
  locale?: string; // Optional locale prop for SSR fallback
}

export function MomentCardSkeleton({ moment, locale: propLocale }: MomentCardSkeletonProps) {
  const isTweet = moment.type === "Tweet"
  // Use prop locale if provided (for Suspense fallback), otherwise use hook
  const hookLocale = useLocale()
  const locale = propLocale || hookLocale

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="relative">
        {/* Header */}
        <div className="flex gap-3 items-center">
          <Avatar size="sm" name="Choneas" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <span className="text-xs text-content3-foreground">
              {/* Handle for social platforms in skeleton */}
              {moment.platform && moment.platform !== 'notion' && moment.social?.username && (
                <>
                  <span className="text-xs">@{moment.social.username}</span>
                  <span> · </span>
                </>
              )}
              {/* Date (unified) */}
              {formatDate(moment.created_time, locale, true)}
              {/* Time for social platforms */}
              {moment.platform && moment.platform !== 'notion' && (
                <span> {moment.created_time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              )}
              {!isTweet && moment.readingTime && " · " + moment.readingTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 moment-card-content loading">
          <div className="flex items-center gap-1">
            {moment.icon && <span className="mr-1" aria-hidden="true">{moment.icon}</span>}
            <span className="text-xl font-semibold">{moment.title}</span>
          </div>

          {/* Tags */}
          {moment.tags && moment.tags.length > 0 && (
            <Tags className="pt-1" tags={moment.tags} />
          )}

          {isTweet ? (
            <TweetContentSkeleton
              hasDescription={moment.description ? true : false}
              images={moment.photos?.length ? Array(moment.photos.length).fill(0) : undefined}
            />
          ) : (
            <p className="text-foreground/80">{moment.description}</p>
          )}
        </div>

        {/* Footer */}
        {isTweet && (
          <Skeleton className="h-10 w-full rounded-full" />
        )}
      </Card>
    </motion.div>
  )
}
