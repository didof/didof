const core = require("@actions/core");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const run = require('../_helpers/run')
const to = require('../_helpers/to')

run(async () => {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/")

    const [err, readme] = await to(octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: core.getInput('readme_path')
    }))
    if (err) {
        console.error(err)
        core.setFailed(err.message)
    }

    console.log(JSON.stringify(readme, null, 4))
})