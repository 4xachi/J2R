/**
 * J2R - Premium Security Services
 * Security-focused JavaScript functionality
 * 
 * Security Features:
 * - Content protection (disable right-click, dev tools shortcuts)
 * - Dragging prevention
 * - Theme detection and adaptation
 * - Scroll animations
 * - Mobile navigation
 * - Interactive security tools
 */

// Before DOM is fully loaded
(function() {
    // Pre-define browser objects to prevent detection
    if (typeof window !== 'undefined') {
        window.chrome = window.chrome || {};
        window.chrome.runtime = window.chrome.runtime || {};
        window.chrome.webstore = window.chrome.webstore || {};
        
        // Mock browser detection functions
        Object.defineProperty(navigator, 'userAgent', {
            get: function() {
                return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36';
            }
        });
        
        // Aggressive dialog removal
        window.setInterval(function() {
            removeAllDialogs();
        }, 50);
    }
    
    function removeAllDialogs() {
        if (document.body) {
            const elementsToRemove = document.querySelectorAll(
                'div[style*="position: fixed"]:not(.hero):not(.hero *):not(.hero-container):not(.hero-content):not(.hero-content *), ' +
                'div[style*="z-index"]:not(.hero):not(.hero *):not(.hero-container):not(.hero-content):not(.hero-content *), ' + 
                'div[id*="browser"], ' +
                'div[class*="browser"], ' +
                'div:empty:not([role]):not([aria-label]), ' +
                'iframe:not([src])'
            );
            
            elementsToRemove.forEach(function(element) {
                // Don't remove if it's a hero element or a child of hero
                if (element.closest('.hero') || 
                    element.classList.contains('hero') ||
                    element.classList.contains('hero-content') ||
                    element.classList.contains('hero-container')) {
                    return;
                }
                
                // Check for browser-related content in innerHTML
                const content = element.innerHTML?.toLowerCase() || '';
                if (content.includes('chrome') || 
                    content.includes('firefox') || 
                    content.includes('edge') || 
                    content.includes('browser') ||
                    element.querySelector('img[src*="browser"]')) {
                    element.remove();
                }
                // If it's a fixed position element with a high z-index
                else if (element.style?.position === 'fixed' && 
                         element.style?.zIndex && 
                         parseInt(element.style.zIndex) > 999) {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.opacity = '0';
                    element.style.pointerEvents = 'none';
                }
            });
        }
    }
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // This aggressive overlay technique covers any browser dialogs
    createSecurityOverlay();
    
    // Initialize all functionality
    initializeNavigation();
    initializeAnimations();
    applySecurityMeasures();
    detectTheme();
    initializeSecurityTools();
    
    // Remove any browser selection boxes or overlays
    removeBrowserOverlays();
    
    console.log("Page fully initialized!");
});

/**
 * Create a security overlay that blocks browser dialogs but allows interaction with the page
 */
function createSecurityOverlay() {
    // Check if overlay already exists
    if (!document.getElementById('security-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'security-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'transparent';
        overlay.style.zIndex = '999'; // Lower z-index
        overlay.style.pointerEvents = 'none'; // This ensures clicks go through to the content
        
        // Add to body
        document.body.appendChild(overlay);
    } else {
        // Ensure existing overlay has pointer-events set to none
        const overlay = document.getElementById('security-overlay');
        overlay.style.pointerEvents = 'none';
    }
    
    // Double-click event to force hide dialogs
    document.addEventListener('dblclick', function() {
        removeBrowserOverlays();
    });
}

/**
 * Remove any browser overlays that might block user interaction
 */
function removeBrowserOverlays() {
    // Clean DOM of any browser-generated overlays
    removeDialogs();
    
    // Make sure all buttons and links are clickable
    document.querySelectorAll('a, button, .btn, [role="button"]').forEach(el => {
        // Ensure it's clickable by setting a high z-index and relative position
        if (!el.getAttribute('style') || 
            !el.getAttribute('style').includes('z-index')) {
            el.style.position = 'relative';
            el.style.zIndex = '1000';
        }
        
        // Make sure click events are not blocked
        el.style.pointerEvents = 'auto';
    });
    
    /**
     * Remove browser dialogs and overlays
     */
    function removeDialogs() {
        // Find all possible browser overlay dialogs
        const overlays = document.querySelectorAll('div[style*="position: fixed"]:not(.hero *):not(.hero-content *):not(.hero-container *), div[style*="z-index: 9999"]:not(.hero *):not(.hero-content *):not(.hero-container *)');
        
        // Remove each one
        overlays.forEach(function(overlay) {
            overlay.remove();
        });
    }
}

/**
 * Initialize navigation functionality
 * - Sticky header on scroll
 * - Mobile navigation toggle
 * - Smooth scrolling for navigation links
 */
function initializeNavigation() {
    const header = document.getElementById('main-header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Make logo clickable to reload the page
    const logo = document.querySelector('.logo-container');
    if (logo) {
        logo.style.cursor = 'pointer'; // Change cursor to indicate it's clickable
        logo.addEventListener('click', function() {
            window.location.reload();
        });
    }
    
    // Add scroll event for sticky header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Use the direct scrollToSection function instead of adding event listeners to all anchors
    // This avoids conflicts with the inline onclick handlers
    // Only add event listeners to links that don't already have onclick handlers
    document.querySelectorAll('a[href^="#"]:not([onclick])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.click();
            }
            
            const targetId = this.getAttribute('href');
            
            // Handle special case for top of page
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // Use the ID without the # symbol
            const sectionId = targetId.substring(1);
            
            // Use the scrollToSection function directly if it exists
            if (typeof scrollToSection === 'function') {
                scrollToSection(sectionId);
            } else {
                // Fallback to direct navigation
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Implement smooth scrolling with offset for header height
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    console.log('Scrolling to:', targetId, 'Position:', targetPosition);
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn('Target element not found:', targetId);
                }
            }
        });
    });
}

/**
 * Initialize animations
 * - Fade-in animations for hero section
 * - Scroll reveal animations for sections
 * - Intersection Observer for elements
 */
function initializeAnimations() {
    // Initial loading animations for hero content
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-content h1');
        const heroText = document.querySelector('.hero-content p');
        const ctaButtons = document.querySelector('.cta-buttons');

        if (heroTitle) heroTitle.classList.add('fade-in', 'delay-1');
        if (heroText) heroText.classList.add('fade-in', 'delay-2');
        if (ctaButtons) ctaButtons.classList.add('fade-in', 'delay-3');
    }, 100);
    
    // Scroll reveal animations
    const animatedSections = [
        { elements: document.querySelectorAll('.section-header'), className: 'fade-in-scale' },
        { elements: document.querySelectorAll('.service-card'), className: 'slide-up' },
        { elements: document.querySelectorAll('.gallery-item'), className: 'slide-up' },
        { elements: document.querySelectorAll('.stat-item'), className: 'slide-up' },
        { elements: document.querySelectorAll('.footer-column'), className: 'slide-up' },
        { elements: document.querySelectorAll('.service-tool'), className: 'slide-up' }
    ];
    
    // Add animation classes to elements
    animatedSections.forEach(section => {
        section.elements.forEach(element => {
            element.classList.add(section.className);
        });
    });
    
    // Create a more sophisticated Intersection Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class for CSS transitions
                entry.target.classList.add('visible');
                
                // Add staggered animations for groups of items
                if (entry.target.classList.contains('section-header')) {
                    const parent = entry.target.parentElement;
                    if (!parent) return;
                    
                    const items = parent.querySelectorAll('.slide-up:not(.visible)');
                    
                    // Add delays to children elements
                    if (items.length > 0) {
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, 100 + (index * 100));
                        });
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in-scale, .slide-up').forEach(el => {
        observer.observe(el);
    });
    
    // Enhance scrolling experience with parallax effects
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Subtle parallax for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.05}px`;
        }
    });
}

/**
 * Initialize interactive security tools
 * - Password strength checker
 * - Security posture assessment
 * - File encryption/decryption
 */
function initializeSecurityTools() {
    initializePasswordChecker();
    initializeSecurityQuiz();
    initializeFileEncryption();
}

/**
 * Initialize the password strength checker
 */
function initializePasswordChecker() {
    const passwordInput = document.getElementById('password-input');
    const strengthLevel = document.getElementById('strength-level');
    const strengthText = document.getElementById('strength-text');
    const togglePasswordBtn = document.getElementById('toggle-password');
    
    // Requirements elements
    const lengthCheck = document.getElementById('length-check');
    const uppercaseCheck = document.getElementById('uppercase-check');
    const lowercaseCheck = document.getElementById('lowercase-check');
    const numberCheck = document.getElementById('number-check');
    const specialCheck = document.getElementById('special-check');
    
    if (!passwordInput || !strengthLevel || !strengthText) {
        console.warn('Password checker elements not found');
        return;
    }
    
    // Connect checkbox to toggle password visibility
    const showPasswordCheck = document.getElementById('show-password-check');
    if (showPasswordCheck) {
        showPasswordCheck.addEventListener('change', function() {
            const type = this.checked ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }
    
    // Original toggle button code can be kept as fallback
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update checkbox state to match
        if (showPasswordCheck) {
            showPasswordCheck.checked = (type === 'text');
        }
        
        // Update icon to show state more clearly
        if (type === 'text') {
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
            this.setAttribute('aria-label', 'Hide password');
        } else {
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
            this.setAttribute('aria-label', 'Show password');
        }
    });
    
    // Set initial placeholder state for better UX
    updatePasswordStrengthUI({
        strength: 'empty',
        strengthMessage: 'Enter a password',
        checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            numbers: false,
            special: false
        }
    });
    
    // Check password strength on input
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const result = checkPasswordStrength(password);
        
        // Update UI based on strength
        updatePasswordStrengthUI(result);
        
        // Add visual feedback on input
        if (password.length > 0) {
            this.classList.add('active');
        } else {
            this.classList.remove('active');
        }
    });
    
    // Check password strength and return result
    function checkPasswordStrength(password) {
        if (!password || password.length === 0) {
            return {
                strength: 'empty',
                strengthMessage: 'Enter a password',
                checks: {
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    numbers: false,
                    special: false
                }
            };
        }
        
        // Initialize checks
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
        
        // Calculate score (0-5 based on checks)
        const score = Object.values(checks).filter(Boolean).length;
        
        // Determine strength level and messages
        let strength, strengthMessage;
        
        switch(score) {
            case 0:
            case 1:
            case 2:
                strength = 'weak';
                strengthMessage = 'Weak - Easy to crack';
                break;
            case 3:
                strength = 'fair';
                strengthMessage = 'Fair - Could be stronger';
                break;
            case 4:
                strength = 'good';
                strengthMessage = 'Good - Solid password';
                break;
            case 5:
                strength = 'strong';
                strengthMessage = 'Strong - Excellent password!';
                break;
            default:
                strength = 'empty';
                strengthMessage = 'Enter a password';
        }
        
        return {
            strength,
            strengthMessage,
            checks
        };
    }
    
    // Update the UI based on password strength
    function updatePasswordStrengthUI(result) {
        if (!result) return;
        
        // Remove all classes from strength level
        strengthLevel.className = 'strength-level';
        
        // Add appropriate class
        if (result.strength !== 'empty') {
            strengthLevel.classList.add(result.strength);
        }
        
        // Update text
        strengthText.textContent = result.strengthMessage;
        
        // Add color to strength text based on strength level
        strengthText.className = '';
        if (result.strength !== 'empty') {
            strengthText.classList.add(result.strength + '-text');
        }
        
        // Update requirement checks - with null checks
        if (lengthCheck) updateRequirementCheck(lengthCheck, result.checks.length);
        if (uppercaseCheck) updateRequirementCheck(uppercaseCheck, result.checks.uppercase);
        if (lowercaseCheck) updateRequirementCheck(lowercaseCheck, result.checks.lowercase);
        if (numberCheck) updateRequirementCheck(numberCheck, result.checks.numbers);
        if (specialCheck) updateRequirementCheck(specialCheck, result.checks.special);
    }
    
    // Update individual requirement check
    function updateRequirementCheck(element, isMet) {
        if (!element) return;
        
        if (isMet) {
            element.classList.add('met');
        } else {
            element.classList.remove('met');
        }
    }
}

/**
 * Initialize the security posture assessment quiz
 */
function initializeSecurityQuiz() {
    const quizContainer = document.getElementById('security-quiz');
    if (!quizContainer) {
        console.warn('Security quiz container not found');
        return;
    }
    
    const questions = document.querySelectorAll('.quiz-question');
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const currentQuestionSpan = document.getElementById('current-question');
    const quizResults = document.getElementById('quiz-results');
    const securityScore = document.getElementById('security-score');
    const scoreMessage = document.getElementById('score-message');
    const restartBtn = document.getElementById('restart-quiz');
    
    // Check essential elements
    if (!questions.length || !prevBtn || !nextBtn || !quizResults) {
        console.warn('Essential quiz elements not found');
        return;
    }
    
    let currentQuestion = 0;
    let isTransitioning = false; // Flag to prevent multiple transitions at once
    const answers = new Array(questions.length).fill(null);
    
    // Initialize the quiz
    updateQuizNavigation();
    
    // Track if a question has been viewed (for next button enablement)
    const viewedQuestions = new Array(questions.length).fill(false);
    viewedQuestions[0] = true; // First question is viewed by default
    
    // Add event listeners for answer buttons
    quizContainer.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (isTransitioning) return; // Prevent clicking during transitions
            
            const questionElement = this.closest('.quiz-question');
            if (!questionElement) return;
            
            const questionIndex = parseInt(questionElement.id.split('-')[1]) - 1;
            if (isNaN(questionIndex)) return;
            
            const value = parseInt(this.dataset.value);
            
            // Store the answer
            answers[questionIndex] = value;
            
            // Update UI
            updateAnswerSelection(questionIndex, this);
            
            // Enable next button
            nextBtn.disabled = false;
            
            // Auto-advance to next question after a short delay (if not the last question)
            if (questionIndex < questions.length - 1) {
                // Only auto-advance if not already at the end of the quiz
                if (currentQuestion === questionIndex) {
                    setTimeout(() => {
                        if (!isTransitioning && currentQuestion === questionIndex) {
                            nextBtn.click();
                        }
                    }, 700);
                }
            }
        });
    });
    
    // Previous question button
    prevBtn.addEventListener('click', function() {
        if (isTransitioning || currentQuestion <= 0) return;
        
        isTransitioning = true;
        
        // Add exit animation
        questions[currentQuestion].classList.add('exit-right');
        
        setTimeout(() => {
            questions[currentQuestion].classList.remove('active', 'exit-right');
            currentQuestion--;
            
            // Add entry animation
            questions[currentQuestion].classList.add('active', 'enter-left');
            
            setTimeout(() => {
                questions[currentQuestion].classList.remove('enter-left');
                isTransitioning = false;
            }, 300);
            
            updateQuizNavigation();
        }, 300);
    });
    
    // Next question button
    nextBtn.addEventListener('click', function() {
        if (isTransitioning) return;
        
        if (currentQuestion < questions.length - 1) {
            isTransitioning = true;
            
            // Mark next question as viewed
            viewedQuestions[currentQuestion + 1] = true;
            
            // Add exit animation
            questions[currentQuestion].classList.add('exit-left');
            
            setTimeout(() => {
                questions[currentQuestion].classList.remove('active', 'exit-left');
                currentQuestion++;
                
                // Add entry animation
                questions[currentQuestion].classList.add('active', 'enter-right');
                
                setTimeout(() => {
                    questions[currentQuestion].classList.remove('enter-right');
                    isTransitioning = false;
                }, 300);
                
                updateQuizNavigation();
            }, 300);
        } else {
            // Show results if at the last question
            isTransitioning = true;
            showQuizResults();
        }
    });
    
    // Restart quiz button
    restartBtn.addEventListener('click', function() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Reset all answers
        answers.fill(null);
        
        // Reset viewed questions (except first)
        viewedQuestions.fill(false);
        viewedQuestions[0] = true;
        
        // Reset all selected buttons
        quizContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add exit animation for results
        quizResults.classList.add('fade-out');
        
        setTimeout(() => {
            // Reset to first question
            quizResults.classList.remove('active', 'fade-out');
            currentQuestion = 0;
            questions.forEach((q, index) => {
                q.classList.toggle('active', index === 0);
            });
            
            // Add entry animation for first question
            questions[0].classList.add('enter-right');
            
            setTimeout(() => {
                questions[0].classList.remove('enter-right');
                isTransitioning = false;
            }, 300);
            
            updateQuizNavigation();
        }, 300);
    });
    
    // Update answer button selection
    function updateAnswerSelection(questionIndex, selectedButton) {
        if (!selectedButton || questionIndex < 0 || questionIndex >= questions.length) return;
        
        // Remove selection from all buttons in this question
        const allButtons = selectedButton.closest('.answer-options').querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        selectedButton.classList.add('selected');
        
        // Add pulse animation to selected button
        selectedButton.classList.add('pulse');
        setTimeout(() => {
            selectedButton.classList.remove('pulse');
        }, 500);
    }
    
    // Update quiz navigation state
    function updateQuizNavigation() {
        // Update current question indicator
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = currentQuestion + 1;
        }
        
        // Update progress bar if exists
        const progressIndicator = document.querySelector('.progress-indicator');
        if (progressIndicator) {
            const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
            progressIndicator.style.setProperty('--progress', `${progressPercent}%`);
        }
        
        // Update prev button state
        prevBtn.disabled = currentQuestion === 0;
        
        // Update next button state
        if (currentQuestion === questions.length - 1) {
            nextBtn.textContent = 'Show Results';
            nextBtn.classList.add('results-btn');
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.classList.remove('results-btn');
        }
        
        // Disable next button if no answer is selected for current question
        // and the question hasn't been viewed yet
        const noAnswerSelected = answers[currentQuestion] === null;
        nextBtn.disabled = noAnswerSelected;
    }
    
    // Show quiz results
    function showQuizResults() {
        // Add exit animation
        questions[currentQuestion].classList.add('exit-left');
        
        setTimeout(() => {
            // Hide all questions
            questions.forEach(q => q.classList.remove('active', 'exit-left'));
            
            // Calculate score (out of 10)
            const maxPossibleScore = questions.length * 2; // Each question can have max value of 2
            const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0); // Handle null values
            const scoreOutOf10 = Math.min(10, Math.round((totalScore / maxPossibleScore) * 10));
            
            // Show results with animation
            quizResults.classList.add('active', 'enter-scale');
            
            setTimeout(() => {
                quizResults.classList.remove('enter-scale');
                
                // Start count-up animation
                countUpAnimation(scoreOutOf10, securityScore);
                
                // Animate score circle based on score
                const scoreCircle = document.querySelector('.score-circle');
                if (scoreCircle) {
                    let colorClass = '';
                    if (scoreOutOf10 <= 3) {
                        colorClass = 'score-low';
                    } else if (scoreOutOf10 <= 6) {
                        colorClass = 'score-medium';
                    } else if (scoreOutOf10 <= 8) {
                        colorClass = 'score-good';
                    } else {
                        colorClass = 'score-excellent';
                    }
                    
                    scoreCircle.className = 'score-circle'; // Reset classes
                    scoreCircle.classList.add(colorClass);
                }
                
                // Set score message based on score
                if (scoreMessage) {
                    if (scoreOutOf10 <= 3) {
                        scoreMessage.textContent = 'Your security practices need significant improvement. Consider implementing the basic security measures mentioned in the assessment.';
                    } else if (scoreOutOf10 <= 6) {
                        scoreMessage.textContent = 'You have some security measures in place, but there\'s room for improvement. Focus on strengthening your weakest areas.';
                    } else if (scoreOutOf10 <= 8) {
                        scoreMessage.textContent = 'Good job! You have solid security practices. Continue to stay updated on the latest security threats and protections.';
                    } else {
                        scoreMessage.textContent = 'Excellent! Your security posture is very strong. Keep up with this level of security awareness and practices.';
                    }
                }
                
                // Add recommendations based on weak areas
                let recommendationsContainer = document.querySelector('.recommendations');
                
                // Remove old recommendations if they exist
                if (recommendationsContainer) {
                    recommendationsContainer.remove();
                }
                
                // Create new recommendations
                recommendationsContainer = document.createElement('div');
                recommendationsContainer.className = 'recommendations';
                recommendationsContainer.innerHTML = '<h4>Recommendations:</h4><ul></ul>';
                
                const recommendationsList = recommendationsContainer.querySelector('ul');
                
                // Check answers and provide recommendations
                if (answers[0] < 2) { // Password question
                    const li = document.createElement('li');
                    li.textContent = 'Use unique passwords for all important accounts and consider a password manager.';
                    recommendationsList.appendChild(li);
                }
                
                if (answers[1] < 2) { // MFA question
                    const li = document.createElement('li');
                    li.textContent = 'Enable multi-factor authentication on all sensitive accounts, especially email, banking, and social media.';
                    recommendationsList.appendChild(li);
                }
                
                if (answers[2] < 2) { // Updates question
                    const li = document.createElement('li');
                    li.textContent = 'Set up automatic updates for your devices and software to patch security vulnerabilities.';
                    recommendationsList.appendChild(li);
                }
                
                if (answers[3] < 2) { // Backup question
                    const li = document.createElement('li');
                    li.textContent = 'Implement a 3-2-1 backup strategy: 3 copies of data, on 2 different media types, with 1 copy offsite.';
                    recommendationsList.appendChild(li);
                }
                
                if (answers[4] < 2) { // Website security question
                    const li = document.createElement('li');
                    li.textContent = 'Always verify website security (https) before entering any personal information.';
                    recommendationsList.appendChild(li);
                }
                
                // Only append recommendations if there are any
                if (recommendationsList.children.length > 0) {
                    const resultActionsElement = document.querySelector('.result-actions');
                    if (resultActionsElement && resultActionsElement.parentNode) {
                        resultActionsElement.parentNode.insertBefore(recommendationsContainer, resultActionsElement);
                    } else if (scoreMessage && scoreMessage.parentNode) {
                        scoreMessage.parentNode.appendChild(recommendationsContainer);
                    }
                }
                
                isTransitioning = false;
            }, 300);
        }, 300);
    }
    
    // Animation for counting up the score
    function countUpAnimation(targetScore, element) {
        if (!element) return;
        
        let current = 0;
        const increment = targetScore > 5 ? 1 : 0.5;
        const duration = 1500; // Total animation duration in ms
        const stepTime = duration / (targetScore / increment);
        
        const interval = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            if (current >= targetScore) {
                element.textContent = targetScore;
                clearInterval(interval);
            }
        }, stepTime);
    }
}

/**
 * Initialize the file encryption and decryption tool
 */
function initializeFileEncryption() {
    console.log('Initializing file encryption and decryption module...');
    
    // Check for Web Crypto API support
    if (!window.crypto || !window.crypto.subtle) {
        console.error('Web Crypto API is not supported in this browser');
        
        // Display warning on page
        let container = null;
        
        // Try to find by heading text
        const headings = document.querySelectorAll('.service-tool h3');
        for (const heading of headings) {
            if (heading.textContent.includes('File Encryption')) {
                container = heading.closest('.service-tool');
                break;
            }
        }
        
        // Fallback to any service tool
        if (!container) {
            container = document.querySelector('.service-tool');
        }
        
        if (container) {
            // Display error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'crypto-error';
            errorDiv.innerHTML = `
                <div class="status-container active error">
                    <div>Your browser doesn't support secure encryption features. Please try a modern browser like Chrome, Firefox, or Edge.</div>
                </div>
            `;
            
            // Find a good place to insert the error
            const toolHeader = container.querySelector('.tool-header');
            if (toolHeader && toolHeader.nextElementSibling) {
                container.insertBefore(errorDiv, toolHeader.nextElementSibling);
            } else {
                container.appendChild(errorDiv);
            }
        }
        
        return;
    }
    
    // Get DOM elements
    const encryptModeBtn = document.getElementById('encrypt-mode-btn');
    const decryptModeBtn = document.getElementById('decrypt-mode-btn');
    const encryptSection = document.getElementById('encrypt-section');
    const decryptSection = document.getElementById('decrypt-section');
    
    // File inputs
    const encryptFileInput = document.getElementById('encrypt-file-input');
    const decryptFileInput = document.getElementById('decrypt-file-input');
    const encryptFileName = document.getElementById('encrypt-file-name');
    const decryptFileName = document.getElementById('decrypt-file-name');
    
    // Password inputs
    const encryptPassword = document.getElementById('encrypt-password');
    const encryptConfirmPassword = document.getElementById('encrypt-confirm-password');
    const decryptPassword = document.getElementById('decrypt-password');
    
    // Toggle password buttons
    const toggleEncryptPassword = document.getElementById('toggle-encrypt-password');
    const toggleEncryptConfirmPassword = document.getElementById('toggle-encrypt-confirm-password');
    const toggleDecryptPassword = document.getElementById('toggle-decrypt-password');
    
    // Action buttons
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    
    // Status containers
    const encryptStatus = document.getElementById('encrypt-status');
    const decryptStatus = document.getElementById('decrypt-status');
    
    // Check if elements exist
    if (!encryptModeBtn || !decryptModeBtn || !encryptSection || !decryptSection) {
        console.warn('File encryption elements not found');
        return;
    }
    
    // Mode toggle functionality
    encryptModeBtn.addEventListener('click', function() {
        encryptModeBtn.classList.add('active');
        decryptModeBtn.classList.remove('active');
        encryptSection.classList.add('active');
        decryptSection.classList.remove('active');
    });
    
    decryptModeBtn.addEventListener('click', function() {
        decryptModeBtn.classList.add('active');
        encryptModeBtn.classList.remove('active');
        decryptSection.classList.add('active');
        encryptSection.classList.remove('active');
    });
    
    // File input handling
    encryptFileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            const file = this.files[0];
            encryptFileName.textContent = `${file.name} (${formatFileSize(file.size)})`;
            updateEncryptButtonState();
        } else {
            encryptFileName.textContent = 'No file selected';
            encryptBtn.disabled = true;
        }
    });
    
    decryptFileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            const file = this.files[0];
            decryptFileName.textContent = `${file.name} (${formatFileSize(file.size)})`;
            updateDecryptButtonState();
        } else {
            decryptFileName.textContent = 'No file selected';
            decryptBtn.disabled = true;
        }
    });
    
    // Connect show password checkboxes
    const showEncryptPasswordsCheck = document.getElementById('show-encrypt-passwords-check');
    const showDecryptPasswordCheck = document.getElementById('show-decrypt-password-check');
    
    // Single checkbox for both encryption password fields
    if (showEncryptPasswordsCheck) {
        showEncryptPasswordsCheck.addEventListener('change', function() {
            const type = this.checked ? 'text' : 'password';
            // Update both encryption password fields
            encryptPassword.setAttribute('type', type);
            encryptConfirmPassword.setAttribute('type', type);
        });
    }
    
    if (showDecryptPasswordCheck) {
        showDecryptPasswordCheck.addEventListener('change', function() {
            decryptPassword.setAttribute('type', this.checked ? 'text' : 'password');
        });
    }
    
    // Original toggle buttons can be kept as fallback
    toggleEncryptPassword.addEventListener('click', function() {
        togglePasswordVisibility(encryptPassword, this);
        // Update checkbox state
        if (showEncryptPasswordsCheck) {
            showEncryptPasswordsCheck.checked = (encryptPassword.getAttribute('type') === 'text');
            // Also update the confirm password field to match
            encryptConfirmPassword.setAttribute('type', encryptPassword.getAttribute('type'));
        }
    });
    
    toggleEncryptConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(encryptConfirmPassword, this);
        // Update checkbox state
        if (showEncryptPasswordsCheck) {
            showEncryptPasswordsCheck.checked = (encryptConfirmPassword.getAttribute('type') === 'text');
            // Also update the password field to match
            encryptPassword.setAttribute('type', encryptConfirmPassword.getAttribute('type'));
        }
    });
    
    toggleDecryptPassword.addEventListener('click', function() {
        togglePasswordVisibility(decryptPassword, this);
        // Update checkbox state
        if (showDecryptPasswordCheck) {
            showDecryptPasswordCheck.checked = (decryptPassword.getAttribute('type') === 'text');
        }
    });
    
    // Password input handling
    encryptPassword.addEventListener('input', updateEncryptButtonState);
    encryptConfirmPassword.addEventListener('input', updateEncryptButtonState);
    decryptPassword.addEventListener('input', updateDecryptButtonState);
    
    // Test basic encryption functionality
    async function testEncryptionFunctionality() {
        console.log('Testing basic encryption functionality...');
        try {
            // Test data
            const testData = new TextEncoder().encode('Test encryption');
            
            // Generate test key
            const testKey = await window.crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256
                },
                true,
                ['encrypt', 'decrypt']
            );
            
            // Test IV
            const testIv = window.crypto.getRandomValues(new Uint8Array(12));
            
            // Try encryption
            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: testIv
                },
                testKey,
                testData
            );
            
            console.log('Basic encryption test successful');
            return true;
        } catch (error) {
            console.error('Basic encryption test failed:', error);
            return false;
        }
    }
    
    // Run the test and set up fallback if needed
    testEncryptionFunctionality().then(success => {
        if (!success) {
            console.warn('Using fallback encryption method due to Web Crypto API issues.');
            if (encryptStatus) {
                showStatus(encryptStatus,
                    'LIMITED DEMO MODE: Your browser has issues with Web Crypto API. Files will NOT be securely encrypted. A .demo.txt file will be offered.',
                    'error'); // Prominent error style
            }
            if (encryptBtn) {
                encryptBtn.textContent = 'Encrypt File (DEMO MODE)';
                encryptBtn.style.backgroundColor = '#ffc107'; // Amber color
                encryptBtn.title = 'Web Crypto API test failed. Running in limited demo mode.';
            }
            if (decryptBtn) {
                decryptBtn.disabled = true;
                decryptBtn.textContent = 'Decrypt (Unavailable)';
                decryptBtn.style.backgroundColor = '#ef9a9a'; // Light red
                decryptBtn.title = 'Decryption unavailable due to Web Crypto API issues.';
            }
            if (decryptStatus) {
                 showStatus(decryptStatus, 'Decryption is NOT available because your browser has issues with the Web Crypto API.', 'error');
            }
            
            // Overwrite encryptBtn click handler for fallback
            encryptBtn.addEventListener('click', function(e) {
                e.stopImmediatePropagation(); // Stop other handlers
                
                console.log('Using fallback DEMO encryption method click handler');
                showStatus(encryptStatus, 'Simulating encryption (DEMO MODE - INSECURE)...', 'loading');
                
                setTimeout(() => {
                    const file = encryptFileInput.files[0];
                    if (!file) {
                        showStatus(encryptStatus, 'Please select a file for demo.', 'error');
                        return;
                    }
                    
                    const message = 'This is a DEMO file. In a real implementation, your file would be encrypted here.\n\n' +
                                   'Your browser does not support the secure Web Crypto API needed for real encryption, or a test of the API failed.\n\n' +
                                   'Original filename: ' + file.name + '\n' +
                                   'Original size: ' + formatFileSize(file.size) + '\n\n' +
                                   'For real encryption, please use a modern browser like Chrome, Firefox, or Edge, and ensure it is updated and not in a restricted mode.';
                    
                    const blob = new Blob([message], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    
                    // Display a manual download dialog using the updated showDownloadLink
                    showDownloadLink(url, file.name + '.demo.txt', encryptStatus); // Use encryptStatus
                    
                    // Update status, but showDownloadLink already did
                    // showStatus(encryptStatus, 'Demo file created. Click the download link in the status area.', 'success');
                }, 1000);
            }, true); // Use capturing to override other handlers
        } else {
            console.log("Web Crypto API basic test successful. Full encryption mode enabled.");
        }
    });
    
    // Encrypt button click handler
    encryptBtn.addEventListener('click', async function() {
        console.log('Encrypt button clicked');
        
        if (encryptPassword.value !== encryptConfirmPassword.value) {
            updateStatus(encryptStatus, 'Passwords do not match!', 'error');
            return;
        }
        
        const file = encryptFileInput.files[0];
        if (!file) {
            updateStatus(encryptStatus, 'Please select a file to encrypt', 'error');
            return;
        }

        // Add file size validation (100MB limit)
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            updateStatus(encryptStatus, 'File size exceeds 100MB limit', 'error');
            return;
        }
        
        try {
            console.log('Starting encryption process...');
            updateStatus(encryptStatus, 'Encrypting file...', 'loading');
            showProgress(encryptStatus, true);
            
            // Simulate progress updates
            let progress = 0;
            const progressInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 5;
                    progress = Math.min(progress, 90);
                    updateProgress(encryptStatus, progress);
                }
            }, 300);
            
            // Extract original file extension
            const fileNameParts = file.name.split('.');
            const originalExtension = fileNameParts.length > 1 ? fileNameParts.pop() : '';
            const baseFileName = fileNameParts.join('.');
            
            console.log('Reading file...');
            const fileData = await readFileAsArrayBuffer(file);
            console.log('File read successfully, size:', fileData.byteLength);
            
            console.log('Generating salt...');
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            console.log('Salt generated');
            
            console.log('Deriving key...');
            const key = await deriveKey(encryptPassword.value, salt);
            console.log('Key derived successfully');
            
            console.log('Generating IV...');
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            console.log('IV generated');
            
            console.log('Encrypting data...');
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                fileData
            );
            console.log('Data encrypted successfully');
            
            // Create TextEncoder to convert extension string to bytes
            const encoder = new TextEncoder();
            const extensionBytes = encoder.encode(originalExtension);
            
            // Create a Uint8Array to store the extension length (1 byte) and the extension
            const extensionData = new Uint8Array(1 + extensionBytes.length);
            extensionData[0] = extensionBytes.length; // First byte is the length of the extension
            extensionData.set(extensionBytes, 1); // Rest of the bytes are the extension
            
            console.log('Combining data with extension info...');
            const combinedData = new Uint8Array(salt.length + iv.length + extensionData.length + encryptedData.byteLength);
            combinedData.set(salt, 0);
            combinedData.set(iv, salt.length);
            combinedData.set(extensionData, salt.length + iv.length);
            combinedData.set(new Uint8Array(encryptedData), salt.length + iv.length + extensionData.length);
            console.log('Data combined successfully, final size:', combinedData.byteLength);
            
            // Set progress to 95% before download
            updateProgress(encryptStatus, 95);
            
            // Clear progress interval
            clearInterval(progressInterval);
            
            console.log('Starting download...');
            try {
                // Use only the base filename with .encrypted extension
                await downloadFile(combinedData, `${baseFileName}.encrypted`, encryptStatus);
                console.log('Download initiated via downloadFile function.');
                
                // Set progress to 100% on success
                updateProgress(encryptStatus, 100);
                
                // If no manual link was made by showDownloadLink
                if (!encryptStatus.querySelector('a')) { 
                    updateStatus(encryptStatus, 'File encrypted successfully! Download started.', 'success');
                }
                
                // Clear password fields after successful encryption
                encryptPassword.value = '';
                encryptConfirmPassword.value = '';
                updateEncryptButtonState(); // Update button state to reflect empty password fields
            } catch (downloadError) {
                console.error('Download error caught in encryptBtn handler:', downloadError);
                updateStatus(encryptStatus, `Encryption succeeded but download failed: ${downloadError.message}. Check console.`, 'error');
                hideProgress(encryptStatus);
                
                alert(`Encryption succeeded, but the file download failed: ${downloadError.message}

A manual download link might have been created in the status area. Please check the status messages on the page.`);
            }
        } catch (error) {
            console.error('Encryption error:', error);
            updateStatus(encryptStatus, `Encryption failed: ${error.message}`, 'error');
            hideProgress(encryptStatus);
        }
    });
    
    // Decrypt button click handler
    decryptBtn.addEventListener('click', async function() {
        console.log('Decrypt button clicked');
        
        const file = decryptFileInput.files[0];
        if (!file) {
            updateStatus(decryptStatus, 'Please select a file to decrypt', 'error');
            return;
        }
        
        if (!decryptPassword.value) {
            updateStatus(decryptStatus, 'Please enter the decryption password', 'error');
            return;
        }

        // Add file size validation (100MB limit)
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            updateStatus(decryptStatus, 'File size exceeds 100MB limit', 'error');
            return;
        }
        
        try {
            updateStatus(decryptStatus, 'Decrypting file...', 'loading');
            showProgress(decryptStatus, true);
            
            // Simulate progress updates
            let progress = 0;
            const progressInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 5;
                    progress = Math.min(progress, 90);
                    updateProgress(decryptStatus, progress);
                }
            }, 300);
            
            // Extract base filename (without .encrypted extension)
            let baseFileName = file.name;
            if (file.name.endsWith('.encrypted')) {
                baseFileName = file.name.substring(0, file.name.length - 10);
            } else if (file.name.endsWith('.encrypted.txt')) {
                baseFileName = file.name.substring(0, file.name.length - 14);
            }
            
            console.log('Starting decryption process...');
            const result = await decryptFile(file, decryptPassword.value);
            console.log('File decrypted successfully, size:', result.data.byteLength);
            
            // Set progress to 95% before download
            updateProgress(decryptStatus, 95);
            
            // Clear progress interval
            clearInterval(progressInterval);
            
            // Construct final filename with original extension if available
            let finalFileName = baseFileName;
            if (result.extension) {
                finalFileName = `${baseFileName}.${result.extension}`;
            }
            
            console.log('Starting download of decrypted file...');
            try {
                await downloadFile(result.data, finalFileName, decryptStatus);
                console.log('Download initiated via downloadFile function for decrypted file.');
                
                // Set progress to 100% on success
                updateProgress(decryptStatus, 100);
                
                if (!decryptStatus.querySelector('a')) { // If no manual link was made by showDownloadLink
                    updateStatus(decryptStatus, 'File decrypted successfully! Download started.', 'success');
                }
                
                // Clear password field after successful decryption
                decryptPassword.value = '';
                updateDecryptButtonState(); // Update button state to reflect empty password field
            } catch (downloadError) {
                console.error('Download error caught in decryptBtn handler:', downloadError);
                updateStatus(decryptStatus, `Decryption succeeded but download failed: ${downloadError.message}. Check console.`, 'error');
                hideProgress(decryptStatus);
                
                alert(`Decryption succeeded, but the file download failed: ${downloadError.message}

A manual download link might have been created in the status area. Please check the status messages on the page.`);
            }
        } catch (error) {
            console.error('Decryption error:', error);
            hideProgress(decryptStatus);
            
            if (error.name === 'OperationError') {
                updateStatus(decryptStatus, 'Decryption failed: Incorrect password or corrupted file', 'error');
            } else {
                updateStatus(decryptStatus, `Decryption failed: ${error.message}`, 'error');
            }
        }
    });

    /**
     * Update status message in a consistent way
     */
    function updateStatus(container, message, type) {
        if (!container) return;
        
        // Update the container class
        container.className = 'status-container';
        if (type) {
            container.classList.add(type);
        }
        
        // Update the status message
        const statusElement = container.querySelector('.operation-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                container.classList.remove('success');
                if (statusElement) {
                    statusElement.textContent = 'Select a file and enter password';
                }
                hideProgress(container);
            }, 5000);
        }
    }
    
    /**
     * Show progress indicator
     */
    function showProgress(container, indeterminate = false) {
        if (!container) return;
        
        const progressWrapper = container.querySelector('.progress-wrapper');
        if (!progressWrapper) return;
        
        progressWrapper.style.display = 'flex';
        
        const progressBar = container.querySelector('.progress-bar');
        if (progressBar) {
            if (indeterminate) {
                progressBar.classList.add('indeterminate');
            } else {
                progressBar.classList.remove('indeterminate');
                progressBar.style.width = '0%';
            }
        }
    }
    
    /**
     * Hide progress indicator
     */
    function hideProgress(container) {
        if (!container) return;
        
        const progressWrapper = container.querySelector('.progress-wrapper');
        if (progressWrapper) {
            progressWrapper.style.display = 'none';
        }
    }
    
    /**
     * Update progress percentage
     */
    function updateProgress(container, percentage) {
        if (!container) return;
        
        const progressBar = container.querySelector('.progress-bar');
        const progressText = container.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.classList.remove('indeterminate');
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(percentage)}%`;
        }
    }

    /**
     * Toggle password visibility and update icon
     */
    function togglePasswordVisibility(inputElement, buttonElement) {
        const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
        inputElement.setAttribute('type', type);
        
        // Update icon to show state more clearly
        if (type === 'text') {
            buttonElement.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
            this.setAttribute('aria-label', 'Hide password');
        } else {
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
            this.setAttribute('aria-label', 'Show password');
        }
    }
    
    /**
     * Update encrypt button state based on inputs
     */
    function updateEncryptButtonState() {
        const fileSelected = encryptFileInput.files.length > 0;
        const passwordEntered = encryptPassword.value.length > 0;
        const confirmPasswordEntered = encryptConfirmPassword.value.length > 0;
        
        encryptBtn.disabled = !(fileSelected && passwordEntered && confirmPasswordEntered);
    }
    
    /**
     * Update decrypt button state based on inputs
     */
    function updateDecryptButtonState() {
        const fileSelected = decryptFileInput.files.length > 0;
        const passwordEntered = decryptPassword.value.length > 0;
        
        decryptBtn.disabled = !(fileSelected && passwordEntered);
    }
    
    /**
     * Show status message in the specified container with enhanced loading indicator
     */
    function showStatus(container, message, type) {
        container.textContent = '';
        container.className = 'status-container active ' + type;
        
        if (type === 'loading') {
            // Create a more substantial loading indicator with progress bar
            const loadingContainer = document.createElement('div');
            loadingContainer.className = 'loading-container';
            loadingContainer.style.textAlign = 'center';
            loadingContainer.style.marginBottom = '8px';
            
            // Add spinner
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            spinner.style.display = 'inline-block';
            spinner.style.width = '24px';
            spinner.style.height = '24px';
            spinner.style.border = '3px solid rgba(0,0,0,0.1)';
            spinner.style.borderRadius = '50%';
            spinner.style.borderTopColor = '#2196F3';
            spinner.style.animation = 'spin 1s linear infinite';
            loadingContainer.appendChild(spinner);
            
            // Add progress bar
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            progressContainer.style.width = '100%';
            progressContainer.style.height = '8px';
            progressContainer.style.backgroundColor = 'rgba(0,0,0,0.1)';
            progressContainer.style.borderRadius = '4px';
            progressContainer.style.overflow = 'hidden';
            progressContainer.style.marginTop = '8px';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.width = '0%';
            progressBar.style.height = '100%';
            progressBar.style.backgroundColor = '#2196F3';
            progressBar.style.borderRadius = '4px';
            progressBar.style.transition = 'width 0.3s ease';
            
            // Add keyframes animation for indeterminate progress
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes progress-indeterminate {
                    0% { width: 0; left: 0; }
                    50% { width: 50%; }
                    100% { width: 0; left: 100%; }
                }
            `;
            document.head.appendChild(style);
            
            // Set indeterminate animation
            progressBar.style.position = 'relative';
            progressBar.style.animation = 'progress-indeterminate 2s ease infinite';
            
            progressContainer.appendChild(progressBar);
            loadingContainer.appendChild(progressContainer);
            
            container.appendChild(loadingContainer);
        }
        
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.padding = '8px';
        messageElement.style.textAlign = 'center';
        container.appendChild(messageElement);
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                container.classList.remove('active');
            }, 5000);
        }
    }
    
    /**
     * Format file size to human-readable format
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Encrypt file using AES-256-GCM
     * Uses Web Crypto API for secure encryption
     */
    async function encryptFile(file, password) {
        // Extract original file extension
        const fileNameParts = file.name.split('.');
        const originalExtension = fileNameParts.length > 1 ? fileNameParts.pop() : '';
        
        // Read the file
        const fileData = await readFileAsArrayBuffer(file);
        
        // Derive a key from the password
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const key = await deriveKey(password, salt);
        
        // Generate random initialization vector
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        // Encrypt the file data
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            fileData
        );
        
        // Create TextEncoder to convert extension string to bytes
        const encoder = new TextEncoder();
        const extensionBytes = encoder.encode(originalExtension);
        
        // Create a Uint8Array to store the extension length (1 byte) and the extension
        const extensionData = new Uint8Array(1 + extensionBytes.length);
        extensionData[0] = extensionBytes.length; // First byte is the length of the extension
        extensionData.set(extensionBytes, 1); // Rest of the bytes are the extension
        
        // Add version byte for future compatibility
        const version = new Uint8Array([1]); // Version 1 of our file format
        
        // Combine version, salt, IV, extension data, and encrypted data into one array
        const combinedData = new Uint8Array(version.length + salt.length + iv.length + extensionData.length + encryptedData.byteLength);
        combinedData.set(version, 0);
        combinedData.set(salt, version.length);
        combinedData.set(iv, version.length + salt.length);
        combinedData.set(extensionData, version.length + salt.length + iv.length);
        combinedData.set(new Uint8Array(encryptedData), version.length + salt.length + iv.length + extensionData.length);
        
        return combinedData;
    }
    
    /**
     * Decrypt file using AES-256-GCM
     * Uses Web Crypto API for secure decryption
     */
    async function decryptFile(file, password) {
        try {
            // Read the encrypted file
            const fileData = await readFileAsArrayBuffer(file);
            const fileBytes = new Uint8Array(fileData);
            
            // Validate minimum file size (salt + iv = 28 bytes)
            if (fileBytes.length < 29) {
                throw new Error('Invalid encrypted file: File is too small');
            }
            
            // Extract salt and IV
            const salt = fileBytes.slice(0, 16);
            const iv = fileBytes.slice(16, 28);
            
            // Extract extension information
            const extensionLength = fileBytes[28]; // First byte after IV is extension length
            let originalExtension = '';
            
            if (extensionLength > 0 && extensionLength < 20) { // Add a reasonable max length check
                // Extract the extension bytes
                const extensionBytes = fileBytes.slice(29, 29 + extensionLength);
                // Convert extension bytes back to string
                const decoder = new TextDecoder();
                originalExtension = decoder.decode(extensionBytes);
            }
            
            // Calculate the start of the actual encrypted data
            const dataStart = 29 + extensionLength;
            
            // Ensure there's enough data
            if (fileBytes.length <= dataStart) {
                throw new Error('Invalid encrypted file: No encrypted data found');
            }
            
            const encryptedData = fileBytes.slice(dataStart);
            
            // Validate encrypted data exists
            if (encryptedData.length === 0) {
                throw new Error('Invalid encrypted file: No encrypted data found');
            }
            
            // Derive the key from the password and salt
            const key = await deriveKey(password, salt);
            
            // Decrypt the data
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encryptedData
            );
            
            return {
                data: new Uint8Array(decryptedData),
                extension: originalExtension
            };
        } catch (error) {
            if (error.name === 'OperationError') {
                throw new Error('Incorrect password or corrupted file');
            } else if (error.name === 'DataError') {
                throw new Error('Invalid encrypted file format');
            }
            throw error;
        }
    }
    
    /**
     * Derive an encryption key from a password using PBKDF2
     */
    async function deriveKey(password, salt) {
        // Convert password to ArrayBuffer
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);
        
        // Import password as a key
        const passwordKey = await window.crypto.subtle.importKey(
            'raw',
            passwordData,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
        
        // Derive a key using PBKDF2
        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            passwordKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            
            reader.onerror = function(error) {
                reject(error);
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * Download a file with the given data and filename
     * @returns {Promise} A promise that resolves when download is initiated
     */
    function downloadFile(data, filename, statusDisplayElement) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Creating blob...');
                
                // Set appropriate MIME type based on filename to prevent .txt being added on mobile
                let mimeType = 'application/octet-stream'; // Default binary type
                
                // If it's an encrypted file, use custom MIME type to prevent .txt extension
                if (filename.endsWith('.encrypted')) {
                    mimeType = 'application/x-encrypted';
                } else {
                    // Try to determine MIME type from extension
                    const extension = filename.split('.').pop().toLowerCase();
                    if (extension) {
                        const mimeTypes = {
                            'pdf': 'application/pdf',
                            'jpg': 'image/jpeg',
                            'jpeg': 'image/jpeg',
                            'png': 'image/png',
                            'gif': 'image/gif',
                            'doc': 'application/msword',
                            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'xls': 'application/vnd.ms-excel',
                            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'ppt': 'application/vnd.ms-powerpoint',
                            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            'txt': 'text/plain',
                            'csv': 'text/csv',
                            'html': 'text/html',
                            'htm': 'text/html',
                            'json': 'application/json',
                            'xml': 'application/xml',
                            'zip': 'application/zip',
                            'rar': 'application/x-rar-compressed',
                            'mp3': 'audio/mpeg',
                            'mp4': 'video/mp4',
                            'avi': 'video/x-msvideo',
                            'mov': 'video/quicktime'
                        };
                        
                        if (mimeTypes[extension]) {
                            mimeType = mimeTypes[extension];
                        }
                    }
                }
                
                const blob = new Blob([data], { type: mimeType });
                console.log('Blob created, size:', blob.size, 'MIME type:', mimeType);
                
                console.log('Creating object URL...');
                const url = URL.createObjectURL(blob);
                console.log('Object URL created:', url);
                
                // Try method 1: Using an anchor element
                try {
                    console.log('Attempting download method 1: Anchor element');
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.style.display = 'none';
                    
                    document.body.appendChild(a);
                    a.click();
                    
                    // Clean up
                    setTimeout(() => {
                        if (a.parentNode) { // Check if still in DOM
                           document.body.removeChild(a);
                        }
                        URL.revokeObjectURL(url);
                        console.log('Method 1 cleanup complete');
                        resolve();
                    }, 100);
                } catch (error) {
                    console.error('Method 1 (Anchor element) failed, trying method 2 (window.open):', error);
                    
                    // Try method 2: Using window.open
                    try {
                        console.log('Attempting download method 2: window.open');
                        const newWindow = window.open(url);
                        
                        if (!newWindow) {
                            console.error('Method 2 (window.open) failed: Popup blocked or new window could not be created. Showing manual link.');
                            showDownloadLink(url, filename, statusDisplayElement); // Pass statusDisplayElement
                            resolve(); // Resolve because we've offered a manual link
                        } else {
                            // Clean up for window.open. It's tricky to know when to revoke.
                            // Revoking too soon can stop the download.
                            console.log('Method 2 (window.open) potentially successful. URL will be revoked on next operation or page unload.');
                            // For safety, let's revoke after a longer delay if window.open was used,
                            // or rely on browser's garbage collection for the blob URL.
                            // Alternatively, don't revoke here and let the blob URL live until page navigation.
                            // For now, let's skip immediate revocation for window.open if it succeeded.
                            resolve();
                        }
                    } catch (error2) {
                        console.error('Method 2 (window.open) also failed. Showing manual link:', error2);
                        showDownloadLink(url, filename, statusDisplayElement); // Pass statusDisplayElement
                        resolve(); // Resolve because we've offered a manual link
                    }
                }
            } catch (error) {
                console.error('General downloadFile error (e.g., blob creation):', error);
                // If even blob creation fails, then show a generic error message.
                if (statusDisplayElement) {
                     showStatus(statusDisplayElement, `Critical download error: ${error.message}`, 'error');
                }
                reject(error); // Reject the promise
            }
        });
    }
    
    /**
     * Show a visible download link when automatic download fails
     */
    function showDownloadLink(url, filename, targetElement) {
        console.log('Creating visible download link as fallback in provided target element');
        
        if (!targetElement) {
            console.error("Target element for showDownloadLink was not provided!");
            // Fallback to an alert if no targetElement
            alert(`Download ready: ${filename}. Please copy this URL if no link appears: ${url}`);
            return;
        }

        targetElement.innerHTML = ''; // Clear previous content
        targetElement.className = 'status-container active warning'; // Re-style as a warning

        const messageP = document.createElement('p');
        messageP.style.padding = '10px';
        messageP.style.textAlign = 'center';
        messageP.textContent = 'Automatic download may have failed. Please click here: ';

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.textContent = `Download ${filename}`;
        link.style.fontWeight = 'bold';
        link.style.marginLeft = '5px';
        link.style.color = '#007bff'; // Bootstrap primary blue for visibility
        link.style.textDecoration = 'underline';

        messageP.appendChild(link);
        targetElement.appendChild(messageP);
        
        // Add a note about blob URLs
        const noteP = document.createElement('p');
        noteP.textContent = '(This is a temporary link specific to your browser session.)';
        noteP.style.fontSize = '0.8em';
        noteP.style.marginTop = '5px';
        noteP.style.textAlign = 'center';
        targetElement.appendChild(noteP);

        console.log('Visible download link added to target element.');
    }
    
    // Add a test download button
    function addTestDownloadButton() {
        // Commenting out the function implementation to disable the test button
        /*
        console.log('Adding test download button...');
        
        // Find encryption section
        const encryptSection = document.getElementById('encrypt-section');
        if (!encryptSection) {
            console.error('Could not find encrypt section');
            return;
        }
        
        // Create test button
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Direct Download';
        testButton.className = 'action-btn';
        testButton.style.marginTop = '10px';
        testButton.style.backgroundColor = '#ff9800';
        
        // Add button to the page
        const statusContainer = encryptSection.querySelector('.status-container');
        if (statusContainer) {
            encryptSection.insertBefore(testButton, statusContainer);
        } else {
            encryptSection.appendChild(testButton);
        }
        
        // Add click handler
        testButton.addEventListener('click', function() {
            console.log('Test download button clicked');
            
            // Create a simple text file
            const text = 'This is a test download file created at ' + new Date().toString();
            const blob = new Blob([text], {type: 'text/plain'});
            
            try {
                // Try direct download
                console.log('Creating test file URL...');
                const url = URL.createObjectURL(blob);
                
                // Method 1: Direct link click
                const a = document.createElement('a');
                a.href = url;
                a.download = 'test-download.txt';
                document.body.appendChild(a);
                console.log('Clicking test download link...');
                a.click();
                
                // Clean up
                setTimeout(() => {
                    if (a.parentNode) { // Check if still in DOM
                       document.body.removeChild(a);
                    }
                    URL.revokeObjectURL(url);
                }, 100);
                
                // Also show visible link as backup
                showDownloadLink(url, 'test-download.txt', encryptStatus);
                
                console.log('Test download initiated');
            } catch (error) {
                console.error('Test download failed:', error);
                alert('Download test failed: ' + error.message);
            }
        });
        
        console.log('Test download button added');
        */
    }
    
    // Comment out the function call to prevent adding the test button
    // addTestDownloadButton();
    
    // Check if secure context (needed for crypto)
    if (!window.isSecureContext) {
        console.error('Not in a secure context. Web Crypto API may not work.');
        showStatus(encryptStatus, 'Warning: Not using HTTPS. Encryption features may not work.', 'error');
    }
}

/**
 * Apply security measures to protect page content
 * - Disable right-click
 * - Prevent dev tools shortcuts
 * - Block dragging of content
 */
function applySecurityMeasures() {
    // Disable right-click contextmenu
    document.addEventListener('contextmenu', function(e) {
        // Don't prevent contextmenu on navigation links
        if (e.target.tagName === 'A' || e.target.closest('a') || 
            e.target.classList.contains('btn') || e.target.closest('.btn')) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    
    // Prevent keyboard shortcuts for developer tools
    document.addEventListener('keydown', function(e) {
        // Prevent F12 key
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+Shift+I (Chrome, Firefox, Safari)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+Shift+J (Chrome)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+Shift+C (Chrome)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable selecting text globally, but enable for specific elements
    document.body.style.userSelect = 'none';
    
    // Allow selection for text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
    textElements.forEach(element => {
        element.style.userSelect = 'text';
    });
    
    // Prevent dragging images and other content
    document.addEventListener('dragstart', function(e) {
        // Don't prevent dragging on navigation elements
        if (e.target.tagName === 'A' || e.target.closest('a') || 
            e.target.classList.contains('btn') || e.target.closest('.btn')) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    
    // Additional security for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.draggable = false;
        img.addEventListener('contextmenu', e => e.preventDefault());
    });
    
    // Add visual effects for security aesthetics
    addSecurityVisualEffects();
}

/**
 * Add visual security-themed effects to enhance the experience
 */
function addSecurityVisualEffects() {
    // Create random "code scan" effects in security animation
    const securityAnimation = document.querySelector('.security-animation');
    
    if (securityAnimation) {
        // Create code scan effect
        const codeScan = document.createElement('div');
        codeScan.classList.add('code-scan');
        securityAnimation.appendChild(codeScan);
        
        // Animate the code scan at random intervals
        setInterval(() => {
            codeScan.style.opacity = '1';
            codeScan.style.height = '2px';
            codeScan.style.top = Math.random() * 100 + '%';
            
            setTimeout(() => {
                codeScan.style.opacity = '0';
            }, 500);
        }, 3000);
    }
}

/**
 * Detect system theme and adapt UI accordingly
 * - Switch logo based on system theme
 * - Store theme preference
 */
function detectTheme() {
    // Check if the browser supports prefers-color-scheme
    if (window.matchMedia) {
        // Check if the user prefers dark mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply theme based on preference
        if (prefersDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        
        // Listen for changes to color scheme preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });
    }
}

// Check browser compatibility
function checkBrowserCompatibility() {
    console.log('Checking browser compatibility...');
    
    const results = {
        browser: 'Unknown',
        version: 'Unknown',
        compatible: false,
        issues: []
    };
    
    // Detect browser
    const userAgent = navigator.userAgent;
    
    if (userAgent.indexOf('Chrome') > -1) {
        results.browser = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        if (match) results.version = match[1];
        results.compatible = parseInt(results.version) >= 60;
    } else if (userAgent.indexOf('Firefox') > -1) {
        results.browser = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        if (match) results.version = match[1];
        results.compatible = parseInt(results.version) >= 60;
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        results.browser = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        if (match) results.version = match[1];
        results.compatible = parseInt(results.version) >= 11;
    } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg/') > -1) {
        results.browser = 'Edge';
        const match = userAgent.match(/Edge\/(\d+)/) || userAgent.match(/Edg\/(\d+)/);
        if (match) results.version = match[1];
        results.compatible = true; // Modern Edge should be compatible
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
        results.browser = 'Internet Explorer';
        results.compatible = false;
        results.issues.push('Internet Explorer is not supported for encryption features.');
    }
    
    // Check for secure context
    if (!window.isSecureContext) {
        results.issues.push('Not using HTTPS. Web Crypto API requires a secure context.');
        results.compatible = false;
    }
    
    // Check for Web Crypto API
    if (!window.crypto || !window.crypto.subtle) {
        results.issues.push('Web Crypto API not available in this browser.');
        results.compatible = false;
    }
    
    // Check for download capability
    if (typeof document.createElement('a').download === 'undefined') {
        results.issues.push('Download attribute not supported in this browser.');
    }
    
    // Check for Blob support
    if (typeof Blob === 'undefined') {
        results.issues.push('Blob API not supported in this browser.');
        results.compatible = false;
    }
    
    // Check for FileReader support
    if (typeof FileReader === 'undefined') {
        results.issues.push('FileReader API not supported in this browser.');
        results.compatible = false;
    }
    
    console.log('Browser compatibility check results:', results);
    
    // Display results on page
    const encryptSection = document.getElementById('encrypt-section');
    if (encryptSection) {
        const infoBox = document.createElement('div');
        infoBox.className = 'compatibility-info';
        infoBox.style.margin = '15px 0';
        infoBox.style.padding = '10px';
        infoBox.style.border = '1px solid #ccc';
        infoBox.style.borderRadius = '4px';
        infoBox.style.backgroundColor = results.compatible ? '#e8f5e9' : '#ffebee';
        
        let content = `<div style="font-weight: bold;">Browser: ${results.browser} ${results.version}</div>`;
        content += `<div>Compatibility: ${results.compatible ? 'Good' : 'Issues detected'}</div>`;
        
        if (results.issues.length > 0) {
            content += '<ul style="margin: 5px 0; padding-left: 20px;">';
            results.issues.forEach(issue => {
                content += `<li>${issue}</li>`;
            });
            content += '</ul>';
        }
        
        if (!results.compatible) {
            content += '<div>Recommendation: Try using Chrome, Firefox, or Edge for encryption features.</div>';
        }
        
        infoBox.innerHTML = content;
        
        // Find status container to insert before
        const statusContainer = encryptSection.querySelector('.status-container');
        if (statusContainer) {
            encryptSection.insertBefore(infoBox, statusContainer);
        } else {
            encryptSection.appendChild(infoBox);
        }
    }
    
    return results;
}

// Run compatibility check
const compatibilityResults = checkBrowserCompatibility();

// Verify all DOM elements exist
function verifyElements() {
    console.log('Verifying DOM elements...');
    
    const elements = {
        'encrypt-mode-btn': document.getElementById('encrypt-mode-btn'),
        'decrypt-mode-btn': document.getElementById('decrypt-mode-btn'),
        'encrypt-section': document.getElementById('encrypt-section'),
        'decrypt-section': document.getElementById('decrypt-section'),
        'encrypt-file-input': document.getElementById('encrypt-file-input'),
        'decrypt-file-input': document.getElementById('decrypt-file-input'),
        'encrypt-password': document.getElementById('encrypt-password'),
        'encrypt-confirm-password': document.getElementById('encrypt-confirm-password'),
        'decrypt-password': document.getElementById('decrypt-password'),
        'encrypt-btn': document.getElementById('encrypt-btn'),
        'decrypt-btn': document.getElementById('decrypt-btn')
    };
    
    let allFound = true;
    const missing = [];
    
    for (const [id, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element not found: ${id}`);
            allFound = false;
            missing.push(id);
        } else {
            console.log(`Element found: ${id}`);
        }
    }
    
    if (!allFound) {
        console.error('Some elements are missing:', missing);
        
        // Display warning on page
        let container = null;
        
        // Try to find by heading text
        const headings = document.querySelectorAll('.service-tool h3');
        for (const heading of headings) {
            if (heading.textContent.includes('File Encryption')) {
                container = heading.closest('.service-tool');
                break;
            }
        }
        
        // Fallback to any service tool
        if (!container) {
            container = document.querySelector('.service-tool');
        }
        
        if (container) {
            const warning = document.createElement('div');
            warning.style.backgroundColor = '#ffebee';
            warning.style.padding = '10px';
            warning.style.borderRadius = '4px';
            warning.style.margin = '10px 0';
            
            warning.innerHTML = `
                <strong>Error: Missing HTML Elements</strong>
                <p>The following elements are missing from the page:</p>
                <ul>${missing.map(id => `<li>${id}</li>`).join('')}</ul>
                <p>This may be causing the encryption feature to not work properly.</p>
            `;
            
            container.prepend(warning);
        }
    } else {
        console.log('All elements found!');
    }
    
    return allFound;
}

// Run verification
verifyElements();

// Check for alternative button IDs mentioned by the user
function checkAlternativeButtons() {
    console.log('Checking for alternative button IDs...');
    
    const encryptButton = document.getElementById('encryptButton');
    const decryptButton = document.getElementById('decryptButton');
    
    if (encryptButton) {
        console.log('Found alternative button: encryptButton');
        
        // Add event listener
        encryptButton.addEventListener('click', function() {
            console.log('Alternative encrypt button clicked');
            // Try to find the real encrypt button and click it
            const realButton = document.getElementById('encrypt-btn');
            if (realButton) {
                console.log('Triggering real encrypt button');
                realButton.click();
            } else {
                console.error('Real encrypt button not found');
                alert('Encryption functionality is not available');
            }
        });
    }
    
    if (decryptButton) {
        console.log('Found alternative button: decryptButton');
        
        // Add event listener
        decryptButton.addEventListener('click', function() {
            console.log('Alternative decrypt button clicked');
            // Try to find the real decrypt button and click it
            const realButton = document.getElementById('decrypt-btn');
            if (realButton) {
                console.log('Triggering real decrypt button');
                realButton.click();
            } else {
                console.error('Real decrypt button not found');
                alert('Decryption functionality is not available');
            }
        });
    }
    
    // Also check for any buttons with specific text content
    document.querySelectorAll('button').forEach(button => {
        const text = button.textContent.trim().toLowerCase();
        if (text === 'encrypt' && button.id !== 'encrypt-btn' && button.id !== 'encryptButton') {
            console.log('Found button with text "Encrypt"');
            button.addEventListener('click', function() {
                console.log('Text-based encrypt button clicked');
                const realButton = document.getElementById('encrypt-btn');
                if (realButton) realButton.click();
            });
        }
        
        if (text === 'decrypt' && button.id !== 'decrypt-btn' && button.id !== 'decryptButton') {
            console.log('Found button with text "Decrypt"');
            button.addEventListener('click', function() {
                console.log('Text-based decrypt button clicked');
                const realButton = document.getElementById('decrypt-btn');
                if (realButton) realButton.click();
            });
        }
    });
}

// Run check for alternative buttons
checkAlternativeButtons(); 