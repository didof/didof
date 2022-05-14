const core = require("@actions/core");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const run = require('../../_helpers/run')
const to = require('../../_helpers/to')

run(async () => {
    let handle = core.getInput('handle')
    if (handle.startsWith('@')) handle.substring(1)

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/")

    // https://docs.github.com/en/rest/repos/contents#get-a-repository-readme
    const [err1, readme] = await to(octokit.request('GET /repos/{owner}/{repo}/readme', {
        owner,
        repo,
    }))
    if (err1) {
        core.debug(err1)
        core.setFailed(err1.message)
    }

    const { encoding, content, url, sha } = readme.data

    const path = url.split('/').pop()

    const badge = `[https://badgen.net/twitter/follow/${handle}](https://twitter.com/${handle})`

    const updatedContent = content.concat(Buffer.from(badge, 'utf8').toString(encoding))

    console.log(updatedContent)
    console.log(owner)
    console.log(repo)
    console.log(path)
    console.log(sha)

    // https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
    const [err2, updated] = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: 'test.md',
        message: '(Automated) Update README.md',
        content: updatedContent,
        sha
    })
    if (err2) {
        core.debug(err2)
        core.setFailed(err2)
    }

    console.log(JSON.stringify(updated, null, 4))

    console.log(`See the changes ${updated.content.url}`)
})