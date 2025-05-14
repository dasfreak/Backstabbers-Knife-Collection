document.addEventListener('DOMContentLoaded', function() {

  const ecosystemMapping = {
    'npm': {
      collapseId: '#collapseNpm',
      headingId: '#headingNpm'
    },
    'vscode': {
      collapseId: '#collapseVscode',
      headingId: '#headingVscode'
    },
    'rubygems': {
      collapseId: '#collapseRubygems',
      headingId: '#headingRubygems'
    },
    'mavencentral': {
      collapseId: '#collapseMavencentral',
      headingId: '#headingMavencentral'
    },
    'packagist': {
      collapseId: '#collapsePackagist',
      headingId: '#headingPackagist'
    },
    'pypi': {
      collapseId: '#collapsePypi',
      headingId: '#headingPypi'
    }
  };

  function populateListAndAddBadge(ecosystemKey, packageList) {
    const mapping = ecosystemMapping[ecosystemKey];
    if (!mapping) {
      console.warn(`Mapping not found for ecosystem key: ${ecosystemKey}`);
      return;
    }
    const collapseElement = document.querySelector(mapping.collapseId);
    const accordionButton = document.querySelector(mapping.headingId + ' .accordion-button');
    if (collapseElement && accordionButton) {
      const ulElement = collapseElement.querySelector('.accordion-body ul');
      if (ulElement) {
        ulElement.innerHTML = '';
        packageList.sort();
        packageList.forEach(packageName => {
          const li = document.createElement('li');
          li.classList.add('list-group-item');
          li.textContent = packageName;
          ulElement.appendChild(li);
        });
        const listItemCount = packageList.length;
        const existingBadge = accordionButton.querySelector('.badge');
        if (existingBadge) {
          existingBadge.remove();
        }
        if (listItemCount > 0) {
          const badge = document.createElement('span');
          badge.classList.add('badge', 'bg-secondary', 'rounded-pill', 'ms-2');
          badge.textContent = listItemCount;
          accordionButton.appendChild(badge);
        }
      } else {
        console.error(`Could not find UL element inside ${mapping.collapseId}`);
      }
    } else {
      console.error(`Could not find collapse element with ID ${mapping.collapseId} or accordion button for heading ${mapping.headingId}`);
    }
  }

  fetch('data/packages.json')
    .then(response => {
      if (!response.ok) {
        console.error(`HTTP error fetching packages.json! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      for (const ecosystemKey in ecosystemMapping) {
        const packageList = data[ecosystemKey];
        if (Array.isArray(packageList)) {
          populateListAndAddBadge(ecosystemKey, packageList);
        } else {
          console.warn(`Data for ecosystem "${ecosystemKey}" is missing or not an array in packages.json`);
          populateListAndAddBadge(ecosystemKey, []);
        }
      }
    })
    .catch(error => {
      console.error('Error fetching or parsing packages.json:', error);
    });



  const mediaCarouselInner = document.querySelector('#mediaCarousel .carousel-inner');
  const mediaDataUrl = 'data/media.json';

  fetch(mediaDataUrl)
    .then(response => {
      if (!response.ok) {
        console.error(`HTTP error fetching ${mediaDataUrl}! status: ${response.status}`);
        mediaCarouselInner.innerHTML = '<div class="carousel-item active"><div class="carousel-item-content"><p class="text-danger">Error loading media coverage.</p></div></div>';
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(mediaItems => {
      if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
        mediaCarouselInner.innerHTML = '<div class="carousel-item active"><div class="carousel-item-content"><p>No media coverage found.</p></div></div>';
        console.warn('media.json is empty or not an array.');
        return;
      }

      mediaCarouselInner.innerHTML = '';

      mediaItems.forEach((item, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
          carouselItem.classList.add('active');
        }

        carouselItem.innerHTML = `
                <div class="carousel-item-content">
                    <h5>${item.title || 'Media Mention'}</h5>
                    <p><a href="${item.url}" target="_blank">${item.url}</a></p>
                </div>
            `;

        mediaCarouselInner.appendChild(carouselItem);
      });

    })
    .catch(error => {
      console.error(`Error fetching or parsing ${mediaDataUrl}:`, error);
      if (mediaCarouselInner.innerHTML === '') {
        mediaCarouselInner.innerHTML = '<div class="carousel-item active"><div class="carousel-item-content"><p class="text-danger">Error loading media coverage.</p></div></div>';
      }
    });

});
