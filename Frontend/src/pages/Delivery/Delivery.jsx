import React, { useState, useEffect } from "react";
import "./Delivery.scss";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import AddressAutocomplete from "../../components/AddressAutocomplete/AddressAutocomplete";
import { EUROPE_COUNTRIES } from "../../europeCountries";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Delivery() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\- ]{2,30}$/;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
     shippingMethod: "ctt", // valeur par défaut
    civility: "M",
    firstName: "",
    lastName: "",
    country: "PT",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    phoneCountry: "+351",
    phone: "",
  });

  // Charger les données sauvegardées
  useEffect(() => {
    const savedForm = localStorage.getItem("deliveryForm");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
    setLoading(false);
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("deliveryForm", JSON.stringify(form));
    }
  }, [form, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const validateForm = () => {
  if (!nameRegex.test(form.firstName)) return false;
  if (!nameRegex.test(form.lastName)) return false;
  if (form.phone.trim() === "") return false;

  // Si CTT → adresse obligatoire
if (form.address.trim() === "") return false;
if (form.postalCode.trim() === "") return false;
if (form.city.trim() === "") return false;


  return true;
};

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(t("delivery.formError"));
      return;
    }

    navigate("/payment");
  };

  
if (loading) return <p>{t("delivery.loading")}</p>;

  const ALLOWED_COUNTRIES = EUROPE_COUNTRIES.filter(c =>
  ["PT", "ES", "FR"].includes(c.code)
);


  return (
    <div className="delivery-container">
      <CheckoutSteps step={3} />
  <h2>{t("delivery.title")}</h2>
      <div className="form-group">
<label>{t("delivery.shippingMethod")}</label>

  <div className="shipping-options">
    <label className="radio-option">
      <input
        type="radio"
        name="shippingMethod"
        value="store"
        checked={form.shippingMethod === "store"}
        onChange={handleChange}
      />
{t("delivery.storePickup")}
    </label>
    {form.shippingMethod === "store" && (
  <div className="store-info">
<h3>{t("delivery.storeTitle")}</h3>
<p><strong>{t("delivery.storeAddressLabel")} :</strong> {t("delivery.storeAddress")}</p>
<p><strong>{t("delivery.storeHoursLabel")} :</strong> {t("delivery.storeHours")}</p>
<p>{t("delivery.storeInfo")}</p>
  </div>
)}


    <label className="radio-option">
      <input
        type="radio"
        name="shippingMethod"
        value="ctt"
        checked={form.shippingMethod === "ctt"}
        onChange={handleChange}
      />
       {t("delivery.cttDelivery")}
    </label>
  </div>
</div>

      <form className="delivery-form" onSubmit={handleSubmit}>
        {/* Civilité */}
        <div className="form-group">
        <label>{t("delivery.civility")}</label>
          <select name="civility" value={form.civility} onChange={handleChange}>
             <option value="M">{t("delivery.mr")}</option>
            <option value="Mme">{t("delivery.mrs")}</option>
          </select>
        </div>

        {/* Prénom / Nom */}
        <div className="grid-2">
          <div className="form-group">
        <label>{t("delivery.firstName")}</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} />
          </div>

          <div className="form-group">
       <label>{t("delivery.lastName")}</label>

            <input name="lastName" value={form.lastName} onChange={handleChange} />
          </div>
        </div>

        {/* Pays */}
        <div className="form-group">
      <label>{t("delivery.country")}</label>
        <select name="country"
         value={form.country}
         onChange={(e) => {
          const selected = ALLOWED_COUNTRIES.find(
         (c) => c.code === e.target.value
       );
       setForm((prev) => ({
      ...prev,
      country: selected.code,
      phoneCountry: selected.dial,
    }));
  }}
>
  {ALLOWED_COUNTRIES.map((c) => (
    <option key={c.code} value={c.code}>
      {c.name}
    </option>
  ))}
</select>

        </div>

        {/* Adresse 
        <div className="form-group">
          <label>Adresse</label>
          <AddressAutocomplete
            value={form.address}
            onChange={(text) =>
              setForm((prev) => ({ ...prev, address: text }))
            }
            onSelect={(address) =>
              setForm((prev) => ({ ...prev, address }))
            }
          />
        </div>
*/}


  <>
    {/* Adresse */}
    <div className="form-group">
<label>{t("delivery.address")}</label>
      <AddressAutocomplete
        value={form.address}
        onChange={(text) =>
          setForm((prev) => ({ ...prev, address: text }))
        }
        onSelect={(address) =>
          setForm((prev) => ({ ...prev, address }))
        }
      />
    </div>

    {/* Complément */}
    <div className="form-group">
  <label>{t("delivery.address2")}</label>
      <input
        name="address2"
        value={form.address2}
        onChange={handleChange}
       placeholder={t("delivery.address2Placeholder")}
      />
    </div>

    {/* Code postal / Ville */}
    <div className="grid-2">
      <div className="form-group">
        <label>{t("delivery.postalCode")}</label>
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
     <label>{t("delivery.city")}</label> 
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
        />
      </div>
    </div>
  </>

 
        {/* Téléphone */}
        <div className="form-group">
         <label>{t("delivery.phone")}</label>
          <div className="phone-group">
            <select
              value={form.phoneCountry}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phoneCountry: e.target.value }))
              }
            >
              {EUROPE_COUNTRIES.map((c) => (
                <option key={c.code} value={c.dial}>
                  {c.name} {c.dial}
                </option>
              ))}
            </select>

            <input
              type="tel"
              name="phone"
              placeholder="912 345 678"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

 <button type="submit" className="Button">
  {t("delivery.submit")}
</button>
      </form>
    </div>
  );
}


/*

        <div className="form-group">
          <label>Complément d’adresse</label>
          <input
            name="address2"
            value={form.address2}
            onChange={handleChange}
            placeholder="Appartement, étage, bâtiment…"
          />
        </div>


        <div className="grid-2">
          <div className="form-group">
            <label>Code postal</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ville</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>
        </div>

*/