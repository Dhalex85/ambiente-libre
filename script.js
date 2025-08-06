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
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
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

        function calcularAhorro() {
            const consumoInput = parseFloat(document.getElementById('consumo').value);
            const tarifa = parseFloat(document.getElementById('tarifa').value);
            const ubicacion = document.getElementById('ubicacion').value;
            const periodo = document.querySelector('input[name="periodo"]:checked').value;

            if (!consumoInput || !tarifa) {
                alert('Por favor completa todos los campos');
                return;
            }

            // Convertir consumo a mensual si es bimestral
            const consumoMensual = periodo === 'bimestral' ? consumoInput / 2 : consumoInput;

            // Factores de irradiación solar por ubicación (aproximado)
            const factoresIrradiacion = {
                'hidalgo': 5.2,
                'cdmx': 5.0,
                'edomex': 5.1,
                'queretaro': 5.4,
                'otro': 5.0
            };

            const irradiacion = factoresIrradiacion[ubicacion] || 5.0;
            
            // Cálculos basados en consumo mensual
            const gastoMensual = consumoMensual * tarifa;
            const gastoAnual = gastoMensual * 12;
            const ahorroPorcentaje = 85; // Ahorro estimado del 85%
            const ahorroMensual = gastoMensual * (ahorroPorcentaje / 100);
            const ahorroAnual = ahorroMensual * 12;
            
            // Estimación de capacidad del sistema necesario
            const capacidadKW = (consumoMensual * 12) / (irradiacion * 365 * 0.8); // Factor de eficiencia 0.8

            // Tiempo de retorno de inversión (sin mostrar la inversión)
            const tiempoRetorno = 7.5; // Promedio general de 7.5 años

            // Mostrar resultados
            document.getElementById('resultado').style.display = 'block';
            document.getElementById('resultadoDetalle').innerHTML = `
                <div style="display: grid; gap: 1rem; text-align: left;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                        <strong>💰 Ahorro Mensual Estimado:</strong><br>
                        $${ahorroMensual.toLocaleString('es-MX', {minimumFractionDigits: 2})} MXN
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                        <strong>📅 Ahorro Anual Estimado:</strong><br>
                        $${ahorroAnual.toLocaleString('es-MX', {minimumFractionDigits: 2})} MXN
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                        <strong>⚡ Sistema Recomendado:</strong><br>
                        ${capacidadKW.toFixed(2)} kW (${Math.ceil(capacidadKW * 2.5)} paneles aprox.)
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                        <strong>⏱️ Retorno de Inversión:</strong><br>
                        ${tiempoRetorno} años aproximadamente
                    </div>
                    <div style="background: rgba(76, 175, 80, 0.2); padding: 1rem; border-radius: 8px; border: 1px solid #4caf50;">
                        <small><strong>Nota:</strong> Estos son cálculos estimativos. Para una cotización precisa y personalizada, contáctanos para una evaluación técnica gratuita.</small>
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
                    'img/herrajes/herrajes5.jpg'
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
            if (!gallery) return;

            // Set gallery title
            document.getElementById('gallery-title').textContent = gallery.title;

            // Show modal
            document.getElementById('gallery-modal').style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Initialize Vue apps for both desktop and mobile galleries
            const { createApp, reactive } = Vue;
            
            // Clean up existing apps
            if (galleryApp) {
                galleryApp.unmount();
            }
            if (mobileGalleryApp) {
                mobileGalleryApp.unmount();
            }

            // Desktop Gallery App
            galleryApp = createApp({
                setup() {
                    const items = reactive(
                        gallery.images.map((url, index) => ({
                            id: index,
                            pos: index,
                            url: url
                        }))
                    );

                    function shuffle(item) {
                        const heroPos = Math.floor(items.length / 2);
                        const hero = items.findIndex(({ pos }) => pos === heroPos);
                        const target = items.findIndex(({ id }) => id === item.id);
                        [items[target].pos, items[hero].pos] = [items[hero].pos, items[target].pos];
                    }

                    return {
                        items,
                        shuffle,
                    }
                },
            }).mount('#gallery-app');

// Mobile Gallery App
mobileGalleryApp = createApp({
    setup() {
        const items = reactive([]);
        const currentSlide = reactive({ value: 0 });
        const isLoading = reactive({ value: true });

        // Función para verificar si una imagen existe
        function checkImageExists(url) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => resolve(null);
                img.src = url;
            });
        }

        // Cargar solo imágenes existentes del proyecto actual
        async function loadExistingImages() {
            isLoading.value = true;
            
            // CORRECCIÓN MEJORADA: Reinicializar completamente el array reactivo
            while(items.length > 0) {
                items.pop();
            }
            
            // Forzar reactividad
            await Vue.nextTick();
            
            console.log(`Starting to load images for gallery:`, gallery.title);
            console.log(`Available images:`, gallery.images);
            
            // Usar las imágenes del proyecto actual
            const imagePromises = gallery.images.map(url => checkImageExists(url));
            const results = await Promise.all(imagePromises);
            
            // Filtrar solo las imágenes que existen
            const existingImages = results.filter(url => url !== null);
            
            console.log(`Verified existing images:`, existingImages);
            
            // Agregar las nuevas imágenes una por una para forzar reactividad
            existingImages.forEach(imageUrl => {
                items.push(imageUrl);
            });
            
            // Reset del slide actual
            currentSlide.value = 0;
            
            // Resetear scroll del contenedor
            setTimeout(() => {
                const container = document.querySelector('.mobile-gallery-container');
                if (container) {
                    container.scrollTo({ left: 0, behavior: 'instant' });
                }
            }, 100);
            
            isLoading.value = false;
            console.log(`Mobile gallery loaded ${items.length} images for project: ${gallery.title}`);
        }

        // Cargar imágenes al inicializar
        loadExistingImages();

        function goToSlide(index) {
            if (index < 0 || index >= items.length) return;
            
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

        // Handle scroll events to update indicators
        setTimeout(() => {
            const container = document.querySelector('.mobile-gallery-container');
            if (container) {
                // Limpiar cualquier listener previo
                const newContainer = container.cloneNode(true);
                container.parentNode.replaceChild(newContainer, container);
                
                let scrollTimeout;
                newContainer.addEventListener('scroll', () => {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        if (items.length > 0) {
                            const slideWidth = newContainer.clientWidth;
                            const scrollLeft = newContainer.scrollLeft;
                            const newSlide = Math.round(scrollLeft / slideWidth);
                            
                            if (newSlide >= 0 && newSlide < items.length) {
                                currentSlide.value = newSlide;
                            }
                        }
                    }, 50);
                });
            }
        }, 300);

        return {
            items,
            currentSlide,
            isLoading,
            goToSlide,
        }
    },
}).mount('#mobile-gallery');
        }

        function closeGallery() {
            document.getElementById('gallery-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
            
            if (galleryApp) {
                galleryApp.unmount();
                galleryApp = null;
            }
            
            if (mobileGalleryApp) {
                mobileGalleryApp.unmount();
                mobileGalleryApp = null;
            }
        }

        // Close gallery when clicking outside
        document.getElementById('gallery-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeGallery();
            }
        });

        // Close gallery with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeGallery();
            }
        });

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
            if (!isTouchDevice()) return;

            // Tarjetas de servicios principales
            const mainServiceCards = document.querySelectorAll('.main-service');
            mainServiceCards.forEach(card => {
                card.addEventListener('touchstart', function(e) {
                    this.classList.add('touch-active');
                });
                
                card.addEventListener('touchend', function(e) {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });

            // Tarjetas de beneficios
            const benefitItems = document.querySelectorAll('.benefit-item');
            benefitItems.forEach(item => {
                item.addEventListener('touchstart', function(e) {
                    this.classList.add('touch-active');
                });
                
                item.addEventListener('touchend', function(e) {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });

            // Tarjetas de servicios secundarios
            const secondaryServices = document.querySelectorAll('.secondary-service');
            secondaryServices.forEach(service => {
                service.addEventListener('touchstart', function(e) {
                    this.classList.add('touch-active');
                });
                
                service.addEventListener('touchend', function(e) {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });

            // Tarjetas de valores
            const valueItems = document.querySelectorAll('.value-item');
            valueItems.forEach(item => {
                item.addEventListener('touchstart', function(e) {
                    this.classList.add('touch-active');
                });
                
                item.addEventListener('touchend', function(e) {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });

            // Tarjetas de misión y visión con toggle
            const missionVisionCards = document.querySelectorAll('.mission-vision-card');
            missionVisionCards.forEach(card => {
                let isExpanded = false;
                
                card.addEventListener('touchstart', function(e) {
                    this.classList.add('touch-active');
                });
                
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Toggle estado expandido
                    isExpanded = !isExpanded;
                    
                    if (isExpanded) {
                        this.classList.add('expanded');
                        this.style.zIndex = '1000';
                        
                        // Mostrar contenido con animación
                        const content = this.querySelector('.mission-vision-content p');
                        const title = this.querySelector('.mission-vision-title');
                        
                        if (content) {
                            content.style.opacity = '1';
                            content.style.transform = 'translateY(0)';
                        }
                        
                        if (title) {
                            title.style.transform = 'scale(1.05)';
                            title.style.textShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
                        }
                        
                    } else {
                        this.classList.remove('expanded');
                        this.style.zIndex = '';
                        
                        // Ocultar contenido
                        const content = this.querySelector('.mission-vision-content p');
                        const title = this.querySelector('.mission-vision-title');
                        
                        if (content) {
                            content.style.opacity = '0';
                            content.style.transform = 'translateY(2rem)';
                        }
                        
                        if (title) {
                            title.style.transform = 'scale(1)';
                            title.style.textShadow = '3px 3px 6px rgba(0, 0, 0, 0.9)';
                        }
                    }
                });
                
                card.addEventListener('touchend', function(e) {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });
        }

        // Agregar estilos CSS para los estados táctiles
        function addTouchStyles() {
            const style = document.createElement('style');
            style.textContent = `
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
                
                .mission-vision-card.expanded .mission-vision-content {
                    justify-content: flex-end !important;
                    padding-bottom: 4rem !important;
                }
                
                .mission-vision-card.expanded .mission-vision-title {
                    top: 25% !important;
                    margin-bottom: 1.5rem !important;
                }
                
                .mission-vision-card.expanded::after {
                    transform: translateY(-50%) !important;
                    background-image: linear-gradient(
                        to bottom,
                        hsla(220, 55%, 20%, 0.3) 0%,
                        hsla(220, 55%, 18%, 0.35) 11.7%,
                        hsla(220, 55%, 16%, 0.4) 22.1%,
                        hsla(220, 55%, 14%, 0.45) 31.2%,
                        hsla(220, 55%, 12%, 0.5) 39.4%,
                        hsla(220, 55%, 10%, 0.55) 46.6%,
                        hsla(220, 55%, 8%, 0.6) 53.1%,
                        hsla(220, 55%, 6%, 0.65) 58.9%,
                        hsla(220, 55%, 4%, 0.7) 64.3%,
                        hsla(200, 45%, 15%, 0.75) 69.3%,
                        hsla(200, 45%, 12%, 0.8) 74.1%,
                        hsla(200, 45%, 10%, 0.85) 78.8%,
                        hsla(200, 45%, 8%, 0.9) 83.6%,
                        hsla(200, 45%, 6%, 0.92) 88.7%,
                        hsla(200, 45%, 4%, 0.95) 94.1%,
                        hsla(200, 45%, 2%, 0.98) 100%
                    ) !important;
                }
                
                @media (max-width: 768px) {
                    .mission-vision-card {
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .value-item {
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Inicializar mejoras táctiles cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            enhanceTouchExperience();
            addTouchStyles();
        });