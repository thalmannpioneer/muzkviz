'use strict';

add.addEventListener('click', e => {
    const li = document.createElement("template");

    li.innerHTML = `
    <li>
        <div class="sections__content-wrapper">
            <p class="sections__text">с</p>
            <input class="sections__text minutes" value="0" maxlength="2" inputmode="numeric">
            <p class="sections__text">:</p>
            <input class="sections__text seconds" value="00" maxlength="2" inputmode="numeric">
            <p class="sections__text">до</p>
            <input class="sections__text minutes" value="1" maxlength="2" inputmode="numeric">
            <p class="sections__text">:</p>
            <input class="sections__text seconds" value="00" maxlength="2" inputmode="numeric">
            <input class="sections__text name" placeholder="менуэт" maxlength="20">
        </div>
        <button class="sections__delete">
            <h2>-</h2>
        </button>
    </li>
    `;

    const delb = li.content.firstElementChild.querySelector(".sections__delete");
    delb.addEventListener('click', e => e.target.parentElement.remove());

    const mins = li.content.firstElementChild.querySelectorAll(".minutes");
    const secs = li.content.firstElementChild.querySelectorAll(".seconds");

    for (const elem of [...mins, ...secs]) {
        elem.addEventListener('focus', e => e.target.value = e.target.value.replace(/^0+/, ''));

        elem.addEventListener('keydown', e => {
            const nums = /^\d+$/;
            e.target.value = e.target.value.replace(/^0+/, '');
            const specialKeys = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "Home", "End"];

            if (!nums.test(e.key) && !specialKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }
            if (!specialKeys.includes(e.key) && Number(e.target.value + e.key) > 60) {
                e.preventDefault();
                e.target.value = "59";
                return;
            }
        });
    }

    for (const sec of secs) sec.addEventListener('blur', e => e.target.value = e.target.value.padStart(2, "0"));
    for (const min of mins) min.addEventListener('blur', e => e.target.value = e.target.value.padStart(1, "0"));

    list.appendChild(li.content.firstElementChild);
});