var fs = require('fs')
var sqlite3 = require('sqlite3')
let db

module.exports = {
    init: function (file) {
        db = new sqlite3.Database(file)
        db.serialize(async function () {
            db.run('CREATE TABLE IF NOT EXISTS binfiles (id integer primary key, content blob)')
            let exists = await existsBinfiles()
            if (!exists) {
                await prepare()
            }
        })
    },
    close: function () {
        db.close()
    },
    binfiles: {
        getContent: function (id) {
            return new Promise(function (resolve, reject) {
                db.get('select * from binfiles where id = ?', [id], (err, row) => {
                    if (err) {
                        reject("Read error: " + err.message)
                    }

                    resolve(row.content)
                })
            })
        }
    }
}

function existsBinfiles() {
    return new Promise(function (resolve, reject) {
        db.get('select count(*) num from binfiles', (err, res) => {
            if (err) {
                reject("Read error: " + err.message)
            }

            resolve(0 < res['num'])
        })
    })
}

function prepare() {
    return new Promise(function (resolve, reject) {
        const statement = db.prepare('insert into binfiles values (?, ?)')
        const blue = fs.readFileSync('images/blue.bmp')
        statement.run([1, blue])
        const red = fs.readFileSync('images/red.bmp')
        statement.run([2, red])
        const yellow = fs.readFileSync('images/yellow.bmp')
        statement.run([3, yellow])
        statement.finalize(() => resolve())
    })
}