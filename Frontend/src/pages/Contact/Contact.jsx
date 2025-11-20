import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { IoMail } from "react-icons/io5";
import { FaPhoneFlip  } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import SocialMedia from '../socialMedia/socialMedia';
import style from 'styled-components';


const Contact = () => {
  const lang = localStorage.getItem("i18nextLang");
  const { t } = useTranslation();
  const formRef = useRef();


  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    user_email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    last_name: "",
    first_name: "",
    user_email: "",
    message: "",
  });

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const msgRegex = /^[a-zA-Z ]+$/;

    let isValid = true;
    const newErrors = {last_name: "", first_name: "", user_email: "", message: "" };

    if (!nameRegex.test(formData.last_name)) {
      newErrors.last_name = t("errors.last_name");
      isValid = false;
    }
    if (!nameRegex.test(formData.first_name)) {
      newErrors.first_name =  t("errors.first_name");
      isValid = false;
    }
    if (!emailRegex.test(formData.user_email)) {
      newErrors.user_email = t("errors.user_email");
      isValid = false;
    }
    if (!msgRegex.test(formData.message)){
      newErrors.message = t("errors.message");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      emailjs
        .sendForm("service_qb61wt1", "template_uvl35a8", formRef.current, "fDUMt5JDlc0iHfBWb")
        .then(
          (result) => {
            alert(`${formData.first_name} ${t("email_envoyer")}`);
            console.log(result.text);
            setFormData({ last_name: "", first_name: "", user_email: "", message: "" });
          },
          (error) => {
            console.log(error.text);
          }
        );
    } else {
      alert(t('contact.alert'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <section id={t("contact_id")} className="contact" itemScope itemType="http://schema.org/Person" >
      <h2 className="titlePortfolio">{t("contact_title")}</h2>

      <div style={{  flexDirection: lang === "ar" ? "row" : "row-reverse" }}
        className=" contact-wrapper">

        <form 
         ref={formRef}             
          onSubmit={handleSubmit}
          className="form-horizontal">
          <label htmlFor="last_name" >{t("lastName")}</label>
          <input 
           style={{borderColor: errors.last_name ? "red" : "initial"}}
            type="text"
            name="last_name"
            value={formData.last_name}
          onChange={handleChange}
            className="form-control"
            placeholder={t("lastName")}
            id="last_name"
            required />        
          <div className="error">{errors.last_name}</div>  

          <label htmlFor="first_name">{t("firstName")}</label>
          <input style={{borderColor: errors.first_name ? "red" : "initial"}}
            type="text"
            name="first_name"
            value={formData.first_name}
         onChange={handleChange}
            className="form-control"
            placeholder={t("firstName")} id="first_name" required />
          <div className="error">{errors.first_name}</div>

          <label  type="email" htmlFor="user_email">{t("Email")}</label>
          <input  style={{borderColor: errors.user_email ? "red" : "initial" }}
            id="user_email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            className="form-control"
            placeholder={t("Email")}
            required   />         
          <div className="error">{errors.user_email}</div>

          <label htmlFor="message">{t("Message")}</label>
          <textarea  style={{borderColor: errors.message ? "red" : "initial"}}
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            placeholder={t("Message")}
            rows="10"
            required />
          <div className="error">{errors.message}</div>
          <input type="submit" value={t("Send")} className="send-text" />
        </form>

        <div className="contactList__conatiner" >
          <ul className="contactList">
            <li className="contactList__item" >
              <FaPhoneFlip className="contactList__i" />
              <span className="contactList__span phone">
                <a itemProp="telephone" href="0033769551422" className="contactList__phone" style={{ direction: lang === "ar" ? "rtl" : "ltr" }} >
                  (0033) 7 69 55 14 22 
                </a>
              </span>
            </li>

            <li className="contactList__item" style={{  flexDirection: lang === "ar" ? "row-reverse" : "row" }}>
              <IoMail className="contactList__i Noc" />
              <span className="contact-text gmail">
                <a itemProp="email" href="mailto:nesrineyahoum@gmail.com" className="contactList__a">
                  nesrineyahoum@gmail.com
                </a>
              </span>
            </li>

            <li className="contactList__item" style={{  flexDirection: lang === "ar" ? "row-reverse" : "row" }}>
              <FontAwesomeIcon icon={faLocationDot} className="loc"  />
              <p itemProp="location" className="contactList__span place">{t("contact.location")}</p>
            </li>
          </ul>
          <SocialMedia className="sm" />
        </div>
      </div>
    </section>



      );
};
    export default Contact;

    