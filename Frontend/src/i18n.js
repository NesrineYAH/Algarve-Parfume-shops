//18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationsFR from "./Lang/fr.json";
import translationsEN from "./Lang/en.json";
import translationsES from "./Lang/es.json";
import translationsPT from "./Lang/pt.json";

// Récupère la langue sauvegardée ou "fr" par défaut
const Lang = localStorage.getItem("i18nextLng") || "fr";

i18n
    .use(LanguageDetector) // détecte automatiquement la langue du navigateur
    .use(initReactI18next) // intègre avec React
    .init({
        resources: {
            en: { translation: translationsEN },
            fr: { translation: translationsFR },
            es: { translation: translationsES },
            pt: { translation: translationsPT },
        },
        lng: Lang,
        fallbackLng: "en", // langue par défaut si non trouvée
        debug: true,
        interpolation: {
            escapeValue: false, // React gère déjà la sécurité XSS
        },
        react: {
            useSuspense: false,
        },
    });


export default i18n;

/*
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationsFR from "./Lang/fr.json";
import translationsEN from "./Lang/en.json";
import translationsES from "./Lang/es.json";
import translationsPT from "./Lang/pt.json";


i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: translationsEN,
            i18n: "Internationalisation",
            key: "Bonjour dans ma parfumerie"
        },
        fr: {
            translation: translationsFR,
            i18n: "Internationalisation",
            key: "Hello in my perfumery"
        },
        es: {
            translation: translationsES,
            i18n: "Internationalisation",
            key: "Hola en mi perfumería"
        },
        pt: {
            translation: translationsPT,
            i18n: "Internationalisation",
            key: "Olá na minha perfumaria"
        },
    },
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
});

const Lang = localStorage.getItem("i18nextLng") || "fr";


i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: Lang, // Initialise la langue avec la variable "lang"
        fallbackLng: ["fr", "en", "es", "pt"],
        ns: ["translation"],

        keySeparator: ".",
        debug: true,
        interpolation: {
            espaceValue: false,

        },
        react: {
            useSuspense: false,
            hashTransKey: function (defaultValue) {
                console.log("missing key", defaultValue);
                return defaultValue;
            },
        },
        function({ t }) {
            i18n.t("key");
            document.getElementById("output").innerHTML = i18n.t("key");
        },

    });

export default i18n.t.bind(i18n);
*/
