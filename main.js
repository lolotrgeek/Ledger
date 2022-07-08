const { randomUUID } = require('crypto')
const { Chain } = require('./chain')
const { Node } = require('./node')

/**
 * An immutable distributed key value store with eventual consistency.
 */
class Ledger {
    constructor(name) {
        this.name = name ? name : randomUUID()
        this.chain = new Chain()
        this.node = new Node(name)
        this.node.listen("ledger", (chain, name) => {
            if (name !== this.name) {
                // console.log("heard chain", chain)
                this.chain.merge(chain)
                // this.node.send("ledger", this.chain, 1000)
            }
        })
        this.errors = []
        this.retries = 3
        this.tries = 0
    }

    /**
     * Insert the given key value pair as a new block on the chain.
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    put(key, value) {
        let block = this.chain.put({ key, value })
        this.node.send("ledger", this.chain, 1000)
        return block
    }

    /**
     * Find the latest value of the given key.
     * @param {*} key 
     * @returns 
     * @note using `findLast`, since we assume that the latest blocks hold the most updated data.
     */
    get(key) {
        try {
            let found = this.chain.blocks.slice().reverse().find(block => block.data.key === key)
            if(found) {
                this.tries = 0
                console.log("found", found.data)
                return found.data
            }
            else if(!found && this.tries < this.retries) {
                console.log('retrying...')
                this.tries++
                this.node.send("ledger", this.chain)
                setTimeout(() => this.get(key), this.tries * 1000)
                // TODO: maybe promisify this, how else to speed up?
            }
            else {
                return "unable to find."
            }
            
        } catch (error) {
            this.errors.push(error)
        }

    }

    /**
     * Find all entries of the given key on the chain.
     * @param {*} key 
     * @returns 
     */
    get_history(key) {
        try {
            return this.chain.blocks.filter(block => block.data.key === key).map(block => block.data)
        } catch (error) {
            this.errors.push(error)
        }

    }

    /**
     * Retrieves all the latest entries.
     * @returns 
     */
    get_all() {
        try {
            const entries = this.chain.blocks.map(block => block.data).reverse()
            const latest = new Set()
            const latest_entries = entries.filter(entry => {
                const isDuplicate = latest.has(entry.key)
                latest.add(entry.key)
                if (!isDuplicate) return true
                return false
              })
            return latest_entries 
        } catch (error) {
            this.errors.push(error)
        }

    }

}

module.exports = { Ledger }