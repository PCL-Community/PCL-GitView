function getQueryParam(name, url) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get(name);
}
export const fetchAllIssues = () => {
    return new Promise((resolve, reject) => {
        const fetchIssues = (url, issues) => {
            fetch(url) // TODO：删了个 Header，别忘记加回去 
                .then(async (response) => {
                    if (!response.ok) {
                        reject({
                            status: response.status,
                            message: "Error on fetch data",
                        });
                    }
                    // Prase Link Header, For Paging
                    const linkHeader = response.headers.get("link");
                    let lastPageLink = null;
                    if (linkHeader) {
                        const links = linkHeader.split(",");
                        const linkLast = links.find((link) =>
                            link.includes('rel="last"')
                        );
                        if (linkLast != undefined) {
                            // Verify whether there is the nextpage url, if yes, prase the url
                            lastPageLink = linkLast
                                .split(";")[0]
                                .trim()
                                .slice(1, -1);
                            lastPage = getQueryParam("page", lastPageLink)
                            console.debug(lastPage)
                        }
                    }
                    const data = await response.json();
                    const combinedIssues = issues.concat(data);
                    if (lastPageLink) {
                        for (let i = 1; i <= lastPage; i++) {
                            fetchIssues(
                                lastPageLink.replace(`page=${lastPage}`, `page=${i}`),
                                combinedIssues
                            );
                        }
                    } else {
                        resolve(combinedIssues);
                    }
                })
                .catch((error) => {
                    reject({
                        status: 0,
                        message: "Fetching issues failed: " + error.message,
                    });
                });
        };
        fetchIssues(
            "https://api.github.com/repos/Hex-Dragon/PCL2/issues?per_page=100&state=all",
            []
        );
    });
};
