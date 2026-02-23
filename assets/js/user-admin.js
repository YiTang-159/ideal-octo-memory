window.onload = function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    function renderUsers() {
        const tbody = document.getElementById("users-table-body");
        tbody.innerHTML = "";
        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.fullname}</td>
                <td>${user.username}</td>
                <td>${user.password}</td>
                <td>${user.phone}</td>
                <td>${user.date}</td>
                <td>${user.status === "active" ? "Đang hoạt động" : "Đã khóa"}</td>
                <td style="text-align:center;">
                    <button class="action-button btn-reset" data-username="${user.username}">Đặt lại</button>
                    <button class="action-button ${user.status === "active" ? "btn-lock" : "btn-unlock"}" data-id="${user.id}">
                        ${user.status === "active" ? "Khóa" : "Mở khóa"}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById("total-users").textContent = users.length;
        document.getElementById("active-users").textContent = users.filter(u => u.status === "active").length;
        document.getElementById("locked-users").textContent = users.filter(u => u.status === "locked").length;

        attachResetEvents();
        attachLockEvents();
    }

    // Thêm khách hàng
    document.getElementById("add-user-btn").addEventListener("click", () => {
        document.getElementById("add-user-modal").style.display = "flex";
    });

    document.getElementById("cancel-add-user").addEventListener("click", () => {
        document.getElementById("add-user-modal").style.display = "none";
    });

    document.getElementById("confirm-add-user").addEventListener("click", () => {
        const fullname = document.getElementById("new-fullname").value.trim();
        const username = document.getElementById("new-username").value.trim();
        const password = document.getElementById("new-user-password").value.trim();
        const phone = document.getElementById("new-phone").value.trim();
        const status = document.getElementById("new-status").value;
        const errorBox = document.getElementById("add-user-error");

        errorBox.style.display = "none";
        errorBox.textContent = "";

        if (!fullname || !username || !password || !phone) {
            errorBox.textContent = "Vui lòng nhập đầy đủ thông tin.";
            errorBox.style.display = "block";
            return;
        }

        if (password.length < 6) {
            errorBox.textContent = "Mật khẩu phải ít nhất 6 ký tự.";
            errorBox.style.display = "block";
            return;
        }

        if (users.some(u => u.username === username)) {
            errorBox.textContent = "Tên đăng nhập đã tồn tại.";
            errorBox.style.display = "block";
            return;
        }

        const newUser = {
            id: Date.now(),
            fullname,
            username,
            password,
            phone,
            date: new Date().toLocaleDateString("vi-VN"),
            status
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        renderUsers();
        document.getElementById("add-user-modal").style.display = "none";

        document.getElementById("new-fullname").value = "";
        document.getElementById("new-username").value = "";
        document.getElementById("new-user-password").value = "";
        document.getElementById("new-phone").value = "";
        document.getElementById("new-status").value = "active";
    });

    // Đặt lại mật khẩu
    function attachResetEvents() {
        document.querySelectorAll(".btn-reset").forEach(btn => {
            btn.addEventListener("click", () => {
                const username = btn.getAttribute("data-username");
                const user = users.find(u => u.username === username);
                if (!user) return;

                document.getElementById("reset-username").textContent = user.username;
                document.getElementById("current-password").textContent = user.password;
                document.getElementById("reset-modal").style.display = "flex";

                document.getElementById("confirm-reset").onclick = () => {
                    const newPass = document.getElementById("new-password").value.trim();
                    const confirmPass = document.getElementById("confirm-password").value.trim();
                    const errorBox = document.getElementById("password-error");

                    errorBox.style.display = "none";
                    errorBox.textContent = "";

                    if (newPass.length < 6) {
                        errorBox.textContent = "Mật khẩu phải ít nhất 6 ký tự.";
                        errorBox.style.display = "block";
                        return;
                    }

                    if (newPass !== confirmPass) {
                        errorBox.textContent = "Mật khẩu xác nhận không khớp.";
                        errorBox.style.display = "block";
                        return;
                    }

                    user.password = newPass;
                    localStorage.setItem("users", JSON.stringify(users));
                    renderUsers();
                    document.getElementById("reset-modal").style.display = "none";

                    document.getElementById("new-password").value = "";
                    document.getElementById("confirm-password").value = "";
                };

                document.getElementById("cancel-reset").onclick = () => {
                    document.getElementById("reset-modal").style.display = "none";
                };
            });
        });
    }

    // Khóa/Mở khóa tài khoản
    function attachLockEvents() {
        document.querySelectorAll(".btn-lock, .btn-unlock").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const user = users.find(u => u.id === id);
                if (!user) return;

                user.status = user.status === "active" ? "locked" : "active";
                localStorage.setItem("users", JSON.stringify(users));
                renderUsers();
            });
        });
    }

    renderUsers();
};
