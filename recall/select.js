document.addEventListener("DOMContentLoaded", () => {
  const navs = document.getElementById('navSelect');
  if (navs) {
    navs.addEventListener('change', function () {
      if (this.value) location.href = this.value;
    });
  }
});
