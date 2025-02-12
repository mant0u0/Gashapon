let isMenuOpen = false;

document.querySelector(".function-menu .btn-menu").addEventListener("click", () => {
  isMenuOpen ? closeMenu() : openMenu();
});

function closeMenu() {
  if (isMenuOpen) {
    updateStyles("", "", "", "close", "open", false);
  }
}

function openMenu() {
  if (!isMenuOpen) {
    updateStyles("rotate(180deg)", "0.5", "0.5", "open", "close", true);
  }
}

function updateStyles(transform, gashaponOpacity, hintTextOpacity, addClass, removeClass, state) {
  document.querySelector(".btn-menu-icon").style.transform = transform;
  document.querySelector(".gashapon").style.opacity = gashaponOpacity;
  document.querySelector(".hint-text").style.opacity = hintTextOpacity;

  const menuBox = document.querySelector(".menu-box");
  menuBox.classList.add(addClass);
  menuBox.classList.remove(removeClass);

  setTimeout(() => {
    document.querySelectorAll(".btn-import, .btn-display, .btn-instruction, .btn-about, .btn-share").forEach(el => {
      el.style.opacity = state ? "1" : "0";
    });
    isMenuOpen = state;
  }, 500);
}
