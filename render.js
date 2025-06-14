
const coffeeChain = new Blockchain();

function addBlock() {
  const data = document.getElementById("dataInput").value.trim();
  if (!data) return alert("กรุณาป้อนข้อมูลก่อน");

  const newBlock = new Block(coffeeChain.chain.length, new Date().toISOString(), data);
  coffeeChain.addBlock(newBlock);
  renderChain();
}

function renderChain() {
  const container = document.getElementById("chainDisplay");
  container.innerHTML = "";
  coffeeChain.chain.forEach(block => {
    const div = document.createElement("div");
    div.className = "block";
    div.innerHTML = `
      <strong>Block #${block.index}</strong><br/>
      <strong>Timestamp:</strong> ${block.timestamp}<br/>
      <strong>Data:</strong> ${block.data}<br/>
      <strong>Hash:</strong> ${block.hash}<br/>
      <strong>Previous Hash:</strong> ${block.previousHash}
    `;
    container.appendChild(div);
  });
}

renderChain();
