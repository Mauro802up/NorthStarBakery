// North Star Bakery - Touchstone 4
// The favorites and contact form are class-project demos. No messages are sent.

const bakeryItems = [
  { id: "loaf", name: "Signature Loaf" },
  { id: "roll", name: "Cinnamon Roll" },
  { id: "cake", name: "Celebration Cake" }
];

const fieldsToCheck = ["customer-name", "email", "request-type", "details", "pickup-date"];
const favoriteStorageKey = "northStarFavorite";

function getFavorite() {
  try {
    const id = localStorage.getItem(favoriteStorageKey);
    return bakeryItems.find(item => item.id === id) || null;
  } catch (error) {
    // The rest of the page still works if storage is blocked.
    return null;
  }
}

function saveFavorite(id) {
  try {
    localStorage.setItem(favoriteStorageKey, id);
  } catch (error) {
    // A private browsing setting might block storage.
  }
  showFavorite();
}

function showFavorite(restored = false) {
  const status = document.getElementById("favorite-status");
  if (!status) return;

  const saved = getFavorite();
  status.textContent = saved
    ? (restored ? `Welcome back! Your saved favorite is ${saved.name}.` : `Saved for later: ${saved.name}.`)
    : "No favorite saved yet.";
  document.querySelectorAll(".favorite-choice").forEach(button => {
    button.setAttribute("aria-pressed", String(!!saved && button.dataset.item === saved.id));
  });
  document.getElementById("clear-favorite").hidden = !saved;
}

function setupFavorites() {
  if (!document.getElementById("favorite-status")) return;
  document.querySelectorAll(".favorite-choice").forEach(button => {
    button.addEventListener("click", () => saveFavorite(button.dataset.item));
  });
  document.getElementById("clear-favorite").addEventListener("click", () => {
    try { localStorage.removeItem(favoriteStorageKey); } catch (error) {}
    showFavorite();
  });
  showFavorite(true);
}

function setupFavoritePrefill() {
  const box = document.getElementById("saved-favorite-box");
  if (!box) return;
  const saved = getFavorite();
  if (!saved) return;

  box.hidden = false;
  document.getElementById("saved-favorite-text").textContent = `You saved ${saved.name} as a favorite.`;
  document.getElementById("use-favorite").addEventListener("click", () => {
    document.getElementById("request-type").value = "preorder";
    document.getElementById("details").value = `I would like to ask about a pre-order for the ${saved.name}.`;
    document.getElementById("form-result").textContent = "Your saved favorite was added to the form.";
    clearFieldError("request-type", "request-error");
    clearFieldError("details", "details-error");
  });
}

function showFieldError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(fieldId).setAttribute("aria-invalid", "true");
}

function clearFieldError(fieldId, errorId) {
  document.getElementById(errorId).textContent = "";
  document.getElementById(fieldId).removeAttribute("aria-invalid");
}

function checkForm() {
  const name = document.getElementById("customer-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const requestType = document.getElementById("request-type").value;
  const details = document.getElementById("details").value.trim();
  const pickup = document.getElementById("pickup-date").value;
  const errors = {};

  if (name.length < 2) errors["customer-name"] = "Please enter at least 2 characters for your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (!requestType) errors["request-type"] = "Please choose a request type.";
  if (details.length < 10) errors.details = "Please enter at least 10 characters about your request.";
  if (requestType === "preorder" && !pickup) errors["pickup-date"] = "Please choose a pickup date for a pre-order.";

  const errorIds = {
    "customer-name": "name-error",
    email: "email-error",
    "request-type": "request-error",
    details: "details-error",
    "pickup-date": "pickup-error"
  };
  fieldsToCheck.forEach(fieldId => {
    const message = errors[fieldId];
    if (message) showFieldError(fieldId, errorIds[fieldId], message);
    else clearFieldError(fieldId, errorIds[fieldId]);
  });
  return Object.keys(errors);
}

function setupForm() {
  const form = document.getElementById("request-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault(); // No server is connected to this class project.
    const errors = checkForm();
    const result = document.getElementById("form-result");
    if (errors.length) {
      result.textContent = "Please fix the highlighted fields above.";
      document.getElementById(errors[0]).focus();
    } else {
      result.textContent = "Looks good! This is a class demo, so the request was not sent.";
    }
  });
}

setupFavorites();
setupFavoritePrefill();
setupForm();
