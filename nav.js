document.addEventListener('keydown', (event) => {
  // Check if the key pressed is the left arrow
  if (event.key === 'ArrowLeft') {
    // Find the link with the text "Previous"
    const prevLink = Array.from(document.querySelectorAll('a')).find(link => link.textContent.trim() === 'Previous');
    if (prevLink) {
      prevLink.click();
    }
  }

  // Check if the key pressed is the right arrow
  if (event.key === 'ArrowRight') {
    // Find the link with the text "Next"
    const nextLink = Array.from(document.querySelectorAll('a')).find(link => link.textContent.trim() === 'Next');
    if (nextLink) {
      nextLink.click();
    }
  }
});