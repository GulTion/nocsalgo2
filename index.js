const axios  = require('axios');
const btoa = require('btoa');
const fs = require('fs');
// const URL = "https://csalgo.dark1.workers.dev/0:/[AbdulBari]%20All%20In%20One%20%F0%9F%91%91/[Abdul%20Bari]%20%E2%9A%A1Mastering%20Java%20SE%20programming%20from%20Beginner%20to%20Master/"

const URL = process.argv[2]


const USERNAME = process.argv[4]
const PASS = USERNAME
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
    log(`retry: ${obj.retry+1}`)
    Post({...obj, retry:obj.retry+1}, callback)
  })
}


function aPost(obj){
  Post(
  obj,e=>{
    for(let _ of e){
      if(_.mimeType=="application/vnd.google-apps.folder"){
          sh(`cd ${location} && mkdir '${_.name}'`)
  
          aPost({...obj,url:obj.url+encodeURI(_.name)+"/", parent:_.name})

      }else{

          sh(`cd ${location} && cd '${obj.parent}' && wget --retry-on-http-error=500 -nc ${obj.url+encodeURI(_.name)}`)
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
  time:1000,
  retry:0
  })

console.log(process.argv)

