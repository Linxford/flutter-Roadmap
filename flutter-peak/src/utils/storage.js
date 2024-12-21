export const loadProgress = () => {
  try {
    const saved = localStorage.getItem('flutterProgress');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem('flutterProgress', JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const createConfetti = (rect) => {
  const colors = ["#64ffda", "#00bcd4", "#1a237e", "#0d47a1"];

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${rect.left}px`;
    confetti.style.top = `${rect.top}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
};
