'use strict';

upload.addEventListener('change', async e => {
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

    constructSections();
});