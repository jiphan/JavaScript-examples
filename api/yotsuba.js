const axios = require('axios')
const moment = require('moment')

async function main() {
    const board = 'vt'
    const threadRegex = /ks1mraas71v3fjf1/
    const postRegex = /pom/i
    const timer = 5 * 60 * 1000
    const postSet = new Set()

    scan()
    setInterval(() => {
        scan()
    }, timer)

    /**
     * console log posts containing regex
     */
    async function scan() {

        // get posts
        let postList = []
        for (let thread of await getThreads()) {
            postList = [...postList, ...(await getPosts(thread))]
        }

        // display posts
        if (postList.length > 0) {
            console.log('\n' + moment().format('LT'))
            for (let post of postList) {
                if (post.com.match(threadRegex)) {
                    console.log(`\n${post.no}: ${post.sub}`)
                    continue
                }
                console.log(`${post.no}: ${post.com}`)
            }
        }
    }

    /**
     * get threads from catalog
     * @returns array of thread ids
     */
    async function getThreads() {
        let res = await axios.get(`https://a.4cdn.org/${board}/catalog.json`)
        let threadList = []
        for (let page of res.data) {
            for (let thread of page.threads) {
                if (thread.com?.match(threadRegex)) {
                    threadList.push(thread.no)
                }
            }
        }
        return threadList
    }

    /**
     * get unique matching posts from thread
     * @param {Array} postList array of posts
     * @param {Set} postSet set of post ids
     */
    async function getPosts(thread) {
        let postList = []
        let res = await axios.get(`https://a.4cdn.org/${board}/thread/${thread}.json`)
        for (let post of res.data.posts) {
            if (post.com?.match(postRegex) && !postSet.has(post.no)) {
                postSet.add(post.no)
                post.com = escapeHtml(post.com
                    .replace(/<br>/g, " ")
                    .replace(/<\/?[^>]+(>|$)/g, "")
                )
                postList.push(post)
            }
        }
        return postList
    }
}

/**
 * unescape html formatting
 * https://stackoverflow.com/a/6234804
 * @param {String} unsafe html escaped string
 * @returns formatted string
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&amp;/g, "\&")
        .replace(/&lt;/g, "\<")
        .replace(/&gt;/g, "\>")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "\'")
}

main()