const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(401).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author 
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  let filteredList = Object.values(books).filter((book) => book.author.includes(author));
  //Write your code here
  return res.send(filteredList);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let filteredList = Object.values(books).filter((book) => book.title.includes(title));
  //Write your code here
  return res.send(filteredList);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  //Write your code here
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
