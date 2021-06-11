const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Santu123:Santu@123@employeedb.icaja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true,useUnifiedTopology: true ,useCreateIndex: true}, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

//require('./employee.model');