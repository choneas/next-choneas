export interface Project {
    isGithubRepo?: boolean
    repo?: string
    name?: string
    link?: string
    description?: string
    cover?: string
}

export interface GithubRepoInfo {
    description: string
    stargazers_count: number
    updated_at: string
}