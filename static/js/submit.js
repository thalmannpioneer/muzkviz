'use strict';

const showError = (errorText, hlElem = null) => {
    error.children[0].textContent = errorText;
    error.classList.remove("error__hidden");
    if (hlElem) hlElem.classList.add("highlight");
    setTimeout(() => {
        error.classList.add("error__hidden");
        if (hlElem) hlElem.classList.remove("highlight");
    }, 1000);
}

submitButton.addEventListener('click', async e => {
    let sections = [];

    for (const elem of list.children) {
        const secs = elem.querySelectorAll(".seconds");
        const mins = elem.querySelectorAll(".minutes");
        const name = elem.querySelector(".name");

        if (name.value === "") {
            showError("Поля не должны быть пустыми!", name);
            return;
        }

        const firstPoint = Number(mins[0].value) * 60 + Number(secs[0].value);
        const secondPoint = Number(mins[1].value) * 60 + Number(secs[1].value);

        if (secondPoint - 5 < firstPoint) {
            showError("Секция должна длиться хотя бы 5 секунд!");
            return;
        }
        if (firstPoint > data.duration || secondPoint > data.duration) {
            showError(`Нельзя выходить за пределы аудио! Длина: ${Math.trunc(data.duration / 60)}:${data.duration % 60}`);
            return;
        }

        sections.push([firstPoint, secondPoint, name.value]);
    }

    if (sections.length < 2) {
        showError("Требуется хотя бы 2 секции!");
        return;
    }

    const req = {
        id: data.id,
        duration: data.duration,
        sections: sections
    };

    const resp = await fetch("/get-test", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });

    if (!resp.ok) return;

    const rand = (await resp.json()).parts;

    startTest(rand, 0);
});