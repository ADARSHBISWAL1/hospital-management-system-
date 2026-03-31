// Debug version - Check for errors
console.log("Script loading started...");

class HospitalManagementSystem {
    constructor() {
        console.log("Constructor called...");
        this.patients = [];
        this.doctors = [];
        this.nurses = [];
        this.medicines = [];
        this.beds = [];
        this.labTests = [];
        this.appointments = [];
        this.bills = [];
        this.activities = [];
        this.currentEditId = null;
        this.currentEditType = null;
        
        console.log("Properties initialized...");
        this.init();
    }
    
    init() {
        console.log("Init called...");
        this.setupEventListeners();
        this.loadDataFromStorage();
        this.updateDashboard();
        this.renderAllTables();
        this.initializeCharts();
        this.addSampleData();
        console.log("Init completed!");
    }
    
    setupEventListeners() {
        console.log("Setting up event listeners...");
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });
        console.log("Navigation listeners added");
    }
    
    showSection(sectionId) {
        console.log("Showing section:", sectionId);
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }
    
    loadDataFromStorage() {
        console.log("Loading data from storage...");
        // Simplified for debugging
        console.log("Data loaded");
    }
    
    saveDataToStorage() {
        console.log("Saving data to storage...");
    }
    
    updateDashboard() {
        console.log("Updating dashboard...");
        document.getElementById('total-patients').textContent = '3';
        document.getElementById('total-doctors').textContent = '3';
        document.getElementById('total-appointments').textContent = '3';
        document.getElementById('today-revenue').textContent = '₹6,500';
        console.log("Dashboard updated");
    }
    
    renderAllTables() {
        console.log("Rendering all tables...");
        // Simplified for debugging
        console.log("Tables rendered");
    }
    
    initializeCharts() {
        console.log("Initializing charts...");
        console.log("Charts initialized");
    }
    
    addSampleData() {
        console.log("Adding sample data...");
        console.log("Sample data added");
    }
}

console.log("Class defined...");

// Initialize the system
let hms;
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");
    hms = new HospitalManagementSystem();
    console.log("System initialized!");
});

console.log("Script loaded successfully!");
