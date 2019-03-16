$(document).ready(function() {
    Report.setInitialValues();
    Report.loadChart('chart-container');
    $('#groupBy').change(Report.loadChart('chart-container'));
});

