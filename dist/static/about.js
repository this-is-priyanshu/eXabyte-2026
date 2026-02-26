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
    { name: "Diya Konar", role: "OCM OF EVENTS", phone: "8972572486", email: "diyakonar99@gmail.com", linkedin: "https://www.linkedin.com/in/diya-konar-61546028b", instagram: "https://www.instagram.com/__.diiiyyyaaaa.__" },
    { name: "Shashank Tiwari", role: "OCM OF EVENTS", phone: "", email: "twari.shashank05@gmail.com", linkedin: "https://www.linkedin.com/in/shashank-tiwari-92946528b", instagram: "" },
    
    { name: "Shitij Bhadra", role: "OCM (Systems)", phone: "", email: "jeetbhadra2005@gmail.com", linkedin: "https://www.linkedin.com/in/shitij-bhadra-4aa879312", instagram: "" },
    { name: "Jishnu Chattopadhyay", role: "OCM ( Systems )", phone: "", email: "jishnuchattopadhya@gmail.com", linkedin: "", instagram: "" },
    
    { name: "Shubhrajyoti Biswas", role: "OCM (Logistics)", phone: "8617216165", email: "shubhrajyotib3@gmail.com", linkedin: "https://www.linkedin.com/in/shubhrajyoti-biswas-258224368", instagram: "" },
    { name: "Sujatra Paul", role: "OCM (Logistics)", phone: "9330660104", email: "sujatraofficio2005@gmail.com", linkedin: "", instagram: "https://www.instagram.com/capt.suga21" },
    
    { name: "Chayan Pal", role: "OCM (Photography)", phone: "", email: "palc02.github.io/Photography", linkedin: "https://www.linkedin.com/in/chayan-pal-580058260", instagram: "" },
    { name: "Ujjainee Sengupta", role: "OCM (Photography)", phone: "", email: "ujjaineeushasi4321@gmail.com", linkedin: "https://www.linkedin.com/in/ujjainee-sengupta-1278522a7", instagram: "" },
    
    { name: "Sourashis Nath", role: "OCM (PR)", phone: "9038490777", email: "nath.soura18@gmail.com", linkedin: "", instagram: "https://www.instagram.com/loonixi" },
    { name: "Aditi Das", role: "OCM (PR)", phone: "8697945875", email: "aditi13042004@gmail.com", linkedin: "https://www.linkedin.com/in/aditi-das-20040413ad", instagram: "" },
    
    { name: "Arghya Mukherjee", role: "OCM (Videography)", phone: "7439248710", email: "arghyam.india@gmail.com", linkedin: "https://www.linkedin.com/in/arghya-mukherjee-464422332", instagram: "" },
    { name: "Pragna Pramanik", role: "OCM (Videography)", phone: "9883892210", email: "pragnapramanik2020@gmail.com", linkedin: "https://www.linkedin.com/in/pragna-pramanik-28912a279", instagram: "" },
    
    { name: "Saheli Majumder", role: "OCM (Cultural)", phone: "6290718056", email: "sahelimajumder2004@gmail.com", linkedin: "https://www.linkedin.com/in/sahelimajumder001", instagram: "" },
    { name: "Archita Sengupta", role: "OCM (Cultural)", phone: "", email: "architasengupta06@gmail.com", linkedin: "https://www.linkedin.com/in/archita-sengupta-b5b449316", instagram: "" },
    
    { name: "Devanshi Bhattacharjee", role: "OCM (Hospitality)", phone: "", email: "devanshibhattacharjeenn@gmail.com", linkedin: "", instagram: "" },
    { name: "Sucheta Sinha", role: "OCM (Hospitality)", phone: "", email: "", linkedin: "", instagram: "" },
    
    { name: "Anandi Roy Chowdhury", role: "OCM (Content Creation)", phone: "", email: "anandiroychowdhury20218096@gmail.com", linkedin: "https://www.linkedin.com/in/anandi-roy-chowdhury-657313289", instagram: "" },
    { name: "Aireen Jawed", role: "OCM (Content Creation)", phone: "6291637696", email: "aireenjawed24@gmail.com", linkedin: "https://www.linkedin.com/in/aireen-jawed-59174b28b", instagram: "" },
    
    { name: "Sounak De", role: "OCM (Design)", phone: "8335098087", email: "sounakde69@gmail.com", linkedin: "https://www.linkedin.com/in/sounak-de-22-04-2005-/", instagram: "" }
];

function createCard(member) {
    const card = document.createElement("div");
    card.className = "people-card";

    let overlayIcons = "";

    const hasPhone = member.phone && member.phone.trim() !== "";
    const hasEmail = member.email && member.email.trim() !== "";
    const hasLinkedin = member.linkedin && member.linkedin.trim() !== "";
    const hasInstagram = member.instagram && member.instagram.trim() !== "";

    if (hasPhone) {
        overlayIcons += `
            <a href="tel:${member.phone}" class="social-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            </a>
        `;
    }

    if (hasEmail) {
        overlayIcons += `
            <a href="mailto:${member.email}" class="social-btn">
                <svg viewBox="0 0 16 16">
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                </svg>
            </a>
        `;
    }

    if (hasLinkedin) {
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

    if ((!hasPhone || !hasEmail || !hasLinkedin) && hasInstagram) {
        overlayIcons += `
            <a href="${member.instagram}" target="_blank" class="social-btn">
                <svg viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
            </a>
        `;
    }

    card.innerHTML = `
        <div class="card-info">
            <h3>${member.name}</h3>
            <p>${member.role}</p>
        </div>
        <img src="assets/default.png" alt="Member" class="card-img">
        <div class="card-overlay">
            ${overlayIcons}
        </div>
    `;

    return card;
}

members.forEach(member => {
    ocmList.appendChild(createCard(member));
});