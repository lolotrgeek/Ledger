const { Ledger } = require("../main")

const ledger1 = new Ledger() 
const ledger2 = new Ledger() 
const ledger3 = new Ledger() 

ledger1.put("Cyrus Sanders","Yes")
ledger2.put("Cyrus Sanders","No")
let value = ledger3.get("Cyrus Sanders")

console.log(value)
