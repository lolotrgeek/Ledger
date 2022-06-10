const { Chain } = require("../chain")

// this tests that chain1 resists a merge with a shorter chain2
const chain1 = new Chain()
const chain2 = new Chain()

let data1 = [1,2,3,4,5]
let data2 = [1,2,3,]
data1.forEach(data => chain1.put(data))
data2.forEach(data => chain2.put(data))


chain1.merge(chain2)

let validate = chain1.blocks.every(block => block.chain_id === chain1.id) 
console.log(chain1.id, chain1.blocks)
console.log(validate)
