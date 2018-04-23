var svg = d3.select("svg").attr("class", "svg_first"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    active = d3.select(null);

var format = d3.format(",d");
svg.call(d3.zoom().on("zoom", function () {
        console.log(d3.event.transform)
    svg.attr("transform", d3.event.transform)}))

var color = d3.scaleOrdinal(d3.schemeCategory20c);

var pack = d3.pack()
    .size([width, height])
    .padding(1.5);

var user_research = "1666394";

function do_svg() {

    d3.csv("/HCI/template/data/data_vis.csv", function(d) {
        var user = d.id.split(".")[1];
        d.value = +d.value;
        create_list_user(user);
        if (d.value && user == user_research){
            return d;
        }

    }, function(error, classes) {
        if (error) throw error;

        var root = d3.hierarchy({children: classes})
            .sum(function(d) { return d.value; })
            .each(function(d) {
                if (id = d.data.id) {
                    var id, i = id.lastIndexOf(".");
                    d.id = id;
                    d.package = id.slice(0, i);
                    d.class = id.slice(i + 1);
                }
            });

        var node = svg.selectAll(".node")
            .data(pack(root).leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("circle")
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) {

                var linearScale = d3.scaleLinear().domain([0,100]).range([75,255]);
                var red_orange = d3.scaleLinear().domain([0, 100]).range(["#8d0a15", "#f46500"]);
                var orange_yellow = d3.scaleLinear().domain([0, 100]).range(["#f46500", "#ffce00"]);
                var yellow_blue = d3.scaleLinear().domain([0, 100]).range(["#ffce00", "#0093b7"]);
                var blue_green = d3.scaleLinear().domain([0, 100]).range(["#0093b7", "#4d7701"]);
                var new_elem = 0;
                if(d.value <= 200){
                    if(d.value < 100){
                        return "#8d0a15";
                    }else{
                        new_elem = d.value - 100;
                        return red_orange(new_elem)
                    }
                    //return "rgb("+linearScale(new_elem) + "," +linearScale(100-new_elem) +"," + 0 + ")";
                }else if(d.value > 200 && d.value <= 300){
                    new_elem = d.value - 200;
                    return orange_yellow(new_elem)
                    //return "rgb("+0 + "," +linearScale(new_elem) +"," + linearScale(100-new_elem) + ")";
                }else if(d.value > 300 && d.value <= 400){
                    new_elem = d.value - 300;
                    return yellow_blue(new_elem)
                    //return "rgb("+linearScale(new_elem) + "," +linearScale(new_elem) +"," + linearScale(100-new_elem) + ")";
                }else {
                    new_elem = parseInt(d.value / 100) * 100;
                    new_elem = d.value - new_elem;
                    return blue_green(new_elem)
                    //return "rgb("+linearScale(new_elem) + "," +linearScale(100-new_elem) +"," + linearScale(100-new_elem) + ")";
                }

            });

        node.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.id; });

        node.append("text")
            .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
            .selectAll("tspan")
            .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
            .enter().append("tspan")
            .attr("x", 0)
            .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
            .text(function(d) { return d; });

        node.append("title")
            .text(function(d) {
                var list_elem = d.id.split(".");
                return "Movie: " + list_elem[0] + "\n" + "User: " + list_elem[1] + "\n" +"Value: " + format(d.value) / 100.0; });

    });
}

function choose_user(){
    var usr = document.getElementById("choose_usr").value;

    if(usr != "" && usr!=null){
        d3.select("svg").remove();
        svg = d3.select("#svg_user").append("svg");
        svg.attr("class", "svg_first").attr("width", width).attr("height", height).attr("font-family", "sans-serif").attr("font-size", 10).attr("text-anchor","middle");
        svg.call(d3.zoom().on("zoom", function () { svg.attr("transform", d3.event.transform)}))
        user_research = usr;
        do_svg();
    }else{
        alert("No new User")
    }

}

var all_users = [];

function create_list_user(user){
    if (all_users.indexOf(user) < 0 && user != undefined) {
        all_users.push(user);
        var dl = document.getElementById("db_users");
        var option = document.createElement('option');
        option.value = user;
        dl.appendChild(option);
    }

}

do_svg();