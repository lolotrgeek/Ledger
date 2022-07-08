const { Chain } = require("../chain")

// tests that the chains will merge, but resists self merging and block duplication attacks

const chain1 = new Chain()
const chain2 = new Chain()
const chain3 = new Chain()

chain1.debug = true
chain2.debug = true
chain3.debug = true

let data1 = [1, 2, 3]
let data2 = [1, 2, 3, 4, 5]
data1.forEach(data => chain1.put(data))
data2.forEach(data => chain2.put(data))

chain1.blocks = [...chain1.blocks, ...chain1.blocks]

console.log("chain1 _ attacked", chain1.blocks.map(block => block.block_id), chain1.id)

chain1.merge(chain2)
chain2.merge(chain1)
chain1.merge(chain1)
chain1.merge(chain1)
chain2.blocks = [...chain2.blocks, ...chain2.blocks]
console.log("chain2 _ attacked", chain2.blocks.map(block => block.block_id), chain2.id)
chain3.merge(chain2)
chain3.merge(chain1)
chain2.merge(chain3)

console.log("chain3", chain3.blocks.map(block => block.block_id), chain3.id)
console.log("chain2", chain2.blocks.map(block => block.block_id), chain2.id)
console.log("chain1", chain1.blocks.map(block => block.block_id), chain1.id)



