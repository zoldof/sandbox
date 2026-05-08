document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('navSelect').addEventListener('change', function () {
    if (this.value) location.href = this.value;
  });
});
