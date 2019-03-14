$(document).ready(function() {
    const serverData = $.ajax({
       url: 'http://wbs-bg.ddns.net:5000/expenses/sum',
       method: 'GET',
       contentType: 'application/json'
    }).then((serverData) => {
        let seriesData = [];
        let series = [];
        for (var property in serverData) {
            if (serverData.hasOwnProperty(property)) {
                seriesData.push(
                    {
                        name: property,
                        data: serverData[property]
                    }
                );
                series.push({name: property});
            }
        }
        Highcharts.chart('chart-container', {


                series: seriesData,

                chart: {
                    scrollablePlotArea: {
                        minWidth: 700
                    }
                },


                title: {
                    text: 'Daily sessions at www.highcharts.com'
                },

                subtitle: {
                    text: 'Source: Google Analytics'
                },


                yAxis: [{ // left y axis
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
                    type: 'category',
                    labels: {
                        formatter: function() {
                            return Highcharts.dateFormat('%a %d %b', new Date(this.value));
                        }
                    }
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


});