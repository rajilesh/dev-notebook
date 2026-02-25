// Apply theme instantly from localStorage to prevent flash (default: light)
try {
    const t = localStorage.getItem('devnotebook-theme');
    if (t !== 'dark') document.body.classList.add('light-mode');
} catch(e) {
    document.body.classList.add('light-mode');
}
// Dashboard mode on load
document.body.classList.add('dashboard-mode');
