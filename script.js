// margin setup
var margin = {top: 50, right: 50, bottom: 100, left: 50},
    width = 600 - margin.left - margin.right
    height = 650 - margin.top - margin.bottom;

// svg setup
var svg = d3.select("#visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x-axis setup
var x = d3.scaleLinear().range([0,width]);
var xlog = d3.scaleLog().base(10).range([1,width]);
var xAxis = d3.axisBottom().scale(x);
svg.append("g")
    .attr("transform","translate(0," + height + ")")
    .attr("class","xaxis")
    .append("text")
    .attr("class","xlabel")
    .attr("fill","black")
    .attr("transform","translate(" + width/2 + ",40)")
    .attr("text-anchor", "middle");

// y-axis setup
var y = d3.scaleLinear().range([height,0]);
var ylog = d3.scaleLog().base(10).range([height,1]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
    .attr("class","yaxis")
    .append("text")
    .attr("class","ylabel")
    .attr("fill","black")
    .attr("transform","rotate(-90)")
    .attr("x",-height/2)
    .attr("y",-margin.left)
    .attr("dy", "1em")
    .attr("text-anchor", "middle");

// tooltip setup
var tooltip = d3.select("#tooltip")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip");

// dropdown setup
var dropdown = d3.select("#navBar").insert("select", "svg")
    .attr("class","dropdown")
    .attr("id","carDropdown")
    .style("visibility","hidden")
    .on("change", dropdownChange);

// chart title
function title(slide) {
    if (slide == 0) {
        svg.append("text")
            .attr("class","title")
            .attr("transform","translate(" + width/2 + "," + -margin.top/2 + ")")
            .attr("text-anchor","middle")
            .text("Overall Fuel Economy");
    } else if (slide == 1) {
        svg.selectAll(".title")
            .text("Overall Fuel Economy");
    } else if (slide == 2) {
        svg.selectAll(".title")
            .text("Fuel Economy by Vehicle Type");
    } else if (slide == 3) {
        svg.selectAll(".title")
            .text("Annual Fuel Cost vs Fuel Economy");
    }
}

// chart axes
function axes(slide,carYear) {
    if (slide == 0 || slide == 1) {
        x.domain([d3.min(overall,function(d) { return parseInt(d.key) }),d3.max(overall,function(d) { return parseInt(d.key) })]);
        y.domain([0,d3.max(overall,function(d) { return parseInt(d.value.averageFE) })]);
        d3.selectAll(".xlabel").text("Model Year");
        d3.selectAll(".ylabel").text("Combined Fuel Economy (MPG)");
    } else if (slide == 2) {
        var slide2Max = Math.max(d3.max(gas,function(d) { return parseInt(d.value.averageFE) }),
            Math.max(d3.max(electric,function(d) { return parseInt(d.value.averageFE) }),
            Math.max(d3.max(plugIn,function(d) { return d.value.averageFE }), d3.max(fuelCell,function(d) { return parseInt(d.value.averageFE) }))));
        x.domain([d3.min(overall,function(d) { return parseInt(d.key) }),d3.max(overall,function(d) { return parseInt(d.key) })]); 
        y.domain([0,slide2Max]);
        d3.selectAll(".xlabel").text("Model Year");
        d3.selectAll(".ylabel").text("Combined Fuel Economy (MPG)");
    } else if (slide == 3) {
        xlog.domain([d3.min(data.filter(function(d) { if (d["ModelYear"] == carYear) { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}),function(d) { return parseInt(d.CombFE) }),d3.max(data.filter(function(d) { if (d["ModelYear"] == carYear) { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}),function(d) { return parseInt(d.CombFE); })]); 
        ylog.domain([d3.min(data.filter(function(d) { if (d["ModelYear"] == carYear) { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}),function(d) { return parseInt(d.AnnualFuelCost) }),d3.max(data.filter(function(d) { if (d["ModelYear"] == carYear) { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}),function(d) { return parseInt(d.AnnualFuelCost); })]);
        d3.selectAll(".xlabel").text("Combined Fuel Economy (MPG)");
        d3.selectAll(".ylabel").text("Annual Fuel Cost ($/year)");
    }

    if (slide == 0) {
        svg.selectAll(".xaxis")
        .call(xAxis
            .ticks(7)
            .tickFormat(d3.format("~")));
        svg.selectAll(".yaxis")
        .call(yAxis
            .ticks(5)
            .tickFormat(d3.format("~s")));
    } else if (slide == 3) {
        svg.selectAll(".xaxis")
        .transition()
        .duration(3000)
        .call(d3.axisBottom().scale(xlog)
            .ticks(7)
            .tickFormat(d3.format("~")));
        svg.selectAll(".yaxis")
        .transition()
        .duration(3000)
        .call(d3.axisLeft().scale(ylog)
            .ticks(5)
            .tickFormat(d3.format("~s")));
    } else {
        svg.selectAll(".xaxis")
        .transition()
        .duration(3000)
        .call(xAxis
            .ticks(7)
            .tickFormat(d3.format("~")));
        svg.selectAll(".yaxis")
        .transition()
        .duration(3000)
        .call(yAxis
            .ticks(5)
            .tickFormat(d3.format("~s")));
    }
}

// chart legend
function legend(slide) {
    if (slide == 0 || slide == 1) {
        var legendData = 
            [{"offset": -50, "text": "Overall", "color": "steelblue"},
            {"offset": -50, "text": " ", "color": "steelblue"},
            {"offset": -50, "text": " ", "color": "steelblue"},
            {"offset": -50, "text": " ", "color": "steelblue"},
            {"offset": -50, "text": " ", "color": "steelblue"}];
    } else if (slide == 2) {
        var legendData = 
            [{"offset": -175, "text": "Overall", "color": "steelblue"},
            {"offset": -105, "text": "Gas", "color": "red"},
            {"offset": -50, "text": "Electric", "color": "blue"},
            {"offset": 20, "text": "Plug-In Hybrid", "color": "purple"},
            {"offset": 130, "text": "Fuel Cell", "color": "green"}];
    } else if (slide == 3) {
        var legendData = 
            [{"offset": -105, "text": " ", "color": "red"},
            {"offset": -105, "text": "Gas", "color": "red"},
            {"offset": -50, "text": "Electric", "color": "blue"},
            {"offset": 20, "text": "Plug-In Hybrid", "color": "purple"},
            {"offset": 130, "text": "Fuel Cell", "color": "green"}];
    }

    var legendMarks = svg.selectAll(".legendmark").data(legendData);
    var legendText = svg.selectAll(".legendtext").data(legendData);

    if (slide == 0) {
        legendMarks = legendMarks.enter().append("circle").attr("class","legendmark").merge(legendMarks);
        legendText = legendText.enter().append("text").attr("class","legendtext").merge(legendText);
    } else {
        legendMarks = legendMarks.enter().append("circle").attr("class","legendmark").merge(legendMarks).transition().duration(3000).style("opacity",100);
        legendText = legendText.enter().append("text").attr("class","legendtext").merge(legendText).transition().duration(3000).style("opacity",100);
    }

    legendMarks
        .attr("cx",function(d) { return d.offset + width/2; })
        .attr("cy",parseInt(height) + 80)
        .attr("r",6)
        .style("fill",function(d) { return d.color; });

    legendText
        .attr("x",function(d) { return d.offset + width/2 + 10; })
        .attr("y",parseInt(height) + 80)
        .attr("class","legendtext")
        .text(function(d) { return d.text; })
        .attr("alignment-baseline","middle");
}

// chart lines on slides 1 and 2
function lines(slide) {
    if (slide == 0 || slide == 1) {
        var overallLine = svg.selectAll(".overallline").data([overall]);
        var gasLine = svg.selectAll(".gasline").data([overall]);
        var electricLine = svg.selectAll(".electricline").data([overall]);
        var plugInLine = svg.selectAll(".pluginline").data([overall]);
        var fuelCellLine = svg.selectAll(".fuelcellline").data([overall]);
    } else if (slide == 2) {
        var overallLine = svg.selectAll(".overallline").data([overall]);
        var gasLine = svg.selectAll(".gasline").data([gas]);
        var electricLine = svg.selectAll(".electricline").data([electric]);
        var plugInLine = svg.selectAll(".pluginline").data([plugIn]);
        var fuelCellLine = svg.selectAll(".fuelcellline").data([fuelCell]);
    }

    if (slide == 3) {
        svg.selectAll(".overallline").data([]).exit().transition().duration(1000).style("opacity",0).remove();
        svg.selectAll(".gasline").data([]).exit().transition().duration(1000).style("opacity",0).remove();
        svg.selectAll(".electricline").data([]).exit().transition().duration(1000).style("opacity",0).remove();
        svg.selectAll(".pluginline").data([]).exit().transition().duration(1000).style("opacity",0).remove();
        svg.selectAll(".fuelcellline").data([]).exit().transition().duration(1000).style("opacity",0).remove();
    } else {
        gasLine.enter().append("path").attr("class","gasline").merge(gasLine).transition().duration(3000).style("opacity",100)
            .attr("d",d3.line()
                .x(function(d) { return x(d.key); })
                .y(function(d) { return y(d.value.averageFE); })
                .curve(d3.curveMonotoneX));

        electricLine.enter().append("path").attr("class","electricline").merge(electricLine).transition().duration(3000).style("opacity",100)
            .attr("d",d3.line()
                .x(function(d) { return x(d.key); })
                .y(function(d) { return y(d.value.averageFE); })
                .curve(d3.curveMonotoneX));

        plugInLine.enter().append("path").attr("class","pluginline").merge(plugInLine).transition().duration(3000).style("opacity",100)
            .attr("d",d3.line()
                .x(function(d) { return x(d.key); })
                .y(function(d) { return y(d.value.averageFE); })
                .curve(d3.curveMonotoneX));

        fuelCellLine.enter().append("path").attr("class","fuelcellline").merge(fuelCellLine).transition().duration(3000).style("opacity",100)
            .attr("d",d3.line()
                .x(function(d) { return x(d.key); })
                .y(function(d) { return y(d.value.averageFE); })
                .curve(d3.curveMonotoneX));

        overallLine.enter().append("path").attr("class","overallline").merge(overallLine).transition().duration(3000).style("opacity",100)
            .attr("d",d3.line()
                .x(function(d) { return x(d.key); })
                .y(function(d) { return y(d.value.averageFE); })
                .curve(d3.curveMonotoneX));
    }
}

// chart cicles to represent individual cars on slide 3
function cars(slide,carYear) {
    if (slide == 3) {
        var cars = svg.selectAll(".cars").data(data.filter(function(d) { if (d["ModelYear"] == carYear) { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}));
    } else {
        var cars = svg.selectAll(".cars").data([]);
    }

    var carCircles = cars.enter().append("circle").attr("class","cars").merge(cars);
    carCircles.transition().duration(3000).style("opacity",100)    
        .attr("cx",function(d) { return xlog(d.CombFE); })
        .attr("cy",function(d) { return ylog(d.AnnualFuelCost); })
        .attr("r",5)
        .style("fill", function(d) { if (d.Type == "Gas") { return "red"; } else if (d.Type == "Electric") { return "blue"; } else if (d.Type == "Plug-In") { return "purple"; } else if (d.Type == "Fuel Cell") { return "green"; } });
    carCircles
        .on("mouseover",mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave",mouseLeave);
      
    cars.exit().transition().duration(1000).style("opacity",0).remove();
}

// add annotations to slides
function annotation(slide) {
    if (slide == 0) {
        var annotations = 
            [{"x1": 2010, "y1": 16, "x2": 2011, "y2": 15, "text": "Congress estabilishes Corporate Average Fuel Economy standards in 1975."},
            {"x1": 2010, "y1": 20, "x2": 2010.5, "y2": 17, "text": "Agreement reached to estabilsh national program to implement first fuel efficency improvements in 34 years in 2009."},
            {"x1": 2012, "y1": overall.filter(function(d) { return d.key === "2012"; })[0].value.averageFE, "x2": 2011, "y2": 19.5, "text": "First phase of national program goes into effect calling for an annual ~5% increase in fuel economy from 2012 to 2016."},
            {"x1": 2017, "y1": overall.filter(function(d) { return d.key === "2017"; })[0].value.averageFE, "x2": 2012.5, "y2": 21.5, "text": "Second phase of nation program goes into effect. Fuel efficiency expected to increase to 36-37 mpg by 2025."}];
    } else if (slide == 1) {
        var annotations = 
            [{"x1": 2010, "y1": 16, "x2": 2011, "y2": 15, "text": "Congress estabilishes Corporate Average Fuel Economy standards in 1975."},
            {"x1": 2010, "y1": 20, "x2": 2010.5, "y2": 17, "text": "Agreement reached to estabilsh national program to implement first fuel efficency improvements in 34 years in 2009."},
            {"x1": 2012, "y1": overall.filter(function(d) { return d.key === "2012"; })[0].value.averageFE, "x2": 2011, "y2": 19.5, "text": "First phase of national program goes into effect calling for an annual ~5% increase in fuel economy from 2012 to 2016."},
            {"x1": 2017, "y1": overall.filter(function(d) { return d.key === "2017"; })[0].value.averageFE, "x2": 2012.5, "y2": 21.5, "text": "Second phase of nation program goes into effect. Fuel efficiency expected to increase to 36-37 mpg by 2025."}];
    } else if (slide == 2) {
        var annotations = 
            [{"x1": 2017, "y1": electric.filter(function(d) { return d.key === "2017"; })[0].value.averageFE, "x2": 2016.5, "y2": 95, "text": "The best selling electric vehicle, the Tesla Model 3, is released."},
            {"x1": 2013, "y1": electric.filter(function(d) { return d.key === "2013"; })[0].value.averageFE, "x2": 2013.5, "y2": 80, "text": "Nissan begins assembling the Leaf, the first zero tailpipe emissions mass market vehicle."},
            {"x1": 2012, "y1": overall.filter(function(d) { return d.key === "2012"; })[0].value.averageFE, "x2": 2011, "y2": 10, "text": "First phase of national program goes into effect calling for an annual ~5% increase in fuel economy from 2012 to 2016."},
            {"x1": 2017, "y1": overall.filter(function(d) { return d.key === "2017"; })[0].value.averageFE, "x2": 2012.5, "y2": 15, "text": "Second phase of nation program goes into effect. Fuel efficiency expected to increase to 36-37 mpg by 2025."}];
    } else if (slide == 3) {
        var annotations = [];
    }
  
    var annotationLine = svg.selectAll(".annotationline").data(annotations);
    var annotationText = svg.selectAll(".annotationtext").data(annotations);

    if (slide == 0) {
        annotationLine = annotationLine.enter().append("line").attr("class","annotationline").merge(annotationLine);
        annotationText = annotationText.enter().append("text").attr("class","annotationtext").merge(annotationText);
    } else {
        annotationLine.exit().transition().duration(1000).style("opacity",0).remove();
        annotationText.exit().transition().duration(1000).style("opactiy",0).remove();
        annotationLine = annotationLine.enter().append("line").attr("class","annotationline").merge(annotationLine).transition().duration(3000).style("opacity",100);
        annotationText = annotationText.enter().append("text").attr("class","annotationtext").merge(annotationText).transition().duration(3000).style("opacity",100);
    }

    annotationLine
        .attr("x1",function(d) { return x(d.x1) })
        .attr("y1",function(d) { return y(d.y1) })
        .attr("x2",function(d) { return x(d.x2) })
        .attr("y2",function(d) { return y(d.y2) });

    annotationText
        .attr("x",function(d) { return x(d.x2) })
        .attr("y",function(d) { return y(d.y2) + 7 })
        .attr("text-anchor","start")
        .text(function(d) { return d.text });
}

// make the tooltip visible on mouse over
function mouseOver() {
    tooltip
        .style("opacity", 1)
        .style("display","inherit");
}

// add data to tooltip
var mouseMove = function (d) {
    if (d.MaxEthanol != "") { var EtOH = d.MaxEthanol; } else if (d.Type == "Gas" || d.Type == "Plug-In") { var EtOH = "Not Reported"; } else { var EtOH = "N/A"; };
    if (d.Cylinders != "") { var cylinders = d.Cylinders; } else { var cylinders = "N/A"; };
    tooltip
        .style("left", (d3.mouse(this)[0]+60) + "px")
        .style("top", (d3.mouse(this)[1]-820) + "px")
        .html("Make: " + d.Make + "<br>" +
            "Model: " + d.Model + "<br>" +
            "Fuel: " + d.FuelType + "<br>" +
            "Cyliners: " + cylinders + "<br>" +
            "City Fuel Economy: " + d.CityFE + " MPG<br>" +
            "Highway Fuel Economy: " + d.HwyFE + " MPG<br>" +
            "Combined Fuel Economy: " + d.CombFE + " MPG<br>" +
            "Transmission: " + d.Trans + "<br>" +
            "Gears: " + d.Gears + "<br>" +
            "Drive: " + d.Drive + "<br>" +
            "Maximum Ethanol Content: " + EtOH + "<br>" +
            "Annual Fuel Cost: " + d.AnnualFuelCost + "<br>");
}

// make the tooltip hidden when the mouse leaves
function mouseLeave() {
    tooltip
        .style("opacity", 0)
        .style("display","none")
}

// informational text at bottom of screen
function text(slide) {
    if (slide == 0 || slide == 1) {
        document.getElementById("text").innerHTML = "In 1975, congress established the Corporate Average Fuel Economy (CAFE) standards in response to an oil embargo by OPEC 1973. The new standards went into effect starting with model year 1978 and were expected to roughly double fuel economy by 1985. No updates to the standards were made until 2009 when an agreement was reached between the federal government, state regulators, and the auto industry to establish a national program.<br><br>The first phase of this national program when into effect in 2012 and called for ~5% increase in fuel economy each year from 2012 to 2016. The second phase of the program started in 2017 and call for a decrease in average global warming emissions to 163 grams per mile. Some of this emissions limit is met by improvements to air conditioning systems, but it is expected that this phase will lead to a fuel economy increase to 36-37 MPG.";
    } else if (slide == 2) {
        document.getElementById("text").innerHTML = "Throughout the last decade, vehicles using alternative fuels have begun to become more prevalent. These alternative fuel vehicles have had a large contribution to the increase in the overall fuel economy. Plug-in hybrids, hydrogen fuel cell cars, and electric vehicles have made strides in improving the efficiency of transportation.<br><br>These technologies have become more prevalent and have led to lower overall global warming emissions and decreased fuel cost for consumers.<br><br>Note: For the purposes of this chart, hydrogen and electric vehicles have the energy used to power them converted into a MPG equivalent.";
    } else if (slide == 3) {
        document.getElementById("text").innerHTML = "Year displayed can be changed at the top of the chart. Hover over points to see detailed information about the individual vehicles.<br><br>This chart gives the relationship between fuel economy and annual fuel cost of the consumer. It shows how regulations that increase fuel economy standards also help consumers by reducing their fuel costs.";
    }
}

// updates contents to change between slides
function update(slide) {
    title(slide);
    axes(slide,defaultYear);
    legend(slide);
    lines(slide);
    cars(slide,defaultYear);
    annotation(slide);
    text(slide);
}

// initialize the page
async function init() {
    // load data
    data = await d3.csv("https://raw.githubusercontent.com/bphennessy/CS416NarrativeVisualization/main/cars.csv")

    overall = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {"averageFE": d3.mean(v,function(d) { return d.CombFE; })}})
        .entries(data.filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}));

    gas = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {"averageFE": d3.mean(v,function(d) { return d.CombFE; })}})
        .entries(data.filter(function(d) { if (d["Type"] == "Gas") { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}));

    electric = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {"averageFE": d3.mean(v,function(d) { return d.CombFE; })}})
        .entries(data.filter(function(d) { if (d["Type"] == "Electric") { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}));
    
    plugIn = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {"averageFE": d3.mean(v,function(d) { return d.CombFE; })}})
        .entries(data.filter(function(d) { if (d["Type"] == "Plug-In") { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}));

    fuelCell = d3.nest()
        .key(function(d) { return d.ModelYear; })
        .rollup(function(v) { return {"averageFE": d3.mean(v,function(d) { return d.CombFE; })}})
        .entries(data.filter(function(d) { if (d["Type"] == "Fuel Cell") { return d; }}).filter(function(d) { if (d["FuelUnit"] == "MPG") { return d; }}));

    // initialize dropdown
    defaultYear = "2021";
    dropdownOptions = dropdown.selectAll("option").data(overall).enter().append("option");
    dropdownOptions
        .attr("value",function(d) { return d.key; })
        .text(function(d) { return d.key })
        .property("selected", function(d) { return d.key === defaultYear; });

    // initialize slides
    slide = 0;
    update(slide);
    slide = 1;
}

// move to the previous slide
function previous() {
    if (slide != 1) {
        document.getElementById("nextButton").style.visibility = "visible";
        slide--;
        update(slide);
    }
    if (slide == 1) {
        document.getElementById("previousButton").style.visibility = "hidden";
    } else {
        document.getElementById("previousButton").style.visibility = "visible";
        document.getElementById("carDropdown").style.visibility = "hidden";
    }
    dropdownOptions.property("selected", function(d) { return d.key === defaultYear; });
}

// move to the next slide
function next() {
    if (slide != 3) {
        document.getElementById("previousButton").style.visibility = "visible";
        slide++;
        update(slide);
    }
    if (slide == 3) {
        document.getElementById("nextButton").style.visibility = "hidden";
        document.getElementById("carDropdown").style.visibility = "visible";
    } else {
        document.getElementById("nextButton").style.visibility = "visible";
    }
}

// updates slide when value in the dropdown changes
function dropdownChange() {
    var newYear = d3.select(this).property('value');
    axes(slide,newYear);
    cars(slide,newYear);
};