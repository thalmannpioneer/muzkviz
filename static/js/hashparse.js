'use strict';

if (sha256.test(hash)) {
    (async () => {
        const obj = {
            hash: hash
        };

        const resp = await fetch("/get-sections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });

        if (!resp.ok) window.location.replace(window.location.origin);

        data = await resp.json();

        constructSections();
    })();
}