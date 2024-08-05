import multer from "multer";
import path from "path";


const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 3e7}, //30MB

});

export default upload;