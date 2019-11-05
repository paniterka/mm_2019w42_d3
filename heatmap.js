var parentDiv = document.getElementById("chart");
var vizx = parentDiv.clientWidth;
var vizy = parentDiv.clientWidth;

var margin = {top: 120, right: 25, bottom: 30, left: 100},
    width = vizx - margin.left - margin.right,
    height = vizy - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("position", "relative")
        .append("g")
            .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


// // Add title to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -80)
//         .attr("text-anchor", "left")
//         .style("font-size", "28px")
//         .style("font-weight", "bold")
//         .text("Ironman World Championship");

// // Add subtitle to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -40)
//         .attr("text-anchor", "left")
//         .style("font-size", "20px")
//         // .style("fill", "grey")
//         // .style("font-weight", "bold")
//         .style("max-width", 400)
//         .text("Game of skill - game of chance");


var x;
var y;
var myColor = {
    "0.0": "ghostwhite", 
    "1.0": "gold", 
    "2.0": "silver", 
    "3.0": "peru"
    };
var myGroups;
var myVars;

function drawChart(){
d3.csv("athletes_year_f2.csv", function(data) {

        // console.log(data)
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    myGroups = d3.map(data, function(d){return d.Year;}).keys()
    myVars = d3.map(data, function(d){return d.Athlete;}).keys()

    var xy_padding = 0.15; 

    // Build X scales and axis:
    x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(xy_padding);
    svg.append("g")
        .style("font-size", 10)
        .style("font-family", "inherit")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickSize(0)
            .tickFormat(function(d){return Math.round(d)})
            )
        .call( g => g.select(".domain").remove() )
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)")

        


    // Build Y scales and axis:
    y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(xy_padding);
    svg.append("g")
        .style("font-size", 10)
        .style("font-family", "inherit")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

    // create a tooltip
    var tooltip = d3.select("#chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "2px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        tooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
        tooltip
        .html(d.Athlete + ", " + Math.round(d.Year) + "<br />Finish time: " + d.Time)
        .style("left", (d3.mouse(this)[0]+margin.left+30) + "px")
        .style("top",  (d3.mouse(this)[1]+margin.top-30)+ "px")
        .style("position", "absolute")
    }
    var mouseleave = function(d) {
        tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    // add the squares
    svg.selectAll()
        .data(data, function(d) {return d.Year+':'+d.Athlete;})
        .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.Year) })
            .attr("y", function(d) { return y(d.Athlete) })
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", "ghostwhite")
            .style("stroke-width", 2)
            .style("stroke", "none")
            .style("opacity", 1)
            .attr("class", "heatmap-tiles")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    svg.selectAll("*")
        .style("opacity", 0.0)
        .transition()
            .duration(1000)
            .style("opacity", 1)

}
)
}



function drawMedals(){

svg.selectAll(".heatmap-tiles")
    .filter(function(d) { return d.Place_no > 0; })
    .transition()
        .delay(function(d,i){ return 40*i; }) 
        .duration(0)
        .attr("width", 0)
        .attr("height", 0)
        .style("fill", function(d) { return myColor[d.Place_no]} )
    .transition()
        .duration(800)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .ease(d3.easeElasticOut)
}

var rectangles_queens;
function showQueens(){

    d3.csv("queens2.csv", function(data) {

        rectangles_queens = svg.selectAll()
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d) { return x(d.x) })
                .attr("y", function(d) { return y(d.y) })
                .attr("height", 1.0*y.bandwidth())
                .attr("width", 0)
                .style('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 0.5)
                .attr("rx", 1)
                .attr("ry", 1)
                .attr("class", "rectangles_queens")
            .transition()
                .delay(function(d,i){ return 300*i; }) 
                .duration(300)
                .attr("width", function(d) { return x(d.end_year)-x(d.x)+x.bandwidth()})


    })
}

var rectangles_absences;
function showLottery(){

    d3.csv("queens_absences.csv", function(data) {

        rectangles_absences = svg.selectAll()
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d) { return x(d.x) })
                .attr("y", function(d) { return y(d.missing) })
                // .attr("height", 0)
                .attr("height", function(d) { return y.bandwidth()})
                .attr("width", 1.0*x.bandwidth())
                .style('fill', 'none')
                .attr('stroke', 'black')
                // .attr('stroke-width', 0.5)
                .attr('stroke-width', 0.0)
                .attr("rx", 1)
                .attr("ry", 1)
                .attr("class", "rectangles_absences")
            // .transition()
            //     .delay(function(d,i){ return 1500*i; }) 
            //     .duration(300)
            //     .attr('stroke-width', 5)
            //     .ease(d3.easeElasticOut)
            // .transition()
            //     .attr('stroke-width', 1)
            // .transition()
            //     .delay(function(d,i){ return 150*i; }) 
            //     .duration(300)
            //         .attr("y", function(d) { return y(d.y) })
            //         .attr("height", function(d) { return y(d.end_athlete)-y(d.y)+y.bandwidth()})
            //         .ease(None)


            rectangles_absences.transition()
                .delay(function(d,i){ return 1200*i; }) 
                .duration(300)
                .attr('stroke-width', 5)
                .ease(d3.easeElasticOut)
            .transition()
                .duration(100)
                .attr('stroke-width', 1)
                .ease(d3.easeLinear)
            .transition()
                .duration(300)
                    .attr("y", function(d) { return y(d.y) })
                    .attr("height", function(d) { return y(d.end_athlete)-y(d.y)+y.bandwidth()})
                    .ease(d3.easeLinear)


    })

}


function deleteChart(){
    svg.selectAll("*").remove()
}


function deleteElement(element){
    svg.selectAll(element).remove()
}