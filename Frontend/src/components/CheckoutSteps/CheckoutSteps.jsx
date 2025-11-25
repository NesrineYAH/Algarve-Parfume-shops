import "./CheckoutSteps.scss";

function CheckoutSteps({ step }) {
  return (
    <div className="steps-container">
      <div className={`step ${step >= 1 ? "active" : ""}`}>
        <div className="circle">1</div>
        <span>Panier</span>
      </div>

      <div className="line"></div>

      <div className={`step ${step >= 2 ? "active" : ""}`}>
        <div className="circle">2</div>
        <span>Livraison</span>
      </div>

      <div className="line"></div>

      <div className={`step ${step >= 3 ? "active" : ""}`}>
        <div className="circle">3</div>
        <span>Options</span>
      </div>

      <div className="line"></div>

      <div className={`step ${step >= 4 ? "active" : ""}`}>
        <div className="circle">4</div>
        <span>Paiement</span>
      </div>
    </div>
  );
}

export default CheckoutSteps;
