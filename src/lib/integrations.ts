export async function fetchGitHubCommits(username: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CompLife-App'
      },
      next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limiting
    });
    
    if (!res.ok) return 0;

    const events = await res.json();
    const today = new Date().toISOString().split('T')[0];
    
    let commitCount = 0;
    
    // @ts-ignore
    events.forEach((event: any) => {
      if (event.type === 'PushEvent' && event.created_at.startsWith(today)) {
        commitCount += event.payload.commits.length;
      }
    });

    return commitCount;
  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return 0;
  }
}

export async function fetchLeetCodeGenerals(username: string): Promise<number> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query userSessionProgress($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username }
      }),
      next: { revalidate: 3600 }
    });

    if (!res.ok) return 0;
    const data = await res.json();
    
    const submissions = data?.data?.matchedUser?.submitStats?.acSubmissionNum;
    if (!submissions) return 0;

    // Find the total solved "All" count
    // @ts-ignore
    const totalSolvedObj = submissions.find((s: any) => s.difficulty === "All");
    return totalSolvedObj ? totalSolvedObj.count : 0;
  } catch (error) {
    console.error("LeetCode Fetch Error:", error);
    return 0;
  }
}
