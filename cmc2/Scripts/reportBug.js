$(document).ready(function () {
    $('.bugReporter').click(function () {
        console.log(window.location.href);
        var url = window.location.href;
        url = url.replace('#', 'ht');
        var reportBugLink = 'https://docs.google.com/forms/d/e/1FAIpQLSfIKfvcxlYLrSp6ySDxC_SfKwpvRTh51AuG-IbM_aSrH6_YNA/'+
            'viewform?usp=pp_url&entry.337529483='+
            url +
            '&entry.1638978571';
        window.open(reportBugLink);
    })
});