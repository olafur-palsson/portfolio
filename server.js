const PORT = process.env.PORT || 8080;
const DIST_FOLDER = `${__dirname}/dist`

const express = require('express'); 
const app = express();

app.use(express.static(DIST_FOLDER));
app.get(/.*/, (request, response) => {
    response.sendFile(`${DIST_FOLDER}/index.html`)
})
app.listen(PORT)