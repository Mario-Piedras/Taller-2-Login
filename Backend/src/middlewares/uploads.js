const multer = require('multer');

//Almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;