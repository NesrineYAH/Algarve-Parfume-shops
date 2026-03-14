//18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationsFR from "./Lang/fr.json";
import translationsEN from "./Lang/en.json";
import translationsES from "./Lang/es.json";
import translationsPT from "./Lang/pt.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationsEN },
            fr: { translation: translationsFR },
            es: { translation: translationsES },
            pt: { translation: translationsPT }
        },

        fallbackLng: "pt",

        detection: {
            order: ["localStorage", "navigator", "htmlTag"],
            caches: ["localStorage"]
        },

        interpolation: {
            escapeValue: false
        },

        react: {
            useSuspense: false
        },

        debug: false
    });

export default i18n;