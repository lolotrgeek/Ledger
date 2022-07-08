const { Chain } = require("../chain")

// tests that the chains will merge, but resists self merging and duplication

const chain1 = new Chain()

chain1.debug = true

let data1 = [1, 2, 3, 4]
const promises = []
data1.forEach(data => promises.push(new Promise(resolve => setTimeout(() => { chain1.put(data); resolve() }, 1000))))

Promise.all(promises).then(() => {
    let sorted = [...chain1.blocks].sort((a, b) => b.time - a.time)

    console.log("chain1", chain1.blocks)
    console.log("chain1 sorted", sorted)
})


