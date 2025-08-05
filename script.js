// Mobile menu toggle
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('active');
        }

        function closeMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.remove('active');
        }

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
            const periodo = document.getElementById('periodo').value;
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
            const periodo = document.getElementById('periodo').value;

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
            
            if (data.consumo_kwh) {
                mensaje += `*Consumo Mensual:* ${data.consumo_kwh} kWh\n`;
            }
            
            if (data.mensaje) {
                mensaje += `*Mensaje:* ${data.mensaje}\n`;
            }
            
            mensaje += `\n¡Gracias por contactarnos!`;
            
            // Encode message for WhatsApp
            const mensajeCodificado = encodeURIComponent(mensaje);
            const whatsappUrl = `https://wa.me/527712149628?text=${mensajeCodificado}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            this.reset();
            
            // Show confirmation
            alert('¡Gracias por tu solicitud! Te redirigimos a WhatsApp para completar el contacto.');
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
                    'img/zacualtipan.jpg',
                    'img/zacualtipan.jpg', // Repetimos las imágenes existentes para demo
                    'img/zacualtipan.jpg', // En producción, tendrías más fotos del proyecto
                    'img/zacualtipan.jpg',
                    'img/zacualtipan.jpg'
                ]
            },
            herrajes: {
                title: 'Fábrica de Herrajes',
                images: [
                    'img/tepeapulco.jpg',
                    'img/tepeapulco.jpg',
                    'img/tepeapulco.jpg',
                    'img/tepeapulco.jpg',
                    'img/tepeapulco.jpg'
                ]
            },
            concretera: {
                title: 'Concretera',
                images: [
                    'img/mixquiahuala.jpg',
                    'img/mixquiahuala.jpg',
                    'img/mixquiahuala.jpg',
                    'img/mixquiahuala.jpg',
                    'img/mixquiahuala.jpg'
                ]
            },
            pachuca: {
                title: 'Zona Metropolitana Pachuca',
                images: [
                    'img/pachuca.jpg',
                    'img/pachuca.jpg',
                    'img/pachuca.jpg',
                    'img/pachuca.jpg',
                    'img/pachuca.jpg'
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
                    const items = gallery.images; // Array de URLs directamente
                    console.log('Mobile gallery images:', items); // Debug
                    const currentSlide = reactive({ value: 0 });

                    function goToSlide(index) {
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
                            container.addEventListener('scroll', () => {
                                const slideWidth = container.clientWidth;
                                const scrollLeft = container.scrollLeft;
                                const newSlide = Math.round(scrollLeft / slideWidth);
                                currentSlide.value = newSlide;
                            });
                        }
                    }, 200);

                    return {
                        items,
                        currentSlide,
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