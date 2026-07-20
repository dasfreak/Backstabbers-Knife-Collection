document.addEventListener("DOMContentLoaded", function () {
  // Helper function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Helper function to populate the UL and add the badge
  // This function now directly takes the UL element and the accordion button element
  function populateAccordionContent(ulElement, accordionButton, packageList) {
    if (ulElement) {
      ulElement.innerHTML = ""; // Clear existing content
      packageList.sort(); // Sort package names alphabetically
      packageList.forEach((packageName) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = packageName;
        ulElement.appendChild(li);
      });

      const listItemCount = packageList.length;
      const existingBadge = accordionButton.querySelector(".badge");
      if (existingBadge) {
        existingBadge.remove(); // Remove old badge if exists
      }
      if (listItemCount > 0) {
        const badge = document.createElement("span");
        badge.classList.add("badge", "bg-secondary", "rounded-pill", "ms-2");
        badge.textContent = listItemCount;
        accordionButton.appendChild(badge);
      }
    } else {
      console.error("UL element not found for populating accordion content.");
    }
  }

  // --- Advanced Ecosystem Tab & Search Architecture ---
  let originalData = {};

  fetch("data/packages.json")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      originalData = data;
      const tabHeaderContainer = document.getElementById("ecosystemTabs");
      const tabContentContainer = document.getElementById(
        "ecosystemTabContent",
      );
      const searchInput = document.getElementById("packageSearch");

      if (!tabHeaderContainer || !tabContentContainer) return;

      // Sort ecosystems by payload density volume
      const sortedEcosystems = Object.keys(data)
        .map((key) => ({
          key: key,
          packages: Array.isArray(data[key]) ? data[key].sort() : [],
          count: Array.isArray(data[key]) ? data[key].length : 0,
        }))
        .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

      // Core Render Execution Engine
      function renderEcosystems(filterText = "") {
        tabHeaderContainer.innerHTML = "";
        tabContentContainer.innerHTML = "";
        let searchHasResults = false;

        sortedEcosystems.forEach((eco, index) => {
          // Filter array by search term string
          const filteredPackages = eco.packages.filter((pkg) =>
            pkg.toLowerCase().includes(filterText.toLowerCase()),
          );

          // Skip displaying ecosystem tab headers if filtering yields zero items
          if (filterText && filteredPackages.length === 0) return;
          searchHasResults = true;

          const tabId = `pane-${eco.key}`;
          const isFirst = tabHeaderContainer.children.length === 0;

          // 1. Build Navigation Tab Link Elements
          const navLi = document.createElement("li");
          navLi.classList.add("nav-item");

          const navBtn = document.createElement("button");
          navBtn.className = `nav-link ${isFirst ? "active" : ""}`;
          navBtn.id = `tab-${eco.key}`;
          navBtn.dataset.bsToggle = "tab";
          navBtn.dataset.bsTarget = `#${tabId}`;
          navBtn.type = "button";
          navBtn.role = "tab";
          navBtn.innerHTML = `${capitalizeFirstLetter(eco.key)} <span class="badge rounded-pill bg-dark ms-1">${filteredPackages.length}</span>`;

          navLi.appendChild(navBtn);
          tabHeaderContainer.appendChild(navLi);

          // 2. Build Content Pane Element Components
          const pane = document.createElement("div");
          pane.className = `tab-pane fade ${isFirst ? "show active" : ""}`;
          pane.id = tabId;
          pane.role = "tabpanel";

          // Responsive column configuration framework grid
          const rowGrid = document.createElement("div");
          rowGrid.className = "row g-3";

          filteredPackages.forEach((pkgName) => {
            const colCell = document.createElement("div");
            colCell.className = "col-sm-6 col-md-4 col-lg-3";
            colCell.innerHTML = `
                            <div class="package-item shadow-sm">
                                <i class="fas fa-shield-virus"></i>
                                <span class="text-truncate" title="${pkgName}">${pkgName}</span>
                            </div>
                        `;
            rowGrid.appendChild(colCell);
          });

          pane.appendChild(rowGrid);
          tabContentContainer.appendChild(pane);
        });

        if (!searchHasResults) {
          tabContentContainer.innerHTML =
            '<p class="text-muted text-center py-4 my-0">No malicious components matched your search parameters.</p>';
        }
      }

      // Bind Search Input Listener Engine
      searchInput.addEventListener("input", (e) => {
        renderEcosystems(e.target.value);
      });

      // Initial Layout Execution
      renderEcosystems();
    })
    .catch((error) => {
      console.error("Ecosystem Render Fault:", error);
      const container = document.getElementById("ecosystemTabContent");
      if (container)
        container.innerHTML =
          '<p class="text-danger text-center">Failed to interface package telemetry directory details securely.</p>';
    });

  // --- Enhanced Media Coverage Section ---
  const mediaListContainer = document.getElementById("mediaList");
  const mediaDataUrl = "data/media.json";

  fetch(mediaDataUrl)
    .then((response) => {
      if (!response.ok) {
        console.error(
          `HTTP error fetching ${mediaDataUrl}! status: ${response.status}`,
        );
        if (mediaListContainer) {
          mediaListContainer.innerHTML =
            '<div class="col-12"><p class="text-danger text-center">Error loading media coverage.</p></div>';
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((mediaItems) => {
      if (!mediaListContainer) {
        console.error("Media list container element not found!");
        return;
      }

      if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
        mediaListContainer.innerHTML =
          '<div class="col-12"><p class="text-center text-muted">No media coverage found.</p></div>';
        return;
      }

      mediaListContainer.innerHTML = ""; // Clear existing content

      mediaItems.forEach((item) => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col-md-6", "col-lg-4", "d-flex"); // d-flex ensures matching heights

        // Create the wrapper anchor card
        const card = document.createElement("a");
        card.href = item.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.classList.add("media-card", "w-100");

        // Title container
        const title = document.createElement("div");
        title.classList.add("media-title");
        title.textContent = item.title || "View Reference Article";

        // Metadata footer layout
        const meta = document.createElement("div");
        meta.classList.add("media-meta");
        meta.innerHTML = `<i class="fas fa-external-link-alt small"></i> Read Article`;

        // Assemble structural hierarchy
        card.appendChild(title);
        card.appendChild(meta);
        colDiv.appendChild(card);
        mediaListContainer.appendChild(colDiv);
      });
    })
    .catch((error) => {
      console.error(`Error fetching or parsing ${mediaDataUrl}:`, error);
      if (mediaListContainer && mediaListContainer.innerHTML === "") {
        mediaListContainer.innerHTML =
          '<div class="col-12"><p class="text-danger text-center">Error loading media coverage.</p></div>';
      }
    });
});
