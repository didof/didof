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
        console.error(err1)
        core.setFailed(err1.message)
    }

    const { encoding, content } = readme.data

    const url = `[https://badgen.net/twitter/follow/${handle}](https://twitter.com/${handle})`

    const updatedContent = content.concat(Buffer.from(url, 'utf8').toString(encoding))

    // https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
    const [err2, updated] = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: 'README.md',
        message: 'update: twitter handle ${new Date().toTimeString()}',
        content: updatedContent
    })
    if (err2) {
        console.error(err2)
        core.setFailed(err2.message)
    }

    console.log(`See the changes ${updated.content.url}`)
})