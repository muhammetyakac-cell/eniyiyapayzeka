const key = process.env.GEMINI_API_KEY;
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(r => r.json())
  .then(d => {
    if (d.models) {
      d.models.forEach(m => console.log(m.name));
    } else {
      console.log(d);
    }
  });
