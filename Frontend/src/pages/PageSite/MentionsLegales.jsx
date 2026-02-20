import React from 'react';
import { useTranslation } from "react-i18next";
import "./PageSite.scss";

const MentionsLegales = () => {
  const { t } = useTranslation();
    return (
        <div id='legal-page'>
          <h1>{t('TextInfo.info')}</h1> 
          <br />
        
<p>{t('TextInfo.p')}</p>
<br />
 <h4>1. {t('TextInfo.info')}:</h4>

<span  style={{whiteSpace:"nowrap"}}>{t('TextInfo.pI')} : <span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')}</span></span> <br/>
<span >{t('TextInfo.pS')}<span style={{fontWeight: 'bold'}}>{t('TextInfo.pS1')}</span></span> <br/>
<span>{t('TextInfo.pII')} <span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')}</span></span><br/>
<span>{t('TextInfo.pII1')}</span> <strong style={{fontWeight: 'bold'}}> contact@perfumealgarve.com </strong><br/>
<span>{t('TextInfo.pS2')} :<span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')}</span></span> <br/>
<span>{t('TextInfo.pIII')} <span style={{fontWeight: 'bold'}}>{t('TextInfo.pIII1')}</span></span><br/>
<p>{t('TextInfo.pr')}</p>
<p>{t('TextInfo.pr2')}</p>
<br />

<h4>2. {t('TextInfo.infoI')}:</h4>

<p> {t('TextInfo.prI')}: <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer">https://perfumealgarve.com </a> {t('TextInfo.prII')}</p>
<p>  {t('TextInfo.prIII')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com </a> {t('TextInfo.prIIII')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com</a> {t('TextInfo.prIIII1')} <span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')}.</span></p>

<br />

<h4>3. {t('TextInfo.infoII')}:</h4> 

 <p>{t('TextInfo.prIII')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer">https://perfumealgarve.com </a> {t('TextInfo.pIIIII')}</p>
 <p>{t('TextInfo.prIII')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer">https://perfumealgarve.com </a> {t('TextInfo.pT1')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer">https://perfumealgarve.com </a> {t('TextInfo.pT2') }.</p> 


  <br />
  <h4>4. {t('TextInfo.infoIII')}:</h4>
 <p> <span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')}</span> {t('TextInfo.pT3')}…</p>
 <p>{t('TextInfo.pT4')} <a href="https://perfumealgarve.com" target="_blank" rel="noreferrer">https://perfumealgarve.com</a>, {t('TextInfo.pT5')} <span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')}</span> {t('TextInfo.pTT5')}  <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com </a> {t('TextInfo.pT6')}.</p>
    <br />  

    
    <h4>5. {t('TextInfo.infoVII')}:</h4> 

   <p> {t('TextInfo.prIII')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com </a> {t('TextInfo.pT9')}


</p>

<br/>
    <h4>6. {t('TextInfo.infoVI')}:</h4>


<p>{t('TextInfo.pT7')}</p>
<p>{t('TextInfo.prIII')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com </a>,<span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')} </span>{t('TextInfo.pT10')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com</a>.{t('TextInfo.pT11')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com  </a> 
{t('TextInfo.pT12')} <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com </a> {t('TextInfo.pT13')} : <span style={{fontWeight: 'bold'}}>contact@perfumealgarve.com </span> {t('TextInfo.pTT14')}

 {t('TextInfo.pT14')}<a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com </a> {t('TextInfo.pT15')} <a href="https://perfumealgarve.com" target="_blank" rel="noreferrer"> https://perfumealgarve.com </a>{t('TextInfo.pT16')} <span style={{fontWeight: 'bold'}}> {t('TextInfo.nom')}</span>{t('TextInfo.pT17')}
 <a href="https://perfumealgarve.com" target="_blank" rel="noreferrer"> https://perfumealgarve.com </a>.
 {t('TextInfo.prIII')}   <a href="https://perfumealgarve.com " target="_blank" rel="noreferrer"> https://perfumealgarve.com </a> {t('TextInfo.pT18')} </p>    <br /> 

 <p>{t('TextInfo.pT19')}</p>


    <br /> 
    <br /> 
 </div>
    );
};

export default MentionsLegales;