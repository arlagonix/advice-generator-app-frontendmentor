import {
  disableElement,
  enableElement,
  addClassToElement,
  removeClassFromElement,
  displayData,
  displayError,
  removeElementFromPage,
} from "./scripts/utils.js";

const API_URL = "https://api.adviceslip.com/advice";
const generateQuoteButton = document.querySelector(".card__button");
const adviceId = document.querySelector(".card__id");
const adviceText = document.querySelector(".card__advice");

// Fetches the data
// Adds animation and fills quote text and advice number
// In case of error shows a notification that disappears in several seconds
const generateQuote = async () => {
  try {
    const result = await fetch(API_URL, {
      method: "GET",
    });
    const resultJSON = await result.json();

    disableElement(generateQuoteButton);

    removeClassFromElement(adviceText, "card__advice--in");
    addClassToElement(adviceText, "card__advice--out");

    removeClassFromElement(adviceId, "card__id--in");
    addClassToElement(adviceId, "card__id--out");

    // According to the API description you can receive a new quote only once in 3s
    // Otherwise it returns the cached result
    setTimeout(() => {
      enableElement(generateQuoteButton);
    }, 1900); // 1900 instead of 2000 to fix some animation issues

    setTimeout(() => {
      removeClassFromElement(adviceText, "card__advice--out");
      removeClassFromElement(adviceId, "card__id--out");

      displayData(adviceId, resultJSON?.slip?.id ?? "-");
      displayData(
        adviceText,
        resultJSON?.slip?.advice ?? "Unable to get the quote."
      );

      addClassToElement(adviceText, "card__advice--in");
      addClassToElement(adviceId, "card__id--in");
    }, 600); // 600ms helps to make all animations smooth - result of experiments
  } catch (err) {
    const errorElement = displayError(
      "Something went wrong with receiving a quote"
    );
    setTimeout(() => {
      errorElement.style.animation = "shrink-out 0.8s forwards";
      setTimeout(() => {
        removeElementFromPage(errorElement);
      }, 800);
    }, 3000);
  }
};

generateQuoteButton.addEventListener("click", generateQuote);

// Shows a notification when the user is offline
// Hides it when user is back online
addEventListener("offline", (event) => {
  disableElement(generateQuoteButton);
  const errorElement = displayError("You are offline");
  const checkOnline = setInterval(() => {
    const isOnline = window.navigator.onLine;
    if (isOnline) {
      enableElement(generateQuoteButton);
      clearInterval(checkOnline);
      errorElement.style.animation = "shrink-out 0.8s forwards";
      setTimeout(() => {
        removeElementFromPage(errorElement);
      }, 800);
    }
  }, 1000);
});

// Generate quotes from keyboard
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Enter":
      generateQuoteButton.focus();
      generateQuoteButton.dispatchEvent("click");
      return;
  }
});
