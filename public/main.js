const shortenForm = document.getElementById('shortenForm');
const originalURLInput = document.getElementById('originalURL');
const shortenedURLOutput = document.getElementById('shortenedURL');

shortenForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const originalURL = originalURLInput.value;

  axios.post('/shorten', { url: originalURL })
    .then(response => {
      const { shortUrl } = response.data;
      shortenedURLOutput.innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
      originalURLInput.value = '';
    })
    .catch(error => {
      console.error(error);
    });
});
