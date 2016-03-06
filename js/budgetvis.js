function vis (data, w, h) {
    var units = "$";

    var margin = {top: 20, right: 10, bottom: 10, left: 10},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return units + formatNumber(d); },
        color = d3.scale.category20();
    
    // append the svg canvas to the page
    var svg = d3.select("#chart").append("svg");
    svg.classed("sankeyChart", true);
    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
/*
    svg.append("text")
        .text("Revenues")
        .attr("y", 10)//-margin.top * 0.25)
        .attr("x", 0);

    svg.append("text")
        .text("Expenses")
        .attr("y", 10)//-margin.top * 0.25)
        .attr("x", width)
        .attr("text-anchor", "end");*/

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();
        
    svg.append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")")
      //set up graph in same style as original example but empty
    graph = {"nodes" : [], "links" : []};

    data.forEach(function (d) {
      graph.nodes.push({ "node": d.source, "name": d.source });
      graph.nodes.push({ "node": d.target, "name": d.target });
      graph.links.push({ "source": d.source,
                         "target": d.target,
                         "value": +d.value });
     });

     // return only the distinct / unique nodes
     graph.nodes = d3.keys(d3.nest()
       .key(function (d) { return d.name; })
       .map(graph.nodes));

     // loop through each link replacing the text with its index from node
     graph.links.forEach(function (d, i) {
       graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
       graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
     });

     //now loop through each nodes to make nodes an array of objects
     // rather than an array of strings
     graph.nodes.forEach(function (d, i) {
       graph.nodes[i] = { "name": d };
     });

    sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

    // add in the links
    var link = svg.append("g")
    .selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .style("stroke", function(d) {
            switch (d.target.name) {
                case "General Fund":
                    return "#276419";
                    break;
                case "Restricted Funds":
                    return '#4db029';
                    break;
                default: 
                    return "#FFC107";
                    break;
            }})
      .sort(function(a, b) { return b.dy - a.dy; })
    .on("mouseover", function(d){
        d3.select(this).classed("highlight", true);
        d3.select("#hover_description")
            .classed("show", true)
            .text(d.source.name + " → " + d.target.name + ": " + format(d.value));
      })
    .on("mousemove", function(d){
      d3.select("#hover_description")
        .style({
                "top": (d3.event.y - 10 + $(window).scrollTop()) + "px",
                "left": (d3.event.x + 10) + "px"
                });
      })
    .on("mouseout", function(){
        d3.select(this).classed("highlight", function(){
            return d3.select(this).classed('click');
        })
            d3.select("#hover_description")
                .classed("show", false);
          });

    // add the link titles
    // changed to text to eliminate delayed mouseover effect 
    link.append("text")
        .text(function(d) {
            return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { 
          this.parentNode.appendChild(this); })
      .on("drag", dragmove));

    // add the rectangles for the nodes
    node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
            switch (d.name) {
                case "General Fund":
                    d.color = "#276419";
                    break;
                case "Restricted Funds":
                    d.color = '#4db029';
                    break;
                default: 
                    d.color = "#FFC107";
                    break;
            }
        return d.color;
        })
             //function(d) { 
          //return d.color = color(d.name.replace(/ .*/, "")); }
      .style("stroke", function(d) { 
          return d3.rgb(d.color).darker(1); })


    // new code from open oak
    .on("mouseover", function(d){
      var thisnode = d3.select(this.parentNode);

    //   highlight node only, not flows
      thisnode.classed("hover", true);

    //   append total amount to label
      thisnode.select("text").transition()
        .text(function(d){
            var text = d.name;
            text += ': ' + format(d.value);
            return text;
        });
    })
    .on("mouseout", function(d){
      var thisnode = d3.select(this.parentNode);
    //   remove node highlight
      thisnode.classed("hover", false);
    //   remove amount from label
    if (!thisnode.classed('highlight')) {
        thisnode.select("text").transition()
          .text(function(d){ return d.name; });
    }

    })
    .on("click", function(d){
      var thisnode = d3.select(this.parentNode);
      if (thisnode.classed("highlight")) {
          thisnode.classed("highlight", false);
          thisnode.classed("hover", false);
      } else {
        //   node.classed("highlight", false);
          thisnode.classed("highlight", true);
      }

      link.classed('highlight click', function(link_d){
          if ([link_d.target.name, link_d.source.name].indexOf(d.name) >= 0) {
              return thisnode.classed("highlight");
          } else {
              return d3.select(this).classed("click");
          };
      });

      thisnode.select("text").transition()
        .text(function(d){
            var text = d.name;
            if (thisnode.classed('highlight')) {
                text += ': ' + format(d.value);
            }
            return text;
        });
    });

    // add in the title for the nodes
    node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
    d3.select(this).attr("transform", 
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", path);
    }
};