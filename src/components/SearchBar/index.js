import template from "./template.html";

class SearchBar extends HTMLElement {
  constructor() {
    super();
    const templateNode = document.createElement("template");
    templateNode.innerHTML = template;

    const shadowNodeRoot = this.attachShadow({ mode: "open" });
    shadowNodeRoot.appendChild(templateNode.content.cloneNode(true));
    this.shadowDom = shadowNodeRoot;
  }

  connectedCallback() {
    const searchButton = this.shadowDom.querySelector(".search-button");
    const searchInput = this.shadowDom.querySelector(".search-input");
    searchButton.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("search-event", {
          detail: searchInput.value,
          bubbles: true,
        })
      );
    });
  }
}

customElements.define("search-bar", SearchBar);
