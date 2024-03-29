const express = require('express')
const session = require('express-session')
const app = express()
const path = require('path')
const pug = require('pug');


app.set("view engine", "pug");
app.use(express.static("View"));
app.use(express.urlencoded({extended: true}));
app.use(express.static("Public"));


app.use(session({ secret: 'some secret here'}))
app.use(express.json());
let basic_path = path.join('C:', 'Users', 'admin', 'Desktop', 'ECE1779PJ')

//临时的数据
const images = ["example.png", "example.png"]
const {response} = require("express");


app.get('/', home);
app.get("/login", login_get);
app.get("/register", register);
app.get("/user/:userid", auth, user_get);
app.get("/admin", auth, admin_get);
// app.get("/people/:eamil", auth, user_page)
app.get("/product/:projectid", auth, product_get);

app.post("/logout", logout);
app.post("/login", login);
// app.post("/register", register_post)z

function user_page(req,res, next){
	const email = req.params.email;
	const user_request = fetch('https://3txduis0cl.execute-api.us-east-1.amazonaws.com/getUser/'+email,{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	})

	Promise.all([user_request])
	.then(([person]) => {
		console.log(person)
		res.status(200).send(pug.renderFile("./View/person.pug", {user:req.session.user, person:person.user}));
	})
	.catch(error => {
		console.error(error);
	});
}
function admin_get(req,res,next){
	const all_user_request=fetch("https://3txduis0cl.execute-api.us-east-1.amazonaws.com/getAllUsers", {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	})

	const all_order_request = fetch("https://19sa6lvwk2.execute-api.us-east-1.amazonaws.com/getAllOrder",{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	})

	const all_products_request = fetch("https://ai43qb7kp9.execute-api.us-east-1.amazonaws.com/getAllProducts",{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	})

	Promise.all([all_user_request,all_products_request, all_order_request])
	.then(([users, products, orders]) => {
		res.status(200).send(pug.renderFile("./View/admin.pug", {user:req.session.user, users:users, orders:orders, products:products}))
	})
	.catch(error => {
		console.error(error);
	});


}
function logout(req, res, next){
    req.session.loggedin=false;
    req.session.user=null;
    res.status(200).redirect("/");
}

function product_get(req, res, next){
	const project_id = req.params.projectid;
	const product_request = fetch("https://ai43qb7kp9.execute-api.us-east-1.amazonaws.com/getProduct/"+project_id,{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	})

	Promise.all([product_request])
	.then(([project]) => {
		res.status(200).send(pug.renderFile("./View/product.pug", {user:req.session.user, product: project}));
	})
	.catch(error => {
		console.error(error);
	});


}
function auth(req,res,next){
	if(!req.session.loggedin){
       return res.redirect("/login");
    }
    next();
}
function user_get(req,res,next){
	const  user_id = req.params.userid
	fetch("https://19sa6lvwk2.execute-api.us-east-1.amazonaws.com/getUserOrder/"+user_id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	}).then(data => {
		// console.log(data)
		res.status(200).send(pug.renderFile("./View/user.pug",{user:req.session.user, order:data}))
	}).catch(error=>{
		console.error('There was a problem with the fetch operation:', error);
	})

}

function login_get(req, res, next){
	// console.log(req.session.loggedin)
	if (req.session.loggedin){
		return res.redirect('/user/'+req.session.user.UserId);
	}else{
		return res.sendFile( path.join(basic_path, 'Public','login.html'));
	}
}
function getRandomImages(data, count) {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Get 5 random images
function home(req, res, next){
	// const randomImages = getRandomImages(products, 5);
	// let images = [];
	// randomImages.forEach(item => {
	// 	// Add the item's image URL to the pics list
	// 	images.push(item.ImageURL);
	// });
	// res.status(200).send(pug.renderFile("./View/Home.pug",{user:req.session.user, images:images, products: products}))
	const all_products_request = fetch("https://ai43qb7kp9.execute-api.us-east-1.amazonaws.com/getAllProducts",{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	})

	Promise.all([all_products_request])
	  .then(([products]) => {
		// console.log(users, orders);
		res.status(200).send(pug.renderFile("./View/Home.pug",{user:req.session.user, products: products.products}))
	  })
	  .catch(error => {
		console.error(error);
	  });
}



function register(req, res, next){
	 res.sendFile( path.join(basic_path, 'Public','register.html'));
}

function login(req, res, next){
    const user = req.body;
    if (user) {
		req.session.loggedin=true;
		req.session.user = user;
		console.log(req.session.user)
        // Login successful
        res.json({ user:user, message: "Login successful"});
    }else{
		req.session.loggedin=false;
	}
}

// function register_post(req, res, next){
// 	const {FirstName,SecondName, Email, Address, adminValue} = req.body;
// 	console.log({FirstName,SecondName, Email, Address, adminValue})
// }

// function logout(req, res, next){
// 	if(req.session.loggedin){
// 		req.session.loggedin = false;
//     req.session.username = undefined;
// 		res.status(200).send("Logged out.");
// 	}else{
// 		res.status(200).send("You cannot log out because you aren't logged in.");
// 	}
// }

function get_order(req,res, next){
	fetch("https://19sa6lvwk2.execute-api.us-east-1.amazonaws.com/getUserOrder/"+req.session.user.UserId, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add any other headers you need here
		}
	}).then(response=>{
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
			return response.json();
	}).then(data => {
		console.log(data)
		req.session.order = data
	}).catch(error=>{
		console.error('There was a problem with the fetch operation:', error);
	})

}

app.listen(3000);
console.log("Server listening on port http://localhost:3000");


