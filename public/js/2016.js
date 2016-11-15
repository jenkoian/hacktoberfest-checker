$(document).ready(function () {

    var labels = [],
        values = [],
        data = {
            "2016-10-01": 213,
            "2016-10-02": 213,
            "2016-10-03": 257,
            "2016-10-04": 295,
            "2016-10-05": 342,
            "2016-10-06": 362,
            "2016-10-07": 364,
            "2016-10-08": 272,
            "2016-10-09": 293,
            "2016-10-10": 410,
            "2016-10-11": 338,
            "2016-10-12": 491,
            "2016-10-13": 436,
            "2016-10-14": 451,
            "2016-10-15": 296,
            "2016-10-16": 280,
            "2016-10-17": 397,
            "2016-10-18": 459,
            "2016-10-19": 422,
            "2016-10-20": 412,
            "2016-10-21": 403,
            "2016-10-22": 301,
            "2016-10-23": 275,
            "2016-10-24": 481,
            "2016-10-25": 496,
            "2016-10-26": 886,
            "2016-10-27": 736,
            "2016-10-28": 626,
            "2016-10-29": 527,
            "2016-10-30": 602,
            "2016-10-31": 898
        };

    $.each(data, function (k, v) {
        labels.push(k);
        values.push(v);
    });

    var chart = new Chart($("#2016Chart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Number of visits",
                data: values,
                backgroundColor: "#d3853d",
                borderColor: "#fff",
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#d3853d",
                pointBorderColor: "#fff",
                pointHitRadius: 8
            }]
        },
        options: {
            legend: {
                display: !1
            },
            elements: {},
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "#fff"
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: !0,
                        fontColor: "#fff"
                    }
                }]
            }
        }
    });
});
