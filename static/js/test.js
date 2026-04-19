'use strict';

okbtn.addEventListener('click', async e => {
    const anim = overlay.animate([
        { "opacity": "1" },
        { "opacity": "0" }
    ], {
        duration: 200
    });
    result.animate([
        { "opacity": "1" },
        { "opacity": "0" }
    ], {
        duration: 200
    });
    await anim.finished;
    overlay.classList.add("hidden");
    result.classList.add("hidden");
});

play.addEventListener('click', e => {
    if (audio.paused) {
        pauseIcon.classList.add("hidden");
        playIcon.classList.remove("hidden");
        audio.play();
    }
    else {
        pauseIcon.classList.remove("hidden");
        playIcon.classList.add("hidden");
        audio.pause();
    }
});

repeat.addEventListener('click', e => {
    if (audio.paused) {
        pauseIcon.classList.add("hidden");
        playIcon.classList.remove("hidden");
    }
    audio.load();
    audio.play();
});

volume.addEventListener('input', e => {
    audio.volume = e.target.value;
});

const mix = (arr) => {
    let newArr = [...arr];

    for (let i = newArr.length - 1; i >= 0; i--) {
        const j = Math.trunc(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }

    return newArr;
}

const startTest = async (order, curr) => {
    if (curr === order.length) {
        uploadContainer.classList.remove("hidden");
        test.classList.add("hidden");
        result.querySelector("p").textContent = `Точность: ${(1 - mistakes / order.length).toFixed(2) * 100}%`;
        overlay.classList.remove("hidden");
        result.classList.remove("hidden");
        overlay.animate([
            { "opacity": "0" },
            { "opacity": "1" }
        ], {
            duration: 200
        });
        result.animate([
            { "opacity": "0" },
            { "opacity": "1" }
        ], {
            duration: 200
        });
        uploadContainer.animate([
            { "opacity": "0" },
            { "opacity": "1" }
        ], {
            duration: 200
        });
        return;
    }

    level.textContent = `${curr + 1}/${order.length}`;

    const body = {
        part: order[curr][0],
        id: data.id
    };

    let mistakeMade = false;

    const checkAnswer = async e => {
        if (e.target.textContent === order[curr][1]) {
            e.target.classList.add("test__option_right");
            audio.pause();
            test.classList.add("block");
            const anim = test.animate([
                { "opacity": "1" },
                { "opacity": "0" }
            ], {
                duration: 500
            });
            await anim.finished;
            test.classList.add("hidden");
            setTimeout(() => {
                options.replaceChildren();
                test.classList.remove("block");
                startTest(order, curr + 1);
            }, 500);
        }
        else {
            if (!mistakeMade) {
                mistakes++;
                mistakeMade = true;
            }
            e.target.classList.add("test__option_wrong");
        }
    };

    const mixed = mix(order);

    mixed.forEach(m => {
        const newOpt = document.createElement("template");
        newOpt.innerHTML = `<button class="test__option">${m[1]}</button>`;
        newOpt.content.firstElementChild.addEventListener('click', checkAnswer);
        options.appendChild(newOpt.content.firstElementChild);
    });

    const resp = await fetch("/get-part", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const file = await resp.blob();

    const aurl = URL.createObjectURL(file);
    audio = new Audio(aurl);

    test.classList.remove("hidden");
    const anim2 = test.animate([
        { "opacity": "0" },
        { "opacity": "1" }
    ], {
        duration: 200
    });
    await anim2.finished;
    audio.volume = 0.5;
    if (audio.paused) {
        pauseIcon.classList.add("hidden");
        playIcon.classList.remove("hidden");
    }
    audio.play();
};