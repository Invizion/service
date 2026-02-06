const SUB_URL = "https://bpznhufutxvoblyzkpiv.supabase.co";
const SUB_KEY = "sb_publishable_4XBnmaC7G1V7ItO2Z0xVXg_w9pyJrwb";
const supabase = supabase.createClient(SUB_URL, SUB_KEY);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        document.getElementById('error').innerText = "Acces refuzat: " + error.message;
        document.getElementById('error').classList.remove('hidden');
    } else {
        // Dacă e ok, mergem la pagina de admin
        window.location.href = "admin.html";
    }
});