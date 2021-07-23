async function init() {
    data = await d3.csv("https://raw.githubusercontent.com/bphennessy/CS416NarrativeVisualization/main/gas.csv")

    ByYear = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {"averageFE": d3.mean(v,function(d) { return d.CombFE; })}})
        .object(data)
    console.log(ByYear)

    xs = d3.scaleLinear().domain([2010,2025]).range([0,200]);
    ys = d3.scaleLinear().domain([0,30]).range([200,0]);

    d3.select("svg").append("g").attr("transform","translate(50,50)")
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

    var x = d3.scaleLinear().domain([2010,2022]).range([0,200]);
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
        .tickFormat(d3.format("~")));
    }