const core = require('@actions/core')
const github = require('@actions/github')

const run = require('../_helpers/run')
const sleep = require('../_helpers/sleep')

run(async () => {
    const milliseconds = core.getInput('milliseconds')

    core.debug(`Will wait for ${milliseconds} milliseconds starting from ${(new Date()).toTimeString()}`)  // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    await sleep(milliseconds)

    const time = new Date().toTimeString()

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`Event payload: ${payload}`);

    core.setOutput('time', time)
})