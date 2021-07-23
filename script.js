var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 300 - margin.left - margin.right
        height = 300 - margin.top - margin.bottom
    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

async function init() {
    data = await d3.csv("https://raw.githubusercontent.com/bphennessy/CS416NarrativeVisualization/main/gas.csv")

    ByYear = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {"averageFE": d3.mean(v,function(d) { return d.CombFE; })}})
        .entries(data)
    
    var x = d3.scaleLinear().domain([d3.min(ByYear,function(d) { return d.key }),d3.max(ByYear,function(d) { return d.key })]).range([0,width]);
    var y = d3.scaleLinear().domain([0,d3.max(ByYear,function(d) { return d.value.averageFE })]).range([height,0]);

    //var xticks = [2010,2015,2020,2025];
    //var yticks = [0,10,20,30];

    svg.append("g")
        .attr("transform","translate(0," + height + ")")
        .call(d3.axisBottom(x)
        //.tickValues(xticks)
        .tickFormat(d3.format("~")));

    svg.append("g")
        .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d3.format("~s")));

    var valueline = d3.line()
        .x(function(d) { return x(d.key); })
        .y(function(d) { return y(d.value.averageFE); });

    console.log(y.domain(), x.domain(), ByYear)

    svg.append("path")
        .data([ByYear])
        .attr("class", "line")
        .attr("d", valueline)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
}