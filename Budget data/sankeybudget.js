// console.log(budget_data);

function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

let gf_revenues = "General Fund: Revenues";
let gf_expenditures = "General Fund: Expenditures";

let rf_revenues = "Restricted Fund: Revenues";
let rf_expenditures = "Restricted Funds: Expenditures";

let year = "FY 2013";

let links = [];
let nodes = [];

nodes.push("General Fund");
Object.keys(budget_data[gf_expenditures]).forEach(function(e) {
    if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
        let link = {
            "source": "General Fund",
            "target": e,
            "value": budget_data[gf_expenditures][e][year]
        };
        nodes.push(e);
        links.push(link);
    }
});

Object.keys(budget_data[gf_revenues]).forEach(function(e) {
    if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
        let link = {
            "source": e,
            "target": "General Fund",
            "value": budget_data[gf_revenues][e][year]
        };
        nodes.push(e);
        links.push(link);
    }
});

nodes.push("Restricted Funds");
Object.keys(budget_data[rf_expenditures]).forEach(function(e) {
    if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
        
        if (e.toLowerCase().indexOf("dual app") != -1) {
            let n = Number.parseInt(budget_data[rf_expenditures][e][year]);
            if (n) {
                let link = {
                    "source": e,
                    "target": "Restricted Funds",
                    "value": n * -1
                };
                nodes.push(e);
                links.push(link);
            }
            
        } else {
            let link = {
                "source": "Restricted Funds",
                "target": e,
                "value": budget_data[rf_expenditures][e][year]
            };
            nodes.push(e);
            links.push(link);
        }
    }
});

Object.keys(budget_data[rf_revenues]).forEach(function(e) {
    if (e.toLowerCase().indexOf("total") == -1 && e.toLowerCase().indexOf("net expenditures") == -1) {
        if (Object.keys(budget_data[rf_revenues][e]).indexOf(year) != -1) {
            let link = {
                "source": e,
                "target": "Restricted Funds",
                "value": budget_data[rf_revenues][e][year]
            }; 
            nodes.push(e);
            links.push(link);
        } else {
            let total = 0;
            Object.keys(budget_data[rf_revenues][e]).forEach(function(e2) {
                if (e2.toLowerCase()  == "subtotal") {
                    total = budget_data[rf_revenues][e][e2][year];
                }
            });
            let link = {
                "source": e,
                "target": "Restricted Funds",
                "value": total
            };
            nodes.push(e);
            links.push(link);
        }
    }
});

nodes = removeDuplicates(nodes);
nodes = nodes.map((x) => {return {"name": x}});

var sankeydata = {
    "links": links,
    "nodes": nodes
}