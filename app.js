//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/9acb9fe6f3";
  const options = {
    method: "POST",
    auth: "luca1:3b8f93fd722d862a9eee5a9b7fb33ee4-us7"
  };
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();

app.post("/failure", function(req,res){
  res.redirect("/");
});

});
app.listen(process.env.PORT || 3000, function() {
  console.log("il server è avviato sulla porta 3000");
});
// api key 3b8f93fd722d862a9eee5a9b7fb33ee4-us7
// 9acb9fe6f3
