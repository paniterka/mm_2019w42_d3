var margin = {top: 80, right: 25, bottom: 30, left: 100},
vizx = 600,
vizy = 600,
  width = vizx - margin.left - margin.right,
  height = vizy - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("position", "relative")
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {

d3.csv("athletes_year_f2.csv", function(data) {

    console.log(data)
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, function(d){return d.Year;}).keys()
  var myVars = d3.map(data, function(d){return d.Athlete;}).keys()

  var xy_padding = 0.15; 

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(xy_padding);

svg.append("g")
    .style("font-size", 10)
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
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(xy_padding);
  svg.append("g")
    .style("font-size", 10)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale

  var myColor = {
      "0.0": "ghostwhite", 
      "1.0": "gold", 
      "2.0": "silver", 
      "3.0": "peru"
  }
  console.log(myColor[0])

//   var myColor = d3.scaleSequential()
//     .interpolator(d3.interpolateInferno)
//     .domain([1,100])

  // create a tooltip
  var tooltip = d3.select("#my_dataviz")
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
      .style("fill", function(d) { return myColor[d.Place_no]} )
      .style("stroke-width", 2)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})

// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Ironman World Championship");

// Add subtitle to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("Game of skill - game of chance");
