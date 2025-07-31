export async function loadHeaderFooter() {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");

  try {
    const [headerContent, footerContent] = await Promise.all([
      fetch("/partials/header.html").then(res => res.text()),
      fetch("/partials/footer.html").then(res => res.text())
    ]);

    if (header) {
      header.innerHTML = headerContent;
      highlightActiveLink(); 
    }

    if (footer) {
      footer.innerHTML = footerContent;
    }
  } catch (error) {
    console.error("Error loading header or footer:", error);
  }
}

function highlightActiveLink() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("header nav a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });
}
