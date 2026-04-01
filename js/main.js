// Funcionalidad principal para SIMSA Landing Page
 
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('mainNavbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
 
    // Initialize Bootstrap ScrollSpy
    const scrollSpyContainer = document.body;
    const scrollSpyTarget = document.getElementById('navbarNav');
    if (scrollSpyTarget) {
        new bootstrap.ScrollSpy(scrollSpyContainer, {
            target: '#navbarNav',
            offset: 100
        });
    }
 
    // 2. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Agregamos clase reveal a las tarjetas individuales si no la tienen globalmente
    serviceCards.forEach((card, index) => {
        if(!card.classList.contains('reveal')) {
            card.classList.add('reveal');
            card.style.transitionDelay = `${index * 0.1}s`;
        }
    });
 
    const revealOptions = {
        threshold: 0.15, // Activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    };
 
    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
 
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
 
    // Para las tarjetas generadas dinámicamente o añadidas post-load
    serviceCards.forEach(el => {
        revealObserver.observe(el);
    });
 
    // 3. Smooth scroll for anchor links
    document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust scroll position for sticky header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
 
    // 4. Formulario Web3Forms con SweetAlert2
    const form = document.getElementById('cotizacionForm');
    const submitBtn = document.getElementById('submitBtn');
 
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
 
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando... <i class="bi bi-hourglass-split ms-2"></i>';
 
            const formData = new FormData(form);
 
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
 
                const data = await response.json();
 
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Solicitud enviada!',
                        html: 'Gracias por contactarnos.<br>Nos pondremos en contacto contigo a la brevedad.',
                        confirmButtonText: 'Cerrar',
                        confirmButtonColor: '#1a365d',
                        iconColor: '#28a745',
                    });
                    form.reset();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al enviar',
                        text: 'Por favor intenta de nuevo o contáctanos directamente.',
                        confirmButtonText: 'Cerrar',
                        confirmButtonColor: '#1a365d',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Verifica tu conexión a internet e intenta de nuevo.',
                    confirmButtonText: 'Cerrar',
                    confirmButtonColor: '#1a365d',
                });
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar Solicitud <i class="bi bi-send ms-2"></i>';
            }
        });
    }
 
});
