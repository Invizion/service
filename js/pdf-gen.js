function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('ro-RO');

    // Header - Branding
    doc.setFillColor(30, 41, 59); // Dark Slate
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("MIRCIOIU MOBILE SERVICE", 15, 25);
    
    doc.setFontSize(10);
    doc.text("Strada Exemplului Nr. 1, Telefon: 07xx xxx xxx", 15, 33);
    doc.text(`Data: ${date}`, 160, 25);

    // Detalii Fișă
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`FISA SERVICE NR: #${data.id}`, 15, 55);
    doc.text(`Cod Verificare Online: ${data.cod_verificare}`, 140, 55);

    // Linie separatoare
    doc.setLineWidth(0.5);
    doc.line(15, 60, 195, 60);

    // Tabel Date
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`CLIENT: ${data.client_name}`, 15, 75);
    doc.text(`TELEFON: ${data.client_phone}`, 15, 82);
    
    doc.text(`DISPOZITIV: ${data.device_model}`, 110, 75);
    doc.text(`IMEI/SERIE: ${data.imei || 'N/A'}`, 110, 82);

    doc.text(`DEFECT RECLAMAT:`, 15, 95);
    doc.setFontSize(10);
    doc.text(data.defect || "Nespecificat", 15, 102, { maxWidth: 180 });

    doc.setFontSize(11);
    doc.text(`PRET ESTIMAT: ${data.pret_estimat} RON`, 15, 120);

    // TERMENI SI CONDITII (Protectia ta)
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const termeni = [
        "1. Diagnosticarea poate dura intre 24-72 ore.",
        "2. Service-ul NU raspunde pentru pierderea datelor din dispozitiv. Va rugam faceti backup.",
        "3. Ne-ridicarea dispozitivului in 60 de zile duce la reciclarea acestuia.",
        "4. Garantia se acorda doar pentru piesa inlocuita si manopera aferenta."
    ];
    doc.text("TERMENI SI CONDITII:", 15, 140);
    doc.text(termeni, 15, 145);

    // Semnaturi
    doc.setTextColor(0,0,0);
    doc.text("Semnatura Client:", 15, 180);
    doc.text("Semnatura Tehnician:", 140, 180);
    doc.line(15, 195, 60, 195);
    doc.line(140, 195, 185, 195);

    // Salvare
    doc.save(`Fisa_MMS_${data.id}.pdf`);
}