const Report = {
  setInitialValues: function() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 12);
    $('#startDate').get(0).valueAsDate = firstDay;
    $('#endDate').get(0).valueAsDate = new Date();
  },
  getParams: function() {
    return {
      groupBy: $('#groupBy').val(),
      startDate: $('#startDate').val(),
      endDate: $('#endDate').val()
    }
  },
  loadGrid: function(gridContainer, data) {
    grid = new Slick.Grid('#'+gridContainer, data, [
      {
        name: "Група",
        field: "group",
        id: "group",
        sortable: true,
        width: 400
      },
      {
        name: "Сума",
        field: "total",
        id: "total",
        sortable: true
      }
    ], {
      enableColumnReorder: false
    });
  },

  loadChart: function(chartContainer) {
    const params = this.getParams();
    console.log(params);
    const serverData = $.ajax({
        url: 'http://wbs-bg.ddns.net:5000/expenses/sum/'
            + params.groupBy
            + '/' + params.startDate
            + '/' + params.endDate,
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
      this.loadGrid('grid-container', serverData.gridData);

      Highcharts.chart(chartContainer, {


                series: seriesData,

                chart: {
                    type: 'column',
                    scrollablePlotArea: {
                        minWidth: 700
                    },
                    height: 500
                },


                title: {
                    text: 'Разходи на ден'
                },

                subtitle: {
                    text: 'Общо за целия период: <strong>' + serverData.total + '</strong>'
                },


                yAxis: [{ // left y axis
                    max: 500,
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
                    max: 500,
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
}

