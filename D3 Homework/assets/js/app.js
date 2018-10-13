let svgHeight = 500;
let svgWidth = 1000;
let margin = {
    top: 20,
    left: 120,
    right: 40,
    bottom: 80
}
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;
let svg = d3
    .select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
let chartgroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
let chosenXaxis = "poverty";
let chosenYaxis = "healthcare";
function xScale(poverty, chosenXaxis){
    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(poverty, d => d[chosenXaxis]) * .8,
        d3.max(poverty, d => d[chosenXaxis]) * 1.2
    ])
    .range([0, width]);
    return xLinearScale;
}

function yScale(healthcare, chosenYaxis){
    let yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthcare, d => d[chosenYaxis]*.5),
        d3.max(healthcare, d => d[chosenYaxis]) * 1.2
    ])
    .range([height, 0]);
    return yLinearScale;
}

function renderAxes(newXScale, xAxis){
    let bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(500)
        .call(bottomAxis);
    return xAxis;
}

function renderAxesY(newYScale, yAxis){
    let leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(500)
        .call(leftAxis);
    return yAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXaxis, circleLabels){
    let offset;
    if(chosenXaxis === "income"){
        offset = 800;
    }
    else if(chosenXaxis === "poverty"){
        offset = .23;
    }
    else{
        offset = .33;
    }
    circlesGroup.transition()
        .duration(500)
        .attr("cx", d => newXScale(d[chosenXaxis]));
    circleLabels.transition()
        .duration(500)
        .attr("x", d => newXScale(d[chosenXaxis] - offset));
    return circlesGroup;
}

function renderCirclesY(circlesGroup, newXScale, chosenYaxis, circleLabels){
    let offset;
    if(chosenYaxis === "healthcare"){
        offset = .3;
    }
    else if(chosenYaxis === "obesity"){
        offset = .4;
    }
    else{
        offset = .35;
    }
    circlesGroup.transition()
        .duration(500)
        .attr("cy", d => newXScale(d[chosenYaxis]));
    circleLabels.transition()
        .duration(500)
        .attr("y", d => newXScale(d[chosenYaxis] - offset));
    return circlesGroup;
}

function updateToolTip(chosenXaxis, circlesGroup, chosenYaxis){
    let xlabel = "";
    if(chosenXaxis === "poverty"){
        xlabel = "Poverty";
    }
    else if(chosenXaxis === "age"){
        xlabel = "Age";
    }
    else{
        xlabel = "Household Income";
    }
    let ylabel = "";
    if(chosenYaxis === "healthcare"){
        ylabel = "Healthcare";
    }
    else if(chosenYaxis === "obesity"){
        ylabel = "Obesity";
    }
    else{
        ylabel = "Smokes";
    }
    let toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d){
            let xVar;
            if(chosenXaxis === "poverty"){
                xVar = d[chosenXaxis] + "%";
            }
            else if(chosenXaxis === "age"){
                xVar = d[chosenXaxis];
            }
            else {
                let incomeValue = new Intl.NumberFormat("en-US",{
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0
                });
                xVar = incomeValue.format(d[chosenXaxis]);
            }
            let yVar;
            if(chosenYaxis === "healthcare"){
                yVar = d[chosenYaxis] + "%";
            }
            else if(chosenYaxis === "obesity"){
                yVar = d[chosenYaxis] + "%";
            }
            else{
                yVar = d[chosenYaxis] + "%";
            }
            return (`${d.state}<br>${xlabel}: ${xVar}<br>${ylabel}: ${yVar}`);
        });
        circlesGroup.call(toolTip);
        circlesGroup.on("mouseover", function(data){
            toolTip.style("display", "block")
            toolTip.style("left", (d3.event.pageX) + "px")
            toolTip.style("top", (d3.event.pageY + 20) + "px")
            toolTip.show(data);
        })
        .on("mouseout", function(data, index){
            toolTip.style("display", "none")
        });
    return circlesGroup;
}

d3.csv("/assets/data/data.csv").then(function(data) {
    data.forEach(function(element) {
        element.poverty = +element.poverty;
        element.age = +element.age;
        element.income = +element.income;
        element.healthcare = +element.healthcare;
        element.obesity = +element.obesity;
        element.smokes = +element.smokes;
    });
    let xLinearScale = xScale(data, chosenXaxis);
    let yLinearScale = yScale(data, chosenYaxis);
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
    let xAxis = chartgroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    let yAxis = chartgroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(${width}, 0)`)
        .call(leftAxis);
    let circlesGroup = chartgroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXaxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "green")
        .attr("opacity", .2)
        // .text(d.abbr);
    let xLabelsgroup = chartgroup.append("g")
        .attr("transform", `translate(${width/2}, ${height+20})`);
    let povertyLabel = xLabelsgroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    let ageLabel = xLabelsgroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");
    let incomeLabel = xLabelsgroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");
    let yLabelgroup = chartgroup.append("g")
        .attr("transform", "rotate(-90)");
    let healthcareLabel = yLabelgroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        // .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    let obeseLabel = yLabelgroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - height/2)
        .attr("dy", "1em")
        .attr("value", "obesity")
        // .classed("axis-text", true)
        .classed("inactive", true)
        .text("Obese (%)");
    let smokesLabel = yLabelgroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - height/2)
        .attr("dy", "1em")
        .attr("value", "smokes")
        // .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smokes (%)");
    let circleLabels = chartgroup.append("text")
        .selectAll("tspan")
        .data(data)
        .enter()
        .append("tspan")
        .attr("x", function(data){
            return xLinearScale(data[chosenXaxis] - .23);
        })
        .attr("y", function(data){
            return yLinearScale(data[chosenYaxis] - .3);
        })
        .text(function(data){
            return data.abbr;
        });
    circlesGroup = updateToolTip(chosenXaxis, circlesGroup, chosenYaxis);
    xLabelsgroup.selectAll("text")
        .on("click", function(){
            let value = d3.select(this).attr("value");
            if(value !== chosenXaxis){
                chosenXaxis = value;
                xLinearScale = xScale(data, chosenXaxis);
                xAxis = renderAxes(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXaxis, circleLabels);
                circlesGroup = updateToolTip(chosenXaxis, circlesGroup, chosenYaxis);
                if(chosenXaxis === "poverty"){
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if(chosenXaxis === "age"){
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else{
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
        circlesGroup = updateToolTip(chosenXaxis, circlesGroup, chosenYaxis);
        yLabelgroup.selectAll("text")
            .on("click", function(){
                let value = d3.select(this).attr("value");
                if(value !== chosenYaxis){
                    chosenYaxis = value;
                    yLinearScale = yScale(data, chosenYaxis);
                    yAxis = renderAxesY(yLinearScale, yAxis);
                    circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYaxis, circleLabels);
                    circlesGroup = updateToolTip(chosenXaxis, circlesGroup, chosenYaxis);
                    if(chosenYaxis === "healthcare"){
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if(chosenYaxis === "obesity"){
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obeseLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else{
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });
})

