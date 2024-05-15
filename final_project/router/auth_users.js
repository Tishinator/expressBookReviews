const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("ADDING REVIEW...")
  const user = req.session.authorization.username;
  console.log(user)
  const isbn = req.params.isbn;
  const review = req.query.review;

  // get the reviews for the isbn
  books[isbn].reviews[user] = review;
  
  //Write your code here
  return res.status(200).json({message: `${user} said ${review}`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  delete books[isbn].reviews[user];
  return res.status(200).json({message: `${user} deleted their review. Their review is now: ${books[isbn].reviews[user]}`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
// module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
