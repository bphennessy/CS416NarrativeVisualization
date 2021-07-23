var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 300 - margin.left - margin.right
    height = 300 - margin.top - margin.bottom

//var parseTime = d3.timeParse("%y")

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/bphennessy/CS416NarrativeVisualization/main/gas.csv",function(error,data) {
    if (error) throw error;
    a
    console.log(data)

    //data.forEach(function(d) {
   //     d.ModelYear = parseTime(d.date);
    //});
    
    var ByYear = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {averageFE: d3.mean(v,function(d) { return d.CombFE; })};})
        .entries(data)
    
    console.log(ByYear)

    var x = d3.scaleTime().domain(d3.extent(data, function(d) { return d.date; })).range([0,width]);
    var y = d3.scaleLinear().domain([0,d3.max(ByYear,function(d) { return d.value.averageFE })]).range([height,0]);

    var valueline = d3.line()
        .x(function(d) { return x(new Date(d.key)); })
        .y(function(d) { return y(d.value.averageFE); });
    
    console.log(y.domain(), x.domain(), ByYear)

    svg.append("path")
        .datum(ByYear)
        .attr("class", "line")
        .attr("d", valueline)
        .attr("fill", "none")
        .attr("stroke", "steelblue")

    svg.append("g")
        .attr("transform","translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
});