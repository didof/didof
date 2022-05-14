const core = require('@actions/core')
// const github = require('@actions/github')

function run(cb) {
    try {
        cb()
    } catch (error) {
        core.setFailed(error.message);
    }
}

run(() => {
    core.setOutput("output", 42);
})