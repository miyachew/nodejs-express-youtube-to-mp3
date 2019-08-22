const express = require("express")
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express()
app.use(cors())

app.listen(4000,()=>{
    console.log("started at port 4000")
})

app.get('/download', (req,res) => {
    let URL = req.query.URL;
    let id = URL;
    const outputFormat = 'mp3';

    let stream = ytdl(id, {
        quality: 'highestaudio',
    });
      
    ytdl.getInfo(URL, function(err, info){
        var videoName = info.title.replace(/[^a-zA-Z ]/g, "").toString('ascii');
        console.log(videoName);
        res.header('Content-Disposition', `attachment; filename="${videoName}.${outputFormat}"`);

        ffmpeg(stream)	           
            .format('mp3')	      
            .audioBitrate(160)	     
            .on('progress', (progress) => {	      })	 
            .on('error', function(err) {
                console.log('an error happened: ' + err.message);
            })
            .on('end', () => {	        
                console.log('download completed');
            })	  
            .pipe(res, {end: true})
    }); 
})