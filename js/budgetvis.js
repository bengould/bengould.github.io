let yearOptions = ["FY 2013", "FY 2014", "FY 2015", "FY 2016", "FY 2017", "FY 2018", "FY 2019"];

function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

function makeLink(source, target, value) {

    value = Number.parseInt(value);
    value = value ? value : 0;
    if (value && value != 0) {
        if (value < 0) {
            temp = source;
            source = target;
            target = temp;
        }
        return {
            "source": source,
            "target": target,
            "value": Math.abs(value)
        }
    }
    return {
        "source": source,
        "target": target,
        "value": null
    };
}

function readCSV(file, table_names) {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let rows = rawFile.responseText.split("\n");
                rows = rows.map((x) => x.split("\t"));

                let tables = {};
                let currentTableHeader = null;
                let currentSubTable = null;
                for (let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    if (table_names.indexOf(row[0]) != -1) {
                        tables[row[0]] = {};
                        currentTableHeader = row;
                        currentSubTable = null;
                    } else if (row.every((x) => x != "")) {
                        let row_obj = {};
                        for (let j = 1; j < row.length; j++) {
                            row_obj[currentTableHeader[j]] = row[j];
                        }
                        if (currentSubTable != null) {
                            tables[currentTableHeader[0]][currentSubTable][row[0]] = row_obj;
                        } else {
                            tables[currentTableHeader[0]][row[0]] = row_obj;
                        }
                    } else if (row[0] != "") {
                        tables[currentTableHeader[0]][row[0]] = {};
                        currentSubTable = row[0];
                    }
                }
                console.log(tables);
                load_nodes(tables);
            }
        }
    }
    rawFile.send(null);
}

function load_nodes(data) {

    let gf_revenues = "General Fund: Revenues";
    let gf_expenditures = "General Fund: Expenditures";

    let rf_revenues = "Restricted Fund: Revenues";
    let rf_expenditures = "Restricted Funds: Expenditures";

    year = "FY 2013";
    let links = [];
    let nodes = [];

    nodes.push("General Fund");
    Object.keys(data[gf_expenditures]).forEach(function(e) {
        if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
            nodes.push(e);
            links.push(makeLink("General Funds", e, data[gf_expenditures][e][year]));
        }
    });

    Object.keys(data[gf_revenues]).forEach(function(e) {
        if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
            nodes.push(e);
            links.push(makeLink(e, "General Funds", data[gf_revenues][e][year]));
        }
    });

    nodes.push("Restricted Funds");
    Object.keys(data[rf_expenditures]).forEach(function(e) {
        if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
            nodes.push(e);
            links.push(makeLink("Restricted Funds", e, data[rf_expenditures][e][year]));
        }
    });

    Object.keys(data[rf_revenues]).forEach(function(e) {
        if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
            let value = 0;
            if (Object.keys(data[rf_revenues][e]).indexOf(year) == -1) {
                value = data[rf_revenues][e]["Subtotal"][year]
            } else {
                value = data[rf_revenues][e][year]
            }
            nodes.push(e);
            links.push(makeLink(e, "Restricted Funds", value));
        }
    });

    nodes = removeDuplicates(nodes);

    let filteredLinks = [];
    let filteredNodes = [];

    for (let i = 0; i < links.length; i++) {
        if (links[i].value != null) {
            filteredLinks.push(links[i]);
            let nodeName = [links[i].target, links[i].source].filter((x) => {
                return ["General Funds", "Restricted Funds"].indexOf(x) == -1;
            })[0];
            filteredNodes.push(nodeName);
        }
    }
    filteredNodes = removeDuplicates(filteredNodes);
    filteredNodes.push("General Funds");
    filteredNodes.push("Restricted Funds");
    filteredNodes = filteredNodes.map((x) => {return {"name": x}});

    load_vis({
        "links": filteredLinks,
        "nodes": filteredNodes
    });
}

function load_vis(graph) {
    let units = "$";

    let margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = document.getElementById("chart").scrollWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let formatNumber = d3.format(",.0f"), // zero decimal places
        format = function(d) {
            return units + formatNumber(d);
        },
        color = d3.scaleOrdinal(d3.category20);

    // append the svg canvas to the page
    let svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    // Set the sankey diagram properties
    let sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(10)
        .size([width, height]);


    let path = sankey.link();

    let nodeMap = {};
    graph.nodes.forEach(function(x) {
        nodeMap[x.name] = x;
    });

    graph.links = graph.links.map(function(x) {
        return {
            source: nodeMap[x.source],
            target: nodeMap[x.target],
            value: x.value
        };
    });
    console.log("About to sankey");
    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // add in the links
    let link = svg.append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) {
            return Math.max(1, d.dy);
        })
        .style("stroke", function(d) {
            switch (d.target.name) {
                case "General Fund":
                    return "green";
                    break;
                case "Restricted Funds":
                    return 'lightgreen';
                    break;
                default:
                    return "#008CE7";
                    break;
            }
        })
        .sort(function(a, b) {
            return b.dy - a.dy;
        })
        .on("mouseover", function(d) {
            d3.select(this).classed("highlight", true);
            d3.select("#hover_description")
                .classed("show", true)
                .text(d.source.name + " → " + d.target.name + ": " + format(d.value));
        })
        .on("mousemove", function(d) {
            d3.select("#hover_description")
                .style("top", (d3.event.y - 10 + $(window).scrollTop()) + "px")
                .style("left", (d3.event.x + 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).classed("highlight", function() {
                return d3.select(this).classed('click');
            })
            d3.select("#hover_description")
                .classed("show", false);
        });
    // add the link titles
    link.append("text")
        .text(function(d) {
            return d.source.name + " → " +
                d.target.name + "\n" + format(d.value);
        });

    // add in the nodes
    let node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.drag()
            .on("drag", dragmove))
        .on("start", function() {
            this.parentNode.appendChild(this);
        });

    // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
            switch (d.name) {
                case "General Funds":
                    d.color = "green";
                    break;
                case "Restricted Funds":
                    d.color = 'lightgreen';
                    break;
                default:
                    d.color = "palegoldenrod";
                    break;
            }
            return d.color;
        })
        //function(d) { 
        //return d.color = color(d.name.replace(/ .*/, "")); }
        .style("stroke", function(d) {
            return d3.rgb(d.color).darker(1);
        })


        // new code from open oak
        .on("mouseover", function(d) {
            var thisnode = d3.select(this.parentNode);

            //   highlight node only, not flows
            thisnode.classed("hover", true);

            //   append total amount to label
            thisnode.select("text").transition()
                .text(function(d) {
                    var text = d.name;
                    text += ': ' + format(d.value);
                    return text;
                });
        })
        .on("mouseout", function(d) {
            var thisnode = d3.select(this.parentNode);
            //   remove node highlight
            thisnode.classed("hover", false);
            //   remove amount from label
            if (!thisnode.classed('highlight')) {
                thisnode.select("text").transition()
                    .text(function(d) {
                        return d.name;
                    });
            }

        })
        .on("click", function(d) {
            var thisnode = d3.select(this.parentNode);
            if (thisnode.classed("highlight")) {
                thisnode.classed("highlight", false);
                thisnode.classed("hover", false);
            } else {
                //   node.classed("highlight", false);
                thisnode.classed("highlight", true);
            }

            link.classed('highlight click', function(link_d) {
                if ([link_d.target.name, link_d.source.name].indexOf(d.name) >= 0) {
                    return thisnode.classed("highlight");
                } else {
                    return d3.select(this).classed("click");
                };
            });

            thisnode.select("text").transition()
                .text(function(d) {
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
        .attr("y", function(d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) {
            return d.name;
        })
        .filter(function(d) {
            return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this).attr("transform",
            "translate(" + (
                d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
            ) + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
};

window.onload = function() {

    // let fySelect = document.getElementById("fy");
    // for (let i = 0; i < yearOptions.length; i++) {
    //     let option = this.document.createElement("option");
    //     option.value = yearOptions[i];
    //     option.innerHTML = yearOptions[i];
    //     fySelect.appendChild(option);
    // }

    // fySelect.onchange = function() {
    //     let chart = document.getElementById("chart");
    //     while (chart.firstChild) {
    //         chart.removeChild(chart.firstChild);
    //     }
    //     load(get_data(this.value));
    // }

    let year = this.document.getElementById("fy").value;
    console.log(year);

    let table_names = ["General Fund: Revenues", "General Fund: Expenditures", "Restricted Fund: Revenues", "Restricted Funds: Expenditures", "All Fund: Expenditures"];

    readCSV("/Budget data/BerkeleyBudgetCSV.csv", table_names);

}

