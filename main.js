const { randomUUID } = require('crypto')
const { Chain } = require('./chain')
const { Node } = require('./node')

class Ledger {
    constructor(name) {
        this.name = name ? name : randomUUID()
        this.chain = new Chain()
        this.node = new Node(name)
        this.node.listen("ledger", chain => this.chain.merge(chain))
    }

    update() {
        
    }

    put() {

    }

    get(key) {
        
    }

    get_all() {
        return this.chain.blocks
    }


}

module.exports = { Ledger }