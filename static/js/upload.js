'use strict';

upload.addEventListener('change', async e => {
    overlay.classList.remove("hidden");
    overlay.animate([
        { "opacity": "0" },
        { "opacity": "1" }
    ], {
        duration: 200
    });

    list.replaceChildren();

    const file = upload.files[0];
    const form = new FormData();

    form.append('file', file);

    const resp = await fetch('/upload', {
        method: 'POST',
        body: form
    });

    if (!resp.ok) return;

    data = await resp.json();

    overlay.animate([
        { "opacity": "1" },
        { "opacity": "0" }
    ], {
        duration: 200
    });
    setTimeout(() => overlay.classList.add("hidden"), 200);

    constructSections();
});