document.addEventListener('keydown', (event) => {
  // Check if any modifier keys are being pressed.
  // If so, exit the function to avoid interfering with shortcuts.
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    return;
  }

  // Go to the parent directory if the escape key is pressed.
  if (event.key === 'Escape') {
    window.location.href = '../';
  }

  // Check if the key pressed is the left arrow.
  if (event.key === 'ArrowLeft') {
    // Find the link with the text "<"
    const prevLink = Array.from(document.querySelectorAll('a')).find(link => link.textContent.trim() === '<');
    if (prevLink) {
      prevLink.click();
    }
  }

  // Check if the key pressed is the right arrow.
  if (event.key === 'ArrowRight') {
    // Find the link with the text ">"
    const nextLink = Array.from(document.querySelectorAll('a')).find(link => link.textContent.trim() === '>');
    if (nextLink) {
      nextLink.click();
    }
  }
});

// Select all divs that contain an <a> tag.
const divsWithLinks = document.querySelectorAll('div a');

divsWithLinks.forEach(link => {
  // Get the parent div of the link.
  const parentDiv = link.parentElement;

  // Check if the parent is a div and not null.
  if (parentDiv && parentDiv.tagName === 'DIV') {
    // Get the href attribute of the link.
    const href = link.getAttribute('href');

    // Add a click event listener to the parent div.
    parentDiv.addEventListener('click', () => {
      if (href) {
        // Navigate to the link's URL.
        window.location.href = href;
      }
    });
  }
});

// Add a click event listener to the image to navigate to its source.
const mainImage = document.querySelector('img');
if (mainImage) {
  mainImage.addEventListener('click', () => {
    // Get the source (src) of the image.
    const imageSrc = mainImage.src;
    if (imageSrc) {
      // Navigate to the full-size image file.
      window.location.href = imageSrc;
    }
  });
}