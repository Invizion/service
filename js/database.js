// Configurare Supabase (Folosește aceleași chei ca în auth.js)
const SUB_URL = "https://bpznhufutxvoblyzkpiv.supabase.co";
const SUB_KEY = "sb_publishable_4XBnmaC7G1V7ItO2Z0xVXg_w9pyJrwb";
const supabase = supabase.createClient(SUB_URL, SUB_KEY);

// Încarcă datele la pornire
document.addEventListener('DOMContentLoaded', fetchReparatii);

async function fetchReparatii() {
    const { data, error } = await supabase
        .from('reparatii')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Eroare la încărcare:", error);
        return;
    }

    const tableBody = document.getElementById('reparatiiTable');
    tableBody.innerHTML = '';

    data.forEach(rep => {
        const tr = document.createElement('tr');
        tr.className = "border-b hover:bg-gray-50 transition";
        tr.innerHTML = `
            <td class="p-4 font-mono text-sm">#${rep.id}</td>
            <td class="p-4 font-bold">${rep.client_name}<br><span class="text-xs text-gray-500">${rep.client_phone}</span></td>
            <td class="p-4">${rep.device_model}</td>
            <td class="p-4">
                <select onchange="updateStatus(${rep.id}, this.value)" class="text-xs font-bold p-1 rounded border ${getStatusColor(rep.status)}">
                    <option value="In diagnostic" ${rep.status === 'In diagnostic' ? 'selected' : ''}>In diagnostic</option>
                    <option value="In lucru" ${rep.status === 'In lucru' ? 'selected' : ''}>In lucru</option>
                    <option value="Asteptare piese" ${rep.status === 'Asteptare piese' ? 'selected' : ''}>Asteptare piese</option>
                    <option value="Finalizat" ${rep.status === 'Finalizat' ? 'selected' : ''}>Finalizat</option>
                </select>
            </td>
            <td class="p-4 flex gap-2 justify-center">
                <button onclick='generatePDF(${JSON.stringify(rep)})' class="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Descarcă PDF">📄</button>
                <button onclick="sendWhatsApp('${rep.client_phone}', '${rep.device_model}', '${rep.status}')" class="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Trimite WhatsApp">📱</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Funcție pentru culori status
function getStatusColor(status) {
    if (status === 'Finalizat') return 'bg-green-100 text-green-700';
    if (status === 'In lucru') return 'bg-blue-100 text-blue-700';
    if (status === 'Asteptare piese') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
}

// Salvare Fișă Nouă
document.getElementById('addRepairForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newData = {
        client_name: document.getElementById('c_name').value,
        client_phone: document.getElementById('c_phone').value,
        device_model: document.getElementById('d_model').value,
        imei: document.getElementById('d_imei').value,
        defect: document.getElementById('d_defect').value,
        pret_estimat: document.getElementById('p_estimat').value,
        cod_verificare: Math.floor(1000 + Math.random() * 9000).toString() // Cod random de 4 cifre
    };

    const { error } = await supabase.from('reparatii').insert([newData]);
    if (error) alert("Eroare la salvare!");
    else {
        document.getElementById('modal').classList.add('hidden');
        fetchReparatii();
    }
});

async function updateStatus(id, newStatus) {
    await supabase.from('reparatii').update({ status: newStatus }).eq('id', id);
    fetchReparatii();
}

function sendWhatsApp(phone, model, status) {
    const msg = `Salut! Dispozitivul tau ${model} are acum statusul: ${status.toUpperCase()}. Mircioiu Mobile Service.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}