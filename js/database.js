// js/database.js

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    
    // Listener pentru formularul de adăugare
    const form = document.getElementById('addRepairForm');
    if(form) form.addEventListener('submit', createNewRepair);
});

// Deschide/Închide Modal
function openModal() { document.getElementById('repairModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('repairModal').classList.add('hidden'); }

// 1. Încărcare Date + Statistici
async function loadDashboardData() {
    const { data, error } = await supabase
        .from('reparatii')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return console.error("Eroare database:", error);

    const tbody = document.getElementById('adminBody');
    tbody.innerHTML = '';

    let inLucru = 0;
    let finalizate = 0;
    let profitTotal = 0;

    data.forEach(item => {
        // Calcul Statistici
        if(item.status === 'In lucru') inLucru++;
        if(item.status === 'Finalizat') finalizate++;
        profitTotal += (Number(item.pret_estimat) || 0) - (Number(item.cost_piese) || 0);

        // Generare Rând Tabel
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/80 transition duration-200 border-b border-slate-50";
        tr.innerHTML = `
            <td class="p-6">
                <div class="font-black text-slate-900 text-sm italic">#${item.id}</div>
                <div class="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">${item.cod_verificare}</div>
            </td>
            <td class="p-6">
                <div class="font-bold text-slate-800">${item.client_name}</div>
                <div class="text-xs text-slate-400 font-medium">${item.client_phone}</div>
            </td>
            <td class="p-6">
                <div class="font-black text-slate-700 uppercase text-xs tracking-tight">${item.device_model}</div>
                <div class="text-[9px] text-slate-400 font-mono">${item.imei_serie || 'FĂRĂ IMEI'}</div>
            </td>
            <td class="p-6 text-center">
                <select onchange="updateStatus(${item.id}, this.value)" 
                    class="p-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer ${getStatusColor(item.status)}">
                    <option value="In diagnostic" ${item.status === 'In diagnostic' ? 'selected' : ''}>Diagnostic</option>
                    <option value="In lucru" ${item.status === 'In lucru' ? 'selected' : ''}>In lucru</option>
                    <option value="Asteptare piese" ${item.status === 'Asteptare piese' ? 'selected' : ''}>Piese</option>
                    <option value="Finalizat" ${item.status === 'Finalizat' ? 'selected' : ''}>Finalizat</option>
                    <option value="Livrat" ${item.status === 'Livrat' ? 'selected' : ''}>Livrat</option>
                </select>
            </td>
            <td class="p-6 text-right space-x-3">
                <button onclick='generatePDF(${JSON.stringify(item)})' class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition shadow-sm"><i class="fas fa-file-pdf text-xs"></i></button>
                <button onclick="sendWhatsApp('${item.client_phone}', '${item.device_model}', '${item.status}')" class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:bg-green-50 hover:text-green-600 transition shadow-sm"><i class="fab fa-whatsapp text-xs"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update Statistici în UI
    document.getElementById('statInLucru').innerText = inLucru;
    document.getElementById('statReady').innerText = finalizate;
    document.getElementById('statProfit').innerText = profitTotal.toLocaleString() + " RON";
}

// 2. Creare Fișă Nouă
async function createNewRepair(e) {
    e.preventDefault();
    
    // Cod unic scurt de 6 caractere
    const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const entry = {
        client_name: document.getElementById('c_name').value,
        client_phone: document.getElementById('c_phone').value,
        device_model: document.getElementById('d_model').value,
        imei_serie: document.getElementById('d_imei').value,
        defect_reclamat: document.getElementById('d_defect').value,
        pret_estimat: Number(document.getElementById('p_estimat').value),
        cod_verificare: uniqueCode
    };

    const { error } = await supabase.from('reparatii').insert([entry]);

    if (error) {
        alert("Eroare Securitate: " + error.message);
    } else {
        closeModal();
        loadDashboardData();
        alert(`Fișă creată cu succes!\nCod Client: ${uniqueCode}`);
    }
}

// 3. Update Status Rapid
async function updateStatus(id, newStatus) {
    const { error } = await supabase
        .from('reparatii')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) alert("Eroare la update!");
    else loadDashboardData();
}

function getStatusColor(status) {
    if (status === 'Finalizat') return 'bg-green-100 text-green-700';
    if (status === 'In lucru') return 'bg-blue-100 text-blue-700';
    if (status === 'Asteptare piese') return 'bg-orange-100 text-orange-700';
    if (status === 'Livrat') return 'bg-slate-800 text-white';
    return 'bg-slate-100 text-slate-500';
}

function sendWhatsApp(phone, model, status) {
    const msg = `Salut! Dispozitivul tau ${model} este acum in stadiul: ${status.toUpperCase()}. Te tinem la curent! - Mircioiu Mobile Service`;
    window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
}
