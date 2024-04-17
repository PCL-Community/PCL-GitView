function getQueryParam(name, url) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get(name);
}
function fetchOne(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(async (response) => {
                if (!response.ok) {
                    reject({
                        status: response.status,
                        message: "Error on fetch data",
                    });
                }
                const data = await response.json();
                resolve(data);
            })
    })
}
export const fetchAllIssues = () => {
    return new Promise((resolve, reject) => {
        const fetchIssues = (url) => {
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
                    const linkLast = linkHeader.split(",").find((link) =>
                        link.includes('rel="last"')
                    );
                    const lastPageLink = linkLast
                        .split(";")[0]
                        .trim()
                        .slice(1, -1);
                    const lastPage = getQueryParam("page", lastPageLink);
                    console.debug(lastPage);
                    const data = await response.json();
                    let combinedIssues = data;
                    if (lastPageLink) {
                        for (let i = 1; i <= Number(lastPage); i++) {
                            data = await fetchOne(
                                lastPageLink.replace(`page=${lastPage}`, `page=${i}`)
                            );
                            combinedIssues = combinedIssues.concat(data);
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
