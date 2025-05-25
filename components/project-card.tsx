"use client"

import { Card, CardHeader, CardBody, CardFooter, Link, Image } from "@heroui/react"
import { FaStar } from "react-icons/fa"
import type { Project, GithubRepoInfo } from "@/types/project"
import { formatDate } from "@/lib/format"
import { useEffect, useState } from "react"
import { fetchGithubRepoInfo } from "@/lib/github"
import { useTranslations, useLocale } from "next-intl"

export function ProjectCard({ project }: { project: Project }) {
    const [repoInfo, setRepoInfo] = useState<GithubRepoInfo | null>(null);
    const [error, setError] = useState<boolean>(false);
    const locale = useLocale();
    const t = useTranslations('Project');
    
    const finalLink = project.isGithubRepo && project.repo 
        ? `https://github.com/${project.repo}`
        : project.link;

    useEffect(() => {
        if (project.isGithubRepo && project.repo) {
            fetchGithubRepoInfo(project.repo)
                .then(data => {
                    if (!data) {
                        setError(true);
                        return;
                    }
                    setRepoInfo(data);
                })
                .catch(() => setError(true));
        }
    }, [project.repo, project.isGithubRepo]);

    return (
        <Card 
            isExternal 
            as={Link} 
            href={finalLink || '#'}
            className="w-full transition-shadow bg-primary-60"
        >
            <CardHeader className="flex flex-col items-start gap-1 pb-2 px-4 pt-4">
                <h3 className="text-xl font-semibold">
                    {project.name}
                </h3>
                {project.link && (
                    <span className="text-sm text-content2-foreground flex items-center gap-1">
                        {project.link}
                        <span className="i-heroicons-arrow-top-right-20-solid" />
                    </span>
                )}
            </CardHeader>
            
            <CardBody className="flex flex-col gap-3 px-4 py-2">
                {error ? (
                    <p className="text-danger">{t('error.fetch-failed')}</p>
                ) : (
                    <>
                        {project.cover && (
                            <Image
                                src={project.cover}
                                alt={project.name || ''}
                                className="w-full h-48 rounded-lg object-cover"
                            />
                        )}
                        <p className="text-lg text-gray-600">
                            {project.isGithubRepo ? repoInfo?.description : project.description}
                        </p>
                    </>
                )}
            </CardBody>

            {project.isGithubRepo && repoInfo && !error && (
                <CardFooter className="flex items-center gap-2 text-sm text-gray-500 pt-2 pb-4 px-4">
                    <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        {repoInfo?.stargazers_count}
                    </span>
                    <span>·</span>
                    <span>{formatDate(new Date(repoInfo?.updated_at || ''), locale)}</span>
                </CardFooter>
            )}
        </Card>
    )
}