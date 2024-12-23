export const dateFormat = (date, locale = "en-US") => {
    return new Intl.DateTimeFormat([locale, "en-US"], {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };