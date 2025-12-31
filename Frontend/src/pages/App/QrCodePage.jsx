import React from "react";
import { QRCodeCanvas } from "qrcode.react";


export default function QrCodePage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Téléchargez notre application</h1>

 <QRCodeCanvas
        value="https://ton-site-ecommerce.com/app"
        size={220}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
      /> 

         {/* <img src={} alt="" /> */}

      <p style={styles.subtitle}>
        Scannez ce QR code pour accéder à notre application mobile.
      </p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
        fontWeight: 28,

  },
  subtitle: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
};
