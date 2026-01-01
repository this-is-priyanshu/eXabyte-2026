const college = document.getElementById('college');
const iff_sxc = document.getElementById('iff-sxc');
const iff_sxc_input = document.getElementById('roll');

college.addEventListener('change', function () {

    const abbr = this.value.toLowerCase().split(/ +/).map((a) => a[0]).join('').substring(0, 3)

    if (abbr === 'sxc') {
        iff_sxc.classList.remove('hidden-block');
        iff_sxc.classList.add('show-block');
    } else {
        iff_sxc.classList.remove('show-block');
        iff_sxc.classList.add('hidden-block');
        iff_sxc_input.value = '';
    }
});

const form = document.getElementById('event-registration');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const dude = document.querySelector('.loader-father')
    dude.classList.remove('noshow')

    const cook= document.querySelector('.form-container')
    cook.classList.add('blurout')

    const fd = new FormData(this);

    const formDataString = [...fd.entries()].map(entry => entry.join('=')).join('&');
    console.log(formDataString)

    window.crypto.subtle.digest('SHA-1', new TextEncoder().encode(formDataString))
        .then(
            async value => {

                fd.append('id', new Uint8Array(value).toBase64())
                fd.append('timestamp', new Date())
                fd.append('access_key', "d9a93770-0d66-496c-bc5e-a5f943e5a79d");

                try {
                    const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        body: fd
                    });

                    const data = await response.json();

                    if (response.ok) {

                        const thing = JSON.stringify({
                            name: fd.get('name'),
                            college: fd.get('college'),
                            ticket: fd.get('id'),
                            timestamp: fd.get('timestamp')
                        })

                        const transport = new TextEncoder().encode(thing).toBase64();
                        window.location.href = '/submit.html?v=' + transport;

                    } else {
                        alert("Error: " + data.message);
                    }

                } catch (error) {

                    // WE REDIRECT TO A GOOGLE FORMS HERE

                    console.log(error)
                    alert("Something went wrong. Please try again.");
                }
            })
})
