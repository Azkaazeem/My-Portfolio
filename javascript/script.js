// ------------------------------------   Typing Animation   ------------------------------------

var typed = new Typed('.typing', {
    strings: ["", "Frontend Developer", "Graphic Designer"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
})












// -------------------------------------   Aside -------------------------------------

const nav = document.querySelector('.nav'),
    navList = nav.querySelectorAll('li'),
    totalNavList = navList.length,
    allSection = document.querySelectorAll('.section');

totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector('a');

    a.addEventListener('click', function () {

        removeBackSection()

        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector('a').classList.contains('active')) {
                addBackSection(j)
                // console.log('back-section' + navList[j].querySelector('a'));
                // allSection[j].classList.add('back-section');
            }

            navList[j].querySelector('a').classList.remove('active');
        }

        this.classList.add('active')
        showSection(this);

        if (window.innerWidth < 1200) {
            asideSectionTogglerBtn()
        }
    })
}

function removeBackSection() {
    for (let i = 0; i < totalNavList; i++) {
    allSection[i].classList.remove('back-section');
}
}

function addBackSection(num) {
    allSection[num].classList.add('back-section');
}

function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove('active');
    }
    const target = element.getAttribute("href").split('#')[1];
    // console.log(target);
    document.querySelector('#' + target).classList.add('active')
}

function updateNav(element) {
    // console.log(element.getAttribute("href").split('#')[1]);
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector('a').classList.remove('active');
        const target = element.getAttribute("href").split('#')[1];

        if (target === navList[i].querySelector('a').getAttribute('href').split('#')[1]) {
            navList[i].querySelector('a').classList.add('active');
        }
    }

}

document.querySelector('.hire-me').addEventListener('click', function () {
    // console.log(this);
    const sectionIndex = this.getAttribute('data-section-index');
    aside = document.querySelector('.aside');
    showSection(this);
    updateNav(this);
    removeBackSection();
    addBackSection(sectionIndex);

})

const navTogglerBtn = document.querySelector('.nav-toggle'),
    aside = document.querySelector('.aside');

navTogglerBtn.addEventListener('click', () => {
    asideSectionTogglerBtn();
})

function asideSectionTogglerBtn() {
    aside.classList.toggle('open');
    navTogglerBtn.classList.toggle('open');
}












// ------------------------------------   Supabase & SweetAlert Logic   ------------------------------------

const projectUrl = 'https://srjpepewfuumaqgadyoe.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyanBlcGV3ZnV1bWFxZ2FkeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzk3MTEsImV4cCI6MjA4MDY1NTcxMX0.9UUk7eGAl0mEpddg3brdIsOB_diT4R8IJ6YTh-zptbU';

const supabaseClient = supabase.createClient(projectUrl, apiKey);

function getThemeColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--skin-color').trim();
}

const submitBtn = document.getElementById('submitBtn');

submitBtn && submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const currentColor = getThemeColor();
        const fullName = document.getElementById('full_name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Validation
        if (fullName === "" || email === "" || message === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all required fields!',
                confirmButtonColor: currentColor,
                background: 'var(--bg-black-100)', // Dark mode background
                color: 'var(--text-black-900)'     // Dark mode text
            });
            return;
        }

        // Loading Alert
        Swal.fire({
            title: 'Sending Message...',
            html: 'Please wait while we save your response.',
            allowOutsideClick: false,
            background: 'var(--bg-black-100)', // Dark mode background
            color: 'var(--text-black-900)',     // Dark mode text
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Supabase Insert
        const { data, error } = await supabaseClient
            .from('messages')
            .insert([
                { 
                    full_name: fullName, 
                    email: email, 
                    subject: subject, 
                    message: message 
                },
            ]);

        // Response Handling
        if (error) {
            // Error Alert
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong: ' + error.message,
                confirmButtonColor: currentColor,
                background: 'var(--bg-black-100)',
                color: 'var(--text-black-900)'
            });
        } else {
            // Success Alert
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: 'Thank you for contacting me.',
                timer: 2000,
                showConfirmButton: false,
                background: 'var(--bg-black-100)',
                color: 'var(--text-black-900)',
                iconColor: 'var(--skin-color)'
            });

            // Greeting Message on Page
            const contactFormDiv = document.querySelector('.contact-form');
            
            contactFormDiv.innerHTML = `
                <div class="greeting-box" style="text-align: center; padding: 50px 20px; animation: slideSection 0.5s ease;">
                    <div style="font-size: 50px; color: var(--skin-color); margin-bottom: 20px;">
                        <i class="fa fa-check-circle"></i>
                    </div>
                    <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 10px; color: var(--text-black-900);">Thank You, ${fullName}!</h3>
                    <p style="font-size: 16px; color: var(--text-black-700);">
                        Your message has been received securely. <br> I will get back to you at <strong>${email}</strong> soon.
                    </p>
                </div>
            `;
        }
    });
