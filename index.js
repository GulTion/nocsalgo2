const axios  = require('axios');
const btoa = require('btoa');
const fs = require('fs');
// const URL = "https://csalgo.dark1.workers.dev/0:/[AbdulBari]%20All%20In%20One%20%F0%9F%91%91/[Abdul%20Bari]%20%E2%9A%A1Mastering%20Java%20SE%20programming%20from%20Beginner%20to%20Master/"

const URL = process.argv[2]


const USERNAME = "GoaInquisition"
const PASS = "GoaInquisition"
const TOKEN = btoa(USERNAME+":"+PASS);
const LOC1 = "/content"

const NAME = decodeURI(URL.split("/")[URL.split('/').length-2])

const LOC = LOC1+"/"+NAME

// fs.appendFileSync('data.txt', `cd "${LOC}" mkdir "${NAME}"`)


const location = process.argv[3]

const { exec } = require("child_process");

const {log} = console


async function sh(cmd){
  await exec(cmd, (error, stdout, stderr) => {
   
    log(cmd)
});
}

async function Post(obj, callback){
  data = {q:"",password:null,page_token:obj.token,page_index:obj.index}
  headers={
    'Authorization': 'Basic '+TOKEN
  }
  await axios.post(obj.url, data,{headers:{...headers}}).then(e=>{
    const {nextPageToken, data} = e.data;
    if(nextPageToken!=null){
      Post({...obj, token:nextPageToken, index:obj.index+1, files:[...obj.files,...data.files]}, callback);
      
    }else{
     callback([...obj.files, ...data.files]);
    }
  }).catch(e=>{
    // log(e.response.status)
    callback([])
  })
}


function aPost(obj){
  Post(
  obj,e=>{
    for(let _ of e){
      if(_.mimeType=="application/vnd.google-apps.folder"){
          // fs.appendFileSync("data.txt",`cd "${LOC+'/'+_.name}" && mkdir "${_.name}"@@`)
          console.log("Folder: ",_.name)
          sh(`cd ${location} && mkdir '${_.name}'`)
        setTimeout(e=>{
          aPost({...obj,time:obj.time+2000, url:obj.url+encodeURI(_.name)+"/", parent:_.name})
        },obj.time)
        // aPost({...obj, url:obj.url+encodeURI(_.name)+"/", parent:_.name})
      }else{
        // fs.appendFileSync("data.txt",`cd "${LOC+'/'+_.name}" && wget ${obj.url+encodeURI(_.name)}@@`)
          sh(`cd ${location} && cd '${obj.parent}' && wget -nc ${obj.url+encodeURI(_.name)}`)
          log(obj.url+encodeURI(_.name))
      }
    }
  })
}


// aPost({
//   url:URL,
//   token:null,
//   index:0,
//   files:[]
//   })



aPost({
  url:URL,
  token:null,
  index:0,
  files:[],
  time:1000
  })

console.log(process.argv)

