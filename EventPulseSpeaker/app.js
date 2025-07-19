// EventPulse Speaker Dashboard JavaScript

class SpeakerDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('Initializing EventPulse Dashboard...');
        this.setupEventListeners();
        this.setupFileUpload();
        this.setupNavigationTransitions();
        
        // Check if user is already logged in
        this.checkExistingLogin();
    }

    checkExistingLogin() {
        const userData = localStorage.getItem('eventPulseUser');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('Found existing login:', this.currentUser);
                this.showDashboard();
                this.updateUserInfo();
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('eventPulseUser');
            }
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Google login
        const googleLoginBtn = document.getElementById('googleLogin');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', this.handleGoogleLogin.bind(this));
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // Navigation menu
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Paper submission form
        const paperForm = document.getElementById('paperForm');
        if (paperForm) {
            paperForm.addEventListener('submit', this.handlePaperSubmission.bind(this));
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', this.handleProfileUpdate.bind(this));
        }

        // File actions
        this.setupFileActions();
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        if (uploadArea && fileInput) {
            // Click to upload
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    setupNavigationTransitions() {
        // Smooth transitions between sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    setupFileActions() {
        // Download and delete buttons for files
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-icon')) {
                const button = e.target.closest('.btn-icon');
                const icon = button.querySelector('i');
                
                if (icon && icon.classList.contains('fa-download')) {
                    this.handleFileDownload(button);
                } else if (icon && icon.classList.contains('fa-trash')) {
                    this.handleFileDelete(button);
                }
            }
        });
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log('Login attempt with email:', email);

        if (!email || !password) {
            this.showNotification('Please enter both email and password', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        this.showNotification('Logging in...', 'info');
        
        // Simulate login process
        setTimeout(() => {
            this.currentUser = {
                name: 'Dr. John Smith',
                email: email,
                role: 'speaker'
            };
            
            // Store user data
            localStorage.setItem('eventPulseUser', JSON.stringify(this.currentUser));
            console.log('User logged in successfully:', this.currentUser);
            
            this.showDashboard();
            this.showNotification('Login successful!', 'success');
            this.updateUserInfo();
            
            // Reset form
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
            e.target.reset();
        }, 1500);
    }

    handleGoogleLogin() {
        console.log('Google login initiated...');
        
        const googleBtn = document.getElementById('googleLogin');
        googleBtn.textContent = 'Connecting...';
        googleBtn.disabled = true;

        this.showNotification('Redirecting to Google...', 'info');
        
        // Simulate Google OAuth
        setTimeout(() => {
            this.currentUser = {
                name: 'Dr. John Smith',
                email: 'john.smith@gmail.com',
                role: 'speaker'
            };
            
            localStorage.setItem('eventPulseUser', JSON.stringify(this.currentUser));
            console.log('Google login successful:', this.currentUser);
            
            this.showDashboard();
            this.showNotification('Google login successful!', 'success');
            this.updateUserInfo();
            
            // Reset button
            googleBtn.innerHTML = '<i class="fab fa-google"></i> Continue with Google';
            googleBtn.disabled = false;
        }, 2000);
    }

    handleLogout() {
        console.log('Logging out user...');
        
        this.currentUser = null;
        localStorage.removeItem('eventPulseUser');
        
        this.showLogin();
        this.showNotification('Logged out successfully', 'success');
    }

    showDashboard() {
        console.log('Showing dashboard...');
        
        const loginPage = document.getElementById('loginPage');
        const dashboardPage = document.getElementById('dashboardPage');
        
        if (loginPage && dashboardPage) {
            loginPage.classList.remove('active');
            dashboardPage.classList.add('active');
            
            // Load dashboard data
            this.loadDashboardData();
        }
    }

    showLogin() {
        console.log('Showing login page...');
        
        const loginPage = document.getElementById('loginPage');
        const dashboardPage = document.getElementById('dashboardPage');
        
        if (loginPage && dashboardPage) {
            dashboardPage.classList.remove('active');
            loginPage.classList.add('active');
        }
    }

    updateUserInfo() {
        const userNameElement = document.getElementById('userName');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
            console.log('Updated user info in navbar:', this.currentUser.name);
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const menuItem = e.currentTarget;
        const targetPage = menuItem.dataset.page;

        console.log('Navigating to:', targetPage);

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        menuItem.classList.add('active');

        // Show target section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(targetPage);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Load section-specific data
        this.loadSectionData(targetPage);
    }

    handleFileUpload(files) {
        if (!files || files.length === 0) return;

        const allowedTypes = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'];
        
        Array.from(files).forEach(file => {
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!allowedTypes.includes(fileExtension)) {
                this.showNotification(`File type not allowed: ${file.name}`, 'error');
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                this.showNotification(`File too large: ${file.name}`, 'error');
                return;
            }

            // Simulate file upload
            this.uploadFile(file);
        });
    }

    uploadFile(file) {
        console.log('Uploading file:', file.name);
        this.showNotification(`Uploading ${file.name}...`, 'info');
        
        // Simulate upload progress
        setTimeout(() => {
            this.addFileToList(file);
            this.showNotification(`${file.name} uploaded successfully!`, 'success');
        }, 2000);
    }

    addFileToList(file) {
        const fileList = document.querySelector('.file-list');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileIcon = this.getFileIcon(file.name);
        const fileSize = this.formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="${fileIcon}"></i>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${fileSize} • Uploaded just now</p>
                </div>
            </div>
            <div class="file-actions">
                <button class="btn-icon" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon btn-danger" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add to top of file list
        const firstFile = fileList.querySelector('.file-item');
        if (firstFile) {
            fileList.insertBefore(fileItem, firstFile);
        } else {
            fileList.appendChild(fileItem);
        }
    }

    getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fas fa-file-pdf',
            'ppt': 'fas fa-file-powerpoint',
            'pptx': 'fas fa-file-powerpoint',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word'
        };
        return iconMap[extension] || 'fas fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleFileDownload(button) {
        const fileItem = button.closest('.file-item');
        const fileName = fileItem.querySelector('h4').textContent;
        
        console.log('Downloading file:', fileName);
        this.showNotification(`Downloading ${fileName}...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            this.showNotification(`${fileName} downloaded successfully!`, 'success');
        }, 1000);
    }

    handleFileDelete(button) {
        const fileItem = button.closest('.file-item');
        const fileName = fileItem.querySelector('h4').textContent;
        
        if (confirm(`Are you sure you want to delete ${fileName}?`)) {
            console.log('Deleting file:', fileName);
            fileItem.remove();
            this.showNotification(`${fileName} deleted successfully!`, 'success');
        }
    }

    handlePaperSubmission(e) {
        e.preventDefault();
        
        const paperData = {
            title: document.getElementById('paperTitle').value.trim(),
            abstract: document.getElementById('paperAbstract').value.trim(),
            category: document.getElementById('paperCategory').value,
            file: document.getElementById('paperFile').files[0]
        };

        // Validation
        if (!paperData.title || !paperData.abstract || !paperData.category || !paperData.file) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        console.log('Submitting paper:', paperData.title);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        this.showNotification('Submitting paper...', 'info');
        
        // Simulate paper submission
        setTimeout(() => {
            this.addPaperToList(paperData);
            this.showNotification('Paper submitted successfully!', 'success');
            
            // Reset form
            e.target.reset();
            submitBtn.textContent = 'Submit Paper';
            submitBtn.disabled = false;
        }, 2000);
    }

    addPaperToList(paperData) {
        const paperList = document.querySelector('.paper-list');
        const paperItem = document.createElement('div');
        paperItem.className = 'paper-item';
        
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        paperItem.innerHTML = `
            <div class="paper-info">
                <h4>${paperData.title}</h4>
                <p>Submitted: ${currentDate}</p>
                <span class="status status-review">Under Review</span>
            </div>
        `;
        
        // Add to top of paper list
        paperList.insertBefore(paperItem, paperList.firstChild);
        console.log('Added paper to list:', paperData.title);
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Updating...';
        submitBtn.disabled = true;

        this.showNotification('Updating profile...', 'info');
        
        // Simulate profile update
        setTimeout(() => {
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const fullName = `${firstName} ${lastName}`;
            
            // Update user info
            if (this.currentUser) {
                this.currentUser.name = fullName;
                localStorage.setItem('eventPulseUser', JSON.stringify(this.currentUser));
                this.updateUserInfo();
                console.log('Profile updated:', fullName);
            }
            
            this.showNotification('Profile updated successfully!', 'success');
            
            // Reset button
            submitBtn.textContent = 'Update Profile';
            submitBtn.disabled = false;
        }, 1000);
    }

    loadDashboardData() {
        console.log('Loading dashboard data...');
        // Simulate loading dashboard statistics
        this.animateCounters();
    }

    loadSectionData(section) {
        console.log('Loading section data for:', section);
        // Load section-specific data
        switch (section) {
            case 'materials':
                this.loadMaterials();
                break;
            case 'papers':
                this.loadPapers();
                break;
            case 'events':
                this.loadEvents();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    loadMaterials() {
        console.log('Loading materials...');
    }

    loadPapers() {
        console.log('Loading papers...');
    }

    loadEvents() {
        console.log('Loading events...');
    }

    loadProfile() {
        console.log('Loading profile...');
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-info h3');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            let current = 0;
            const increment = target / 30;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 50);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    getNotificationIcon(type) {
        const iconMap = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle'
        };
        return iconMap[type] || 'fa-info-circle';
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing EventPulse Dashboard...');
    const dashboard = new SpeakerDashboard();
    
    // Make dashboard globally available for debugging
    window.eventPulseDashboard = dashboard;
});

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
