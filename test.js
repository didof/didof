const text = '[google](https://google.com)'

function b(i) {
    return Buffer.from(i, 'utf8').toString('base64')
}

console.log(b(text))