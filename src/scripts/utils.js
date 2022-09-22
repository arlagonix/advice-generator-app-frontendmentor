const page = document.querySelector(".page");

export const disableElement = (element) => {
  element.setAttribute("disabled", "");
};

export const enableElement = (element) => {
  element.removeAttribute("disabled");
};

export const addClassToElement = (element, className) => {
  element.classList.add(className);
};

export const removeClassFromElement = (element, className) => {
  element.classList.remove(className);
};

export const displayData = (element, content) => {
  element.innerHTML = content;
};

export const displayError = (errorMessage = "Error") => {
  const newElement = document.createElement("article");
  newElement.classList.add("error");
  newElement.innerHTML = `
  <h2 class="error__text text text--h2 text--color--error">
    ${errorMessage}
  </h2>`;
  page.appendChild(newElement);
  return newElement;
};

export const removeElementFromPage = (errorElement) => {
  page.removeChild(errorElement);
};
