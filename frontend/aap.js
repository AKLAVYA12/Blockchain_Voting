
const contractaddress = "0x8A1Fd770C7B5D29b32E3F57389b7390254528244";

let web3;
let contract;
let contractAbi;

async function loadcontract(){    // will take json file for abi
    const response = await fetch('voting.json');
    const votingartifacts = await response.json();
    contractAbi = votingartifacts.abi;
}

async function updateVotes(){      // ui update
    try{
        const abhi = await contract.methods.getAbhi().call();
        const aklavya = await contract.methods.getAklavya().call();

        document.getElementById("display1").innerText = abhi;
        document.getElementById("display2").innerText = aklavya;

    } catch(err){
        console.error("not fetched",err);
    }
}

async function init(){   // metamask connect to your ganache network
    await loadcontract();

    if(window.ethereum){
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        contract = new web3.eth.Contract(contractAbi,contractaddress);
        console.log("connected to contract" , contractaddress);

        const buttons = document.querySelectorAll("button");
        buttons[0].addEventListener("click", VoteAbhi);
        buttons[1].addEventListener("click", VoteAklavya);

    }else {
    alert("Please install MetaMask!");
}

    async function VoteAbhi(){     // candidate 1
        try{
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            const account = accounts[0];

            await contract.methods.voteAbhi().send({from: account});
            console.log("voted for Abhi!");
            updateVotes();
        } catch(err){
            console.error("error voting abhi:",err);
        }
    }

    async function VoteAklavya(){    // candidate 2
        try{
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            const account = accounts[0];

            await contract.methods.voteAklavya().send({from: account});
            console.log("voted for aklavya");
            updateVotes();
        } catch(err){
            console.error("faild to vote",err);
        }
    }
}

window.addEventListener("DOMContentLoaded" , async() => {
    await init();
    await updateVotes();
});