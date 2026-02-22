const cards = document.querySelectorAll('.people-card');

cards.forEach(card => {
    card.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            this.classList.toggle('is-tapped');
            cards.forEach(c => { if (c !== this) c.classList.remove('is-tapped'); });
        }
    });
});

const ocmList = document.getElementById("ocm-list");

const members = [
    { name: "Diya Konar", role: "OCM OF EVENTS", phone: "8972572486", email: "diyakonar99@gmail.com", linkedin: "https://www.linkedin.com/in/diya-konar-61546028b" },
    { name: "Aanjishnu Bhattacharyya", role: "OCM (WebDevelopment)", phone: "", email: "freshgrounds.nrp+eXabyte@gmail.com", linkedin: "https://www.linkedin.com/in/aanjishnu" },
    { name: "Shitij Bhadra", role: "OCM (Systems)", phone: "", email: "jeetbhadra2005@gmail.com", linkedin: "https://www.linkedin.com/in/shitij-bhadra-4aa879312" },
    { name: "Jishnu Chattopadhyay", role: "OCM ( Systems )", phone: "", email: "jishnuchattopadhya@gmail.com", linkedin: "" },
    { name: "Shashank Tiwari", role: "OCM (Events)", phone: "", email: "twari.shashank05@gmail.com", linkedin: "https://www.linkedin.com/in/shashank-tiwari-92946528b" },
    { name: "Shubhrajyoti Biswas", role: "OCM (Logistics)", phone: "8617216165", email: "shubhrajyotib3@gmail.com", linkedin: "https://www.linkedin.com/in/shubhrajyoti-biswas-258224368" },
    { name: "Chayan Pal", role: "OCM (Photography)", phone: "", email: "palc02.github.io/Photography", linkedin: "https://www.linkedin.com/in/chayan-pal-580058260" },
    { name: "Ujjainee Sengupta", role: "OCM (Photography)", phone: "", email: "ujjaineeushasi4321@gmail.com", linkedin: "https://www.linkedin.com/in/ujjainee-sengupta-1278522a7" },
    { name: "Sourashis Nath", role: "OCM (PR)", phone: "9038490777", email: "nath.soura18@gmail.com", linkedin: "https://www.instagram.com/loonixi" },
    { name: "Aditi Das", role: "OCM (PR)", phone: "8697945875", email: "aditi13042004@gmail.com", linkedin: "https://www.linkedin.com/in/aditi-das-20040413ad" },
    { name: "Saheli Majumder", role: "OCM (Cultural)", phone: "6290718056", email: "sahelimajumder2004@gmail.com", linkedin: "https://www.linkedin.com/in/sahelimajumder001" },
    { name: "Arghya Mukherjee", role: "OCM (Videography)", phone: "7439248710", email: "arghyam.india@gmail.com", linkedin: "https://www.linkedin.com/in/arghya-mukherjee-464422332" },
    { name: "Anandi Roy Chowdhury", role: "OCM (Content)", phone: "", email: "anandiroychowdhury20218096@gmail.com", linkedin: "https://www.linkedin.com/in/anandi-roy-chowdhury-657313289" },
    { name: "Pragna Pramanik", role: "OCM (Videography)", phone: "9883892210", email: "pragnapramanik2020@gmail.com", linkedin: "https://www.linkedin.com/in/pragna-pramanik-28912a279" },
    { name: "Devanshi Bhattacharjee", role: "OCM (Hospitality)", phone: "", email: "devanshibhattacharjeenn@gmail.com", linkedin: "" },
    { name: "Sujatra Paul", role: "OCM (Logistics)", phone: "9330660104", email: "sujatraofficio2005@gmail.com", linkedin: "" },
    { name: "Sucheta Sinha", role: "OCM (Hospitality)", phone: "", email: "", linkedin: "" },
    { name: "Archita Sengupta", role: "OCM (Cultural)", phone: "", email: "architasengupta06@gmail.com", linkedin: "https://www.linkedin.com/in/archita-sengupta-b5b449316" },
    { name: "Aireen Jawed", role: "OCM (Content Creation)", phone: "6291637696", email: "aireenjawed24@gmail.com", linkedin: "https://www.linkedin.com/in/aireen-jawed-59174b28b" }
];

function createCard(member) {
    const card = document.createElement("div");
    card.className = "people-card";
    let overlayIcons = "";
    if (member.phone && member.phone.trim() !== "") {
        overlayIcons += `
            <a href="tel:${member.phone}" class="social-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            </a>
        `;
    }
    if (member.email && member.email.trim() !== "") {
        overlayIcons += `
            <a href="mailto:${member.email}" class="social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                </svg>
            </a>
        `;
    }
    if (member.linkedin && member.linkedin.trim() !== "") {
        overlayIcons += `
            <a href="${member.linkedin}" target="_blank" class="social-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                </svg>
            </a>
        `;
    }
    card.innerHTML = `
        <div class="card-info">
            <h3>${member.name}</h3>
            <p>${member.role}</p>
        </div>

        <img src="assets/default.png"
            alt="Member" class="card-img">

        <div class="card-overlay">
            ${overlayIcons}
        </div>
    `;
    return card;
}

members.forEach(member => {
    ocmList.appendChild(createCard(member));
});