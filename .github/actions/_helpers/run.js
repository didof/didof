const core = require('@actions/core')

module.exports = async function run(cb) {
    try {
        await cb()
    } catch (error) {
        core.setFailed(error.message)
    }
}