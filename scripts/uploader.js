const multer = require('multer'); 
// Set up storage specification for uploaded files 
const storageSpec = multer.diskStorage({ 
  // indicate location for uploaded files 
destination: (req, file, cb) => { 
cb(null, 'uploads/'); 
}, 
  // add the date+time to the filename of the uploaded file,  
  // so each uploaded file has a unique filename on the server 
filename: (req, file, cb) => { 
cb(null, Date.now() + '-' + file.originalname); 
} 
}); 
// Create the multer instance 
const upload = multer({ storage: storageSpec }); 
module.exports = upload; 
