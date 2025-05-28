const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose');
const HttpError = require('./models/http-error')
const fs = require('fs/promises')
const memberRoutes = require('./routes/member-routes')
const organizationRoutes = require('./routes/organization-routes')
const cors = require('cors')


const port = process.env.PORT || 5000
const app = express()

app.use(cors());
app.use(bodyParser.json())


app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next();
});


app.use('/api/member',memberRoutes)
app.use('/api/organization',organizationRoutes)


app.use((req, res, next)=>{
    const error = new HttpError("Could not find this route.",404);
    throw error;
    });

app.use((error, req, res, next)=>{
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
            console.log(err);
            
        });
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message:error.message || "An unknown error occured"});
})

mongoose.connect("mongodb+srv://arjunbiju322:N0fz9tM39vjsM3L7@cluster0.gey9y.mongodb.net/medlem?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    app.listen(port);
}).catch(err=>{
    console.log(err);
});