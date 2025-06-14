class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return btoa(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== current.calculateHash() || current.previousHash !== previous.hash) {
        return false;
      }
    }
    return true;
  }
}

const traceChain = new Blockchain();

function addBlock() {
  const input = document.getElementById('inputData').value;
  if (!input) return alert("Please enter data");
  traceChain.addBlock(new Block(traceChain.chain.length, new Date().toISOString(), { trace: input }));
  document.getElementById('output').textContent = JSON.stringify(traceChain.chain, null, 2);
}
