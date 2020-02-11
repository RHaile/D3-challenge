var svgWidth = 690;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

/********************************************************/

d3.csv("assets/data/data.csv")
    .then(function (healthData) {
        console.log()
        healthData.forEach(function (data) {

            data.income = +data.income;
            data.obesity = +data.obesity;
        });

/********************************************************/

        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.obesity))
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.income))
            .range([height, 0]);

/********************************************************/

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

/********************************************************/

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

/********************************************************/

        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.obesity))
            .attr("cy", d => yLinearScale(d.income))
            .attr("r", "10")
            .attr("fill", "lightblue")
            .attr("opacity", "0.8");

        var abbrGroup = chartGroup.selectAll("label")
            .data(healthData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("font-size", 9)
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("x", d => xLinearScale(d.obesity) - 7)
            .attr("y", d => yLinearScale(d.income) + 4);

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`${d.abbr}<br>Obesity: ${d.obesity}%<br>Avg Income: $ ${d.income}`);
            });

        chartGroup.call(toolTip);

        abbrGroup.on("mouseover", function (data) {
                toolTip.show(data, this);
            })
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

/********************************************************/

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Avg Income ($)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Obesity (%)");
    });