const { send } = require('micro')
const { router, get } = require('microrouter')
const fs = require('fs')
const store = require('./store.js')
store.init('./storage/demo.sqlite3')

const index = (req, res) => send(res, 200, fs.readFileSync('index.html', 'utf-8'))
const getImage = async (req, res) => send(res, 200, await store.binfiles.getContent(req.params.id))

module.exports = router(
    get('/', index),
    get('/images/:id', getImage),
)

process.once('beforeExit', function () {
    store.close()
});