const { Ledger } = require("../src/ledger")
const { data } = require('./utils/data')

// tests that the ledger will get all entries

const ledger = new Ledger()

data.forEach(datum => ledger.put(datum.key, datum.value))

let tries = 0
function test_get_all() {
  if(tries > 4) return console.log("Pass:", false)
  tries++
  let test_find = ledger.get_all()
  let test_dup = test_find.find(entry => entry.key === "Cyrus Sanders")
  let test = test_find.length === 100 && test_dup.value === "No"

  if(test === false) return setTimeout(test_get_all, 500)
  return console.log(test_find, "Pass:", test)
}

test_get_all()
