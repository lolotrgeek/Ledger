'use strict'
const crypto = require('crypto')

class Chain {
    constructor() {
        this.blocks = []
        this.id = crypto.randomUUID()
        this.debug = false
        this.log = message => this.debug ? process.send ? process.send(message) : console.log(message) : null
    }

    block(data) {
        return { chain_id: this.id, block_id: crypto.randomUUID(), time: Date.now(), data }
    }

    put(data) {
        if (data) {
            let block = this.block(data)
            this.blocks.push(block)
            return block
        }
    }

    get(key) {
        if(key) return this.blocks.find(block => block.block_id === key)
    }

    validate() {
        return this.blocks.every(block => block.chain_id)
    }

    same(block) {
        return block.chain_id === this.id
    }

    isBlock(data) {
        return typeof data === 'object' && data.chain_id && data.block_id && typeof data.time === 'number' && data
    }

    isValid(chain) {
        return chain && typeof chain.id === 'string' && Array.isArray(chain.blocks) && chain.blocks.every(block => this.isBlock(block))
    }

    newestBlock(chain) {
        return chain.blocks[chain.blocks.length - 1]
    }

    isNewer(chain) {
        return this.newestBlock(this).time > this.newestBlock(chain).time
    }

    isLonger(chain) {
        return this.blocks.length > chain.blocks.length
    }

    isSameLength(chain) {
        return this.blocks.length === chain.blocks.length
    }

    shouldMerge(chain) {
        if (this.isLonger(chain)) {
            this.log(`Not Merging: this ${this.id} [${this.blocks.length}] longer than ${chain.id} [${chain.blocks.length}]`)
            return false
        }
        else if (this.isSameLength(chain) && this.isNewer(chain)) {
            this.log(`Not Merging: this ${this.id} newer than ${chain.id}`)
            return false
        }
        else {
            this.log(`Merging: ${this.id} [${this.blocks.length}] shorter than ${chain.id} : [${chain.blocks.length}]`)
            return true
        }
    }

    updateBlock(block, chain_id, index) {
        block.chain_id = chain_id
        block.name = index
        return block
    }

    updateBlockIds(chain_id) {
        let updatedBlocks = this.blocks.map((block, index) => this.updateBlock(block, chain_id, index))
        this.blocks = updatedBlocks
    }

    merge(chain) {
        if (this.isValid(this) === false) this.log("This Invalid", this)
        else if (this.isValid(chain) === false) this.log("Invalid", chain)
        else if (this.shouldMerge(chain) === false) this.log("No Merge", chain)
        else {
            this.blocks = chain.blocks
            this.id = chain.id
        }
    }
}

module.exports = { Chain }