/*******************************************************
 *                                                     *
 *                GET GRAPH DATA                       *
 *                                                     *
 ******************************************************/

getData(); // start getting the graph data (kind of slow atm)


function getData() {
    var data = []; // set empty gobal array
    var currentDate = new Date;
    
    for ( var i = 1; i <= currentDate.getDate(); i++) {
      var startDate = setStartDate(i)

      d3.json('/graph?start='+startDate+'&end='+i)
        .get(function(res) {
          // create a global graphDate var
          data.push(res);

          if (i - 1 == data.length) {
            // Sort the grid into date order
            data.sort(function(a, b) {
              return new Date(a.date) - new Date(b.date);
            });

            buildGraph(data);
          }
      });
    }
}

function setStartDate(endDate) {
    if (endDate == '01'){
      startDate = 30;
    } else {
      startDate = endDate - 1;
    }
    return startDate  < 10 ? "0"+startDate : startDate;
}


/*******************************************************
 *                                                     *
 *                BUILD GRAPH DATA                     *
 *                                                     *
 ******************************************************/
var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width  = 960 - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%d-%b-%y");
var formatTime = d3.timeFormat("%e %B");


var x = d3.scaleTime()
          .range([0, width]);

var y = d3.scaleLinear()
          .range([height, 0]);

var area = d3.area()
             .curve(d3.curveCardinal)
             .x(function(d) { return x(d.date); })
             .y0(height)
             .y1(function(d) { return y(d.data) ;})

var line = d3.line()
             .curve(d3.curveCardinal)
             .x(function(d) { return x(d.date) })
             .y(function(d) { return y(d.data) })

var div = d3.select('#graph').append('div')
            .attr("class", "tooltip")
            .style("display", "none");
          
var svg = d3.select("#graph").append("svg")
            .attr("id", "svg")
            .attr("width", width + margin.left + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ","+ margin.top +")");


function buildGraph(data) {
  
    // sorts out the date values
    var graphData = convertDate(data);
    
    // sorts the returned data by date
    graphData.sort(function(a,b) {
        a = new Date(a.date);
        b = new Date(b.date);

        return a > b ? -1 : a < b ? 1 : 0;
    });

    graphData.reverse();

    // does something
    graphData.forEach(function(d) {
        d.date = parseTime(d.date);
        d.data = +d.data;
    });

    // get the min/ max value of data
    var min = d3.min(graphData, function(d) { return d.data });
    var max = d3.max(graphData, function(d) { return d.data });
    

    // set up the range of the graph
    x.domain(d3.extent(graphData, function(d) { return d.date }));
    y.domain([min - 4000, max]);


    // plot the line
    var path = svg.append("path")
                  .data([graphData])
                  .attr("class", "line")
                  .attr("d", line);
     
    // Get the length of the path 
    var totalLength = path.node().getTotalLength();

    // animate the path from the left to right
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);

    // add data points onto the grid
    var dot = svg.selectAll("dot")
                 .data(graphData)
                 .enter().append("circle")
                 .attr("r", 4)
                 .attr("cx", function(d) { return x(d.date) })
                 .attr("cy", function(d) { return y(d.data) })
                 .attr("class", "dot")
                 .style("opacity", 0)
                 .on("mouseover", mouseover)
                 .on("mousemove", mousemove)
                 .on("mouseout", mouseout)
    
    // add the x axis
  var xAxis =  svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .attr("class", "axis")
                  .style("opacity", .5)
                  .call(d3.axisBottom(x)
                  .ticks(5));


      // add y axis
  var yAxis = svg.append("g")
                 .attr("class", "axis")
                 .style("opacity", .5)
                 .call(d3.axisLeft(y)
                 .ticks(5));

  d3.select("#graph")
    .on("mouseover", function(d) {

        dot.transition()
           .delay(function(d,i) { return i * 150})
           .style("opacity", .9)
    })
    .on("mouseout", function(d) {

      dot.transition()
         .delay(function(d,i) { return i * 150})
         .style("opacity", 0)
    });
  }



  function convertDate(data) {
      return data.map(function(val) {
        var oldDate = new Date(val.date);
        var day = oldDate.getDate();
        var year = oldDate.getFullYear();
        var month = day == 30 ? 'Sep' : 'Oct';
        val.date = day + "-" + month + "-" + "16";
        val.date = val.date;
        return val;
      });
  }

  function mouseover() {
      div.style("display", "inline")
  }

  function mousemove(d) {
      var current_postion = d3.mouse(this);
      div.html(formatTime(d.date) + "<br /> Pull Requests: " + d.data)
         .style("left", (current_postion[0]) + "px")
         .style("top", (d3.event.pageY - 38) + "px")
  }

  function mouseout() {
      div.style("display", "none")
  }
