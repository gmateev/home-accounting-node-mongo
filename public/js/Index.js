$(document).ready(function() {
    Report.setInitialValues();
    Report.loadChart('chart-container');
    $('#updateReport').click(function() {
        Report.loadChart('chart-container');
        return false;
    });

});