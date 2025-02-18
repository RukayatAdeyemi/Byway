
 mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to MongoDB");
    }).catch(error => {console.log("Error", error)});
    