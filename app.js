const express = require('express')
const app     = express()
const cors    = require('cors')
const auth    = require('./routes/auth');
const person    = require('./routes/person');

const port = 3200

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use('/auth', auth);
app.use('/person', person);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})