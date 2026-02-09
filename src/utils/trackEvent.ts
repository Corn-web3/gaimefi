export const trackEvent = (eventName: string, params?: any) => {
  try {
    if (window.gtag) {
      window.gtag("event", eventName, params);
    }
  } catch (error) {
    console.log(error);
  }
};
