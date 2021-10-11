const apiUrl = "https://tcc-api-maua2021.herokuapp.com/";
let charges = [];
const table = document.getElementById("list");
const pageBar = document.getElementById("page-bar");
let url = apiUrl;
let choosenEndDate;
let choosenStartDate;
let listValue = table.getAttribute("path")

onLoad(listValue);


async function fetchNewResources(startDate, endDate, page){
    let newUrl = url;
    let queryParams = [];

    charges = null;
    table.innerHTML=  "";
    pageBar.innerHTML = "";

    if(startDate!=null){
        queryParams.push(`start=${startDate}` )
    }
    if(endDate!=null){
        queryParams.push(`end=${endDate}` )
    }
    if(page!=null){
        queryParams.push(`page=${page}` )
    }
    for(let i=0; i< queryParams.length;i++){
        if(i==0){
            newUrl+="?";
        }else{
            newUrl+="&"
        }
        newUrl+= queryParams[i];
    }
    charges =  await fetch(newUrl)
                        .then(response=>response.json()); 
    generateTableHeader();
    charges.content.forEach(element => {
        const tr = generateContent(element);
        table.append(tr)
    });
    generatePageBar(charges.number, charges.totalPages)
}

function generateTableHeader(){
    table.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Timestamp</th>
        <th>Energia(KWh)</th>
    </tr>`
}

async function onLoad(path){
    url += path;
    fetchNewResources(null,null,null);
}


function generatePageBar(pgNumber,totalPages){
    pgNumber++;
    var number = [pgNumber];


    for(let i=1; i<5;i++){ 
        if(number.length==5){
            break;
        }
        if(pgNumber-i>0){
            console.log(`vou diminuir ${pgNumber-i} ${totalPages}`)
            number.unshift(pgNumber-i)
        }
        if(pgNumber+i<=totalPages){
            console.log(`vou aumentar ${pgNumber+i} ${totalPages}`)
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
    node.onclick = changePage;
    return node;
}

function changePage(){
    fetchNewResources(choosenStartDate,choosenEndDate,this.innerText - 1);
}

function getChargeByDate(formData){
    choosenStartDate = formData.elements["startDate"].value==""? null: formData.elements["startDate"].value;
    choosenEndDate = formData.elements["endDate"].value==""? null: formData.elements["endDate"].value;

    if(choosenStartDate != null && choosenEndDate !=null){
        if(new Date(choosenStartDate)> new Date(choosenEndDate)){
            alert("Data de início não pode ser maior que a final.")
            return
        }
    }

    fetchNewResources(choosenStartDate,choosenEndDate,null);
}

function generateContent(content){
    console.log(content)
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
    energy.innerText = content.energy;
    timestamp.innerText = content.timestamp;
    return node;
}


