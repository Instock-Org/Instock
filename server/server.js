var express = require('express');
var app = express();
const PORT = process.env.PORT || 8081;

app.use('/', require('./routes/api/stores'));
app.use('/', require('./routes/api/items'));
app.use('/', require('./routes/api/internal'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
