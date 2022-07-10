const { Chain } = require("../chain")

// tests that the chain can be sorted

const chain1 = new Chain()

chain1.debug = true

let data1 = [1, 2, 3, 4]
const promises = data1.map((data, i) => new Promise(resolve => setTimeout(() => { chain1.put(data); resolve() }, 100 * (i + 1) )))

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

Promise.allSettled(promises).then(() => {
    shuffleArray(chain1.blocks)
    let sorted = chain1.sortBlocks([...chain1.blocks])

    console.log("chain1 shuffled", chain1.blocks)
    console.log("chain1 sorted", sorted)

    console.log("Pass:", JSON.stringify(sorted.map(block => block.data)) === JSON.stringify(data1))
})


