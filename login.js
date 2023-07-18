const mysql=require ("mysql2");
const express=require("express");
const session = require('express-session');
const bodyParser =require("body-parser");
const encoder = bodyParser.urlencoded();
const app=express();
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const formidable = require('formidable');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const secret = 'my secret';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false
}));
app.use(cookieParser());


// Set the view engine to EJS
app.set('view engine', 'ejs');





app.use(express.static("public"))

const connection=mysql.createConnection({
   host:"localhost",
   user:"root",
   password:"manager",
   database:"project",
   port:"3306"

});



//connect to the database

connection.connect(function(error){
    if(error) throw error
    else console.log("connected to the database successfully");

});
// user login

app.get("/",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html");

});

app.get("/userlogin.html",function(req,res){

      res.sendFile(__dirname + "/userlogin.html")
});
app.get("/aboutus.html",function(req,res){

  res.sendFile(__dirname + "/aboutus.html")
});


// user login
app.post("/userlogin.html",encoder,function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from newlogin where username =? and password =?",[username,password],function(error,results,fields){
        console.log("select * from newlogin where username ="+ username+ "");
        if(results.length > 0){
              const id =results[0].id
              const token =jwt.sign in({id},"jwt-secret-key",{expiresIn :'id'});
              res.cookie('token',token);
          res.redirect("/home");
        }else{

          res.redirect("/userlogin.html?error=1");
        }
        res.end();
        
        
    })
})
app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      
      
      res.send('/');
    }
  });
});
 // Set up the search route
// Set up the search route
app.get('/search', (request, response) => {
  const search = request.query.search;
  const search1 = request.query.search1;
  const searchBy = request.query.searchBy;
  console.log(searchBy);
  console.log(search);
  let sql = '';

  switch (searchBy) {
    case 'keyword':
      sql = `SELECT * FROM sculptureview WHERE keyword LIKE '%${search}%'`;
      break;
    case 'state':
      sql = `SELECT * FROM sculptureview WHERE keyword LIKE '%${search}%' AND state LIKE '%${search1}%'`;
      break;
    case 'name':
      sql = `SELECT * FROM sculptureview WHERE name LIKE '%${search}%'`;
      break;
    default:
      sql = `SELECT * FROM sculptureview WHERE keyword LIKE '%${search}%'`;
      break;
  }

  // execute query
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    //decode the image
    result.forEach((result)=> {
      result.image = Buffer.from(result.image, 'base64');
    });

    //render the search page
    response.render('search', { results: result });
  });
});
   
//when login  is success
app.get("/home",function(req,res){

    res.sendFile(__dirname + "/userhome.html")
});

app.get("/homewithlogindropdown",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html")
});
app.get("/imagegallery",function(req,res){

  res.sendFile(__dirname + "/imagegallery.html")
});
app.get("/contact-us.html",function(req,res){

  res.sendFile(__dirname + "/contact-us.html")
});
app.get("/imagepage.html",function(req,res){

  res.sendFile(__dirname + "/imagepage.html")
});



// regstration details
app.get("/register",function(req,res){

    res.sendFile(__dirname + "/Registration.html");
});

app.post("/register",encoder,function(req,res){
const { name,age,gender,phonenumber, emailid,username,password } = req.body;
  const sql = 'INSERT INTO newlogin (name,age,gender,phonenumber,emailid,username,password) VALUES (?,?, ?, ?,?,?,?)';
  
  const values = [name,age,gender,phonenumber, emailid, username,password];
  
  connection.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(`Message from ${name} (${emailid}) saved to database...`);
    res.redirect('/thankyou.html');
  });
 });
    // when sucess 
    app.get("/thankyou.html",function(req,res){

    res.sendFile(__dirname + "/thankyou.html")
});



// admin login
app.get("/adminlogin.html",function(req,res){

  res.sendFile(__dirname + "/adminlogin.html")
});


app.post("/adminlogin.html",encoder,function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from login where username =? and password =?",[username,password],function(error,results,fields){
        console.log("select * from login where username ="+ username+ "");

        if(results.length > 0){
            res.redirect("/adminhome");
        }else{
          res.redirect("/adminlogin.html?error=2");

        }
        res.end();
    })
})

//when login  is success
app.get("/adminhome",function(req,res){

    res.sendFile(__dirname + "/adminhome.html")
});

app.get("/homewithlogindropdown",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html")
});

app.get("/home.html",function(req,res){

    res.sendFile(__dirname + "/home.html")
});
app.get("/gettempleintemple.html",function(req,res){

  res.sendFile(__dirname + "/gettempleintemple.html")
});

app.get("/master.html",function(req,res){

  res.sendFile(__dirname + "/master.html")
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//master dropdown details


// get city details 
app.get("/getcity.html",function(req,res){

    res.sendFile(__dirname + "/getcity.html")
});

app.post("/getcity.html",encoder,function(req,res){
    const { cityid,cityname } = req.body;
      const sql = 'INSERT INTO city (cityid,cityname) VALUES (?,?)';
      
      const values = [cityid,cityname];
      
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        }
        console.log(`Message from ${cityname}  saved to database...`);
        res.redirect('/thankyou.html');
    });
});
     // when sucess  
    app.get("/thankyou.html",function(req,res){
    
        res.sendFile(__dirname + "/thankyou.html")
    });



//get temple details
app.get("/gettemple.html",function(req,res){

    res.sendFile(__dirname + "/gettemple.html")
});
app.post("/temple",encoder,function(req,res){
    const { templeid,name,address,stateid,city,pincode } = req.body;
      const sql = 'INSERT INTO temple (templeid,name,address,stateid,city,pincode) VALUES (?,?, ?, ?,?,?)';
      
      const values = [templeid,name,address,stateid,city,pincode];
      
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        }
        console.log(`Message from ${name} (${city}) saved to database...`);
        res.redirect('/thankyou.html');
      });
     });
      // when sucess
    app.get("/thankyou.html",function(req,res){
    
        res.sendFile(__dirname + "/thankyou.html")
    });


// get material details 
    app.get("/getmaterial.html",function(req,res){

        res.sendFile(__dirname + "/getmaterial.html")
    });
app.post("/material",encoder,function(req,res){
        const { materialid,materialname } = req.body;
          const sql = 'INSERT INTO material (materialid,materialname) VALUES (?,?)';
          
          const values = [materialid,materialname];
          
          connection.query(sql, values, (err, result) => {
            if (err) {
              throw err;
            }
            console.log(`Message from ${materialname}  saved to database...`);
            res.redirect('/thankyou.html');
        });
    });
         // when sucess  
        app.get("/thankyou.html",function(req,res){
        
            res.sendFile(__dirname + "/thankyou.html")
        });

    //gettemplelogin details
app.get("/gettemplelogin.html",function(req,res){

    res.sendFile(__dirname + "/gettemplelogin.html")
});
app.post("/Templelogin",encoder,function(req,res){
    const { templeid,templename,password } = req.body;
      const sql = 'INSERT INTO templelogin (templeid,templename,password) VALUES (?, ?, ?)';
      
      const values = [templeid,templename,password];
      
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        }
        console.log(`Message from ${templename}  saved to database...`);
        res.redirect('/thankyou.html');
      });
     });
      // when sucess
    app.get("/thankyou.html",function(req,res){
    
        res.sendFile(__dirname + "/thankyou.html")
    });

// get sculpture details 
        
   app.get("/getsculpture.html",function(req,res){

          // Select all items from the table
 connection.query('SELECT * FROM temple', function (error, results, fields) {
   if (error) throw error;

   // Check if any data was returned
   //console.log('Results:', results);

   // Generate the HTML code for the dropdown list
   let options = '';
   for (let i = 0; i < results.length; i++) {
     options += `<option value="${results[i].templeid}">${results[i].name}</option>`;
   }
   connection.query('SELECT * FROM material', function (error, results, fields) {
   if (error) throw error;
   
   let options1 ='';
   for (let j = 0; j < results.length; j++) {
     options1 += `<option value="${results[j].materialid}">${results[j].materialname}</option>`;
   }


   // Generate the complete HTML code for the form
   let html = `
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>add sculpture</title>
     <link rel="stylesheet" href="styles.css">
     <style>
       body {
           
           font-family: Arial, sans-serif;
           //background-color: #f0d1e5;
           margin: 0;
           padding: 0;
           background-image: url('images/getsculptureimage.jpeg');
           background-repeat: no-repeat;
             background-size: 100%;
         }
         
         h1 {
           text-align: center;
           margin-top: 50px;
         }
         
         form {
           max-width: 600px;
           margin: 0 auto;
           background-color: #eaf5fe;
           padding: 30px;
           border-radius: 5px;
           box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
         }
         
         label {
           display: block;
           margin-bottom: 5px;
           font-weight: bold;
         }
         
         input[type="number"],
         input[type="text"],
         textarea {
           width: 100%;
           padding: 10px;
           border: 1px solid #ccc;
           border-radius: 5px;
           margin-bottom: 15px;
         }
         
         textarea {
           height: 150px;
         }
          select {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 6px;
                margin-bottom: 18px;
  }
         
         button[type="submit"] {
           background-color: #4CAF50;
           color: white;
           padding: 10px 20px;
           border: none;
           border-radius: 5px;
           cursor: pointer;
         }
         button[type="reset"] {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
         
         button[type="submit"]:hover {
           background-color: #45a049;
         }
         button[type="reset"]:hover {
          background-color: #45a049;
        }
         
       
         </style>
   </head>
   <body>
     <h1>SCULPTURE</h1>
     <form  action="/getsculpture.html" method="post" enctype="multipart/form-data">
       <label for="SCULPTURE_ID">SCULPTURE ID:</label>
       <input type="number" id="sculptureid" name="sculptureid" required><br>
       
       <label for="sculpture name">SCULPTURE NAME:</label>
       <input type="text" id="sculpture name" name="sculpturename" required><br>
   
       <label for="TEMPLEID">TEMPLE ID:</label>
       <select id="templeid" name="templeid">
       ${options}
      </select>
   
   <label for="materialid">MATERIAL id:</label>
     <select id="materialid" name="materialid">
        ${options1}
      </select>
   
       <label for="IMAGE">IMAGE </label>
       <input type="file" id="image" name="image"  accept="image/*"  ><br>
   
      
       <label for="description">description:</label>
        <input type="text" id="description" name="description" required><br>

        <label for="keyword"> KEYWORD:</label>
        <input type="text" id="keyword" name="keyword" required><br>
        
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button type="submit">Submit</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button type="reset">RESET</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     </form>
   </body>
   </html>
   
   `;

   // Send the HTML code to the client
   res.send(html);
      });
    });
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage });

app.post("/getsculpture.html", upload.single('image'),(req,res)=>{

  const { sculptureid, sculpturename, templeid, materialid, description, keyword } = req.body;
  const image = req.file.buffer;

  if (!image) {
    // Handle error when file was not uploaded successfully
    res.status(400).send('No file uploaded');
    return;
  }
  // Read the contents of the uploaded image file into a Buffer object
  // const imageBuffer = fs.readFileSync(image.path);
    
      const sql ='INSERT INTO sculpture (sculptureid,sculpturename,templeid,materialid,image,description,keyword) VALUES (?,?, ?, ?,?,?,?)';
         
       connection.query(sql, [sculptureid,sculpturename,templeid,materialid,image,description,keyword], (err, result) => {
       if (err) {
         throw err;
        }
        console.log(`Message from ${sculptureid} (${sculpturename}) saved to database...`);
       res.redirect('/thankyou.html');
   });
});
         //when  success
       app.get("/thankyou.html",function(req,res){
       
           res.sendFile(__dirname + "/thankyou.html")
       });  
       
//////////////////////////////////////////////////////////////////////////////////////////////////////////////   
// REPORT GENERATION ROUTES 
   
   
   // PART 1 for templeview


            app.get("/templeview",function(req,res){

                connection.query('SELECT * FROM templeview', function (error, results, fields) {
                    if (error) throw error;
            
                    // Create an HTML table to display the results
                    let html = '<h1 style="text-align: center;">TEMPLE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';
                    
                    // Create the header row
                    html += '<tr style="background-color: #b5cef5; color: #333;">';
                    for (let i = 0; i < fields.length; i++) {
                        html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
                    }
                    html += '</tr>';
            
                    // Create a row for each result
                    for (let i = 0; i < results.length; i++) {
                        html += '<tr style="background-color: #fff; color: #333;">';
                        for (let j = 0; j < fields.length; j++) {
                            html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
                        }
                        html += '</tr>';
                    }
            
                    html += '</table>';
                    // // Add a button to print the table
                    html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh; width:200vh;">';
                    html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window-print()">Print</button>';
                    html += '</div>';

                    
                 
            
                    // Send the HTML code to the client
                    res.send(html);
                });
                // Create a new jsPDF instance
   
            });
            
//  PART *2 DROPDOWN report generation for temple view for particular state

app.get('/templestate', (req, res) => { 
    try { 
      // Your code here 
    } catch (err) { 
      if (res.headersSent) return; 
      // Your error handling code here 
      res.status(500).send('Internal server error'); 
    } 
connection.query('SELECT * FROM templeview', (error, results, fields) => {
  if (error) throw error;

  // Create an HTML table to display the results
  let html = '<h1 style="text-align: center;">TEMPLE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';

  // Create the header row
  html += '<tr style="background-color: #b5cef5; color: #333;">';
  for (let i = 0; i < fields.length; i++) {
    html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
  }
  html += '</tr>';

  // Create a row for each result
  for (let i = 0; i < results.length; i++) {
    html += '<tr style="background-color: #fff; color: #333;">';
    for (let j = 0; j < fields.length; j++) {
      if (fields[j].name === 'state') {
        // If the current field is "state", create a hyperlink to the next page
        const stateValue = results[i][fields[j].name];
        html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/templeview/${stateValue}">${stateValue}</a></td>`;
      } else {
        // If the current field is not "state", display the field value in the table cell
        html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
      }
    }
    
    html += '</tr>';
    
  }

  html += '</table>';
  // Add a button to print the table
  html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh; width:200vh;">';
  html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
  html += '</div>';
  
  // Send the HTML code to the client
  res.send(html);
});
});
   // Retrieve specific rows from the "templeview" table based on state value
   app.get('/templeview/:state', (req, res) => {
    const stateValue = req.params.state;
  
    connection.query(`SELECT * FROM templeview WHERE state = '${stateValue}'`, (error, results, fields) => {
      if (error) throw error;
  
      // Create an HTML table to display the results
      let html = `<h1 style="text-align: center;">TEMPLE DETAIL (${stateValue})</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">`;
  
      // Create the header row
      html += '<tr style="background-color: #b5cef5; color: #333;">';
      for (let i = 0; i < fields.length; i++) {
        html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
      }
      html += '</tr>';
  
      // Create a row for each result
      for (let i = 0; i < results.length; i++) {
        html += '<tr style="background-color: #fff; color: #333;">';
        for (let j = 0; j < fields.length; j++) {
          if (fields[j].name === 'state') {
            // If the current field is "state", create a hyperlink to the next page
            const stateValue = results[i][fields[j].name];
            html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/templeview/${stateValue}">${stateValue}</a></td>`;
          } else {
            // If the current field is not "state", display the field value in the table cell
            html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
          }
        }
        html += '</tr>';
          }
          
          html += '</table>';
          // Add a button to print the table
          html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh; width:200vh;">';
          html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
          html += '</div>';
      
          // Send the HTML code to the client
          res.send(html);
        });
      });

// part -3  display  for sculptureview        
            app.get('/sculptureview', (req, res) => { 
                try { 
                  // Your code here 
                } catch (err) { 
                  if (res.headersSent) return; 
                  // Your error handling code here 
                  res.status(500).send('Internal server error'); 
                } 
              
                // Retrieve all rows from the "city" table 
                connection.query('SELECT * FROM sculptureview ORDER BY sculptureid', function (error, results, fields) { 
                  if (error) throw error;
              
                  // Create an HTML table to display the results 
                  let html = '<h1 style="text-align: center;">SCULPTURE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">'; 
              
                  // Create the header row 
                  html += '<tr style="background-color: #b5cef5; color: #333;">'; 
                  for (let i = 0; i < fields.length; i++) { 
                      html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>'; 
                  } 
                  html += '</tr>'; 
              
                  // Loop through all the rows and create a row for each result 
                  for (let i = 0; i < results.length; i++) { 
                    html += '<tr style="background-color: #fff; color: #333;">'; 
                    for (let j = 0; j < fields.length; j++) { 
                      if (fields[j].name === 'image') {
                        // If the current field is "image", get the image data and convert it to base64
                        const imageData = results[i][fields[j].name]; 
                        const imageBase64 = Buffer.from(imageData).toString('base64');
                        // Display the image in the table cell
                        html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200" width="200"/></td>`;
                      } else {
                        // If the current field is not "image", display the field value in the table cell
                        html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>'; 
                      }
                    } 
                    html += '</tr>'; 
                  } 
              
                  html += '</table>'; 
                  // Add a button to print the table
                  html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh;">';
                  html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
                  html += '</div>';

                //    // Add a button to print the table
                // html += '<div style="display: flex; justify-content: center; align-items: center; margin-top: 20px;">';
                // html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
                // html += '</div>';
              
                  // Send the HTML code to the client 
                  res.send(html); 
                }); 
              });
 //part -4 state view for sculpture table 
 app.get('/sculpturestate', (req, res) => { 
    try { 
      // Your code here 
    } catch (err) { 
      if (res.headersSent) return; 
      // Your error handling code here 
      res.status(500).send('Internal server error'); 
    } 
  connection.query('SELECT * FROM sculptureview ORDER BY sculptureid', (error, results, fields) => {
        if (error) throw error;
  
        // Create an HTML table to display the results
        let html = '<h1 style="text-align: center;">SCULPTURE DETAILS</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';
        // Create the header row
        html += '<tr style="background-color: #b5cef5; color: #333;">';
        for (let i = 0; i < fields.length; i++) {
            html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
         }
        html += '</tr>';
        // Create a row for each result
        for (let i = 0; i < results.length; i++) {
            html += '<tr style="background-color: #fff; color: #333;">';
            for (let j = 0; j < fields.length; j++) {
               if (fields[j].name === 'image') {
                        // If the current field is "image", get the image data and convert it to base64
                        const imageData = results[i][fields[j].name]; 
                        const imageBase64 = Buffer.from(imageData).toString('base64');
                        // Display the image in the table cell
                        html += `<td style="padding: 12px; text-align: left; border: 4px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200" width="200"/></td>`;
                      } else if (fields[j].name === 'state') {
                    // If the current field is "state", create a hyperlink to the next page
                    const stateValue = results[i][fields[j].name];
                    html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/sculptureview/${stateValue}">${stateValue}</a></td>`;
                } else {
                    // If the current field is not "state", display the field value in the table cell
                 html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
                }
                   
            }
        }
       
    html += '</tr>';
    
    html += '</table>';
    // Add a button to print the table
    html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh; width:200vh;">';
    html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
    html += '</div>';
  
            // Send the HTML code to the client
            res.send(html);
        });
  });
  
// Retrieve specific rows from the "sculptureview" table based on state value
    app.get('/sculptureview/:state', (req, res) => {
      const stateValue = req.params.state;
    
      connection.query(`SELECT * FROM sculptureview WHERE state = '${stateValue}'`, (error, results, fields) => {
        if (error) throw error;
    
        // Create an HTML table to display the results
        let html = `<h1 style="text-align: center;">SCULPTURE  DETAIL (${stateValue})</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">`;
    
        // Create the header row
        html += '<tr style="background-color: #b5cef5; color: #333;">';
        for (let i = 0; i < fields.length; i++) {
          html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
        }
        html += '</tr>';
    
        // Create a row for each result
        for (let i = 0; i < results.length; i++) {
          html += '<tr style="background-color: #fff; color: #333;">';
          for (let j = 0; j < fields.length; j++) {
                if (fields[j].name==='image') {
                    // If the current field is "image", get the image data and convert it to base64
                    const imageData = results[i][fields[j].name]; 
                    const imageBase64 = Buffer.from(imageData).toString('base64');
                    // Display the image in the table cell
                     html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200px" width="200px"/></td>`;
                }  else if (fields[j].name === 'state') {
                    // If the current field is "state", create a hyperlink to the next page
                    const stateValue = results[i][fields[j].name];
                 html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/sculptureview/${stateValue}">${stateValue}</a></td>`;
                } else {
                // If the current field is not "state", display the field value in the table cell
             html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
            }
        }
          html += '</tr>';
            }
            
            html += '</table>';
            // Add a button to print the table
            html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh; width:200vh;">';
            html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
            html += '</div>';
        
            // Send the HTML code to the client
            res.send(html);
          });
        });

// part -5 final dropdown report generation for temple view for particular state

      app.get('/sculpturetemple', (req, res) => { 
    try { 
      // Your code here 
    } catch (err) { 
      if (res.headersSent) return; 
      // Your error handling code here 
      res.status(500).send('Internal server error'); 
    } 
  connection.query('SELECT * FROM sculptureview', (error, results, fields) => {
        if (error) throw error;
  
        // Create an HTML table to display the results
        let html = '<h1 style="text-align: center;">SCULPTURE DETAILS</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;font:bolder">';
        // Create the header row
        html += '<tr style="background-color: #b5cef5; color: #333;">';
        for (let i = 0; i < fields.length; i++) {
            html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
         }
        html += '</tr>';
        // Create a row for each result
        for (let i = 0; i < results.length; i++) {
            html += '<tr style="background-color: #fff; color: #333;">';
            for (let j = 0; j < fields.length; j++) {
                if (fields[j].name==='image') {
                    // If the current field is "image", get the image data and convert it to base64
                    const imageData = results[i][fields[j].name]; 
                    const imageBase64 = Buffer.from(imageData).toString('base64');
                    // Display the image in the table cell
                     html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200px" width="200px"/></td>`;
                } else if (fields[j].name === 'state') {
                    // If the current field is "state", create a hyperlink to the next page
                    const stateValue = results[i][fields[j].name];
                    html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/templeview/${stateValue}">${stateValue}</a></td>`;
                } else {
                    // If the current field is not "state", display the field value in the table cell
                 html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
                }
                   
            }
        }
       
    html += '</tr>';
    
    html += '</table>';
    // Add a button to print the table
    html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh; width:200vh;">';
    html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
    html += '</div>';
  
            // Send the HTML code to the client
            res.send(html);
        });
  });
  
      // Retrieve specific rows from the "templeview" table based on state value
      app.get('/sculpturestate/templeview', (req, res) => {
        connection.query('SELECT * FROM templeview', function (error, results, fields) {
                    if (error) throw error;
            
                    // Create an HTML table to display the results
                    let html = '<h1 style="text-align: center;">TEMPLE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';
            
                    // Create the header row
                    html += '<tr style="background-color: #b5cef5; color: #333;">';
                    for (let i = 0; i < fields.length; i++) {
                        html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
                    }
                    html += '</tr>';
            
                    // Create a row for each result
                    for (let i = 0; i < results.length; i++) {
                        html += '<tr style="background-color: #fff; color: #333;">';
                        for (let j = 0; j < fields.length; j++) {
                            html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
                        }
                        html += '</tr>';
                    }
            
                    html += '</table>';
                    // Add a button to print the table
                    html += '<div style="display: flex; justify-content: center; align-items: center; height: 30vh; width:200vh;">';
                    html += '<button style="padding: 16px; background-color: skyblue; color: black; border:none; border-radius: 10px; font-size: 20px; font-family:bold;" onclick="window.print()">Print</button>';
                    html += '</div>';
            
                    // Send the HTML code to the client
                    res.send(html);
                });
            });


// temple administrator 
//temple login

app.get("/templelogin.html",function(req,res){

  res.sendFile(__dirname + "/templelogin.html")
});

app.post("/templelogin.html",encoder,function(req,res){
  const templeid = req.body.templeid;
  const password = req.body.password;

  // execute MySQL query to validate user credentials
  const sql = `SELECT * FROM templelogin WHERE templeid = ${templeid} AND password = '${password}'`;
  console.log("")
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error validating user credentials');
    } else {
      if (results.length > 0) {
        // user found with the given credentials
        const user = results[0];
        res.cookie('templeid', user.templeid);
        res.redirect('/templehome');
      } else {
        // no user found with the given credentials
        res.redirect("/templelogin.html?error=3");
      }
    }
  });
});
//when login  is success
app.get("/templehome",function(req,res){

    res.sendFile(__dirname + "/templehome.html")
});

app.get("/homewithlogindropdown.html",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html")
});


/*app.get("/getsculptureintemple",function(req,res){

  res.sendFile(__dirname + "/getsculptureintemple.html")
 });*/

// temple sculpture page

app.get('/getsculptureintemple', (req, res) => {
  const templeid = req.cookies.templeid;
 
  if (!templeid) {
    res.redirect('/');
    return;
  }

  res.render('getsculptureintemple', { templeid: templeid });
});


app.post('/getsculptureintemple',upload.single('image1'),(req, res) => {
  const { sculptureid, sculpturename, materialid, description, keyword } = req.body;
  const image1 = req.file.buffer;
  const imageData = Buffer.from(image1).toString('hex');
  // const sculptureid = req.body.sculptureid;
  // const sculpturename = req.body.sculpturename;
  const templeid = req.cookies.templeid;
  // const materialid = req.body.materialid;
  // const image = req.file.image;
  // const description = req.body.description;
  // const keyword = req.body.keyword;

  if (!image1) {
    // Handle error when file was not uploaded successfully
    res.status(400).send('No file uploaded');
    return;
  }
  // doSomethingElseWithBuffer(image);
  // execute MySQL query to insert sculpture details
  const sql = `INSERT INTO sculpture (sculptureid, sculpturename, templeid, materialid,image, description, keyword) 
               VALUES (${sculptureid}, '${sculpturename}', ${templeid}, ${materialid}, UNHEX('${imageData}'),'${description}', '${keyword}')`;
  connection.query(sql,  (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error adding sculpture details');
    } else {
      res.redirect('/thankyou.html');
    }
  });
});

//set app port

app.listen(3000);

