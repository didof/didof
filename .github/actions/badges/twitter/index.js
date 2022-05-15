const core = require("@actions/core");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const run = require('../../_helpers/run')
const to = require('../../_helpers/to')

console.log('token', process.env.GITHUB_TOKEN)

run(async () => {
    let handle = core.getInput('handle')
    if (handle.startsWith('@')) handle = handle.substring(1)

    console.log(process.env.GITHUB_REPOSITORY)

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/")

    // https://docs.github.com/en/rest/repos/contents#get-a-repository-readme
    const [err1, readme] = await to(octokit.request('GET /repos/{owner}/{repo}/readme', {
        owner,
        repo,
    }))
    if (err1) {
        console.error('Failed GET', JSON.stringify(err1, null, 4))
        core.debug('Failed GET', JSON.stringify(err1, null, 4))
        core.setFailed(err1.message)
        return
    }

    const { encoding, content, name, sha } = readme.data

    const badge = `https://badgen.net/twitter/follow/${handle}`
    const url = `https://twitter.com/${handle}`
    const template = `[${badge}](${url})`
    const updatedContent = content.concat(Buffer.from(template, 'utf8').toString(encoding))

    console.log(encoding)
    console.log(updatedContent)

    // https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
    const [err2, updated] = await to(octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: name,
        message: '(Automated) Update README.md',
        content: updatedContent,
        sha,
    }))
    if (err2) {
        console.error('Failed PUT', JSON.stringify(err2, null, 4))
        core.debug('Failed PUT', JSON.stringify(err2, null, 4))
        core.setFailed('Failed PUT', err2.message)
        return
    }

    console.log(`See the changes ${updated.data.content.url}`)

    core.setOutput('badge', badge)
    core.setOutput('url', url)

})