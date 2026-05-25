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
    const prevLink = document.getElementById('previous')
    if (prevLink) {
      prevLink.click();
    }
  }

  // Check if the key pressed is the right arrow.
  if (event.key === 'ArrowRight') {
    // Find the link with the text ">"
    const nextLink = document.getElementById('next')
    if (nextLink) {
      nextLink.click();
    }
  }
});

// // Select all divs that contain an <a> tag.
// const divsWithLinks = document.querySelectorAll('div a');

// divsWithLinks.forEach(link => {
//   // Get the parent div of the link.
//   const parentDiv = link.parentElement;

//   // Check if the parent is a div and not null.
//   if (parentDiv && parentDiv.tagName === 'DIV') {
//     // Get the href attribute of the link.
//     const href = link.getAttribute('href');

//     // Add a click event listener to the parent div.
//     parentDiv.addEventListener('click', () => {
//       if (href) {
//         // Navigate to the link's URL.
//         window.location.href = href;
//       }
//     });
//   }
// });

// // Add a click event listener to the image to navigate to its source.
// const allImages = document.querySelectorAll('img');
// allImages.forEach(img => {
//   img.parentElement.href = "";
//   img.addEventListener('click', () => {
//     // Toggle the full-size styling class on the clicked image
//     img.classList.toggle('full-size');
//   });
// });

// const imgElement = document.querySelector('img');
// const linkElement = imgElement?.parentElement;

// // Ensure both elements exist and the parent is actually an anchor
// if (imgElement && linkElement?.tagName === 'A') {
    
//     linkElement.addEventListener('click', (e) => {
//         e.preventDefault(); // Stop page navigation

//         // If the link still points to the low-res folder, swap it to high-res
//         if (imgElement.src.includes('/800/')) {
//             imgElement.src = linkElement.href.replace('/800/', '/hi/');
//         }

//         // Toggle the zoom class on the image
//         imgElement.classList.toggle('full-size');
//     });
// }