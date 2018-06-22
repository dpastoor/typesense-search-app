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
            'query_by': 'data'
        }
        let data = await this
            .client
            .collections('content')
            .documents()
            .search(searchParameters)
        return data
            .hits
            .map(d => {
                return {id: d.id, snippets: d.highlights[0].snippets, source: d.document.source, branch: d.document.branch, slug: d.document.slug, nav_target: d.document.nav_target}
            });
    }
}
