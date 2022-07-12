'use strict'
const crypto = require('crypto')
const fs = require('fs')

class Chain {
    constructor() {
        this.blocks = []
        this.id = crypto.randomUUID()
        this.debug = false
        this.errors = []
        this.file = `./${this.id}.json`
        this.log = function () { if (this.debug) console.log(...Object.values(arguments)) }
        this.handle = error =>{this.errors.push(error); this.log(error)}
        try { fs.accessSync(this.file) }
        catch { fs.writeFileSync(this.file, JSON.stringify(this.blocks)) }
    }

    store(block) {
        try {
            let data = fs.readFileSync(this.file)
            let stored_blocks = JSON.parse(data)
            stored_blocks.push(block)
            fs.writeFileSync(this.file, JSON.stringify(stored_blocks))
        } catch (error) {
            this.handle(error)
        }
    }

    /**
     * Retrieve block(s) from local store.
     * @param {function} [key_finder]  boolean function, returns true to find desired block
     * @returns the found block or if no `key_finder` is given returns all blocks
     */
    retrieve(key_finder) {
        try {
            let stored_blocks = JSON.parse(fs.readFileSync(this.file))
            if (!key_finder) return stored_blocks
            let found = stored_blocks.find(block => key_finder(block))
            return found
        } catch (error) {
            this.handle(error)
        }
    }

    prune() {
        if (this.blocks.length === 5000) this.blocks.splice(0, 2500)
    }

    block(data) {
        return { chain_id: this.id, block_id: crypto.randomUUID(), time: Date.now(), data }
    }

    put(data) {
        try {
            let block = this.block(data)
            this.blocks.push(block)
            this.store(block)
            this.prune()
            return block
        } catch (error) {
            this.handle(error)
        }
    }

    get(data) {
        if (typeof data === 'object' && data.block_id) {
            let found = this.blocks.find(block => block.block_id === data.block_id)
            if (found) return found
            else return this.retrieve(block => block.block_id === data.block_id)
        }
        else if (typeof data === 'function') return this.retrieve(data)
    }

    add(block) {
        if (this.isBlock(block) && this.hasBlock(block) === false) {
            this.store(block)
            this.blocks.push(block)
        }
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