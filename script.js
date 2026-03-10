/**
 * COLLEGE ADMISSION PORTAL - JAVASCRIPT
 * Developed by: Ashmita Dasgupta
 * Registration Number: 24BCT0321
 * College: Vellore Institute of Technology (Vellore)
 * Course: B.Tech CSE with specialization in Internet of Things
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFormSteps();
    initFormValidation();
    initProgramFilter();
    initFileUpload();
});

/**
 * Navigation Functionality
 * Handles mobile menu toggle and smooth scrolling
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Toggle icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
    });
}

/**
 * Multi-step Form Navigation
 * Handles moving between form steps
 */
function initFormSteps() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    nextButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNumber = parseInt(currentStep.dataset.step);
            
            // Validate current step before proceeding
            if (validateStep(currentStepNumber)) {
                const nextStepNumber = currentStepNumber + 1;
                const nextStep = document.querySelector(`.form-step[data-step="${nextStepNumber}"]`);
                
                if (nextStep) {
                    currentStep.classList.remove('active');
                    nextStep.classList.add('active');
                    
                    // Update progress indicators
                    updateProgressSteps(nextStepNumber);
                    
                    // Scroll to top of form
                    document.querySelector('.registration-wrapper').scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    prevButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNumber = parseInt(currentStep.dataset.step);
            const prevStepNumber = currentStepNumber - 1;
            const prevStep = document.querySelector(`.form-step[data-step="${prevStepNumber}"]`);
            
            if (prevStep) {
                currentStep.classList.remove('active');
                prevStep.classList.add('active');
                
                // Update progress indicators
                updateProgressSteps(prevStepNumber);
                
                // Scroll to top of form
                document.querySelector('.registration-wrapper').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Update Progress Steps
 * Updates the visual progress indicators
 */
function updateProgressSteps(activeStep) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach(function(step, index) {
        const stepNumber = index + 1;
        
        if (stepNumber < activeStep) {
            step.classList.add('completed');
            step.classList.add('active');
        } else if (stepNumber === activeStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active');
            step.classList.remove('completed');
        }
    });
}

/**
 * Form Validation
 * Comprehensive form validation for all fields
 */
function initFormValidation() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        // Add real-time validation on blur
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                // Clear error when user starts typing
                const errorElement = document.getElementById(input.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
                input.classList.remove('error');
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all steps
            let isValid = true;
            
            for (let i = 1; i <= 3; i++) {
                if (!validateStep(i)) {
                    isValid = false;
                    
                    // Show the first step with errors
                    const stepWithError = document.querySelector(`.form-step[data-step="${i}"]`);
                    const currentStep = document.querySelector('.form-step.active');
                    
                    if (stepWithError && !currentStep.isEqualNode(stepWithError)) {
                        currentStep.classList.remove('active');
                        stepWithError.classList.add('active');
                        updateProgressSteps(i);
                    }
                    
                    break;
                }
            }
            
            if (isValid) {
                submitForm();
            }
        });
    }
}

/**
 * Validate Step
 * Validates all fields in a specific step
 */
function validateStep(stepNumber) {
    let isValid = true;
    const step = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    
    if (!step) return true;
    
    const requiredFields = step.querySelectorAll('[required]');
    
    requiredFields.forEach(function(field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate Field
 * Validates individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(field.id + 'Error');
    let errorMessage = '';
    
    // Check if empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
    } else {
        // Specific validations
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (value && !/^[a-zA-Z\s]{2,50}$/.test(value)) {
                    errorMessage = 'Name should contain only letters (2-50 characters)';
                }
                break;
                
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                if (value && !/^[0-9]{10}$/.test(value)) {
                    errorMessage = 'Please enter a valid 10-digit phone number';
                }
                break;
                
            case 'dob':
                if (value) {
                    const dobDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - dobDate.getFullYear();
                    if (age < 16 || age > 30) {
                        errorMessage = 'Age should be between 16 and 30 years';
                    }
                }
                break;
                
            case 'pincode':
                if (value && !/^[0-9]{6}$/.test(value)) {
                    errorMessage = 'Please enter a valid 6-digit PIN code';
                }
                break;
                
            case 'percentage':
                if (value) {
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                        errorMessage = 'Please enter a valid percentage (0-100)';
                    }
                }
                break;
        }
    }
    
    // Display error
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    if (errorMessage) {
        field.classList.add('error');
        return false;
    } else {
        field.classList.remove('error');
        return true;
    }
}

/**
 * Submit Form
 * Handles form submission and shows notification
 */
function submitForm() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    
    // Generate application ID
    const applicationId = 'MC2025' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Simulate submission (in real scenario, this would be an API call)
    // For demonstration, we'll show a success message
    // You can modify this to handle actual server submission
    
    // Randomly simulate success or failure for demonstration
    // In production, this would depend on actual server response
    const isSuccess = true; // Set to true for successful submission
    
    showNotification(isSuccess, applicationId);
    
    // Reset form on success
    if (isSuccess) {
        form.reset();
        // Reset to first step
        document.querySelectorAll('.form-step').forEach(function(step, index) {
            step.classList.remove('active');
            if (index === 0) {
                step.classList.add('active');
            }
        });
        updateProgressSteps(1);
    }
}

/**
 * Show Notification Modal
 * Displays success or error notification
 */
function showNotification(isSuccess, applicationId) {
    const modal = document.getElementById('notificationModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalDetails = document.getElementById('modalDetails');
    const applicationIdSpan = document.getElementById('applicationId');
    const closeBtn = document.getElementById('modalClose');
    
    if (isSuccess) {
        modalIcon.className = 'modal-icon success';
        modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        modalTitle.textContent = 'Registration Successful!';
        modalMessage.textContent = 'Your application has been submitted successfully. You will receive a confirmation email shortly with further instructions.';
        modalDetails.style.display = 'block';
        applicationIdSpan.textContent = applicationId;
    } else {
        modalIcon.className = 'modal-icon error';
        modalIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        modalTitle.textContent = 'Registration Failed!';
        modalMessage.textContent = 'There was an error submitting your application. Please check your details and try again.';
        modalDetails.style.display = 'none';
    }
    
    modal.classList.add('active');
    
    // Close modal on button click
    closeBtn.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Close modal on overlay click
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

/**
 * Program Filter
 * Filters programs by category
 */
function initProgramFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');
    
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter cards
            programCards.forEach(function(card) {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * File Upload Enhancement
 * Shows file name after selection
 */
function initFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            const fileUpload = this.closest('.file-upload');
            const label = fileUpload.querySelector('.file-upload-label span');
            
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                const fileSize = (this.files[0].size / 1024).toFixed(1);
                
                // Check file size (2MB limit)
                if (this.files[0].size > 2 * 1024 * 1024) {
                    const errorElement = document.getElementById(this.id + 'Error');
                    if (errorElement) {
                        errorElement.textContent = 'File size exceeds 2MB limit';
                    }
                    this.value = '';
                    label.textContent = 'Click to upload or drag and drop';
                    return;
                }
                
                label.innerHTML = `<strong>${fileName}</strong> (${fileSize} KB)`;
                fileUpload.style.borderColor = '#28a745';
                
                // Clear any previous error
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            } else {
                label.textContent = 'Click to upload or drag and drop';
                fileUpload.style.borderColor = '#e0e0e0';
            }
        });
    });
}

/**
 * Smooth Scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
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

/**
 * Animation on scroll
 * Elements animate when they come into view
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.link-card, .feature-item, .program-card, .date-card, .contact-card, .leader-card, .mv-card, .value-item, .infra-item, .eligibility-card');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

// Initialize scroll animations after page load
window.addEventListener('load', animateOnScroll);

/**
 * Console log for project information
 */
console.log('%c College Admission Portal ', 'background: #1a4b8c; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c Developed by: Ashmita Dasgupta ', 'background: #f5a623; color: white; font-size: 12px; padding: 5px;');
console.log('%c Registration Number: 24BCT0321 ', 'color: #1a4b8c;');
console.log('%c Vellore Institute of Technology (Vellore) ', 'color: #1a4b8c;');
console.log('%c Guided by: Raparthi Yaswanth ', 'color: #1a4b8c;');
console.log('%c School: SCOPE ', 'color: #1a4b8c;');
console.log('%c Course: B.Tech CSE with specialization in Internet of Things ', 'color: #1a4b8c;');
