const aws = require("aws-sdk");
const fs = require("fs");
const { unlink } = require("fs/promises");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets.json");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.uploader = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => {
            console.log("upload successfull");
            unlink(path);
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

// The following function deletes an object from AWS SDK
module.exports.delete = (picture) => {
    const params = {
        Bucket: "spicedling",
        Key: picture,
    };
    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
        /*
         data = {
         }
         */
    })
        .promise()
        .then(() => {
            console.log("the picture was succefully deleted from AWS SDK");
        });
};
