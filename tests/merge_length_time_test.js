const { Chain } = require("../chain")

// tests that the longer chain1 will merge with chain2 even though chain2 is newer
const chain1 = new Chain()
const chain2 = new Chain()

let data1 = [1,2,3,4]
let data2 = [3,2,1]
data1.forEach(data => chain1.put(data))
setTimeout(() => data2.forEach(data => chain2.put(data)), 1000)

setTimeout(() => {
    chain2.merge(chain1)
    let validate = chain2.id === chain1.id && chain2.blocks.length === data1.length && chain2.blocks.every(block => block.chain_id === chain1.id)
    console.log(chain1.id, chain2.id, chain1.blocks)
    console.log(validate)
}, 2000)
