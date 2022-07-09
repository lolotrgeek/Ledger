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
        let block = this.block(data)
        this.blocks.push(block)
        return block
    }

    get(key) {
        if (key) return this.blocks.find(block => block.block_id === key)
    }

    add(block) {
        if(this.isBlock(block) && this.hasBlock(block) === false) this.blocks.push(block)
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

    hasBlock(data) {
        return this.blocks.find(block => block.block_id === data.block_id) ? true : false
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

    mapBlocks() {
        return this.blocks.map(block => block.block_id)
    }

    /**
     * 
     * @param {*} block_map 
     * @returns the blocks that this chain does not have 
     */
    compare(block_map) {
        const difference = (a, b) => b.filter(x => !a.includes(x))
        return difference(this.mapBlocks(), block_map)
    }

    joinChains(A, B) {
        const a = new Set(A)
        const b = new Set(B)
        const _union = new Set(a)
        for (const elem of b) { _union.add(elem) }
        return [..._union]
    }

    /**
     * sort by smallest time is oldest, biggest time is newest
     */
    sortBlocks(blocks) {
        return blocks.sort((a, b) => a.time - b.time)
    }

    /**
     * Merge the given chain, always assuming it has blocks we do not have, even if same ID
     * @param {*} chain 
     * @returns 
     */
    merge(chain) {
        if (this.isValid(this) === false) {
            this.log("This Invalid", this)
            return false
        }
        else if (this.isValid(chain) === false) {
            this.log("Invalid", chain)
            return false
        }
        // NOTE: Keep the following conditions, they resolve blocks that have the same `time`
        else {
            if (this.isLonger(chain) === false) {
                this.id = chain.id
                this.blocks = this.sortBlocks(this.joinChains(chain.blocks, this.blocks))
            }
            else if (this.isSameLength(chain) && this.isNewer(chain) === false) {
                this.id = chain.id
                this.blocks = this.sortBlocks(this.joinChains(chain.blocks, this.blocks))
            }
            else {
                this.blocks = this.sortBlocks(this.joinChains(this.blocks, chain.blocks))
            }
        }
    }
}

module.exports = { Chain }