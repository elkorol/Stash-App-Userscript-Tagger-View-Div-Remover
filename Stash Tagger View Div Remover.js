// ==UserScript==
// @name         Stash-Tagger-View-Scene-Remove-Button
// @namespace    https://github.com/7dJx1qP/stash-userscripts
// @version      0.3
// @description  Adds remove tag button to div elements in tagger view, so if on mass scrape there is scene miss match. You can remove the scene before saving all.
// @author       Echoman
// @match        http://localhost:9999/*
// @require      https://raw.githubusercontent.com/7dJx1qP/stash-userscripts/master/src\StashUserscriptLibrary.js
// @grant        unsafeWindow
// @grant        GM_getResourceText
// ==/UserScript==
(function () {
  "use strict";
  const {
    stash,
    Stash,
    waitForElementId,
    waitForElementClass,
    waitForElementByXpath,
    getElementByXpath,
    getClosestAncestor,
    updateTextInput,
  } = unsafeWindow.stash;

  async function run() {
    await waitForElementByXpath(
      "//div[contains(@class, 'tagger-container mx-md-auto')]",
      function (xpath, el) {
        // Get all div elements with class "mt-3" and "search-item"
        const divs = document.querySelectorAll(".mt-3.search-item");
        // Loop through each div element and add a remove button
        divs.forEach((div) => {
          // Check if a remove button has already been added to the current element
          if (!div.querySelector(".tagger-remover")) {
            const divContainer = document.createElement("div");
            divContainer.setAttribute("class", "mt-2 text-right");
            const removeBtn = document.createElement("button");
            removeBtn.innerText = "Remove";
            removeBtn.setAttribute("class", "tagger-remover btn btn-danger");
            // Add click event listener to remove button
            removeBtn.addEventListener("click", () => {
              div.parentNode.removeChild(div);
            });
            divContainer.appendChild(removeBtn);
            // Get the first child element with class "col-md-6 my-1"
            const col = div.querySelector(".col-md-6.my-1");
            if (col) {
              // Get the div element without a class
              const innerDiv = col.querySelector("div:not([class])");
              if (innerDiv) {
                // Append the new element as a child inside the inner div
                innerDiv.appendChild(divContainer);
              }
            }
          }
        });
      }
    );
  }
  function updateElements() {
    run();
  }
  stash.addEventListener("tagger:searchitem", () => {
    console.log("Loaded");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        Array.from(mutation.addedNodes).forEach((addedNode) => {
          if (addedNode.matches && addedNode.matches(".mt-3.search-item")) {
            setTimeout(function () {
              updateElements();
            }, 2000);
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });

  stash.addEventListener("tagger:searchitem", function () {
    run();
  });
})();
