export async function fetchGithubRepoInfo(repo: string) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 3600 } // 缓存1小时
        });
        
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching Github repo:', error);
        return null;
    }
}
