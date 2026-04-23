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

  const identifierInput = document.getElementById("identifierInput")
  const passwordInput = document.getElementById("passwordInput")
  const errorBox = document.getElementById("errorMsg")

  if (!identifierInput || !passwordInput) return

  const identifier = identifierInput.value.trim()
  const password = passwordInput.value

  errorBox.style.display = "none"

  if (!identifier || !password) {

    errorBox.innerText = "ادخل البيانات كاملة"
    errorBox.style.display = "block"
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

      errorBox.innerText = data.error || "فشل تسجيل الدخول"
      errorBox.style.display = "block"
      return

    }

    /* حفظ بيانات المستخدم */
    localStorage.setItem("user", JSON.stringify(data.user))

    /* حفظ التوكن */
    if (data.token) {
      localStorage.setItem("token", data.token)
    }

    /* حفظ آخر معرف استخدمه */
    localStorage.setItem("tempIdentifier", identifier)

    /* الانتقال للوحة التحكم */
    window.location.href = "dashboard.html"

  } catch (err) {

    console.error("LOGIN ERROR:", err)

    errorBox.innerText = "خطأ في الاتصال بالخادم"
    errorBox.style.display = "block"

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
