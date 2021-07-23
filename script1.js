// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d/%m");
//test
// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("formdata.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.scale = +d.scale;
  });

var dataNest = d3.nest()
 .key(function(d) {return d.date;})
 .rollup (function(v) { return {
   averagescale: d3.mean(v, function(d) {return d.scale; })
 }; })
 .entries(data)

 // set the ranges
 var x = d3.scaleTime().range([0, width]);
 var y = d3.scaleLinear().range([height, 0]);
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(dataNest, function(d) { return d.value.averagescale; })]);

 // define the line
 var valueline = d3.line()
     .x(function(d) { return x(new Date(d.key)); })
     .y(function(d) { return y(d.value.averagescale); });

  // Scale the range of the data
  console.log(y.domain(), x.domain(), dataNest)
  // Add the valueline path.
  svg.append("path")
      .datum(dataNest)
      .attr("class", "line")
      .attr('d', valueline)
      .attr("fill", "none")
      .attr("stroke", "steelblue")      

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});