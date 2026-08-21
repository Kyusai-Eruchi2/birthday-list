const birthdayList = document.getElementById("birthday-list");

const form = document.getElementById("birthday-form");

const nameInput = document.getElementById("name");
const monthInput = document.getElementById("month");
const dayInput = document.getElementById("day");

const nameError = document.getElementById("name-error");
const monthError = document.getElementById("month-error");
const dayError = document.getElementById("day-error");

const submitButton = document.getElementById("submit-button");

let birthdays = [];


// ==============================
// 誕生日データ読み込み
// ==============================

fetch("birthday.json")
    .then(response => response.json())
    .then(data => {

        birthdays = data;

        displayBirthdays();

    })
    .catch(error => {

        console.error(error);

        birthdayList.innerHTML =
            "<p>誕生日データを読み込めませんでした。</p>";

    });


// ==============================
// 誕生日一覧表示
// ==============================

function displayBirthdays() {

    birthdayList.innerHTML = "";

    if (birthdays.length === 0) {

        birthdayList.innerHTML =
            "<p>登録されている誕生日はありません。</p>";

        return;
    }

    // 月 → 日の順番で並び替え
    const sortedBirthdays = [...birthdays].sort((a, b) => {

        if (a.month !== b.month) {
            return a.month - b.month;
        }

        return a.day - b.day;

    });


    sortedBirthdays.forEach(person => {

        const item = document.createElement("div");

        item.className = "birthday-item";

        item.innerHTML = `
            <span class="birthday-date">
                ${person.month}月${person.day}日
            </span>

            <span>
                ${escapeHTML(person.name)}
            </span>
        `;

        birthdayList.appendChild(item);

    });
}


// ==============================
// HTMLエスケープ
// ==============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==============================
// 名前チェック
// ==============================

function validateName() {

    const name = nameInput.value.trim();

    nameError.textContent = "";


    if (name === "") {

        nameError.textContent =
            "名前を入力してください。";

        return false;
    }


    if (name.length > 30) {

        nameError.textContent =
            "名前は30文字以内で入力してください。";

        return false;
    }


    // 数字だけ
    if (/^[0-9]+$/.test(name)) {

        nameError.textContent =
            "この名前は登録できません。";

        return false;
    }


    // 記号だけ
    if (/^[^ぁ-んァ-ヶ一-龠a-zA-Z0-9]+$/.test(name)) {

        nameError.textContent =
            "この名前は登録できません。";

        return false;
    }


    // 同じ文字が10回以上連続
    if (/(.)\1{9,}/u.test(name)) {

        nameError.textContent =
            "不自然な文字列は登録できません。";

        return false;
    }

    // 英数字のみで構成されているか
    const isAlphanumericOnly = /^[a-zA-Z0-9]+$/.test(name);

    // 英字＋数字が混在しているか
    const hasLetters = /[a-zA-Z]/.test(name);
    const hasNumbers = /[0-9]/.test(name);

    // 長い英数字の不自然な羅列
    if (
        isAlphanumericOnly &&
        name.length >= 15 &&
        hasLetters &&
        hasNumbers
    ) {
        nameError.textContent =
            "不自然な文字列は登録できません。";

        return false;
    }
    

    return true;
}

// ==============================
// 月チェック
// ==============================

function validateMonth() {

    const month = monthInput.value.trim();

    monthError.textContent = "";


    if (!/^[0-9]+$/.test(month)) {

        monthError.textContent =
            "月は数字で入力してください。";

        return false;
    }


    const value = Number(month);

    if (value < 1 || value > 12) {

        monthError.textContent =
            "月は1～12で入力してください。";

        return false;
    }


    return true;
}


// ==============================
// 日チェック
// ==============================

function validateDay() {

    const day = dayInput.value.trim();

    dayError.textContent = "";


    if (!/^[0-9]+$/.test(day)) {

        dayError.textContent =
            "日は数字で入力してください。";

        return false;
    }


    const value = Number(day);

    if (value < 1 || value > 31) {

        dayError.textContent =
            "日は1～31で入力してください。";

        return false;
    }


    return true;
}


// ==============================
// 実在する日付かチェック
// ==============================

function validateRealDate() {

    if (!validateMonth() || !validateDay()) {
        return false;
    }


    const month = Number(monthInput.value);
    const day = Number(dayInput.value);


    // 2024年はうるう年
    const date = new Date(2024, month - 1, day);


    if (
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {

        dayError.textContent =
            "その日付は存在しません。";

        return false;
    }


    return true;
}


// ==============================
// 入力時チェック
// ==============================

nameInput.addEventListener("input", validateName);

monthInput.addEventListener("input", () => {

    // 数字以外を入力した場合
    if (!/^[0-9]*$/.test(monthInput.value)) {

        monthError.textContent =
            "月は数字のみ入力できます。";

    } else {

        validateMonth();

    }

});


dayInput.addEventListener("input", () => {

    if (!/^[0-9]*$/.test(dayInput.value)) {

        dayError.textContent =
            "日は数字のみ入力できます。";

    } else {

        validateDay();

    }

});


// ==============================
// 登録
// ==============================

form.addEventListener("submit", event => {

    event.preventDefault();


    const nameOK = validateName();
    const monthOK = validateMonth();
    const dayOK = validateDay();
    const dateOK = validateRealDate();


    if (!nameOK || !monthOK || !dayOK || !dateOK) {

        alert(
            "入力内容に問題があります。\n" +
            "内容を確認してください。"
        );

        return;
    }


    const newBirthday = {

        name: nameInput.value.trim(),

        month: Number(monthInput.value),

        day: Number(dayInput.value)

    };


    console.log("登録データ:", newBirthday);


    alert(
        "入力内容は正常です！\n\n" +
        `${newBirthday.name}\n` +
        `${newBirthday.month}月${newBirthday.day}日`
    );

});
