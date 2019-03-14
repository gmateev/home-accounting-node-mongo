$(document).ready(function() {
    loadChart({
        groupBy: 'category'
    });
    $('#groupBy').change(() => {
        loadChart({groupBy: this.value})
    })
});

function loadChart(params)
{
    const serverData = $.ajax({
        url: 'http://wbs-bg.ddns.net:5000/expenses/sum/'+params.groupBy,
        method: 'GET',
        contentType: 'application/json'
    }).then((serverData) => {
        /**
         * Setup Highcharts
         */
        let seriesData = [];
        let series = [];
        for (var property in serverData.results) {
            if (serverData.results.hasOwnProperty(property)) {
                seriesData.push(
                    {
                        name: property,
                        data: serverData.results[property]
                    }
                );
                series.push({name: property});
            }
        }
        Highcharts.chart('chart-container', {


                series: seriesData,

                chart: {
                    type: 'column',
                    scrollablePlotArea: {
                        minWidth: 700
                    }
                },


                title: {
                    text: 'Разходи на ден'
                },

                subtitle: {
                    text: 'Общо за целия период: <strong>' + serverData.total + '</strong>'
                },


                yAxis: [{ // left y axis
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    },
                    title: {
                        text: null
                    },
                    labels: {
                        align: 'left',
                        x: 3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }, { // right y axis
                    linkedTo: 0,
                    gridLineWidth: 0,
                    opposite: true,
                    title: {
                        text: null
                    },
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }],

                xAxis: {
                    type: 'datetime',
                    pointInterval: 24 * 3600 * 1000 // one day
                },

                legend: {
                    align: 'left',
                    verticalAlign: 'top',
                    borderWidth: 0
                },

                tooltip: {
                    shared: true,
                    crosshairs: true
                },

                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                fontSize: '8px'
                            },
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function (e) {
                                    hs.htmlExpand(null, {
                                        pageOrigin: {
                                            x: e.pageX || e.clientX,
                                            y: e.pageY || e.clientY
                                        },
                                        headingText: this.series.name,
                                        maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                                        this.y + ' sessions',
                                        width: 200
                                    });
                                }
                            }
                        },
                        marker: {
                            lineWidth: 1
                        }
                    }
                }
            }
        );
    });

}