const apiUrl = "https://tcc-api-maua2021.herokuapp.com/";
let url = apiUrl+ "balance";
let choosenEndDate;
let choosenStartDate;
var elementCanvas = document.getElementById('charts-page');
var ctx = elementCanvas.getContext('2d');
let data = {
    labels: [],
    datasets: [
        {
            label: "Geração de Energia",
            backgroundColor: "#5fad56",
            data: []
        },
        {
            label: "Carregamentos",
            backgroundColor: "yellow",
            data: []
        },
        {
            label: "Total",
            backgroundColor: "green",
            data: []
        }
    ]
};

let configGraph = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        interactions:{
                intersect:false
        },
        plugins: {
            title: {
              display: true,
              text: 'Geração X Consumo X Total',
            },
            subtitle: {
                display: true,
                text: 'Todos os valores',
            }
        }
    }
};

var myChart = new Chart(ctx, configGraph);



fetchNewResources(null,null,null,null);

async function fetchNewResources(startDate, endDate, filter, periodicity){
    let newUrl = url;
    let queryParams = [];
    data.labels = [];
    data.datasets = [
        {
            label: "Geração de Energia",
            backgroundColor: "#9BDE52",
            data: []
        },
        {
            label: "Carregamentos",
            backgroundColor: "#DA2B00",
            data: []
        },
        {
            label: "Total",
            backgroundColor: "#31479F",
            
            data: []
        }
    ];

    if(startDate!=null){
        queryParams.push(`start=${startDate}` )
    }
    if(endDate!=null){
        queryParams.push(`end=${endDate}` )
    }
    if(filter!=null){
        queryParams.push(`filter=${filter}` )
    }
    if(periodicity!=null){
        queryParams.push(`by=${periodicity}` )
    }
    for(let i=0; i< queryParams.length;i++){
        if(i==0){
            newUrl+="?";
        }else{
            newUrl+="&"
        }
        newUrl+= queryParams[i];
    }
    console.log(newUrl)
    let results =  await fetch(newUrl)
                        .then(response=>response.json()); 

    if (startDate != null && endDate!= null) {
        configGraph.options.plugins.subtitle.text = `De ${startDate} até ${endDate}`;
    } else if(startDate !=null){
        configGraph.options.plugins.subtitle.text = `De ${startDate} até a data atual`;
    }else if(endDate !=null){
        configGraph.options.plugins.subtitle.text = `Até ${endDate}`;
    }else{
        configGraph.options.plugins.subtitle.text = `Todos os valores`;
    }
    
    for(const key in results.details){
        let value = results.details[key]
        data.labels.push(key);
        data.datasets[0].data.push(value.generationTotal)
        data.datasets[1].data.push(value.chargeTotal)
        data.datasets[2].data.push(value.total)
    }
    myChart.update();
}




function useFilters(formData){
    choosenStartDate = formData.elements["startDate"].value==""? null: formData.elements["startDate"].value;
    choosenEndDate = formData.elements["endDate"].value==""? null: formData.elements["endDate"].value;
    let filter = formData.elements["filter"].value =""? null: formData.elements["filter"].value;
    let periodicity = formData.elements["periodicity"].value =""? null: formData.elements["periodicity"].value;

    if(choosenStartDate != null && choosenEndDate !=null){
        if(new Date(choosenStartDate)> new Date(choosenEndDate)){
            alert("Data de início não pode ser maior que a final.")
            return
        }
    }
    if(choosenEndDate !=null){
        if(new Date(choosenEndDate)> new Date(Date.now())){
            alert("Proibido datas no futuro.")
            return
        }
    }
    if(choosenStartDate !=null){
        if(new Date(choosenStartDate)> new Date(Date.now())){
            alert("Proibido datas no futuro.")
            return
        }
    }
    fetchNewResources(choosenStartDate,choosenEndDate,filter,periodicity);
}


function clickHandler(evt) {
    var helpers = Chart.helpers;
    var scale = myChart.scale;
    var opts = scale.options;
    var tickOpts = opts.ticks;

    // Position of click relative to canvas.
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;

    var labelPadding = 5; // number pixels to expand label bounding box by

    // get the label render position
    // calcs taken from drawPointLabels() in scale.radialLinear.js
    var tickBackdropHeight = (tickOpts.display && opts.display) ?
        helpers.valueOrDefault(tickOpts.fontSize, Chart.defaults.global.defaultFontSize)
        + 5: 0;
    var outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max);
    for (var i = 0; i < scale.pointLabels.length; i++) {
        // Extra spacing for top value due to axis labels
        var extra = (i === 0 ? tickBackdropHeight / 2 : 0);
        var pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + 5);

        // get label size info.
        // TODO fix width=0 calc in Brave?
        // https://github.com/brave/brave-browser/issues/1738
        var plSize = scale._pointLabelSizes[i];

        // get label textAlign info
        var angleRadians = scale.getIndexAngle(i);
        var angle = helpers.toDegrees(angleRadians);
        var textAlign = 'right';
        if (angle == 0 || angle == 180) {
            textAlign = 'center';
        } else if (angle < 180) {
            textAlign = 'left';
        }

        // get label vertical offset info
        // also from drawPointLabels() calcs
        var verticalTextOffset = 0;
        if (angle === 90 || angle === 270) {
            verticalTextOffset = plSize.h / 2;
        } else if (angle > 270 || angle < 90) {
            verticalTextOffset = plSize.h;
        }

        // Calculate bounding box based on textAlign
        var labelTop = pointLabelPosition.y - verticalTextOffset - labelPadding;
        var labelHeight = 2*labelPadding + plSize.h;
        var labelBottom = labelTop + labelHeight;

        var labelWidth = plSize.w + 2*labelPadding;
        var labelLeft;
        switch (textAlign) {
        case 'center':
          var labelLeft = pointLabelPosition.x - labelWidth/2;
          break;
        case 'left':
          var labelLeft = pointLabelPosition.x - labelPadding;

          break;
        case 'right':
          var labelLeft = pointLabelPosition.x - labelWidth + labelPadding;
          break;
        default:
          console.log('ERROR: unknown textAlign '+textAlign);
        }
        var labelRight = labelLeft + labelWidth;

        // Render a rectangle for testing purposes
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(labelLeft, labelTop, labelWidth, labelHeight);
        ctx.restore();

        // compare to the current click
        if (mouseX >= labelLeft && mouseX <= labelRight && mouseY <= labelBottom && mouseY >= labelTop) {
            alert(scale.pointLabels[i]+' clicked');
            // Break loop to prevent multiple clicks, if they overlap we take the first one.
            break;
        }
    }
}

elementCanvas.onclick = clickHandler;