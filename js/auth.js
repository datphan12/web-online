const registeredUsers = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "admin@example.com",
        password: "123456",
        avatar: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
    },
];

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignupLink = document.getElementById("showSignup");
const showLoginLink = document.getElementById("showLogin");
const loginFormElement = document.getElementById("loginFormElement");
const signupFormElement = document.getElementById("signupFormElement");

// Chuyển đổi giữa form đăng nhập và đăng ký
showSignupLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    clearAllErrors();
});

showLoginLink.addEventListener("click", function (e) {
    e.preventDefault();
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    clearAllErrors();
});

// Hàm xóa tất cả các thông báo lỗi
function clearAllErrors() {
    const errorMessages = document.querySelectorAll(
        ".error-message, .success-message"
    );
    errorMessages.forEach((msg) => {
        msg.style.display = "none";
        msg.textContent = "";
    });

    const inputs = document.querySelectorAll(".form-control");
    inputs.forEach((input) => {
        input.classList.remove("is-invalid", "is-valid");
    });
}

// Hàm hiển thị lỗi
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    const inputElement = errorElement.previousElementSibling;

    errorElement.textContent = message;
    errorElement.style.display = "block";
    inputElement.classList.add("is-invalid");
    inputElement.classList.remove("is-valid");
}

// Hàm hiển thị thành công
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    successElement.textContent = message;
    successElement.style.display = "block";
}

// Hàm validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm validate mật khẩu
function validatePassword(password) {
    return password.length >= 6;
}

// Hàm validate tên
function validateName(name) {
    return name.trim().length >= 2;
}

// Xử lý đăng nhập
loginFormElement.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let hasError = false;

    // Validate email
    if (!email) {
        showError("loginEmailError", "Email required!");
        hasError = true;
    } else if (!validateEmail(email)) {
        showError("loginEmailError", "Email invalid!");
        hasError = true;
    }

    // Validate password
    if (!password) {
        showError("loginPasswordError", "Password required");
        hasError = true;
    }

    if (hasError) return;

    // Kiểm tra thông tin đăng nhập
    const user = registeredUsers.find(
        (u) => u.email === email && u.password === password
    );

    if (user) {
        showSuccess(
            "loginSuccess",
            `Đăng nhập thành công! Chào mừng ${user.name}`
        );
        document.getElementById("loginEmail").classList.add("is-valid");
        document.getElementById("loginPassword").classList.add("is-valid");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } else {
        const emailExists = registeredUsers.find((u) => u.email === email);
        if (emailExists) {
            showError("loginGeneralError", "Email or password invalid!");
        } else {
            showError("loginGeneralError", "Email or password invalid!");
        }
    }
});

// Xử lý đăng ký
signupFormElement.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById(
        "signupConfirmPassword"
    ).value;

    let hasError = false;

    // Validate tên
    if (!name) {
        showError("signupNameError", "Vui lòng nhập họ và tên");
        hasError = true;
    } else if (!validateName(name)) {
        showError("signupNameError", "Họ và tên phải có ít nhất 2 ký tự");
        hasError = true;
    }

    // Validate email
    if (!email) {
        showError("signupEmailError", "Vui lòng nhập email");
        hasError = true;
    } else if (!validateEmail(email)) {
        showError("signupEmailError", "Email không hợp lệ");
        hasError = true;
    } else {
        const emailExists = registeredUsers.find((u) => u.email === email);
        if (emailExists) {
            showError("signupEmailError", "Email này đã được sử dụng");
            hasError = true;
        }
    }

    // Validate mật khẩu
    if (!password) {
        showError("signupPasswordError", "Vui lòng nhập mật khẩu");
        hasError = true;
    } else if (!validatePassword(password)) {
        showError("signupPasswordError", "Mật khẩu phải có ít nhất 6 ký tự");
        hasError = true;
    }

    // Validate xác nhận mật khẩu
    if (!confirmPassword) {
        showError("signupConfirmPasswordError", "Vui lòng xác nhận mật khẩu");
        hasError = true;
    } else if (password !== confirmPassword) {
        showError("signupConfirmPasswordError", "Mật khẩu xác nhận không khớp");
        hasError = true;
    }

    if (hasError) return;

    // Đăng ký thành công
    const newUser = {
        id: registeredUsers.length + 1,
        name: name,
        email: email,
        password: password,
    };

    registeredUsers.push(newUser);
    showSuccess("signupSuccess", "Sign up success!");

    // Đánh dấu các field hợp lệ
    document.getElementById("signupName").classList.add("is-valid");
    document.getElementById("signupEmail").classList.add("is-valid");
    document.getElementById("signupPassword").classList.add("is-valid");
    document.getElementById("signupConfirmPassword").classList.add("is-valid");

    // Reset form sau 2 giây và chuyển về form đăng nhập
    setTimeout(() => {
        signupFormElement.reset();
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        clearAllErrors();
    }, 1000);
});

// Xóa lỗi khi người dùng bắt đầu nhập
document.querySelectorAll(".form-control").forEach((input) => {
    input.addEventListener("input", function () {
        this.classList.remove("is-invalid");
        const errorElement = this.nextElementSibling;
        if (errorElement && errorElement.classList.contains("error-message")) {
            errorElement.style.display = "none";
        }
    });
});

// Hiển thị avatar
