'use client'

import { Card, Skeleton, Button } from "@heroui/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { LuMessageCircle, LuMessageSquare } from "react-icons/lu"
import { FiArrowUpRight } from "react-icons/fi"
import Image from "next/image"
import NotionPage from "@/components/notion-page"
import { Tags } from "@/components/tags"
import { Avatar } from "@/components/avatar"
import { TweetModal } from "@/components/tweet-modal"
import type { ExtendedRecordMap } from "notion-types"
import type { PostMetadata } from "@/types/content"
import { formatDate } from "@/lib/format"
import { getPost } from "@/lib/content"

export function MomentCard({ moment }: { moment: PostMetadata }) {
  const isTweet = moment.type === "Tweet"
  const t = useTranslations('Moment')
  const router = useRouter()
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(isTweet)
  const [isExpanded, setIsExpanded] = useState(true)
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    if (!isTweet || !recordMap) return
    if (moment.description) {
      setIsExpanded(false)
    }
  }, [moment.description, isTweet, recordMap])

  if (!moment.id) return null;

  const handleCardClick = () => {
    if (isTweet) {
      setIsModalOpen(true)
    } else {
      router.push('/article/' + (moment.slug || moment.id))
    }
  }

  const handleOpenInNewTab = () => {
    const url = isTweet ? `/tweet/${moment.slug || moment.id}` : `/article/${moment.slug || moment.id}`
    router.push(url)
  }

  const handleViewAllClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
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
        <Button
          isIconOnly
          variant="secondary"
          onPress={handleOpenInNewTab}
          className="absolute top-3 right-3"
          aria-label={t('open-in-new-tab')}
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
              {!isTweet && moment.readingTime && " · " + moment.readingTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <span className="text-xl font-semibold">
            {moment.icon && <span className="mr-1" aria-hidden="true">{moment.icon}</span>}
            {moment.title}
          </span>

          {/* Tags */}
          {moment.tags && moment.tags.length > 0 && (
            <Tags className="pt-1" tags={moment.tags} />
          )}

          {isTweet ? (
            isLoading ? (
              <TweetContentSkeleton
                hasDescription={moment.description ? true : false}
                images={moment.photos?.length ? Array(moment.photos.length).fill(0) : undefined}
              />
            ) : recordMap ? (
              <>
                <div className="relative">
                  {!moment.description ? (
                    <div
                      inert
                      aria-hidden
                      tabIndex={-1}
                      role="presentation"
                      className="tweet-preview relative max-h-[178px] overflow-hidden pointer-events-none"
                    >
                      <NotionPage recordMap={recordMap} type="tweet-preview" />
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-foreground/80">
                      <LuMessageCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <p>{moment.description}</p>
                    </div>
                  )}
                  {!isExpanded && !moment.description && (
                    <div
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
                    </div>
                  )}
                </div>
                {/* Image preview */}
                <ImagePreview images={moment.photos ?? []} />
              </>
            ) : null
          ) : (
            <p className="text-foreground/80">{moment.description}</p>
          )}
        </div>

        {/* Footer - Comment button for Tweet */}
        {isTweet && !isLoading && (
          <Button
            onPress={() => setIsModalOpen(true)}
            variant="secondary"
            className="w-full justify-start gap-2 pl-4 py-2 transition-colors"
          >
            <LuMessageSquare size={18} aria-hidden="true" />
            <span>{t('comment-placeholder')}</span>
          </Button>
        )}
      </Card>

      {/* Modal for Tweet details */}
      {isTweet && (
        <TweetModal
          isLoading={isLoading}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          recordMap={recordMap || undefined}
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
