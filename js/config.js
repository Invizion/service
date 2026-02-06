// js/config.js
const SUPABASE_URL = "https://bpznhufutxvoblyzkpiv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwem5odWZ1dHh2b2JseXprcGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODUyNjgsImV4cCI6MjA4NTk2MTI2OH0.TBevkJT4Ph6-vEeNEZ4-F30Ka8i4vaX64OL9dZRd4O0";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// PROTECȚIE ADMIN: Verifică accesul
async function checkAccess() {
    const { data: { session } } = await supabase.auth.getSession();
    const isAdminPage = window.location.pathname.includes('admin.html');

    if (!session && isAdminPage) {
        window.location.href = 'login.html';
    }
    return session;
}

// Executăm verificarea imediat ce se încarcă scriptul
if (window.location.pathname.includes('admin.html')) {
    checkAccess();
}