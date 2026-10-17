document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 2. HEADER GLASSMORPHISM NO SCROLL
    // ==========================================
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // ==========================================
    // 3. MENU MOBILE
    // ==========================================
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    menuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const isExpanded = mainNav.classList.contains('active');
        menuBtn.setAttribute('aria-expanded', isExpanded);
        menuBtn.textContent = isExpanded ? '✕' : '☰';
    });

    // Fechar menu ao clicar em um link
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.textContent = '☰';
        });
    });

    // ==========================================
    // 4. FAQ ACCORDION
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;
            
            // Fechar todos os outros
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });
            
            // Toggle atual
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // ==========================================
    // 5. SISTEMA DE COOKIES E TRACKING
    // ==========================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    
    // Verifica se já aceitou
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.remove('hidden');
    }
    
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.add('hidden');
        console.log('Cookies aceitos. Rastreamento ativado.');
    });

    // Função de rastreamento segura
    window.trackEvent = function(eventName, category) {
        const hasConsent = localStorage.getItem('cookiesAccepted') === 'true';
        if (hasConsent) {
            // [PLACEHOLDER] Aqui você integra com gtag('event', ...), fbq('track', ...), etc.
            console.log(`[TRACKING] Event: ${eventName}, Category: ${category}`);
            
            // Exemplo real para GA4 (descomente quando o GTM/GA4 estiver ativo):
            // if (typeof gtag === 'function') {
            //     gtag('event', eventName, { 'event_category': category });
            // }
        } else {
            console.log('[TRACKING] Bloqueado: Consentimento não dado.');
        }
    };

    // ==========================================
    // 6. RASCUNHO DE FORMULÁRIO (LocalStorage)
    // ==========================================
    const form = document.getElementById('contact-form');
    const formInputs = form.querySelectorAll('input, textarea, select');
    
    // Carregar rascunho
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`form_draft_${input.name}`);
        if (savedValue && input.type !== 'checkbox') {
            input.value = savedValue;
        }
        if (savedValue && input.type === 'checkbox') {
            input.checked = savedValue === 'true';
        }
        
        // Salvar ao digitar
        input.addEventListener('input', () => {
            const value = input.type === 'checkbox' ? input.checked : input.value;
            localStorage.setItem(`form_draft_${input.name}`, value);
        });
    });
    
    // Limpar rascunho ao enviar com sucesso
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            // Simulação de envio
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            form.reset();
            formInputs.forEach(input => {
                localStorage.removeItem(`form_draft_${input.name}`);
            });
            window.trackEvent('form_success', 'conversion');
        } else {
            form.reportValidity();
        }
    });

    // ==========================================
    // 7. WHATSAPP CONTEXTUAL
    // ==========================================
    const whatsappFloat = document.getElementById('whatsapp-float');
    const whatsappTooltip = document.getElementById('whatsapp-tooltip');
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > 50 && !whatsappFloat.dataset.contextualized) {
            whatsappTooltip.textContent = "Ainda com dúvidas? Fale conosco!";
            whatsappFloat.dataset.contextualized = "true";
        } else if (scrollPercent <= 50 && whatsappFloat.dataset.contextualized) {
            whatsappTooltip.textContent = "Agende seu horário!";
            delete whatsappFloat.dataset.contextualized;
        }
    }, { passive: true });
});