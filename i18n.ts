import { getRequestConfig } from "next-intl/server";

const locales = ["en", "id"];

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locales.includes(locale) ? locale : "en",
    messages: {},
  };
});
