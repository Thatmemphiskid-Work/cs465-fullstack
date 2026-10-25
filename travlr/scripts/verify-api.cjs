const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const requireApp = createRequire(require('node:path').join(__dirname, '../app.js'));
const base = process.env.API_BASE_URL || 'http://localhost:3000';
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD for an existing staff account.');
  process.exit(1);
}
requireApp('dotenv').config({quiet:true});
const jwt=requireApp('jsonwebtoken');
const User=requireApp('./app_api/models/user');
const fs=require('node:fs');
const results=[];
async function req(path,method='GET',body,token){
 const headers={};if(body)headers['Content-Type']='application/json';if(token)headers.Authorization=token;
 const r=await fetch(base+path,{method,headers,body:body?JSON.stringify(body):undefined,redirect:'manual'});
 const text=await r.text();let data;try{data=JSON.parse(text)}catch{data=text}return{status:r.status,data};
}
function ok(name,condition){assert.ok(condition,name);results.push(name);console.log('PASS '+name)}
(async()=>{
 let r=await req('/');ok('Customer home renders Travlr branding through Express',r.status===200&&r.data.includes('Travlr Getaways')&&r.data.includes('View available trips'));
 r=await req('/travel');ok('Travel renders trip data and navigation',r.status===200&&r.data.includes('Gale Reef')&&r.data.includes('id="header"')&&r.data.includes('per person'));
 r=await req('/travel.html');ok('Legacy static Travel URL redirects to dynamic catalog',r.status===302);
 r=await req('/api/trips');ok('Trip collection returns JSON from MongoDB',r.status===200&&Array.isArray(r.data)&&r.data.length>=3);
 r=await req('/api/trips/ABSENT_RJ_FINAL');ok('Unknown trip returns 404',r.status===404);
 r=await req('/api/login','POST',{});ok('Missing login fields return 400',r.status===400);
 r=await req('/api/login','POST',{email:process.env.ADMIN_EMAIL,password:'incorrect-rubric-password'});ok('Invalid password returns 401',r.status===401);
 for(const [path,method] of [['/api/trips','POST'],['/api/trips/RJFINAL1025','PUT'],['/api/register','POST']]){
  r=await req(path,method,{});ok(`${method} ${path} rejects unauthenticated access`,r.status===401);
 }
 r=await req('/api/trips','POST',{},'Bearer invalid');ok('Forged JWT is rejected',r.status===401);
 const expired=jwt.sign({_id:'test',exp:Math.floor(Date.now()/1000)-5},process.env.JWT_SECRET);
 r=await req('/api/trips','POST',{},'Bearer '+expired);ok('Expired JWT is rejected',r.status===401);
 r=await req('/api/login','POST',{email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD});ok('Existing staff account signs in successfully',r.status===200&&!!r.data.token);const token='Bearer '+r.data.token;
 r=await req('/api/register','POST',{},token);ok('Authenticated registration still validates required fields',r.status===400);
 r=await req('/api/trips','POST',{},token);ok('Authenticated create rejects missing trip fields',r.status===400);
 const code='RJFINAL1025';const trip={code,name:'Randall Coastal Discovery',length:'5 nights / 6 days',start:'2027-03-10',resort:'Coral Discovery Resort',perPerson:'1499.00',image:'reef2.jpg',description:'A coastal getaway with guided snorkeling and island excursions.'};
 r=await req('/api/trips/'+code);
 if(r.status===404){r=await req('/api/trips','POST',trip,token);ok('Authenticated POST persists a unique dated tour',r.status===201&&r.data.code===code)}
 else{ok('Existing verification tour is available',r.status===200)}
 trip.perPerson='1399.00';trip.description='Updated coastal getaway including a guided reef excursion.';
 r=await req('/api/trips/'+code,'PUT',trip,token);ok('Authenticated PUT returns updated data',r.status===201&&r.data.perPerson==='1399.00');
 r=await req('/api/trips/'+code);ok('Independent GET verifies updated database values',r.status===200&&r.data.description===trip.description&&r.data.perPerson==='1399.00'&&r.data.start.startsWith('2027-03-10'));
 r=await req('/travel');ok('Public HBS view reflects the newly persisted tour',r.status===200&&r.data.includes(trip.name)&&r.data.includes('1399.00'));
 const modern=new User({name:'Test',email:'test@example.invalid'});modern.setPassword('temporary-password');ok('New password hashing uses 210000 iterations and validates correctly',modern.hashIterations===210000&&modern.validPassword('temporary-password')&&!modern.validPassword('wrong'));
 const crypto=require('node:crypto');const legacy=new User({name:'Legacy',email:'legacy@example.invalid',salt:'legacy-salt'});legacy.hash=crypto.pbkdf2Sync('legacy-password',legacy.salt,1000,64,'sha512').toString('hex');ok('Legacy password hashes remain compatible',legacy.validPassword('legacy-password'));
 if (process.env.TEST_RESULTS_PATH) fs.writeFileSync(process.env.TEST_RESULTS_PATH, JSON.stringify({passed:results.length,results},null,2));console.log(results.length+' checks passed');
})().catch(e=>{console.error(e.message);process.exitCode=1});
