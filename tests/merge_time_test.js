const { Chain } = require("../chain")

// tests that the newer chain2 will merge with chain1
const chain1 = new Chain()
const chain2 = new Chain()

let data1 = [1,2,3]
let data2 = [3,2,1]
data1.forEach(data => chain1.put(data))
setTimeout(() => data2.forEach(data => chain2.put(data)), 1000)

setTimeout(() => {
    chain1.merge(chain2)
    let validate = chain1.id === chain2.id && chain1.blocks.every((block, i) => block.chain_id === chain2.id && block.data === data2[i])
    console.log(chain1.id, chain2.id, chain1.blocks)
    console.log(validate)
}, 2000)
