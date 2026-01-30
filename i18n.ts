import { getRequestConfig } from "next-intl/server";

const locales = ["en", "fr"];

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locales.includes(locale) ? locale : "en",
    messages: {},
  };
});
