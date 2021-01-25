import template from "./template.html";
import "../../components/SearchBar";
import "../../components/SearchResults";
import {
  getPhotos,
  getPhotoUrl,
  getNextPage,
} from "../../services/FlickUrlUtils";
class FlickrApp extends HTMLElement {
  constructor() {
    super();
    this._page = 0;
    this._keyword = "";
    const templateNode = document.createElement("template");
    templateNode.innerHTML = template;

    const shadowNodeRoot = this.attachShadow({ mode: "open" });
    shadowNodeRoot.appendChild(templateNode.content.cloneNode(true));

    this.shadowDom = shadowNodeRoot;
    this.searchResultsComponent = this.shadowDom.querySelector(
      "search-results"
    );
    this._loader = this.shadowDom.getElementById("loader");

    const target = this.shadowDom.getElementById("observer");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const el = entries[0];
        if (el.isIntersecting) {
          const nextPage = this.getCurrentPage() + 1;
          this.setCurrentPage(nextPage);
          this.searchHandler();
        }
      },
      {
        root: this.shadowDom.querySelector(".container"),
        rootMargin: "500px",
        threshold: 1,
      }
    );

    observer.observe(target);
  }
  getCurrentPage() {
    return this._page;
  }

  getCurrentKeyword() {
    return this._keyword;
  }

  setCurrentKeyword(newKeyword) {
    this._keyword = newKeyword;
  }

  setCurrentPage(pageNumber) {
    this._page = pageNumber;
  }

  async searchHandler(firstSearch) {
    if (this.getCurrentKeyword() === "") return;
    this._loader.style.display = "block";

    try {
      const { photo } = await getPhotos(
        this.getCurrentKeyword(),
        this.getCurrentPage()
      );

      if (firstSearch) {
        this.searchResultsComponent.photos = photo;
      } else {
        const current = this.searchResultsComponent.photos;
        this.searchResultsComponent.photos = [...current, ...photo];
      }
    } catch (e) {
      alert(
        "There has been an error while processing the request, please try again later"
      );
    }
    this._loader.style.display = "none";
  }
  connectedCallback() {
    this.shadowRoot.addEventListener("search-event", (e) => {
      this.setCurrentKeyword(e.detail);
      this.setCurrentPage(1);
      this.searchResultsComponent.textContent = "";
      this.searchHandler(true);
    });
  }
}

customElements.define("flickr-app", FlickrApp);
