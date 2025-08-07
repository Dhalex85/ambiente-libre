// Mobile menu toggle - MEJORADO
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            const hamburger = document.querySelector('.hamburger');
            
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        function closeMenu() {
            const navMenu = document.getElementById('navMenu');
            const hamburger = document.querySelector('.hamburger');
            
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const navMenu = document.getElementById('navMenu');
            const hamburger = document.querySelector('.hamburger');
            const header = document.querySelector('.header');
            
            if (!header.contains(event.target) && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Calcular altura del header fijo
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    // Calcular posición del destino menos la altura del header
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Calculator functionality
        function actualizarEtiquetaConsumo() {
            const periodo = document.querySelector('input[name="periodo"]:checked').value;
            const etiqueta = document.getElementById('etiqueta-consumo');
            const input = document.getElementById('consumo');
            
            if (periodo === 'bimestral') {
                etiqueta.textContent = 'Consumo bimestral promedio (kWh)';
                input.placeholder = 'Ej: 700';
            } else {
                etiqueta.textContent = 'Consumo mensual promedio (kWh)';
                input.placeholder = 'Ej: 350';
            }
        }

        function actualizarTarifaCFE() {
            const tipoInstalacion = document.getElementById('tipo-instalacion').value;
            const tarifaInput = document.getElementById('tarifa');
            
            const tarifas = {
                'residencial': 1.50,
                'comercial': 4.00,
                'industrial': 3.00
            };
            
            const tarifaSeleccionada = tarifas[tipoInstalacion];
            tarifaInput.value = tarifaSeleccionada;
        }

        
        function calcularAhorro() {
    // Obtener valores del formulario
    const consumoInput = parseFloat(document.getElementById('consumo').value);
    const tarifa = parseFloat(document.getElementById('tarifa').value);
    const tipoInstalacion = document.getElementById('tipo-instalacion').value;
    const periodo = document.querySelector('input[name="periodo"]:checked').value;

    // Validación
    if (!consumoInput || consumoInput <= 0) {
        alert('Por favor ingresa un consumo válido');
        return;
    }

    // Convertir consumo a mensual
    const consumoMensual = periodo === 'bimestral' ? consumoInput / 2 : consumoInput;

    // Parámetros técnicos
    const irradiacion = 5.2;
    const factorEficiencia = 0.8;
    const horasDia = 5.2;
    const diasMes = 30.4;
    
    // Cálculo de capacidad del sistema
    const capacidadKW = (consumoMensual / (horasDia * factorEficiencia * diasMes)) * 1.15;
    
    // Costos base por kW (MXN)
    const costosBase = {
        'residencial': 6000,
        'comercial': 13000,
        'industrial': 11000
    };
    
    // Ajustar costo base para cumplir con los retornos objetivo
    const costoPorKW = costosBase[tipoInstalacion] * ajusteCostoPorConsumo(consumoMensual);
    const costoTotal = capacidadKW * costoPorKW;
    
    // Cálculo de ahorros
    const gastoMensual = consumoMensual * tarifa;
    const ahorroAnual = gastoMensual * 0.85 * 12;
    
    // Cálculo y ajuste del tiempo de retorno
    let tiempoRetorno = calcularRetornoAjustado(consumoMensual, costoTotal, ahorroAnual);
    

    // Función para ajuste lineal del retorno entre 100-600 kWh
    function calcularRetornoAjustado(consumo, costo, ahorro) {
        const retornoBase = costo / ahorro;
        
        // Puntos de referencia
        const consumoMin = 100;
        const consumoMax = 600;
        const retornoMin = 3.6;
        const retornoMax = 2.83;
        
        if (consumo <= consumoMin) return retornoMin;
        if (consumo >= consumoMax) return retornoMax;
        
        // Fórmula de interpolación lineal
        const pendiente = (retornoMax - retornoMin) / (consumoMax - consumoMin);
        return retornoMin + pendiente * (consumo - consumoMin);
    }
    
    // Ajuste de costos para mantener la progresión
    function ajusteCostoPorConsumo(consumo) {
        // Factores de ajuste para mantener la curva de retorno
        if (consumo <= 100) return 1.15;  // +15% para 100 kWh
        if (consumo >= 600) return 0.95;   // -5% para 600 kWh
        
        // Interpolación lineal entre los factores
        return 1.15 - (consumo - 100) * 0.0004;
    }
    


            // Mostrar resultados
            document.getElementById('resultado').style.display = 'block';
            document.getElementById('resultadoDetalle').innerHTML = `
                <div style="display: grid; gap: 1rem; text-align: center; justify-items: center;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; min-width: 220px;">
                        <strong>💸 Ahorro anual estimado:</strong><br>
                        $${ahorroAnual.toLocaleString('es-MX', {minimumFractionDigits: 2})} MXN
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; min-width: 220px;">
                        <strong>⏱️ Retorno de inversión:</strong><br>
                        ${tiempoRetorno.toFixed(2)} años
                    </div>
                    <div style="background: rgba(76, 175, 80, 0.15); padding: 0.7rem; border-radius: 8px; border: 1px solid #4caf50; font-size: 1em; max-width: 400px;">
                        <small>Nota: Los resultados mostrados son una proyección estimada basada en parámetros promedio. Para obtener un cálculo preciso y una cotización gratuita adaptada a tus necesidades específicas, te invitamos a contactarnos. ¡Estamos para ayudarte!</small>
                    </div>
                </div>
            `;

            // Scroll to results
            document.getElementById('resultado').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        // Contact form handling
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Create WhatsApp message
            let mensaje = `*Nueva Solicitud de Cotización - Ambiente Libre*\n\n`;
            mensaje += `*Nombre:* ${data.nombre}\n`;
            mensaje += `*Email:* ${data.email}\n`;
            mensaje += `*Teléfono:* ${data.telefono}\n`;
            mensaje += `*Tipo de Proyecto:* ${data.tipo_proyecto}\n`;
            
            // Check if file is attached
            const fileInput = document.getElementById('recibo_cfe');
            if (fileInput.files.length > 0) {
                mensaje += `*Recibo de CFE:* ${fileInput.files[0].name} (adjunto)\n`;
                mensaje += `*Nota:* El cliente adjuntará el recibo de CFE por correo electrónico\n`;
            }
            
            if (data.mensaje) {
                mensaje += `*Mensaje:* ${data.mensaje}\n`;
            }
            
            mensaje += `\n¡Gracias por contactarnos!`;
            
            // Encode message for WhatsApp
            const mensajeCodificado = encodeURIComponent(mensaje);
            const whatsappUrl = `https://wa.me/527712149628?text=${mensajeCodificado}`;
            
            // If there's a file attached, show instructions for email
            if (fileInput.files.length > 0) {
                alert('¡Gracias por tu solicitud! Te redirigimos a WhatsApp para el contacto inicial. Por favor, envía tu recibo de CFE al correo: ambientelibre.cotiza@outlook.com');
            } else {
                alert('¡Gracias por tu solicitud! Te redirigimos a WhatsApp para completar el contacto.');
            }
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            this.reset();
            document.getElementById('file-selected').textContent = 'Ningún archivo seleccionado';
            document.querySelector('.file-label').classList.remove('has-file');
        });

        // File input handling
        document.getElementById('recibo_cfe').addEventListener('change', function(e) {
            const fileLabel = document.querySelector('.file-label');
            const fileSelected = document.getElementById('file-selected');
            
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                const fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2); // MB
                fileSelected.textContent = `${fileName} (${fileSize} MB)`;
                fileLabel.classList.add('has-file');
            } else {
                fileSelected.textContent = 'Ningún archivo seleccionado';
                fileLabel.classList.remove('has-file');
            }
        });

        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'linear-gradient(135deg, rgba(26, 54, 93, 0.95), rgba(44, 82, 130, 0.95))';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #1a365d, #2c5282)';
                header.style.backdropFilter = 'none';
            }
        });

        // Animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.addEventListener('DOMContentLoaded', function() {
            const animatedElements = document.querySelectorAll('.service-card, .project-card, .value-item, .main-service, .secondary-service');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                observer.observe(el);
            });
        });


//INICIO GALERIA
// Gallery functionality
let galleryApp = null;
let mobileGalleryApp = null;

// Project gallery data
const projectGalleries = {
    textil: {
        title: 'Fábrica Textil',
        images: [
            'img/textil/textil2.jpg',
            'img/textil/textil3.jpg',
            'img/textil/textil1.jpg',
            'img/textil/textil4.jpg',
            'img/textil/textil5.jpg'
        ]
    },
    herrajes: {
        title: 'Fábrica de Herrajes',
        images: [
            'img/herrajes/herrajes4.jpg',
            'img/herrajes/herrajes3.jpg',
            'img/herrajes/herrajes1.jpg',
            'img/herrajes/herrajes2.jpg',
            //'img/herrajes/herrajes5.jpg'
        ]
    },
    concretera: {
        title: 'Concretera',
        images: [
           'img/concretera/concretera4.jpg',
            'img/concretera/concretera3.jpg',
            'img/concretera/concretera1.jpg',
            'img/concretera/concretera2.jpg',
            'img/concretera/concretera5.jpg'
        ]
    },
    pachuca: {
        title: 'Zona Metropolitana Pachuca',
        images: [
            'img/pachuca/pachuca3.jpg',
            'img/pachuca/pachuca4.jpg',
            'img/pachuca/pachuca1.jpg',
            'img/pachuca/pachuca2.jpg',
            'img/pachuca/pachuca5.jpg'
        ]
    },
    residenciales: {
        title: 'Proyectos Residenciales',
        images: [
            'img/domestico.webp',
            'img/domestico.webp',
            'img/domestico.webp',
            'img/domestico.webp',
            'img/domestico.webp'
        ]
    },
    comerciales: {
        title: 'Proyectos Comerciales',
        images: [
            'img/comercial.webp',
            'img/comercial.webp',
            'img/comercial.webp',
            'img/comercial.webp',
            'img/comercial.webp'
        ]
    }
};

function openGallery(projectType) {
    const gallery = projectGalleries[projectType];
    if (!gallery) {
        console.error('Gallery not found for project type:', projectType);
        return;
    }

    console.log('Opening gallery:', projectType, gallery);

    // Set gallery title
    document.getElementById('gallery-title').textContent = gallery.title;

    // Show modal
    const modal = document.getElementById('gallery-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // LIMPIEZA COMPLETA: Desmontar aplicaciones anteriores
    cleanupGalleryApps();

    // Esperar un poco para que el DOM se actualice
    setTimeout(() => {
        initializeGalleryApps(gallery);
    }, 150);
}

function cleanupGalleryApps() {
    if (galleryApp) {
        try {
            galleryApp.unmount();
        } catch (error) {
            console.warn('Error unmounting gallery app:', error);
        }
        galleryApp = null;
    }
    
    if (mobileGalleryApp) {
        try {
            mobileGalleryApp.unmount();
        } catch (error) {
            console.warn('Error unmounting mobile gallery app:', error);
        }
        mobileGalleryApp = null;
    }

    // Limpiar contenedores
    const desktopGallery = document.getElementById('gallery-app');
    const mobileGallery = document.getElementById('mobile-gallery');
    
    if (desktopGallery) {
        desktopGallery.innerHTML = '';
    }
    
    if (mobileGallery) {
        mobileGallery.innerHTML = '';
    }
}

function initializeGalleryApps(gallery) {
    if (!gallery || !gallery.images) {
        console.error('Gallery data is invalid:', gallery);
        return;
    }

    console.log('Initializing galleries with images:', gallery.images);

    // Verificar que Vue esté disponible
    if (typeof Vue === 'undefined') {
        console.error('Vue.js not loaded');
        // Fallback para mostrar galería sin Vue
        initializeFallbackGallery(gallery);
        return;
    }

    const { createApp, reactive, ref } = Vue;

    // Desktop Gallery App
    try {
        const desktopContainer = document.getElementById('gallery-app');
        if (desktopContainer) {
            desktopContainer.innerHTML = `
                <ul class="gallery">
                    <li
                        v-for="item in items"
                        :key="item.id"
                        :data-pos="item.pos"
                        :style="{
                            translate: \`calc(var(--gallery-width) * 0.2 * \${item.pos})\`,
                            scale: item.scale,
                            backgroundImage: \`url(\${item.url})\`
                        }"
                        @click="shuffle(item)"
                    ></li>
                </ul>
            `;

            galleryApp = createApp({
                setup() {
                    const items = reactive(
                        gallery.images.map((url, index) => ({
                            id: index,
                            pos: index,
                            url: url,
                            scale: index === Math.floor(gallery.images.length / 2) ? 1 : 0.8
                        }))
                    );

                    function shuffle(item) {
                        const heroPos = Math.floor(items.length / 2);
                        const hero = items.findIndex(({ pos }) => pos === heroPos);
                        const target = items.findIndex(({ id }) => id === item.id);
                        
                        [items[target].pos, items[hero].pos] = [items[hero].pos, items[target].pos];
                        
                        // Actualizar escalas
                        items.forEach(item => {
                            item.scale = item.pos === heroPos ? 1 : 0.8;
                        });
                    }

                    return {
                        items,
                        shuffle,
                    }
                },
            }).mount('#gallery-app');

            console.log('Desktop gallery mounted successfully');
        }
    } catch (error) {
        console.error('Error mounting desktop gallery:', error);
    }

    // Mobile Gallery App
    try {
        const mobileContainer = document.getElementById('mobile-gallery');
        if (mobileContainer) {
            mobileContainer.innerHTML = `
                <div class="mobile-gallery-container">
                    <div 
                        v-for="(image, index) in images" 
                        :key="'slide-' + index" 
                        class="mobile-gallery-slide"
                        :style="{ backgroundImage: \`url(\${image})\` }"
                    ></div>
                </div>
                <div class="mobile-gallery-indicators">
                    <span 
                        v-for="(image, index) in images" 
                        :key="'indicator-' + index" 
                        class="indicator"
                        :class="{ active: index === currentSlide }"
                        @click="goToSlide(index)"
                    ></span>
                </div>
            `;

            mobileGalleryApp = createApp({
                setup() {
                    const images = ref([...gallery.images]);
                    const currentSlide = ref(0);

                    function goToSlide(index) {
                        console.log('Going to slide:', index);
                        if (index >= 0 && index < images.value.length) {
                            currentSlide.value = index;
                            
                            const container = document.querySelector('.mobile-gallery-container');
                            if (container) {
                                const slideWidth = container.clientWidth;
                                container.scrollTo({
                                    left: slideWidth * index,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }

                    // Configurar scroll listener después del montaje
                    setTimeout(() => {
                        const container = document.querySelector('.mobile-gallery-container');
                        if (container) {
                            console.log('Setting up scroll listener for mobile gallery');
                            
                            let scrollTimeout;
                            const scrollHandler = () => {
                                clearTimeout(scrollTimeout);
                                scrollTimeout = setTimeout(() => {
                                    const slideWidth = container.clientWidth;
                                    const scrollLeft = container.scrollLeft;
                                    const newSlide = Math.round(scrollLeft / slideWidth);
                                    
                                    if (newSlide >= 0 && newSlide < images.value.length && newSlide !== currentSlide.value) {
                                        currentSlide.value = newSlide;
                                        console.log('Current slide changed to:', newSlide);
                                    }
                                }, 50);
                            };

                            container.addEventListener('scroll', scrollHandler, { passive: true });
                            
                            // Asegurar posición inicial
                            container.scrollLeft = 0;
                            currentSlide.value = 0;
                        }
                    }, 200);

                    console.log(`Mobile gallery setup completed with ${images.value.length} images`);

                    return {
                        images,
                        currentSlide,
                        goToSlide,
                    }
                },
            }).mount('#mobile-gallery');

            console.log('Mobile gallery mounted successfully');
        }
    } catch (error) {
        console.error('Error mounting mobile gallery:', error);
        // Intentar fallback
        initializeFallbackMobileGallery(gallery);
    }
}

// Función fallback para cuando Vue no esté disponible o haya errores
function initializeFallbackGallery(gallery) {
    console.log('Using fallback gallery');
    
    // Desktop fallback
    const desktopContainer = document.getElementById('gallery-app');
    if (desktopContainer) {
        desktopContainer.innerHTML = gallery.images.map((image, index) => 
            `<div class="fallback-image" style="background-image: url(${image}); display: ${index === 0 ? 'block' : 'none'}"></div>`
        ).join('');
    }

    // Mobile fallback
    initializeFallbackMobileGallery(gallery);
}

function initializeFallbackMobileGallery(gallery) {
    console.log('Using fallback mobile gallery');
    
    const mobileContainer = document.getElementById('mobile-gallery');
    if (mobileContainer) {
        let currentSlide = 0;
        
        const containerHTML = `
            <div class="mobile-gallery-container">
                ${gallery.images.map((image, index) => 
                    `<div class="mobile-gallery-slide" style="background-image: url(${image})"></div>`
                ).join('')}
            </div>
            <div class="mobile-gallery-indicators">
                ${gallery.images.map((_, index) => 
                    `<span class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>`
                ).join('')}
            </div>
        `;
        
        mobileContainer.innerHTML = containerHTML;
        
        // Agregar funcionalidad de navegación
        const indicators = mobileContainer.querySelectorAll('.indicator');
        const container = mobileContainer.querySelector('.mobile-gallery-container');
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                
                // Actualizar indicadores
                indicators.forEach(ind => ind.classList.remove('active'));
                indicator.classList.add('active');
                
                // Scroll a la imagen correspondiente
                if (container) {
                    const slideWidth = container.clientWidth;
                    container.scrollTo({
                        left: slideWidth * index,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Configurar scroll listener
        if (container) {
            let scrollTimeout;
            container.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const slideWidth = container.clientWidth;
                    const scrollLeft = container.scrollLeft;
                    const newSlide = Math.round(scrollLeft / slideWidth);
                    
                    if (newSlide !== currentSlide && newSlide >= 0 && newSlide < gallery.images.length) {
                        currentSlide = newSlide;
                        indicators.forEach(ind => ind.classList.remove('active'));
                        indicators[newSlide].classList.add('active');
                    }
                }, 100);
            }, { passive: true });
        }
        
        console.log('Fallback mobile gallery initialized');
    }
}

function closeGallery() {
    console.log('Closing gallery');
    
    const modal = document.getElementById('gallery-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Limpieza completa
    cleanupGalleryApps();
}

// Close gallery when clicking outside
document.getElementById('gallery-modal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeGallery();
    }
});

// Close gallery with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('gallery-modal')?.style.display === 'block') {
        closeGallery();
    }
});

// Detectar si es móvil para debugging
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Debug function
function debugGallery() {
    console.log('=== GALLERY DEBUG INFO ===');
    console.log('Is mobile:', isMobileDevice());
    console.log('Vue available:', typeof Vue !== 'undefined');
    console.log('Gallery modal element:', document.getElementById('gallery-modal'));
    console.log('Desktop gallery element:', document.getElementById('gallery-app'));
    console.log('Mobile gallery element:', document.getElementById('mobile-gallery'));
    console.log('Gallery apps:', { galleryApp, mobileGalleryApp });
}

// Exponer función de debug globalmente
window.debugGallery = debugGallery;

//FIN GALERIA

        // Funcionalidad para scroll horizontal de servicios principales en móvil
        document.addEventListener('DOMContentLoaded', function() {
            const servicesSection = document.querySelector('.main-services-section');
            const pageContent = document.querySelector('.main-services-section .page-content');
            
            if (pageContent && window.innerWidth <= 768) {
                let hasScrolled = false;
                
                // Detectar cuando el usuario hace scroll horizontal
                pageContent.addEventListener('scroll', function() {
                    if (!hasScrolled && pageContent.scrollLeft > 20) {
                        hasScrolled = true;
                        servicesSection.classList.add('scrolled');
                    }
                });
                
                // Detectar touch para dispositivos móviles
                let touchStartX = 0;
                
                pageContent.addEventListener('touchstart', function(e) {
                    touchStartX = e.touches[0].clientX;
                });
                
                pageContent.addEventListener('touchmove', function(e) {
                    const touchCurrentX = e.touches[0].clientX;
                    const touchDiff = Math.abs(touchCurrentX - touchStartX);
                    
                    if (touchDiff > 30 && !hasScrolled) {
                        hasScrolled = true;
                        servicesSection.classList.add('scrolled');
                    }
                });
                
                // Opcional: Funcionalidad para expandir tarjetas al tocar
                const cards = document.querySelectorAll('.main-services-section .card');
                cards.forEach(card => {
                    card.addEventListener('click', function() {
                        // Remover clase expandida de otras tarjetas
                        cards.forEach(c => c.classList.remove('expanded'));
                        
                        // Alternar clase expandida en la tarjeta actual
                        this.classList.toggle('expanded');
                        
                        // Hacer scroll suave a la tarjeta expandida
                        if (this.classList.contains('expanded')) {
                            this.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                                inline: 'center'
                            });
                        }
                    });
                });
                
                // Cerrar tarjetas expandidas al hacer scroll
                pageContent.addEventListener('scroll', function() {
                    cards.forEach(card => {
                        if (card.classList.contains('expanded')) {
                            card.classList.remove('expanded');
                        }
                    });
                });
            }
            
            // Reajustar en cambio de orientación o redimensionamiento
            window.addEventListener('resize', function() {
                const servicesSection = document.querySelector('.main-services-section');
                const pageContent = document.querySelector('.main-services-section .page-content');
                
                if (window.innerWidth > 768) {
                    if (servicesSection) servicesSection.classList.remove('scrolled');
                    if (pageContent) pageContent.scrollLeft = 0;
                }
            });
        });

        // ================================================
        // NUEVA FUNCIONALIDAD: CLICK EN LUGAR DE HOVER PARA MÓVILES
        // ================================================
        
        function isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        }

        function isMobileDevice() {
            return window.innerWidth <= 768 || isTouchDevice();
        }

        // Función para manejar clicks en dispositivos móviles
        function setupMobileClickHandlers() {
            if (!isMobileDevice()) return;

            // Configurar click handlers para tarjetas principales de servicios
            const mainServiceCards = document.querySelectorAll('.main-service');
            mainServiceCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remover clase clicked de otras tarjetas
                    mainServiceCards.forEach(c => c.classList.remove('clicked'));
                    
                    // Toggle clase clicked en la tarjeta actual
                    this.classList.toggle('clicked');
                });
            });

            // Configurar click handlers para tarjetas de servicios modernos
            const modernServiceCards = document.querySelectorAll('.main-services-section .card');
            modernServiceCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remover clase clicked de otras tarjetas
                    modernServiceCards.forEach(c => c.classList.remove('clicked'));
                    
                    // Toggle clase clicked en la tarjeta actual
                    this.classList.toggle('clicked');
                });
            });

            // Configurar click handlers para tarjetas de beneficios
            const benefitItems = document.querySelectorAll('.benefit-item');
            benefitItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remover clase clicked de otras tarjetas
                    benefitItems.forEach(i => i.classList.remove('clicked'));
                    
                    // Toggle clase clicked en la tarjeta actual
                    this.classList.toggle('clicked');
                });
            });

            // Configurar click handlers para servicios secundarios
            const secondaryServices = document.querySelectorAll('.secondary-service');
            secondaryServices.forEach(service => {
                service.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remover clase clicked de otras tarjetas
                    secondaryServices.forEach(s => s.classList.remove('clicked'));
                    
                    // Toggle clase clicked en la tarjeta actual
                    this.classList.toggle('clicked');
                });
            });

            // Configurar click handlers para elementos de valores
            const valueItems = document.querySelectorAll('.value-item');
            valueItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remover clase clicked de otras tarjetas
                    valueItems.forEach(i => i.classList.remove('clicked'));
                    
                    // Toggle clase clicked en la tarjeta actual
                    this.classList.toggle('clicked');
                });
            });

            // Configurar click handlers especiales para misión y visión
            const missionVisionCards = document.querySelectorAll('.mission-vision-card');
            missionVisionCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Toggle clase clicked en la tarjeta actual
                    this.classList.toggle('clicked');
                    
                    // Si se clickea otra tarjeta de misión/visión, cerrar las demás
                    missionVisionCards.forEach(c => {
                        if (c !== this) {
                            c.classList.remove('clicked');
                        }
                    });
                });
            });

            // Cerrar tarjetas expandidas al hacer click fuera
            document.addEventListener('click', function(e) {
                const clickedElement = e.target.closest('.main-service, .main-services-section .card, .benefit-item, .secondary-service, .value-item, .mission-vision-card');
                
                if (!clickedElement) {
                    // Remover todas las clases clicked
                    document.querySelectorAll('.clicked').forEach(el => {
                        el.classList.remove('clicked');
                    });
                }
            });

            // Prevenir que el click en el contenido de las tarjetas cierre la tarjeta
            document.querySelectorAll('.service-content, .mission-vision-content, .benefit-item > *, .value-item > *').forEach(content => {
                content.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            });
        }

        // Configurar el redimensionamiento de ventana
        function handleResize() {
            // Re-configurar handlers basado en el tamaño de pantalla
            document.querySelectorAll('.clicked').forEach(el => {
                el.classList.remove('clicked');
            });
            
            if (isMobileDevice()) {
                setupMobileClickHandlers();
            }
        }

        // ================================================
        // MEJORAS PARA INTERACTIVIDAD TÁCTIL EN MÓVILES
        // ================================================
        
        // Función para detectar dispositivos táctiles
        function isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        }

        // Mejorar experiencia táctil en tarjetas de servicios principales
        function enhanceTouchExperience() {
            // La funcionalidad de click ya está manejada por setupMobileClickHandlers
            // Mantener solo efectos visuales adicionales si es necesario
            
            if (!isTouchDevice()) return;

            // Agregar feedback visual inmediato al tocar (antes del click)
            const interactiveElements = document.querySelectorAll(
                '.main-service, .main-services-section .card, .benefit-item, .secondary-service, .value-item, .mission-vision-card'
            );
            
            interactiveElements.forEach(element => {
                element.addEventListener('touchstart', function(e) {
                    this.style.transform = 'scale(0.98)';
                    this.style.transition = 'transform 0.1s ease';
                });
                
                element.addEventListener('touchend', function(e) {
                    setTimeout(() => {
                        if (!this.classList.contains('clicked')) {
                            this.style.transform = '';
                        }
                    }, 100);
                });
                
                element.addEventListener('touchcancel', function(e) {
                    this.style.transform = '';
                });
            });
        }

        // Agregar estilos CSS para los estados táctiles
        function addTouchStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Estados táctiles básicos */
                .touch-active {
                    transform: scale(0.98) !important;
                    transition: transform 0.1s ease !important;
                }
                
                .main-service.touch-active {
                    transform: translateY(-5px) scale(0.98) !important;
                }
                
                .value-item.touch-active {
                    transform: translateY(-3px) scale(0.98) !important;
                }

                /* Estados clicked para móviles */
                @media (max-width: 768px) {
                    .main-service.clicked {
                        transform: translateY(-10px) scale(1.02) !important;
                        box-shadow: 0 25px 50px rgba(0,0,0,0.2) !important;
                    }

                    .main-service.clicked::before {
                        background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%) !important;
                    }

                    .benefit-item.clicked {
                        transform: translateY(-8px) !important;
                        box-shadow: 0 15px 40px rgba(0,0,0,0.12) !important;
                        border-color: rgba(255, 167, 38, 0.2) !important;
                    }

                    .benefit-item.clicked .benefit-icon {
                        transform: scale(1.1) rotate(5deg) !important;
                        box-shadow: 0 12px 35px rgba(102, 126, 234, 0.35) !important;
                    }

                    .secondary-service.clicked {
                        transform: translateY(-5px) !important;
                        box-shadow: 0 12px 25px rgba(0,0,0,0.12) !important;
                    }

                    .value-item.clicked {
                        transform: translateY(-5px) !important;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.12) !important;
                    }

                    /* Tarjetas modernas de servicios en móvil */
                    .main-services-section .card.clicked .content {
                        transform: translateY(0) !important;
                    }

                    .main-services-section .card.clicked .content > *:not(.title) {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }

                    .main-services-section .card.clicked:after {
                        transform: translateY(-50%) !important;
                    }

                    .main-services-section .card.clicked {
                        transform: scale(1.02) !important;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
                    }

                    /* Estados clicked para misión y visión */
                    .mission-vision-card.clicked {
                        transform: translateY(-8px) scale(1.02) !important;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
                    }

                    .mission-vision-card {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent !important;
                    }
                    
                    .value-item {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent !important;
                    }

                    .benefit-item {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent !important;
                    }

                    .secondary-service {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent !important;
                    }
                }

                /* Transiciones suaves para todos los elementos */
                .main-service,
                .benefit-item,
                .secondary-service,
                .value-item,
                .mission-vision-card,
                .main-services-section .card {
                    transition: all 0.3s ease !important;
                }

                .main-service::before,
                .mission-vision-card::before,
                .mission-vision-card::after {
                    transition: all 0.3s ease !important;
                }

                .benefit-icon {
                    transition: all 0.4s ease !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Inicializar mejoras táctiles cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            setupMobileClickHandlers();
            enhanceTouchExperience();
            addTouchStyles();
            
            // Inicializar calculadora con valores por defecto
            actualizarTarifaCFE();
        });

        // Configurar evento de redimensionamiento
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);