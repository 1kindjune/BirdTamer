var bodyParser = require('body-parser');
var express = require('express');
var expressHandlebars = require('express-handlebars')
		.create({defaultLayout: 'main'});
var session = require('express-session');

var app = express();

//options
var sessionOptions = {
  secret: 'secret cookie thang',
  resave: true,
  saveUninitialized: true
};

app.engine('handlebars', expressHandlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false})); //middleware to display req. body
app.use(session(sessionOptions));

//Prints in Console the log
app.use(function(req, res, next) { 
  console.log("");
  console.log(req.method, req.path);
  console.log('=====');
  console.log('req.body: ', req.body);
  next();
});

//app.use(res.render(){
//	console.
//});

//array of birds
var birds = [
	{name: 'Bald Eagle',		 num: 3},
	{name: 'Yellow Billed Duck', num: 7},	
	{name: 'Great Cormorant', 	 num: 4}
];

//Function returning filtered birds array above the minimum
function birdsLeft(minR){
	if(!minR){
		return birds;
	}
	var filtbird = birds.filter(function(x){return x.num >= minR;});
	return filtbird;
}

//--------------------------------------

//home
app.get('/', function(req, res){
    res.render('index');
});

//birds
app.get('/birds', function(req, res) {
    res.render('birds', {birdInfo: birdsLeft(req.session.minimumValueVariable)});
});

app.post('/birds', function(req, res){ //function to find if bird is there
	var find = false;
	var temp = req.body.name.toLowerCase();
	for (var x = 0; x < birds.length; x++){
		if (birds[x].name.toLowerCase() === temp){ //if same
			birds[x].num++;
			find = true;
			break;
		}
	}
	if (find !== true && req.body.name !== ""){ //add to the list, do not add empty fields
		birds.push({ name: req.body.name, num: 1 });
	}
	if(req.body.name !== ""){ //only continue as long as the fields are not empty
		res.render('birds', {birdInfo: birdsLeft(req.session.minimumValueVariable)});//301 default: Moved Permanently
	}
});


//settings
app.get('/settings', function(req, res){
	res.render('settings');
});

app.post('/settings', function (req, res){
	req.session.minimumValueVariable = req.body.minVal;
	if (req.session.minimumValueVariable === ""){ //empty fields
		//don't render anything
		console.log("req.session.minimumValueVariable: ", undefined);
	}
	else{ 
		res.render('birds', {birdInfo: birdsLeft(req.session.minimumValueVariable)});
		console.log("req.session.minimumValueVariable: ", req.session.minimumValueVariable);		
	}
});


app.listen(3000);
console.log('Started server on port 3000');