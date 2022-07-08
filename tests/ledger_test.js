const { Ledger } = require("../main")


// tests to see if we can add conflicting blocks to separte ledgers and still get the correct value
const ledger1 = new Ledger()
const ledger2 = new Ledger()
const ledger3 = new Ledger()

setTimeout(() => ledger1.put("Cyrus Sanders", "Yes"), 50)
setTimeout(() => ledger2.put("Cyrus Sanders", "No"), 100)

let find_truth = setInterval(() => {
    let data = ledger3.get("Cyrus Sanders")
    console.log(data, "Pass:", data && data.value === "No")
    if (data && data.value === "No") clearInterval(find_truth)
    console.log("Ledger1", ledger1.chain.blocks.map(block => block.data))
    console.log("Ledger2", ledger2.chain.blocks.map(block => block.data))
    console.log("Ledger3", ledger3.chain.blocks.map(block => block.data))
}, 1000)

