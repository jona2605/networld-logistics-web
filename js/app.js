const headlineRotator = document.getElementById("headlineRotator");

const headlines = [
  ["deja de ser un", "problema."],
  ["no deberia sentirse", "incierta."],
  ["merece llegar", "sin errores."]
];

let headlineIndex = 0;

if (headlineRotator) {
  setInterval(() => {
    headlineRotator.classList.add("changing");

    setTimeout(() => {
      headlineIndex = (headlineIndex + 1) % headlines.length;
      const [lineOne, lineTwo] = headlines[headlineIndex];
      headlineRotator.innerHTML = `<span class="headline-white">${lineOne}</span> <span class="headline-green">${lineTwo}</span>`;
      headlineRotator.classList.remove("changing");
    }, 350);
  }, 3500);
}
