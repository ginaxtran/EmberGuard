document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('housing-form');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      data.adults = parseInt(data.adults) || 0;
      data.children = parseInt(data.children) || 0;
      data.infants = parseInt(data.infants) || 0;
      data.pets = parseInt(data.pets) || 0;
      data.sameEmail = formData.get('sameEmail') === 'on';
  
      try {
        const res = await fetch('http://localhost:3000/api/housing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
        if (result.success) {
          alert('✅ Request submitted!');
          form.reset();
          location.href = '/'; // or navigate wherever you want
        } else {
          alert('❌ Submission failed.');
        }
      } catch (err) {
        alert('Server error. Please try again.');
        console.error(err);
      }
    });
  });