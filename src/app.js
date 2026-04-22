const API = "https://autofix-backend-y8u9.onrender.com"

/* ================================
رسالة الترحيب المتحركة
================================ */

const text = "مرحبا بك، ماهي مشكلة سيارتك اليوم"
let i = 0

function typeWriter() {

  const el = document.getElementById("typing")

  if (!el) return

  if (i < text.length) {
    el.innerHTML += text.charAt(i)
    i++
    setTimeout(typeWriter, 70)
  }

}

typeWriter()


/* ================================
الوضع الداكن
================================ */

function toggleTheme() {
  document.body.classList.toggle("dark")
}


/* ================================
تغيير اللغة (مستقبلاً)
================================ */

function toggleLang() {
  alert("سيتم دعم لغات لاحقاً")
}


/* ================================
تسجيل الدخول
email / phone / username
================================ */

async function loginUser() {

  const identifier = document
    .getElementById("identifierInput")
    .value
    .trim()

  const password = document
    .getElementById("passwordInput")
    .value

  const error = document.getElementById("errorMsg")

  error.style.display = "none"

  if (!identifier || !password) {

    error.innerText = "ادخل البيانات كاملة"
    error.style.display = "block"
    return

  }

  try {

    const res = await fetch(API + "/auth/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        identifier,
        password
      })

    })

    const data = await res.json()

    if (!res.ok) {

      error.innerText = data.error || "فشل تسجيل الدخول"
      error.style.display = "block"
      return

    }

    localStorage.setItem("user", JSON.stringify(data))

    location = "dashboard.html"

  } catch (err) {

    console.error(err)

    error.innerText = "خطأ في الاتصال بالخادم"
    error.style.display = "block"

  }

}


/* ================================
Google / Apple (لاحقاً)
================================ */

function loginGoogle() {
  alert("تسجيل Google سيتم تفعيله لاحقاً")
}

function loginApple() {
  alert("تسجيل Apple سيتم تفعيله لاحقاً")
}
