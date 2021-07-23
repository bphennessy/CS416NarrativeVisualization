var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 300 - margin.left - margin.right
    height = 300 - margin.top - margin.bottom

var parseTime = d3.timeParse("%y")

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/bphennessy/CS416NarrativeVisualization/main/gas.csv",function(error,data) {
    if (error) throw error;
    
    data.forEach(function(d) {
        d.ModelYear = parseTime(d.date);
    });
    
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
        .attr('d', valueline)
        .attr("fill", "none")
        .attr("stroke", "steelblue")

    svg.append("g")
        .attr("transform","translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
    /*d3.select("svg").append("g").attr("transform","translate(50,50)")
        .selectAll("circle").data(ByYear).enter().append("circle")
            .attr("cx",2015)//function(d) { return d.key; })
            .attr("cy",function(d) { return d.values.averageFE })
            .attr("r",5);
            //.attr("r",function(d) { return +d.EngineCylinders+2 });
    /*xs = d3.scaleLog().base(10).domain([10,150]).range([0,200])
    ys = d3.scaleLog().base(10).domain([10,150]).range([200,0])

    d3.select("svg").append("g").attr("transform","translate(50,50)")
        .selectAll("circle").data(ga2022).enter().append("circle")
            .attr("cx",function(d,i) { return xs(d.AverageCityMPG) })
            .attr("cy",function(d) { return ys(d.AverageHighwayMPG) })
            .attr("r",function(d) { return +d.EngineCylinders+2 });*/

   /* var x = d3.scaleLinear().domain([2010,2025]).range([0,200]);
    var y = d3.scaleLinear().domain([0,30]).range([200,0]);
    var xticks = [2010,2015,2020,2025];
    var yticks = [0,10,20,30];

    d3.select("svg").append("g").attr("transform","translate(50,50)")
        .call(d3.axisLeft(y)
        .tickValues(yticks)
        .tickFormat(d3.format("~s")));
    d3.select("svg").append("g").attr("transform","translate(50,250)")
        .call(d3.axisBottom(x)
        .tickValues(xticks)
        .tickFormat(d3.format("~")));*/
});