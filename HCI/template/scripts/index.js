var recommender = new jsrecommender.Recommender();
var table = new jsrecommender.Table();
var new_user = "";

d3.csv("/HCI/template/data/useful_data1.csv", function(error, data) {
    console.log(data[0]);


    var i; // ok pour 200
    for (i = 0; i < 10; i++) {
        table.setCell(data[i].movie, data[i].user_id, data[i].rating);
    }
    console.log("OK")

    recommend();

});

function recommend(){
    var model = recommender.fit(table);
    console.log(model);

    predicted_table = recommender.transform(table);
    console.log(predicted_table);

    create_options_user();
    create_options_movie();
    create_options_rating();
}

function show_recommendation() {
    var variable = document.getElementById("btn_field");
    var rec =  document.getElementById("recommender");
    var in_ = false;

    if(variable != "" || variable === undefined || variable === null) {
        for (var i = 0; i < predicted_table.columnNames.length; ++i) {
            var user = predicted_table.columnNames[i];
            if(user == variable.value) {
                in_ = true
                rec.innerHTML = 'For user: ' + user + "<br>";
                for (var j = 0; j < predicted_table.rowNames.length; ++j) {
                    var movie = predicted_table.rowNames[j];
                    //console.log('Movie [' + movie + '] has actual rating of ' + Math.round(table.getCell(movie, user)));
                    rec.innerHTML += 'Movie [' + movie + '] is predicted to have rating ' + Math.round(predicted_table.getCell(movie, user)) + "<br>";
                }
            }
        }

    }
    if(!in_){
        rec.innerHTML = '';
        alert("Missing User_ID oder User_ID is Wrong");
    }
}


function displayNextImage() {
    x = (x === images.length - 1) ? 0 : x + 1;
    document.getElementById("img").src = images[x];
}

function displayPreviousImage() {
    x = (x <= 0) ? images.length - 1 : x - 1;
    document.getElementById("img").src = images[x];
}

function startTimer() {
    setInterval(displayNextImage, 10000);
}

var images = [], x = -1;
images[0] = "/HCI/template/data/mf1.jpg";
images[1] = "/HCI/template/data/mf2.png";





function create_new_user(){
    var variable = document.getElementById("new_usr").value;
    var user_exist = false;

    for(var i = 0; i < predicted_table.columnNames.length; i++){
        var user = predicted_table.columnNames[i];
        if(variable == user){
            user_exist = true;
        }
    }
    if(!user_exist && variable != "" && variable!=null){
        new_user = variable;
        console.log(new_user);
    }
    create_options_user();
}

function create_new_rating(){
    var movie = document.getElementById("add_movie").value;
    var rate = document.getElementById("rate").value;

    if(movie != "" && movie!=null&& rate != "" && rate!=null && new_user != "" && new_user != null){
        if(rate < 0){
            rate = 0;
        }else if(rate > 5){
            rate = 5;
        }else{
            Math.round(rate);
        }
        table.setCell(movie, new_user, rate);
        console.log("Rating added");
    }else{
        alert("No new User")
    }

}

function create_options_user(){
    var options = '';
    for(var i = 0; i < predicted_table.columnNames.length; i++){
        var user = predicted_table.columnNames[i];
        options += '<option value="'+user+'" />';
    }
    document.getElementById('db_user_id').innerHTML = options;

}
function create_options_movie(){
    var options = '';
    for(var i = 0; i < predicted_table.rowNames.length; i++){
        var movie = predicted_table.rowNames[i];
        options += '<option value="'+movie+'" />';
    }
    document.getElementById('db_movie_id').innerHTML = options;

}
function create_options_rating(){
    var options = '';
    for(var i = 0; i < 6; i++){
        options += '<option value="'+i+'" />';
    }
    document.getElementById('db_rating').innerHTML = options;

}



d3.csv("/HCI/template/data/out.csv", function(error, data) {
    if (error) throw error;

    var sortAscending = true;
    var table = d3.select('#matrix').append('table').attr('class',"table table-hover table-stripped");
    var titles = d3.keys(data[0]);
    var headers = table.append('thead').append('tr')
        .selectAll('th')
        .data(titles).enter()
        .append('th')
        .text(function (d) {
            return d;
        })

    var rows = table.append('tbody').selectAll('tr')
        .data(data).enter()
        .append('tr');
    rows.selectAll('td')
        .data(function (d) {
            return titles.map(function (k) {
                return { 'value': d[k], 'name': k};
            });
        }).enter()
        .append('td')
        .attr('data-th', function (d) {
            return d.name;
        })
        .text(function (d) {
            return d.value;
        });
});