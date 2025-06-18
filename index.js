document.addEventListener('DOMContentLoaded', function() {
  // ========== CORE FUNCTIONS ========== //
  
  // 1. Loading Effect
  const loadingBar = document.getElementById('loadingBar');
  if (loadingBar) {
    let progress = 0;
    const interval = setInterval(function() {
      progress += 5;
      loadingBar.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(interval);
        loadingBar.style.opacity = '0';
        setTimeout(() => loadingBar.style.display = 'none', 300);
      }
    }, 50);
  }

  // 2. Date and Read Time Calculation
  const updateDate = document.getElementById('updateDate');
  if (updateDate) {
    const today = new Date();
    updateDate.textContent = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  }

  const readTime = document.getElementById('readTime');
  if (readTime) {
    const articleContent = document.getElementById('articleContent')?.textContent || '';
    readTime.textContent = Math.ceil(articleContent.split(/\s+/).length / 200);
  }

  // ========== UI INTERACTIONS ========== //

  // 1. Mobile Menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const headerContainer = document.querySelector('.header-container');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      headerContainer?.classList.toggle('mobile-active');
      document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
      this.innerHTML = mainNav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });
  }

  // 2. Smooth Scrolling and Active Menu
  function handleScroll() {
    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.classList.toggle('show', window.pageYOffset > 300);
    }

    // Animate Elements on Scroll
    document.querySelectorAll('.web-item').forEach((item, index) => {
      const itemPosition = item.getBoundingClientRect().top;
      if (itemPosition < window.innerHeight / 1.3) {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, index * 200);
      }
    });

    // Highlight Active Menu Item
    const sections = document.querySelectorAll('section, .web-item');
    const menuLinks = document.querySelectorAll('.menu-link, .nav-link');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    menuLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', handleScroll);

  // 3. FAQ Toggle
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      question.classList.toggle('active');
      question.nextElementSibling.classList.toggle('show');
    });
  });

  // ========== SHARING & ANALYTICS ========== //

  // 1. Social Sharing
  function share(social) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.getElementById('articleTitle')?.textContent || '');
    let shareUrl;
    
    switch(social) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        break;
      case 'pinterest':
        const media = encodeURIComponent('https://via.placeholder.com/300x200?text=Web+Kiếm+Tiền');
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}&media=${media}`;
        break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
  }

  // 2. Visit Tracking
  function visitWebsite(websiteId, url) {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = `Đang chuyển hướng đến ${document.getElementById(websiteId)?.querySelector('.web-name')?.textContent}...`;
      notification.classList.add('show');
      
      // Track clicks
      let clicks = localStorage.getItem(websiteId) || 0;
      localStorage.setItem(websiteId, ++clicks);
      
      setTimeout(() => {
        window.open(url, '_blank');
        notification.classList.remove('show');
      }, 2000);
    }
  }

  // ========== DYNAMIC CONTENT ========== //

  // 1. Review System
  document.getElementById('add-review-btn')?.addEventListener('click', () => {
    const name = prompt("Tên của bạn:");
    if (name) {
      const reviewText = prompt("Nhận xét của bạn:");
      const stars = prompt("Đánh giá (1-5 sao):");
      
      if (reviewText && stars) {
        addNewReview(name, reviewText, stars);
        alert("Cảm ơn đánh giá của bạn!");
      }
    }
  });

  function addNewReview(name, text, stars) {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;

    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
      <div class="reviewer-info">
        <img src="https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}" alt="User Avatar" class="avatar">
        <div class="reviewer-meta">
          <span class="name">${name}</span>
          <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} 
            <span class="date">(${new Date().toLocaleDateString()})</span>
          </div>
        </div>
      </div>
      <p class="review-text">"${text}"</p>
    `;
    reviewsGrid.prepend(reviewCard);
  }

  // 2. Table Sorting
  document.querySelectorAll('.comparison-table th').forEach((header, index) => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const table = header.closest('table');
      const tbody = table.querySelector('tbody');
      const isAsc = tbody.getAttribute('data-sort') === `asc-${index}`;

      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.sort((a, b) => {
        const aText = a.cells[index].textContent.trim();
        const bText = b.cells[index].textContent.trim();
        return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });

      rows.forEach(row => tbody.appendChild(row));
      tbody.setAttribute('data-sort', isAsc ? `desc-${index}` : `asc-${index}`);
    });
  });

  // ========== INITIAL ANIMATIONS ========== //
  setTimeout(() => {
    document.querySelectorAll('.web-item, .conclusion, .faq-item').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.transform = el.classList.contains('web-item') ? 'translateX(-50px)' : 'translateY(20px)';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0) translateY(0)';
      }, i * 100 + 300);
    });
  }, 500);
});

// ========== UTILITY FUNCTIONS ========== //
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Tooltip for navigation items
document.querySelectorAll('[data-fulltitle]').forEach(el => {
  el.addEventListener('mouseenter focus', () => {
    el.setAttribute('title', el.dataset.fulltitle);
  });
});
  // Mobile menu toggle
        document.getElementById('menuBtn').addEventListener('click', function() {
            document.getElementById('navLinks').classList.toggle('active');
        });
        
        // Current year in footer
        document.getElementById('year').textContent = new Date().getFullYear();