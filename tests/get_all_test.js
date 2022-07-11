const { Chain } = require("../src/chain")
const { data } = require('./data')

// tests that the chains will merge, but resists self merging and duplication

const chain1 = new Chain()

chain1.debug = true

data.forEach(datum => chain1.put(datum))

function get_all() {
    const entries = chain1.blocks.map(block => block.data).reverse()
    const latest = new Set()
    const latest_entries = entries.filter(entry => {
        const isDuplicate = latest.has(entry.key)
        latest.add(entry.key)
        if (!isDuplicate) return true
        return false
      })
    return latest_entries 
}

let test_find = get_all()
let test_dup = test_find.find(entry => entry.key === "Cyrus Sanders")

console.log(test_find, "Pass:", test_find.length === 100 && test_dup.value === "No")
// console.log(dedup.length, store.length)

