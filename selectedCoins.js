let dataChart;

const selectedArr = (storage, data) => {
  const selectedElem = [];
  for(let elem of storage){
    data.map(item => elem == item.symbol ? selectedElem.push(item) : item);
  };
  return selectedElem;
};

const setDataChart = (selectedElem, chart) => {
  const arr = [];
  for(let elem of selectedElem){
    const obj = {
      type:"line",
      axisYType: "secondary",
      name: elem.name,
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "$#,###k",
      dataPoints: [
      ]
    };
    arr.push(obj);
  };
return arr;
};

const renderTimeout = (dataChart , selectedElem) => {
  for(let elem of selectedElem){
    const current_price = elem.market_data.current_price.usd;
    dataChart.forEach(item => item.name === elem.name ? item.dataPoints.push({ x: new Date(), y: current_price}) : item)
  };
  renderChart(dataChart);
};

const getDataAjax = (storage) => {$.ajax({
  url: "https://api.coingecko.com/api/v3/coins?order=market_cap_desc&per_page=100&page=1",
  success: (data) => {
    const selectedElem = selectedArr(storage, data);
    renderTimeout(dataChart, selectedElem);
  },
  error: (error) => console.error(error),
})};

function displayChart (data, storage) {
  // we get the actual selected elements by comparing storage and ajax data:
  const selectedElem = selectedArr(storage, data);
  // we set the data of the canvasChart:
  dataChart = setDataChart(selectedElem);
  // we update the chart:
  renderTimeout(dataChart, selectedElem);
  };

  const renderChart = (dataChart) => {
    const chart = new CanvasJS.Chart("container_coins", {
      title: {
        text: "Selected Coins"
      },
      axisX: {
        valueFormatString: "MMM YYYY"
      },
      axisY2: {
        title: "Median List Price",
        prefix: "$",
        suffix: "K"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: true,
        itemclick: toogleDataSeries
      },
      data: dataChart,
    });
    
    chart.render();
    function toogleDataSeries(e){
      if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else{
        e.dataSeries.visible = true;
      }
      chart.render();
    };
    };
