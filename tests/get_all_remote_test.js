import { Ledger }  from (require.resolve('../src/ledger'))
import { data }  from ('./utils/data')

// tests that the Ledgers will merge, but resists self merging and duplication

const ledger1 = new Ledger()
const ledger2 = new Ledger()

ledger1.debug = true

setTimeout(() => data.forEach(datum => ledger1.put(datum.key, datum.value)), 100)

let tries = 0
let find_truth = setInterval(() => {
  if (tries > 3) {
    console.log(test_find, "Pass:", false)
    clearInterval(find_truth)
  }
  let test_find = ledger2.get_all()
  let test_dup = test_find.find(entry => entry.key === "Cyrus Sanders")

  if (test_find.length === 100 && test_dup.value === "No") {
    console.log(test_find, "Pass:", true)
    clearInterval(find_truth)
  }
  tries++

}, 1000)