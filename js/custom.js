document.addEventListener('DOMContentLoaded', function() {

    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Helper function to populate the UL and add the badge
    // This function now directly takes the UL element and the accordion button element
    function populateAccordionContent(ulElement, accordionButton, packageList) {
        if (ulElement) {
            ulElement.innerHTML = ''; // Clear existing content
            packageList.sort(); // Sort package names alphabetically
            packageList.forEach(packageName => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = packageName;
                ulElement.appendChild(li);
            });

            const listItemCount = packageList.length;
            const existingBadge = accordionButton.querySelector('.badge');
            if (existingBadge) {
                existingBadge.remove(); // Remove old badge if exists
            }
            if (listItemCount > 0) {
                const badge = document.createElement('span');
                badge.classList.add('badge', 'bg-secondary', 'rounded-pill', 'ms-2');
                badge.textContent = listItemCount;
                accordionButton.appendChild(badge);
            }
        } else {
            console.error("UL element not found for populating accordion content.");
        }
    }

    // Fetch packages data and dynamically generate accordions
    fetch('data/packages.json')
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error fetching packages.json! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const examplesAccordion = document.getElementById('examplesAccordion');
            if (!examplesAccordion) {
                console.error("Examples accordion container element not found!");
                return;
            }
            examplesAccordion.innerHTML = ''; // Clear any existing static content

            // Create an array of ecosystem objects with their package counts
            const ecosystemsWithCounts = [];
            for (const ecosystemKey in data) {
                if (Object.hasOwnProperty.call(data, ecosystemKey)) {
                    const packageList = Array.isArray(data[ecosystemKey]) ? data[ecosystemKey] : [];
                    ecosystemsWithCounts.push({
                        key: ecosystemKey,
                        packages: packageList,
                        count: packageList.length
                    });
                }
            }

            // Sort the array:
            // 1. By count (descending)
            // 2. Then alphabetically by key (ascending) for ties
            ecosystemsWithCounts.sort((a, b) => {
                if (b.count !== a.count) {
                    return b.count - a.count; // Sort by count descending
                }
                return a.key.localeCompare(b.key); // Sort by key alphabetically for ties
            });

            // Iterate through the sorted array to generate the accordions
            ecosystemsWithCounts.forEach(ecosystem => {
                const ecosystemKey = ecosystem.key;
                const packageList = ecosystem.packages; // Use the already fetched and processed list

                // Generate unique IDs for collapse and heading based on ecosystem key
                const collapseId = `collapse${capitalizeFirstLetter(ecosystemKey)}`;
                const headingId = `heading${capitalizeFirstLetter(ecosystemKey)}`;

                // Create accordion item structure
                const accordionItem = document.createElement('div');
                accordionItem.classList.add('accordion-item');

                const accordionHeader = document.createElement('h2');
                accordionHeader.classList.add('accordion-header');
                accordionHeader.id = headingId;

                const accordionButton = document.createElement('button');
                accordionButton.classList.add('accordion-button', 'collapsed'); // Start collapsed by default
                accordionButton.type = 'button';
                accordionButton.dataset.bsToggle = 'collapse';
                accordionButton.dataset.bsTarget = `#${collapseId}`;
                accordionButton.setAttribute('aria-expanded', 'false');
                accordionButton.setAttribute('aria-controls', collapseId);
                accordionButton.textContent = capitalizeFirstLetter(ecosystemKey); // Display capitalized name

                accordionHeader.appendChild(accordionButton);

                const accordionCollapse = document.createElement('div');
                accordionCollapse.id = collapseId;
                accordionCollapse.classList.add('accordion-collapse', 'collapse');
                accordionCollapse.setAttribute('aria-labelledby', headingId);
                accordionCollapse.dataset.bsParent = '#examplesAccordion'; // Link to the parent accordion container

                const accordionBody = document.createElement('div');
                accordionBody.classList.add('accordion-body');

                const ulElement = document.createElement('ul');
                ulElement.classList.add('list-group', 'list-group-flush', 'text-start');

                accordionBody.appendChild(ulElement);
                accordionCollapse.appendChild(accordionBody);

                accordionItem.appendChild(accordionHeader);
                accordionItem.appendChild(accordionCollapse);

                // Append the complete accordion item to the main accordion container
                examplesAccordion.appendChild(accordionItem);

                // Now populate the list and add the badge using the helper function
                populateAccordionContent(ulElement, accordionButton, packageList);
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing packages.json:', error);
            const examplesAccordion = document.getElementById('examplesAccordion');
            if (examplesAccordion) {
                examplesAccordion.innerHTML = '<div class="col-12"><p class="text-danger">Error loading package examples. Please ensure `data/packages.json` exists and is correctly formatted.</p></div>';
            }
        });


    // --- Media Coverage Section (remains the same) ---
    const mediaListContainer = document.getElementById('mediaList');
    const mediaDataUrl = 'data/media.json';

    fetch(mediaDataUrl)
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error fetching ${mediaDataUrl}! status: ${response.status}`);
                if (mediaListContainer) {
                    mediaListContainer.innerHTML = '<div class="col-12"><p class="text-danger">Error loading media coverage.</p></div>';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(mediaItems => {
            if (!mediaListContainer) {
                console.error("Media list container element not found!");
                return;
            }

            if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
                mediaListContainer.innerHTML = '<div class="col-12"><p>No media coverage found.</p></div>';
                console.warn('media.json is empty or not an array.');
                return;
            }

            mediaListContainer.innerHTML = ''; // Clear existing content

            mediaItems.forEach(item => {
                const colDiv = document.createElement('div');
                colDiv.classList.add('col-md-4', 'mb-3');

                const link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.title || item.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.className = "link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover";

                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'border-0', 'bg-light'); // Match section background, remove border

                listItem.appendChild(link);

                colDiv.appendChild(listItem);

                mediaListContainer.appendChild(colDiv);
            });

        })
        .catch(error => {
            console.error(`Error fetching or parsing ${mediaDataUrl}:`, error);
            if (mediaListContainer && mediaListContainer.innerHTML === '') {
                mediaListContainer.innerHTML = '<div class="col-12"><p class="text-danger">Error loading media coverage.</p></div>';
            }
        });

});
