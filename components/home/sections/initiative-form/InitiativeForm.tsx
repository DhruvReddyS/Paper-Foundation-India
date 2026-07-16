"use client";

import { ArrowLeft, ArrowRight, Check, FileEdit, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./InitiativeForm.module.css";

type FormData={name:string;organisation:string;designation:string;address:string;mobile:string;email:string;profession:string;paperAssociation:string;otherDetails:string};
const empty:FormData={name:"",organisation:"",designation:"",address:"",mobile:"",email:"",profession:"",paperAssociation:"",otherDetails:""};

export default function InitiativeForm(){
 const[form,setForm]=useState(empty);const[step,setStep]=useState(1);const[status,setStatus]=useState<"idle"|"sending"|"sent"|"error">("idle");
 function update(field:keyof FormData,value:string){setForm(current=>({...current,[field]:value}));}
 async function submit(event:FormEvent){event.preventDefault();setStatus("sending");try{const response=await fetch("/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,type:"Membership Application",subject:"Join Paper Foundation India",message:`Profession: ${form.profession}\nAssociation with paper: ${form.paperAssociation}\nOther details: ${form.otherDetails}`})});if(!response.ok)throw new Error("Submission failed");setStatus("sent");setForm(empty);}catch{setStatus("error");}}
 return <section className={styles.section} aria-labelledby="initiative-title">
  <div className={styles.copy}><p>Join our initiative</p><h2 id="initiative-title">Add your name<br/><em>to the next page.</em></h2><span>Become a member and support responsible paper use, myth-busting, public awareness and Indian-made paper—without a membership fee or financial commitment.</span><div className={styles.promise}><ShieldCheck/><div><strong>Membership application</strong><p>Digital version of the official Paper Foundation form.</p></div></div><blockquote>“Love paper, encourage its responsible use, fight greenwashing and build awareness about new applications of paper.”</blockquote></div>
  <form className={styles.form} onSubmit={submit}>
   <header><div><FileEdit/><span>Membership application</span></div><small>Step {step} / 2</small></header>
   <div className={styles.progress}><i className={styles.active}/><i className={step===2?styles.active:""}/></div>
   {status==="sent"?<div className={styles.success}><Check/><p>Application received</p><h3>Thank you for joining the movement.</h3><span>The Foundation can use the details you supplied to follow up about membership.</span><button type="button" onClick={()=>{setStatus("idle");setStep(1)}}>Submit another application</button></div>:<>
   {step===1?<div className={styles.fields}>
    <label><span>Full name *</span><input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your name"/></label>
    <label><span>Organisation name</span><input value={form.organisation} onChange={e=>update("organisation",e.target.value)} placeholder="Organisation"/></label>
    <label><span>Designation</span><input value={form.designation} onChange={e=>update("designation",e.target.value)} placeholder="Your role"/></label>
    <label><span>Profession *</span><input required value={form.profession} onChange={e=>update("profession",e.target.value)} placeholder="Your profession"/></label>
    <label className={styles.full}><span>Address *</span><textarea required rows={3} value={form.address} onChange={e=>update("address",e.target.value)} placeholder="Complete postal address"/></label>
   </div>:<div className={styles.fields}>
    <label><span>Mobile number *</span><input required type="tel" value={form.mobile} onChange={e=>update("mobile",e.target.value)} placeholder="Mobile number"/></label>
    <label><span>Email address *</span><input required type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com"/></label>
    <label className={styles.full}><span>Any association with paper?</span><textarea rows={3} value={form.paperAssociation} onChange={e=>update("paperAssociation",e.target.value)} placeholder="Industry, forestry, recycling, education, design or another connection"/></label>
    <label className={styles.full}><span>Any other details</span><textarea rows={3} value={form.otherDetails} onChange={e=>update("otherDetails",e.target.value)} placeholder="Anything else the Foundation should know"/></label>
   </div>}
   <footer>{step===1?<><span>Your information stays within this membership request.</span><button type="button" onClick={()=>setStep(2)}>Continue <ArrowRight/></button></>:<><button type="button" className={styles.back} onClick={()=>setStep(1)}><ArrowLeft/> Back</button><button disabled={status==="sending"} type="submit">{status==="sending"?"Submitting…":"Submit application"} <ArrowRight/></button></>}</footer>{status==="error"&&<p className={styles.error}>The application could not be sent. Please try again.</p>}</>}
  </form>
 </section>;
}
