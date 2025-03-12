document.addEventListener('DOMContentLoaded', () => {
  function animateNewsCards() {
    const newsCards = document.querySelectorAll('.news-item');
    
    if (!newsCards.length) return;
    
    newsCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove('opacity-0', 'translate-y-4');
        card.classList.add('opacity-100', 'translate-y-0');
      }, index * 100); 
    });
  }
  
  animateNewsCards();
  
  const categoryButtons = document.querySelectorAll('#category-filters button');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(animateNewsCards, 50);
    });
  });
});