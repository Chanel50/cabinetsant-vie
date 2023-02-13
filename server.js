const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const server = express();
const ejs=require('ejs');
server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());
server.use(express.json());
var path= require('path');
const { error } = require('console');

server.use(express.static('public'));

// server.use('/stylesheet',express.static(__dirname + 'public/css'));
// server.use('/images',express.static(__dirname + 'public/images'));
server.set('view engine', 'ejs');

server.get("/",(req,res) => {
  res.status(200).render('page');
});
server.use(express.urlencoded({extended: false}))
server.get("/",(req,res) => {
  res.status(200).render('insert');
});





server.listen(5000, () => console.log('server running'));

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cabinet'
});
 connection.connect(error=>{if(error) throw error;     console.log('Connected to the database'); });
// Create a new record in appointments
server.post('/inersta', (req, res) => {
  let sql = 'INSERT INTO appointments SET ?';
  let data = {
    appo_id: req.body.appo_id,
    patient_id: req.body.patient_id,
    doc_id: req.body.doc_id,
    booked_date: req.body.booked_date,
    slot: req.body.slot,
    patient_desc: req.body.patient_desc,
    prescription: req.body.prescription
  };
  connection.query(sql, data, (err, result) => {
    if (err) throw err;
    res.json({"data":"Data inserted successfully"});
  });
});
server.get("/inersta",function(req,res){
  res.render("inersta");
})

  
  // Read all records from appointments
  server.get('/home', function(req, res) {
    let appointmentSQL = 'SELECT COUNT(*) FROM appointments ';
    let patientSQL = 'SELECT COUNT(*) FROM patient ';
    let slotSQL = 'SELECT COUNT(*) FROM slots';
    let feSQL = "SELECT COUNT(*) FROM patient WHERE gender = 'w'";
    let maSQL = "SELECT COUNT(*) FROM patient WHERE gender = 'm'";
    
    
    
    connection.query(appointmentSQL, (error, appointmentResults) => {
      if (error) {
        throw error;
      } 
      connection.query(patientSQL, (error, patientResults) => {
        if (error) {
          throw error;
        } 
        connection.query(slotSQL, (error, slotResults) => {
          if (error) {
            throw error;
          } 
          connection.query(feSQL, (error, feResults) => {
            if (error) {
              throw error;
            } 
            connection.query(maSQL, (error, maResults) => {
              if (error) {
                throw error;
              } 
        res.render('home', {appointmentResults, patientResults, slotResults,feResults,maResults});        
      });
    });
  }); 
});
    });
  });
  
 

    
  
  
  // Update a record in appointments
  server.post('/updatea', (req, res) => {
    let sql = 'UPDATE appointments SET  patient_id = ?, doc_id = ?, booked_date = ?, slot = ?, patient_desc = ?, prescription = ? WHERE appo_id = ?';
    let data = [
      
      req.body.patient_id,
      req.body.doc_id,
      req.body.booked_date,
      req.body.slot,
      req.body.patient_desc,
      req.body.prescription,
      req.body.appo_id
    ];
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      res.json({"message": "Appointment updated successfully"});
    });
  });
  
  server.get("/updatea", function(req, res) {
    res.render("updatea");
  });
  

  
  // Delete a record from appointments
  server.post('/deletea', (req, res) => {
    const appo_id = req.body.appo_id;
    let sql = `DELETE FROM appointments WHERE appo_id = ${connection.escape(appo_id)}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render('deletea', {appo_id: appo_id});
     });

  });
  server.get("/deletea", function(req,res){
    res.render("deletea");
  })
  
  

////////////////////////////////////////////

// Create a new record in doctor
server.post('/insert', (req, res) => {
  let sql = 'INSERT INTO doctors SET ?';
  let data = {
    doctor_id: req.body.doctor_id,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    field: req.body.field
  };
  connection.query(sql, data, (err, result) => {
    if (err) throw err;
    res.json({"data":"Doctor inserted successfully"});
  });
});

  
  // Read all records from doctor
  server.get('/home', function(req, res) {
    let sql = 'SELECT COUNT(*) AS doctorCount FROM doctor';
    connection.query(sql, (error, results) => {
      if (error) {
        throw error;
        res.render('home', {
          doctorCount: doctorResults.length
        });
      }
      res.json({ doctorCount: results[0].doctorCount });
    });
  });

  
  // Update a record in doctor
  server.post('/update', (req, res) => {
    let sql = 'UPDATE doctors SET name = ?, phone = ?, email = ?, field = ? WHERE doctor_id = ?';
    let data = [
      req.body.name,
      req.body.phone,
      req.body.email,
      req.body.field,
      req.body.doctor_id
    ];
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      res.json({"data": "Doctor information updated successfully"});
    });
  });

server.get("/update", function(req, res) {
    res.render("update");
});


  
  // Delete a record from doctor
  server.delete('/delete', (req, res) => {
    const doctor_id = req.params.id;
    let sql = `DELETE FROM doctor WHERE id = ${connection.escape(doctor_id)}`;
    connection.query(sql, (err, result) => {
      if (error) throw error;
      res.render('deleteDoctor', {doctor_id: doctor_id});
    });
  });
  
  server.get("/delete", function(req, res) {
    res.render("delete");
  });
  
  ///////////////////////////////////////////////////////////
  // Create a new record in patient
  server.post('/inerstp', (req, res) => {
    let sql = 'INSERT INTO patient SET ?';
    let data = {
      patient_id: req.body.patient_id,
      name: req.body.name,
      patient_age: req.body.patient_age,
      gender: req.body.gender,
      phone: req.body.phone,
      adress: req.body.adress,
      email: req.body.email,
      medical_history: req.body.medical_history
    };
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      res.json({"data":"Data inserted successfully"});
    });
  });

  server.get("/inerstp",function(req,res){
    res.render("inerstp");
  })
  
  // Read all records from patient
  server.get('/home', function(req, res) {
    let sql = 'SELECT COUNT(*) FROM patient ';
    
     connection.query(sql, (error, patientResults) => {
      if (error) {
       throw error;
      } 
       res.render('home', {patientResults});        
    });
   });
   
 
  
  
  
  
  // Update a record in patient
  server.post('/updatep', (req, res) => {
    let sql = 'UPDATE patient SET name=?, patient_age=?, gender=?, phone=?, adress=?, email=?, medical_history=? WHERE patient_id=?';
    let data = [
      req.body.name,
      req.body.patient_age,
      req.body.gender,
      req.body.phone,
      req.body.adress,
      req.body.email,
      req.body.medical_history,
      req.body.patient_id
    ];
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      res.json({"data":"Data updated successfully"});
    });
  });
  server.get("/updatep", function(req,res){res.render("updatep");});

  
  // Delete a record from patient
  server.post('/deletep', (req, res) => {
    const patient_id= req.body.patient_id;
    let sql = `DELETE FROM patient WHERE patient_id=${connection.escape(patient_id)}`;
    let data = [req.params.id];
    connection.query(sql, data, (error, result) => {
      if (error) throw error;
      res.render('deletep', {patient_id: patient_id});
    });
  });
  server.get("/deletep", function(req,res){res.render("deletep");});
///////////////////////////////////////////////////////////
// Create a new record in slots
server.post('/inersts', (req, res) => {
  let sql = 'INSERT INTO slots SET ?';
  let data = {
    slot_id: req.body.slot_id,
    slot_time: req.body.slot_time
  };
  connection.query(sql, data, (err, result) => {
    if (err) throw err;
    res.json({"data": "Data inserted successfully"});
  });
});

server.get("/inersts", function(req, res) {
  res.render("inersts");
});


  
  // Read all records from slots
  server.get('/home', (req, res) => {
    let sql = 'SELECT COUNT(*) AS slotCount FROM slots';
    connection.query(sql, (error, results) => {
      if (error) {
        throw error;
        res.render('home', {
          slotsCount: slotsResults.length
        });
      }
      res.json({ slotCount: results[0].slotCount });
    });
  });
  
  
  // Update a record in slots
  server.put('/updates', (req, res) => {
    let sql = 'UPDATE slots SET slot_id = ?, slot_time = ? WHERE id = ?';
    let data = {
      slot_id: req.body.slot_id,
      slot_time: req.body.slot_time
    };
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      res.json({"data":"Data updated successfully"});
    });
  });
  
  
  
  // Delete a record from slots
 server.delete('/deletes', (req, res) => {
  const slot_id = req.body.slot_id;
  let sql = `DELETE FROM slots WHERE slot_id = ?`;
  connection.query(sql, [slot_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send({ error: 'Failed to delete slot' });
    }
    res.status(200).send({ success: 'Successfully deleted slot' });
  });
});

server.get("/deletes", function(req, res) {
  res.render("deletes");
});
 


server.get('/patient', function(req, res) {
  let sql = 'SELECT * FROM patient';
  connection.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.render('patient', { patients: results });
  });
});
server.get("/patient", function(req, res) {
  res.render("patient");
});

server.get('/appointments', function(req, res) {
  let sql = 'SELECT * FROM appointment';
  connection.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.render('appointments', { appointment: results });
  });
});
server.get("/appointments", function(req, res) {
  res.render("appointments");
});
  

  

  ///////////////////////////////////////
//server.set("view engine","ejs");
// server.listen(3000);

//server.use(express.json())

// server.use(express.urlencoded({extended: false}))

//server.get("/",(req,res) => {
    //res.status(200).render('page');
//});
