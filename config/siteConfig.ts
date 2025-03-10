let base_url;

if (process.env.NODE_ENV === "production") {
  base_url = "https://api.triptrailing.com/user/v1";
} else {
  base_url = "http://api.triptrailing.com/user/v1";
}
const siteConfig = {
  base_url,
};

export default siteConfig;
