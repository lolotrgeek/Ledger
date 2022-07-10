const { Chain } = require("../chain")


const chain1 = new Chain()
let block = chain1.put("hello")
chain1.blocks = []

let tries = 0
function getter() {
    if(chain1.blocks.length !==0) {
        console.log("Pass:", false, "Chain is populated.")
        return
    }
    if (tries < 4) {
        let retrieved = chain1.get(found => found.block_id === block.block_id)
        if(retrieved) { 
            tries = 4
            console.log("Found in Store:", retrieved, "Pass:", retrieved.block_id === block.block_id)
            return
        }
        tries++
        setTimeout(getter, 100 * tries)
    }else console.log("Pass:", false, " Faulty store")
}

getter()