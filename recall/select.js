  const nav = document.getElementById('navSelect');
  if (nav) {
    nav.addEventListener('change', function () {
      if (this.value) location.href = this.value;
    });
  }
