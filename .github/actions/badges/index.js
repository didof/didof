const core = require("@actions/core");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const run = require('../_helpers/run')
const to = require('../_helpers/to')

run(async () => {
    const twitterHandle = core.getInput('twitter_handle')

    const badges = [twitterHandle]

    if (badges.length === 0) {
        core.setOutput('urls', [])
    }

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/")

    // https://docs.github.com/en/rest/repos/contents#get-a-repository-readme
    const [err, readme] = await to(octokit.request('GET /repos/{owner}/{repo}/readme', {
        owner,
        repo,
    }))
    if (err) {
        console.error(err)
        core.setFailed(err.message)
    }

    console.log(JSON.stringify(readme, null, 4))
})