$(document).ready(function() {
    const serverData = $.ajax({
       url: 'http://wbs-bg.ddns.net:5000/expenses/sum',
       method: 'GET',
       contentType: 'application/json'
    });
    console.log(series);
    let seriesData = [];
    serverData.forEach((item, index) => {
        seriesData.push({
            name: index,
            data: item
        });
    });
    Highcharts.chart('chart-container', {

        title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
        },

        subtitle: {
            text: 'Source: thesolarfoundation.com'
        },

        yAxis: {
            title: {
                text: 'Amount'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: seriesData,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
});