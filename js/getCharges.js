const apiUrl = "http://localhost:8080";
let charges = [];
const table = document.getElementById("list");
const pageBar = document.getElementById("page-bar");
const url = apiUrl+"/charges";

onLoad();
async function onLoad(){
    charges =  await fetch(url)
                        .then(response=>response.json()); 
    charges.content.forEach(element => {
        const tr = generateContent(element);
        table.append(tr)
    });

    console.log(charges)
    generatePageBar(charges.number, charges.totalPages)
}

function generatePageBar(pgNumber,totalPages){
    pgNumber++;
    var number = [pgNumber];


    for(let i=1; i<5;i++){ 
        if(number>5){
            break;
        }
        if(pgNumber-i>0){
            number.unshift(pgNumber-i)
        }
        if(pgNumber+i>0){
            number.push(pgNumber+i)
        }
    }

    number.forEach( n =>
        pageBar.appendChild(generatePaperBox(n))
    )

    console.log(number);
}

function generatePaperBox(number){
    let node = document.createElement("button");
    node.classList.add("page-button");
    node.innerText = number;
    return node;
}

function getChargeByDate(formData){

    console.log(response.body);
}

function generateContent(content){
    
    var node = document.createElement("TR");
    node.classList.add("table-row");
    var id = document.createElement("TD");
    id.classList.add("id-cell")
    var timestamp = document.createElement("TD");
    timestamp.classList.add("timestamp-cell")
    var energy = document.createElement("TD");
    energy.classList.add("energy-cell")
    node.appendChild(id);
    node.appendChild(timestamp);
    node.appendChild(energy)
    id.innerText = content.id;
    energy.innerText = content.energyUsed;
    timestamp.innerText = content.timestamp;
    return node;
}


