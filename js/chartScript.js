const apiUrl = "https://tcc-api-maua2021.herokuapp.com/";
let url = apiUrl+ "balance";
let choosenEndDate;
let choosenStartDate;
var ctx = document.getElementById('charts-page').getContext('2d');
let data = {
    labels: [],
    datasets: [
        {
            label: "Generations",
            backgroundColor: "blue",
            data: []
        },
        {
            label: "Charges",
            backgroundColor: "red",
            data: []
        },
        {
            label: "Total",
            backgroundColor: "green",
            data: []
        }
    ]
};

var myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});;



fetchNewResources(null,null,null);

async function fetchNewResources(startDate, endDate, filter){
    let newUrl = url;
    let queryParams = [];

    if(startDate!=null){
        queryParams.push(`start=${startDate}` )
    }
    if(endDate!=null){
        queryParams.push(`end=${endDate}` )
    }
    if(filter!=null){
        queryParams.push(`filter=${filter}` )
    }
    for(let i=0; i< queryParams.length;i++){
        if(i==0){
            newUrl+="?";
        }else{
            newUrl+="&"
        }
        newUrl+= queryParams[i];
    }

    let results =  await fetch(newUrl)
                        .then(response=>response.json()); 
    
    for(const key in results.details){
        let value = results.details[key]
        data.labels.push(key);
        data.datasets[0].data.push(value.generationTotal)
        data.datasets[1].data.push(value.chargeTotal)
        data.datasets[2].data.push(value.total)
    }

    myChart.update();
}

function getChargeByDate(formData){
    choosenStartDate = formData.elements["startDate"].value==""? null: formData.elements["startDate"].value;
    choosenEndDate = formData.elements["endDate"].value==""? null: formData.elements["endDate"].value;
    let filter = formData.elements["endDate"].value;
    if(choosenStartDate != null && choosenEndDate !=null){
        if(new Date(choosenStartDate)> new Date(choosenEndDate)){
            alert("Data de início não pode ser maior que a final.")
            return
        }
    }

    fetchNewResources(choosenStartDate,choosenEndDate,null);
}

