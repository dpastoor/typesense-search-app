const exampleData = [
    {
        "snippets": ["Tools to help integrate R package projects with <mark>GitLab-CI</mark>"],
        "branch": "master",
        "slug": "/data_science-r_packages-gitlabci/master/docs/README/",
        "nav_target": "root"
    }, {
        "snippets": ["Reconciling in the CLI is not terribly hard, but has a number of steps. In gener" +
                "al, it is recommended to perform this in <mark>gitlab\nas</mark> the interface a" +
                "bstracts these actions well:"],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/05-merge/",
        "nav_target": "#cli"
    }, {
        "snippets": [
            "Any files added to the <mark>git</mark> database (by adding/committing) are\ntra" +
                    "cked from then on.",
            "When changes are made to a file that <mark>git</mark> is tracking, the"
        ],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/03-observe/",
        "nav_target": "#modifications"
    }, {
        "snippets": ["Branching in <mark>git</mark> allows for changes in"],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/04-branch/",
        "nav_target": "root"
    }, {
        "snippets": ["<mark>git(\"</mark>"],
        "branch": "dev",
        "slug": "/data_science-r_packages-amdevtools/dev/docs/README/",
        "nav_target": "#to-install-outside-of-the-cfda-data-science-platform"
    }, {
        "snippets": [
            "<mark>git</mark> checkout <branch-name>\n", "<mark>git</mark> checkout -b dev-analysis\n"
        ],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/04-branch/",
        "nav_target": "#cli-1"
    }, {
        "snippets": [
            "<mark>git</mark> add -p\n", "<mark>git</mark> add -p"
        ],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/02-change/",
        "nav_target": "#cli-3"
    }, {
        "snippets": ["Rstudio does not support the ability to reconcile changes within the UI, please " +
                "use either <mark>gitlab</mark> or the CLI"],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/05-merge/",
        "nav_target": "#rstudio"
    }, {
        "snippets": ["<mark>git-internals</mark>"],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/99-fix/",
        "nav_target": "root"
    }, {
        "snippets": ["<mark>Gitlab</mark>"],
        "branch": "master",
        "slug": "/data_science-documentation-git-started/master/docs/04-branch/",
        "nav_target": "#gitlab"
    }
]

let results = exampleData.reduce((acc, value) => {
    if (Object.hasOwnProperty(acc, value.slug)) {
        let results = acc[value.slug];
        results = results.concat(value.snippets.map((s) => {
            return {snippet: s, branch: value.branch, nav_target: value.nav_target, slug: value.slug}
        }))
        acc[value.slug] = results;
        return acc
    }
    acc[value.slug] = {
        results: value
        .snippets
        .map((s) => {
            return {snippet: s, branch: value.branch, nav_target: value.nav_target, slug: value.slug}
        }),
        name: value.slug
    }
    return acc
}, {})
console.log(results)