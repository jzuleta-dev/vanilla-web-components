import template from "./template.html";
import {
  getPhotos,
  getPhotoUrl,
  getNextPage,
} from "../../services/FlickUrlUtils";
class SearchResults extends HTMLElement {
  constructor() {
    super();
    this._photos = [];
    this.currentKeyword = "";
    const templateNode = document.createElement("template");
    templateNode.innerHTML = template;

    const shadowNodeRoot = this.attachShadow({ mode: "open" });
    shadowNodeRoot.appendChild(templateNode.content.cloneNode(true));
    this.shadowDom = shadowNodeRoot;
    this.photoContainer = this.shadowDom.querySelector(".container");
  }
  async processPhotos(photos) {
    try {
      photos.forEach((photo) => {
        const photoUrl = getPhotoUrl(photo);
        const img = document.createElement("img");
        img.classList.add("image");
        img.src = photoUrl;
        img.alt = img.title;
        img.loading = "lazy";
        img.addEventListener("click", () => window.open(photoUrl, "_blank"));
        this.photoContainer.appendChild(img);
      });
    } catch (e) {
      alert("Oops, there has been an error while processing the photos");
    }
  }
  static get observedAttributes() {
    return ["photos"];
  }

  get photos() {
    return this._photos;
  }

  set photos(photos) {
    this._photos = photos;
    //TODO optimise for reusing of the images that were already rendered.
    this.photoContainer.innerHTML = "";
    this.processPhotos(photos);
  }
}

customElements.define("search-results", SearchResults);
