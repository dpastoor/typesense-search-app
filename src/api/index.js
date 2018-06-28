const Typesense = require('typesense');
require('babel-polyfill')
export default class TypesenseApi {
    constructor(url, apikey, port = "8108", protocol = "http") {
        this.client = new Typesense.Client({
            'masterNode': {
                'host': url,
                'port': port,
                'protocol': protocol,
                'apiKey': apikey
            },
            'timeoutSeconds': 2
        })
        this.getSearchResults = this
            .getSearchResults
            .bind(this)
    }

    /**
* SearchResult transformed from typesense document
 * @typedef {Object} SearchResult
 * @property {string[]} snippets
 * @property {string} branch
 * @property {string} slug
 * @property {string} source
 * @property {string} nav_target
 *
     * @param {string} searchString
     * @returns {SearchResult[]}
     */
    async getSearchResults(searchString) {
        let searchParameters = {
            'q': searchString,
            'query_by': 'data',
            filter_by: "branch:[master]",
            per_page: 100,
        }
        let data = await this
            .client
            .collections('content')
            .documents()
            .search(searchParameters)
        // for now only return master branch results
        let results = data
        .hits
        //.filter(d => d.document.branch === "master")
        .map(d => {
            return {id: d.document.id, snippet: d.highlights[0].snippet, source: d.document.source, branch: d.document.branch, slug: d.document.slug, nav_target: d.document.nav_target}
        });
        return  results
    }
}
