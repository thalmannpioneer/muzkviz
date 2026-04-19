'use strict';


//HASHPARSE
const hash = window.location.pathname.slice(1);
const sha256 = /^[A-Fa-f0-9]{64}$/;

//TEST
const test = document.querySelector(".test");

let audio = null;

const level = document.querySelector(".test__level");
const play = document.querySelector(".test__button_play");
const playIcon = document.querySelector(".play");
const pauseIcon = document.querySelector(".pause");
const repeat = document.querySelector(".test__button_repeat");
const options = document.querySelector(".test__options");
const volume = document.querySelector(".test__volume");

const uploadContainer = document.querySelector(".upload");

const overlay = document.querySelector(".overlay");
const result = document.querySelector(".result-message");

const okbtn = document.querySelector(".result-message button");

let mistakes = 0;

//UPLOAD
const settings = document.querySelector(".upload__settings");
const link = document.querySelector(".upload__actual-link");
const submit = document.querySelector(".upload__submit-wrapper");

const list = document.querySelector(".sections");

let data = null;

//SECMAN
const add = document.querySelector(".upload__add");

//SUBMIT
const submitButton = document.querySelector(".upload__submit");
const error = document.querySelector(".error");


//FUNCTIONS
const constructSections = () => {
    if (data.sections) {
        data.sections.forEach(p => {
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
            const name = li.content.firstElementChild.querySelector(".name");

            mins[0].value = String(p[0] / 60).padStart(1, '0');
            secs[0].value = String(p[0] % 60).padStart(2, '0');
            mins[1].value = String(p[1] / 60).padStart(1, '0');
            secs[1].value = String(p[1] % 60).padStart(2, '0');
            name.value = p[2];

            list.appendChild(li.content.firstElementChild);
        });
    }

    settings.classList.remove("hidden");
    settings.animate([
        { "opacity": "0" },
        { "opacity": "1" }
    ], {
        duration: 200
    });
    submit.classList.remove("hidden");
    submit.animate([
        { "opacity": "0" },
        { "opacity": "1" }
    ], {
        duration: 200
    });
    link.href = `/${data.id}`;
    link.textContent = link.href;
}
