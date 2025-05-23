import account from "./account.json";
import cart from "./cart.json";
import changePassword from "./changePassword.json";
import checkout from "./checkout.json";
import errors from "./errors.json";
import form from "./form.json";
import general from "./general.json";
import listing from "./listing.json";
import newsletter from "./newsletter.json";
import product from "./product.json";
import recoveryPassword from "./recoveryPassword.json";
import validations from "./validations.json";
import custom from "./custom.json";

export default {
  ...form,
  ...general,
  ...account,
  ...changePassword,
  ...recoveryPassword,
  ...checkout,
  ...cart,
  ...listing,
  ...product,
  ...newsletter,
  ...validations,
  ...errors,
  ...custom
};
