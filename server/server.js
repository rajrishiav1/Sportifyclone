const express= require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require('lyrics-finder')
const SpotifyWebApi = require('spotify-web-api-node')


const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))




app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri:"http://localhost:3000",
        clientId:'a23c118333b94edead216deccb344945',
        clientSecret:'035bddecc1274ca29d95630ee7f8f65f',
        refreshToken,
  
    })
  
    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.json({
          accessToken: data.body.accesstoken,
          expiresIn: data.body.expiresin,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })


 app.post('/login',(req,res)=>{
    const code =req.body.code
    const spotifyApi= new SpotifyWebApi({
        redirectUri:"http://localhost:3000",
        clientId:'a23c118333b94edead216deccb344945',
        clientSecret:'035bddecc1274ca29d95630ee7f8f65f',
    })

    spotifyApi.authorizationCodeGrant(code).then(data =>{
        res.json({
            accessToken: data.body.access_token,
            refreshToke: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(err =>{
        res.sendStatus(400)
 })
 })

 app.get("/lyrics", async (req, res) => {
    const lyrics =
      (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
  })
 app.listen(3001)