const express = require('express');
const PORT = process.env.PORT || 2000;
const dbConnection = require('./db-connection.js')
var db = dbConnection();
var aws = require('aws-sdk')
var config = require('./config')
const uuid = require('uuid')

const app = express();
app.use(express.json());

var s3 = new aws.S3();

s3.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
})


function getSignedURL(req,res,nex) {
    var params = {
        Bucket: 'todobucketname',
        Key: uuid.v4(),
        Expires: 1000,
        ContentType: 'image/jpeg'
    }
    s3.getSignedUrl('putObject', params, function(err, signedURL) {
        if(err){
            console.log(err)
            return  next(err)
        } else {
            var data = ({
                postURL: signedURL,
                getURL: signedURL.split("?")[0]
            })
            console.log(data)
            req.data = data;
            next ()
        }
    })
}

app.get('/get-signed-url', (req,res) => {
    var params = {
        Bucket: 'todobucketname',
        Key: uuid.v4(),
        Expires: 1000,
        ContentType: 'image/jpeg'
    }
    s3.getSignedUrl('putObject', params, function(err, signedURL) {
        if(err){
            console.log(err)
            return  res.json(err)
        } else {
            var data = ({
                postURL: signedURL,
                getURL: signedURL.split("?")[0]
            })
            return res.json(data)
        }
    })
})











app.post('/bucket', (req, res) => {
    console.log(db.bucket)
    db.bucket.findOrCreate({
        where: {filelink: req.body.link}
    })
        .then((exists, created) => {
            console.log('inserted successfully!')
            res.json('inserted successfully!')
        })
        .catch(err => {
            console.log(err)
        })
})


app.post('/item', (req, res) => {
    db.Items.create({
        id: req.body.id,
        name: req.body.name,
        description: req.body.desc,
        qty: req.body.qty
    })
        .then((data) => {
            console.log('data inserted successfull!', data)
            res.json({
                message: "data inserted successfully!",
                data: data,
                status: 200
            })
        })
        .catch(err => {
            console.log(err)
        })
})

app.get('/bucket', (req, res) => {
    db.bucket.findAll({ raw: true })
        .then((data) => {
            console.log(data)
            res.json(data)
        })
        .catch(err => {
            console.log(err)
        })
})

app.get('/data/:id', (req, res) => {
    db.bucket.findAll({
        raw: true,
        include: [{
            where: { id: req.params.id },
            model: db.Items
        }]
    })
        .then((data) => {
            console.log(data)
            res.json(data)
        })
        .catch(err => {
            console.log(err)
        })
})


app.put('/bucket/:id', (req, res) => {
    db.bucket.update(
        { filelink: req.body.link },
        { where: { id: req.params.id } }
    )
        .then(data => {
            console.log('updated successfully!')
            res.json(data)
        })
        .catch(err => {
            console.log(err)
        })
})


app.delete('/bucket/:id', (req, res) => {
    db.bucket.destroy({ where: { id: req.params.id } })
        .then(() => {
            console.log('deleted successfully!')
            return res.json('deleted successfully!')
        })
        .catch(err => {
            console.log(err)
        })
})



app.listen(PORT, () => {
    console.log("Your server is listening PORT ", PORT, "thanking you!")
})