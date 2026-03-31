// Hospital Management System - Adimed
class HospitalManagementSystem {
    constructor() {
        this.patients = [];
        this.doctors = [];
        this.nurses = [];
        this.medicines = [];
        this.beds = [];
        this.labTests = [];
        this.appointments = [];
        this.bills = [];
        this.feedback = [];
        this.activities = [];
        this.currentEditId = null;
        this.currentEditType = null;
        this.patientChartInstance = null;
        this.revenueChartInstance = null;
        this.departmentChartInstance = null;
        
        this.init();
    }

    init() {
        this.loadDataFromStorage();
        this.setupEventListeners();
        this.updateDashboard();
        this.renderAllTables();
        this.initializeCharts();
        this.addSampleData();
    }

    // Data Persistence
    loadDataFromStorage() {
        const patients = localStorage.getItem('adimed_patients');
        const doctors = localStorage.getItem('adimed_doctors');
        const nurses = localStorage.getItem('adimed_nurses');
        const medicines = localStorage.getItem('adimed_medicines');
        const beds = localStorage.getItem('adimed_beds');
        const labTests = localStorage.getItem('adimed_labTests');
        const appointments = localStorage.getItem('adimed_appointments');
        const bills = localStorage.getItem('adimed_bills');
        const feedback = localStorage.getItem('adimed_feedback');
        const activities = localStorage.getItem('adimed_activities');

        if (patients) this.patients = JSON.parse(patients);
        if (doctors) this.doctors = JSON.parse(doctors);
        if (nurses) this.nurses = JSON.parse(nurses);
        if (medicines) this.medicines = JSON.parse(medicines);
        if (beds) this.beds = JSON.parse(beds);
        if (labTests) this.labTests = JSON.parse(labTests);
        if (appointments) this.appointments = JSON.parse(appointments);
        if (bills) this.bills = JSON.parse(bills);
        if (feedback) this.feedback = JSON.parse(feedback);
        if (activities) this.activities = JSON.parse(activities);
    }

    saveDataToStorage() {
        localStorage.setItem('adimed_patients', JSON.stringify(this.patients));
        localStorage.setItem('adimed_doctors', JSON.stringify(this.doctors));
        localStorage.setItem('adimed_nurses', JSON.stringify(this.nurses));
        localStorage.setItem('adimed_medicines', JSON.stringify(this.medicines));
        localStorage.setItem('adimed_beds', JSON.stringify(this.beds));
        localStorage.setItem('adimed_labTests', JSON.stringify(this.labTests));
        localStorage.setItem('adimed_appointments', JSON.stringify(this.appointments));
        localStorage.setItem('adimed_bills', JSON.stringify(this.bills));
        localStorage.setItem('adimed_feedback', JSON.stringify(this.feedback));
        localStorage.setItem('adimed_activities', JSON.stringify(this.activities));
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Form submissions
        document.getElementById('patient-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePatientSubmit();
        });

        document.getElementById('doctor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDoctorSubmit();
        });

        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAppointmentSubmit();
        });

        document.getElementById('billing-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBillingSubmit();
        });

        // Nurse form
        document.getElementById('nurse-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNurseSubmit();
        });

        // Bed form
        document.getElementById('bed-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBedSubmit();
        });

        // Lab test form
        document.getElementById('lab-test-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLabTestSubmit();
        });

        // Medicine form
        document.getElementById('medicine-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMedicineSubmit();
        });

        // Feedback form
        document.getElementById('feedback-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFeedbackSubmit();
        });

        // Search and filter
        document.getElementById('patient-search').addEventListener('input', (e) => {
            this.filterPatients();
        });

        document.getElementById('patient-filter').addEventListener('change', (e) => {
            this.filterPatients();
        });

        document.getElementById('doctor-search').addEventListener('input', (e) => {
            this.filterDoctors();
        });

        document.getElementById('doctor-filter').addEventListener('change', (e) => {
            this.filterDoctors();
        });

        document.getElementById('appointment-date-filter').addEventListener('change', (e) => {
            this.filterAppointments();
        });

        document.getElementById('appointment-status-filter').addEventListener('change', (e) => {
            this.filterAppointments();
        });

        document.getElementById('billing-search').addEventListener('input', (e) => {
            this.filterBills();
        });

        document.getElementById('billing-status-filter').addEventListener('change', (e) => {
            this.filterBills();
        });

        // Service item calculation
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('service-amount')) {
                this.calculateBillTotal();
            }
        });
    }

    // Navigation
    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    }

    // Patient Management
    handlePatientSubmit() {
        const formData = {
            id: this.currentEditId || 'P' + Date.now(),
            name: document.getElementById('patient-name').value,
            age: parseInt(document.getElementById('patient-age').value),
            gender: document.getElementById('patient-gender').value,
            phone: document.getElementById('patient-phone').value,
            email: document.getElementById('patient-email').value,
            address: document.getElementById('patient-address').value,
            bloodGroup: document.getElementById('patient-blood-group').value,
            emergencyContact: document.getElementById('patient-emergency-contact').value,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.patients.findIndex(p => p.id === this.currentEditId);
            this.patients[index] = { ...this.patients[index], ...formData };
            this.addActivity('patient', `Updated patient: ${formData.name}`);
        } else {
            this.patients.push(formData);
            this.addActivity('patient', `Added new patient: ${formData.name}`);
        }

        this.saveDataToStorage();
        this.renderPatientsTable();
        this.updateDashboard();
        this.closeModal('patient-modal');
        this.showToast('Patient saved successfully!', 'success');
        this.resetForm('patient-form');
        this.currentEditId = null;
    }

    renderPatientsTable() {
        console.log("Rendering patients table, total patients:", this.patients.length);
        const tbody = document.getElementById('patients-table-body');
        const searchTerm = document.getElementById('patient-search').value.toLowerCase();
        const statusFilter = document.getElementById('patient-filter').value;

        let filteredPatients = this.patients.filter(patient => {
            const matchesSearch = patient.name.toLowerCase().includes(searchTerm) ||
                                patient.phone.includes(searchTerm) ||
                                patient.email.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || patient.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        tbody.innerHTML = '';
        
        if (filteredPatients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No patients found</td></tr>';
            console.log("No patients to display");
            return;
        }

        filteredPatients.forEach(patient => {
            console.log("Rendering patient:", patient.name, patient.id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>${patient.email}</td>
                <td>${patient.bloodGroup || '-'}</td>
                <td><span class="status ${patient.status}">${patient.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="hms.editPatient('${patient.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deletePatient('${patient.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editPatient(id) {
        const patient = this.patients.find(p => p.id === id);
        if (patient) {
            this.currentEditId = id;
            document.getElementById('patient-name').value = patient.name;
            document.getElementById('patient-age').value = patient.age;
            document.getElementById('patient-gender').value = patient.gender;
            document.getElementById('patient-phone').value = patient.phone;
            document.getElementById('patient-email').value = patient.email;
            document.getElementById('patient-address').value = patient.address;
            document.getElementById('patient-blood-group').value = patient.bloodGroup;
            document.getElementById('patient-emergency-contact').value = patient.emergencyContact;
            this.openModal('patient-modal');
        }
    }

    deletePatient(id) {
        if (confirm('Are you sure you want to delete this patient?')) {
            const patient = this.patients.find(p => p.id === id);
            this.patients = this.patients.filter(p => p.id !== id);
            this.saveDataToStorage();
            this.renderPatientsTable();
            this.updateDashboard();
            this.showToast('Patient deleted successfully!', 'success');
            this.addActivity('patient', `Deleted patient: ${patient.name}`);
        }
    }

    // Doctor Management
    handleDoctorSubmit() {
        const formData = {
            id: this.currentEditId || 'D' + Date.now(),
            name: document.getElementById('doctor-name').value,
            department: document.getElementById('doctor-department').value,
            specialization: document.getElementById('doctor-specialization').value,
            phone: document.getElementById('doctor-phone').value,
            email: document.getElementById('doctor-email').value,
            experience: parseInt(document.getElementById('doctor-experience').value),
            qualification: document.getElementById('doctor-qualification').value,
            schedule: document.getElementById('doctor-schedule').value,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.doctors.findIndex(d => d.id === this.currentEditId);
            this.doctors[index] = { ...this.doctors[index], ...formData };
            this.addActivity('doctor', `Updated doctor: ${formData.name}`);
        } else {
            this.doctors.push(formData);
            this.addActivity('doctor', `Added new doctor: ${formData.name}`);
        }

        this.saveDataToStorage();
        this.renderDoctorsTable();
        this.updateDashboard();
        this.closeModal('doctor-modal');
        this.showToast('Doctor saved successfully!', 'success');
        this.resetForm('doctor-form');
        this.currentEditId = null;
    }

    renderDoctorsTable() {
        const tbody = document.getElementById('doctors-table-body');
        const searchTerm = document.getElementById('doctor-search').value.toLowerCase();
        const departmentFilter = document.getElementById('doctor-filter').value;

        let filteredDoctors = this.doctors.filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm) ||
                                doctor.specialization.toLowerCase().includes(searchTerm) ||
                                doctor.email.toLowerCase().includes(searchTerm);
            const matchesDepartment = !departmentFilter || doctor.department === departmentFilter;
            return matchesSearch && matchesDepartment;
        });

        tbody.innerHTML = '';
        
        if (filteredDoctors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No doctors found</td></tr>';
            return;
        }

        filteredDoctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.name}</td>
                <td>${doctor.department}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.phone}</td>
                <td>${doctor.email}</td>
                <td>${doctor.experience} years</td>
                <td><span class="status ${doctor.status}">${doctor.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="hms.editDoctor('${doctor.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteDoctor('${doctor.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editDoctor(id) {
        const doctor = this.doctors.find(d => d.id === id);
        if (doctor) {
            this.currentEditId = id;
            document.getElementById('doctor-name').value = doctor.name;
            document.getElementById('doctor-department').value = doctor.department;
            document.getElementById('doctor-specialization').value = doctor.specialization;
            document.getElementById('doctor-phone').value = doctor.phone;
            document.getElementById('doctor-email').value = doctor.email;
            document.getElementById('doctor-experience').value = doctor.experience;
            document.getElementById('doctor-qualification').value = doctor.qualification;
            document.getElementById('doctor-schedule').value = doctor.schedule;
            this.openModal('doctor-modal');
        }
    }

    deleteDoctor(id) {
        if (confirm('Are you sure you want to delete this doctor?')) {
            const doctor = this.doctors.find(d => d.id === id);
            this.doctors = this.doctors.filter(d => d.id !== id);
            this.saveDataToStorage();
            this.renderDoctorsTable();
            this.updateDashboard();
            this.showToast('Doctor deleted successfully!', 'success');
            this.addActivity('doctor', `Deleted doctor: ${doctor.name}`);
        }
    }

    // Appointment Management
    handleAppointmentSubmit() {
        const patientId = document.getElementById('appointment-patient').value;
        const doctorId = document.getElementById('appointment-doctor').value;
        const patient = this.patients.find(p => p.id === patientId);
        const doctor = this.doctors.find(d => d.id === doctorId);

        const formData = {
            id: this.currentEditId || 'A' + Date.now(),
            patientId: patientId,
            patientName: patient.name,
            doctorId: doctorId,
            doctorName: doctor.name,
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            reason: document.getElementById('appointment-reason').value,
            type: document.getElementById('appointment-type').value,
            department: doctor.department,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.appointments.findIndex(a => a.id === this.currentEditId);
            this.appointments[index] = { ...this.appointments[index], ...formData };
            this.addActivity('appointment', `Updated appointment for ${patient.name}`);
        } else {
            this.appointments.push(formData);
            this.addActivity('appointment', `Scheduled appointment for ${patient.name} with ${doctor.name}`);
        }

        this.saveDataToStorage();
        this.renderAppointmentsTable();
        this.updateDashboard();
        this.closeModal('appointment-modal');
        this.showToast('Appointment scheduled successfully!', 'success');
        this.resetForm('appointment-form');
        this.currentEditId = null;
    }

    renderAppointmentsTable() {
        const tbody = document.getElementById('appointments-table-body');
        const dateFilter = document.getElementById('appointment-date-filter').value;
        const statusFilter = document.getElementById('appointment-status-filter').value;

        let filteredAppointments = this.appointments.filter(appointment => {
            const matchesDate = !dateFilter || appointment.date === dateFilter;
            const matchesStatus = !statusFilter || appointment.status === statusFilter;
            return matchesDate && matchesStatus;
        });

        // Sort by date and time
        filteredAppointments.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB - dateA;
        });

        tbody.innerHTML = '';
        
        if (filteredAppointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No appointments found</td></tr>';
            return;
        }

        filteredAppointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.doctorName}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.department}</td>
                <td><span class="status ${appointment.status}">${appointment.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="hms.editAppointment('${appointment.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${appointment.status === 'scheduled' ? 
                            `<button class="btn btn-sm btn-success" onclick="hms.completeAppointment('${appointment.id}')">
                                <i class="fas fa-check"></i>
                            </button>` : ''
                        }
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteAppointment('${appointment.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editAppointment(id) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            this.currentEditId = id;
            document.getElementById('appointment-patient').value = appointment.patientId;
            document.getElementById('appointment-doctor').value = appointment.doctorId;
            document.getElementById('appointment-date').value = appointment.date;
            document.getElementById('appointment-time').value = appointment.time;
            document.getElementById('appointment-reason').value = appointment.reason;
            document.getElementById('appointment-type').value = appointment.type;
            this.openModal('appointment-modal');
        }
    }

    completeAppointment(id) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            appointment.status = 'completed';
            this.saveDataToStorage();
            this.renderAppointmentsTable();
            this.updateDashboard();
            this.showToast('Appointment marked as completed!', 'success');
            this.addActivity('appointment', `Completed appointment for ${appointment.patientName}`);
        }
    }

    deleteAppointment(id) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            const appointment = this.appointments.find(a => a.id === id);
            this.appointments = this.appointments.filter(a => a.id !== id);
            this.saveDataToStorage();
            this.renderAppointmentsTable();
            this.updateDashboard();
            this.showToast('Appointment deleted successfully!', 'success');
            this.addActivity('appointment', `Deleted appointment for ${appointment.patientName}`);
        }
    }

    // Billing Management
    handleBillingSubmit() {
        const patientId = document.getElementById('billing-patient').value;
        const patient = this.patients.find(p => p.id === patientId);
        
        // Get service items
        const serviceItems = document.querySelectorAll('.service-item');
        const services = [];
        let total = 0;

        serviceItems.forEach(item => {
            const desc = item.querySelector('.service-desc').value;
            const amount = parseFloat(item.querySelector('.service-amount').value) || 0;
            if (desc && amount > 0) {
                services.push({ description: desc, amount: amount });
                total += amount;
            }
        });

        const formData = {
            id: this.currentEditId || 'B' + Date.now(),
            patientId: patientId,
            patientName: patient.name,
            date: document.getElementById('billing-date').value,
            services: services,
            amount: total,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.bills.findIndex(b => b.id === this.currentEditId);
            this.bills[index] = { ...this.bills[index], ...formData };
            this.addActivity('billing', `Updated bill for ${patient.name}`);
        } else {
            this.bills.push(formData);
            this.addActivity('billing', `Generated bill for ${patient.name} - ${this.formatIndianCurrency(total)}`);
        }

        this.saveDataToStorage();
        this.renderBillingTable();
        this.updateDashboard();
        this.closeModal('billing-modal');
        this.showToast('Bill generated successfully!', 'success');
        this.resetForm('billing-form');
        this.currentEditId = null;
    }

    renderBillingTable() {
        const tbody = document.getElementById('billing-table-body');
        const searchTerm = document.getElementById('billing-search').value.toLowerCase();
        const statusFilter = document.getElementById('billing-status-filter').value;

        let filteredBills = this.bills.filter(bill => {
            const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm) ||
                                bill.id.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || bill.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        // Sort by date
        filteredBills.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = '';
        
        if (filteredBills.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No bills found</td></tr>';
            return;
        }

        filteredBills.forEach(bill => {
            const servicesText = bill.services.map(s => s.description).join(', ');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.id}</td>
                <td>${bill.patientName}</td>
                <td>${bill.date}</td>
                <td>${servicesText.substring(0, 50)}${servicesText.length > 50 ? '...' : ''}</td>
                <td>${this.formatIndianCurrency(bill.amount)}</td>
                <td><span class="status ${bill.status}">${bill.status}</span></td>
                <td>
                    <div class="btn-group">
                        ${bill.status === 'pending' ? 
                            `<button class="btn btn-sm btn-success" onclick="hms.markBillPaid('${bill.id}')">
                                <i class="fas fa-rupee-sign"></i>
                            </button>` : ''
                        }
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteBill('${bill.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    markBillPaid(id) {
        const bill = this.bills.find(b => b.id === id);
        if (bill) {
            bill.status = 'paid';
            this.saveDataToStorage();
            this.renderBillingTable();
            this.updateDashboard();
            this.showToast('Bill marked as paid!', 'success');
            this.addActivity('billing', `Payment received for ${bill.patientName} - ${this.formatIndianCurrency(bill.amount)}`);
        }
    }

    deleteBill(id) {
        if (confirm('Are you sure you want to delete this bill?')) {
            const bill = this.bills.find(b => b.id === id);
            this.bills = this.bills.filter(b => b.id !== id);
            this.saveDataToStorage();
            this.renderBillingTable();
            this.updateDashboard();
            this.showToast('Bill deleted successfully!', 'success');
            this.addActivity('billing', `Deleted bill for ${bill.patientName}`);
        }
    }

    // Dashboard
    updateDashboard() {
        // Update statistics
        document.getElementById('total-patients').textContent = this.patients.length;
        document.getElementById('total-doctors').textContent = this.doctors.length;
        
        // Today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.appointments.filter(a => a.date === today);
        document.getElementById('today-appointments').textContent = todayAppointments.length;
        
        // Today's revenue
        const todayRevenue = this.bills
            .filter(b => b.date === today && b.status === 'paid')
            .reduce((sum, b) => sum + b.amount, 0);
        document.getElementById('today-revenue').textContent = `₹${todayRevenue.toLocaleString('en-IN')}`;
        
        // Update recent activities
        this.renderRecentActivities();
    }

    renderRecentActivities() {
        const container = document.getElementById('recent-activities-list');
        const recentActivities = this.activities.slice(-5).reverse();
        
        container.innerHTML = '';
        
        if (recentActivities.length === 0) {
            container.innerHTML = '<p class="empty-state">No recent activities</p>';
            return;
        }
        
        recentActivities.forEach(activity => {
            const activityDiv = document.createElement('div');
            activityDiv.className = 'activity-item';
            
            const iconClass = activity.type;
            const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
            
            activityDiv.innerHTML = `
                <div class="activity-icon ${iconClass}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <small>${timeAgo}</small>
                </div>
            `;
            
            container.appendChild(activityDiv);
        });
    }

    getActivityIcon(type) {
        const icons = {
            'patient': 'user',
            'doctor': 'user-md',
            'appointment': 'calendar-check',
            'billing': 'file-invoice-dollar'
        };
        return icons[type] || 'circle';
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    addActivity(type, description) {
        this.activities.push({
            type: type,
            description: description,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 activities
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(-50);
        }
        
        this.saveDataToStorage();
    }

    // Format Indian currency
    formatIndianCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Charts
    initializeCharts() {
        this.renderPatientChart();
        this.renderRevenueChart();
        this.renderDepartmentChart();
    }

    renderPatientChart() {
        const ctx = document.getElementById('patient-chart');
        if (!ctx) return;
        
        // Destroy existing chart instance if it exists
        if (this.patientChartInstance) {
            this.patientChartInstance.destroy();
        }
        
        // Reset canvas dimensions
        ctx.style.height = '250px';
        ctx.style.width = '100%';
        
        const activePatients = this.patients.filter(p => p.status === 'active').length;
        const inactivePatients = this.patients.filter(p => p.status === 'inactive').length;
        
        this.patientChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive'],
                datasets: [{
                    data: [activePatients, inactivePatients],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + ' patients';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
    }

    renderRevenueChart() {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;
        
        // Destroy existing chart instance if it exists
        if (this.revenueChartInstance) {
            this.revenueChartInstance.destroy();
        }
        
        // Reset canvas dimensions
        ctx.style.height = '250px';
        ctx.style.width = '100%';
        
        // Get last 7 days revenue
        const last7Days = [];
        const revenue = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayRevenue = this.bills
                .filter(b => b.date === dateStr && b.status === 'paid')
                .reduce((sum, b) => sum + b.amount, 0);
            
            last7Days.push(date.toLocaleDateString('en', { weekday: 'short' }));
            revenue.push(dayRevenue);
        }
        
        this.revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Revenue',
                    data: revenue,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Revenue: ' + hms.formatIndianCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
    }

    renderDepartmentChart() {
        const ctx = document.getElementById('department-chart');
        if (!ctx) return;
        
        // Destroy existing chart instance if it exists
        if (this.departmentChartInstance) {
            this.departmentChartInstance.destroy();
        }
        
        // Reset canvas dimensions
        ctx.style.height = '250px';
        ctx.style.width = '100%';
        
        const departmentCounts = {};
        this.doctors.forEach(doctor => {
            departmentCounts[doctor.department] = (departmentCounts[doctor.department] || 0) + 1;
        });
        
        this.departmentChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(departmentCounts),
                datasets: [{
                    label: 'Doctors',
                    data: Object.values(departmentCounts),
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' doctors';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
    }

    // Utility Functions
    renderAllTables() {
        this.renderPatientsTable();
        this.renderDoctorsTable();
        this.renderNursesTable();
        this.renderMedicinesTable();
        this.renderBedsGrid();
        this.renderLabTestsTable();
        this.renderAppointmentsTable();
        this.renderBillingTable();
        this.renderFeedbackTable();
        this.updateSelectOptions();
    }

    // Nurse Management
    handleNurseSubmit() {
        const formData = {
            id: this.currentEditId || 'N' + Date.now(),
            name: document.getElementById('nurse-name').value,
            department: document.getElementById('nurse-department').value,
            phone: document.getElementById('nurse-phone').value,
            email: document.getElementById('nurse-email').value,
            experience: parseInt(document.getElementById('nurse-experience').value),
            shift: document.getElementById('nurse-shift').value,
            qualification: document.getElementById('nurse-qualification').value,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.nurses.findIndex(n => n.id === this.currentEditId);
            this.nurses[index] = { ...this.nurses[index], ...formData };
            this.addActivity('nurse', `Updated nurse: ${formData.name}`);
        } else {
            this.nurses.push(formData);
            this.addActivity('nurse', `Added new nurse: ${formData.name}`);
        }

        this.saveDataToStorage();
        this.renderNursesTable();
        this.closeModal('nurse-modal');
        this.showToast('Nurse saved successfully!', 'success');
        this.resetForm('nurse-form');
        this.currentEditId = null;
    }

    renderNursesTable() {
        const tbody = document.getElementById('nurses-table-body');
        const searchTerm = document.getElementById('nurse-search').value.toLowerCase();
        const departmentFilter = document.getElementById('nurse-department-filter').value;

        let filteredNurses = this.nurses.filter(nurse => {
            const matchesSearch = nurse.name.toLowerCase().includes(searchTerm) ||
                                nurse.phone.includes(searchTerm) ||
                                nurse.email.toLowerCase().includes(searchTerm);
            const matchesDepartment = !departmentFilter || nurse.department === departmentFilter;
            return matchesSearch && matchesDepartment;
        });

        tbody.innerHTML = '';
        
        if (filteredNurses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No nurses found</td></tr>';
            return;
        }

        filteredNurses.forEach(nurse => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nurse.id}</td>
                <td>${nurse.name}</td>
                <td>${nurse.department}</td>
                <td>${nurse.shift}</td>
                <td>${nurse.phone}</td>
                <td>${nurse.email}</td>
                <td>${nurse.experience} years</td>
                <td><span class="status ${nurse.status}">${nurse.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="hms.editNurse('${nurse.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteNurse('${nurse.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editNurse(id) {
        const nurse = this.nurses.find(n => n.id === id);
        if (nurse) {
            this.currentEditId = id;
            document.getElementById('nurse-name').value = nurse.name;
            document.getElementById('nurse-department').value = nurse.department;
            document.getElementById('nurse-phone').value = nurse.phone;
            document.getElementById('nurse-email').value = nurse.email;
            document.getElementById('nurse-experience').value = nurse.experience;
            document.getElementById('nurse-shift').value = nurse.shift;
            document.getElementById('nurse-qualification').value = nurse.qualification;
            this.openModal('nurse-modal');
        }
    }

    deleteNurse(id) {
        if (confirm('Are you sure you want to delete this nurse?')) {
            const nurse = this.nurses.find(n => n.id === id);
            this.nurses = this.nurses.filter(n => n.id !== id);
            this.saveDataToStorage();
            this.renderNursesTable();
            this.showToast('Nurse deleted successfully!', 'success');
            this.addActivity('nurse', `Deleted nurse: ${nurse.name}`);
        }
    }

    filterNurses() {
        this.renderNursesTable();
    }

    // Pharmacy Management
    handleMedicineSubmit() {
        const formData = {
            id: this.currentEditId || 'M' + Date.now(),
            name: document.getElementById('medicine-name').value,
            category: document.getElementById('medicine-category').value,
            manufacturer: document.getElementById('medicine-manufacturer').value,
            composition: document.getElementById('medicine-composition').value,
            stock: parseInt(document.getElementById('medicine-stock').value),
            unit: document.getElementById('medicine-unit').value,
            price: parseFloat(document.getElementById('medicine-price').value),
            expiryDate: document.getElementById('medicine-expiry').value,
            dosage: document.getElementById('medicine-dosage').value,
            sideEffects: document.getElementById('medicine-sideeffects').value,
            description: document.getElementById('medicine-description').value,
            createdAt: new Date().toISOString()
        };

        // Determine stock status
        if (formData.stock === 0) {
            formData.status = 'out-of-stock';
        } else if (formData.stock <= 10) {
            formData.status = 'low-stock';
        } else {
            formData.status = 'in-stock';
        }

        // Check expiry status
        const today = new Date();
        const expiryDate = new Date(formData.expiryDate);
        if (expiryDate < today) {
            formData.status = 'expired';
        }

        if (this.currentEditId) {
            const index = this.medicines.findIndex(m => m.id === this.currentEditId);
            this.medicines[index] = { ...this.medicines[index], ...formData };
            this.addActivity('pharmacy', `Updated medicine: ${formData.name}`);
        } else {
            this.medicines.push(formData);
            this.addActivity('pharmacy', `Added new medicine: ${formData.name}`);
        }

        this.saveDataToStorage();
        this.renderMedicinesTable();
        this.closeModal('medicine-modal');
        this.showToast('Medicine saved successfully!', 'success');
        this.resetForm('medicine-form');
        this.currentEditId = null;
    }

    renderMedicinesTable() {
        const tbody = document.getElementById('medicines-table-body');
        const searchTerm = document.getElementById('medicine-search').value.toLowerCase();
        const categoryFilter = document.getElementById('medicine-category-filter').value;
        const stockFilter = document.getElementById('medicine-stock-filter').value;

        let filteredMedicines = this.medicines.filter(medicine => {
            const matchesSearch = medicine.name.toLowerCase().includes(searchTerm) ||
                                medicine.manufacturer.toLowerCase().includes(searchTerm) ||
                                medicine.composition.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || medicine.category === categoryFilter;
            const matchesStock = !stockFilter || medicine.status === stockFilter;
            return matchesSearch && matchesCategory && matchesStock;
        });

        tbody.innerHTML = '';
        
        if (filteredMedicines.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No medicines found</td></tr>';
            return;
        }

        filteredMedicines.forEach(medicine => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medicine.id}</td>
                <td>${medicine.name}</td>
                <td>${medicine.category}</td>
                <td>${medicine.manufacturer}</td>
                <td>${medicine.stock}</td>
                <td>${medicine.unit}</td>
                <td>${this.formatIndianCurrency(medicine.price)}</td>
                <td>${medicine.expiryDate}</td>
                <td><span class="status ${medicine.status}">${medicine.status.replace('-', ' ')}</span></td>
                <td>
                    <div class="btn-group">
                        ${medicine.status === 'low-stock' ? 
                            `<button class="btn btn-sm btn-warning" onclick="hms.restockMedicine('${medicine.id}')">
                                <i class="fas fa-box"></i>
                            </button>` : ''
                        }
                        <button class="btn btn-sm btn-primary" onclick="hms.editMedicine('${medicine.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteMedicine('${medicine.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editMedicine(id) {
        const medicine = this.medicines.find(m => m.id === id);
        if (medicine) {
            this.currentEditId = id;
            document.getElementById('medicine-name').value = medicine.name;
            document.getElementById('medicine-category').value = medicine.category;
            document.getElementById('medicine-manufacturer').value = medicine.manufacturer;
            document.getElementById('medicine-composition').value = medicine.composition;
            document.getElementById('medicine-stock').value = medicine.stock;
            document.getElementById('medicine-unit').value = medicine.unit;
            document.getElementById('medicine-price').value = medicine.price;
            document.getElementById('medicine-expiry').value = medicine.expiryDate;
            document.getElementById('medicine-dosage').value = medicine.dosage || '';
            document.getElementById('medicine-sideeffects').value = medicine.sideEffects || '';
            document.getElementById('medicine-description').value = medicine.description || '';
            this.openModal('medicine-modal');
        }
    }

    deleteMedicine(id) {
        if (confirm('Are you sure you want to delete this medicine?')) {
            const medicine = this.medicines.find(m => m.id === id);
            this.medicines = this.medicines.filter(m => m.id !== id);
            this.saveDataToStorage();
            this.renderMedicinesTable();
            this.showToast('Medicine deleted successfully!', 'success');
            this.addActivity('pharmacy', `Deleted medicine: ${medicine.name}`);
        }
    }

    restockMedicine(id) {
        const medicine = this.medicines.find(m => m.id === id);
        if (medicine) {
            const quantity = prompt('Enter restock quantity:');
            if (quantity && !isNaN(quantity)) {
                medicine.stock += parseInt(quantity);
                
                // Update status based on new stock
                if (medicine.stock === 0) {
                    medicine.status = 'out-of-stock';
                } else if (medicine.stock <= 10) {
                    medicine.status = 'low-stock';
                } else {
                    medicine.status = 'in-stock';
                }
                
                this.saveDataToStorage();
                this.renderMedicinesTable();
                this.showToast('Medicine restocked successfully!', 'success');
                this.addActivity('pharmacy', `Restocked ${medicine.name} with ${quantity} units`);
            }
        }
    }

    filterMedicines() {
        this.renderMedicinesTable();
    }

    // Feedback Management
    handleFeedbackSubmit() {
        const formData = {
            id: this.currentEditId || 'F' + Date.now(),
            patientId: document.getElementById('feedback-patient').value,
            patientName: this.getPatientName(document.getElementById('feedback-patient').value),
            department: document.getElementById('feedback-department').value,
            rating: parseInt(document.getElementById('feedback-rating').value),
            comments: document.getElementById('feedback-comments').value,
            date: document.getElementById('feedback-date').value,
            status: document.getElementById('feedback-status').value,
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.feedback.findIndex(f => f.id === this.currentEditId);
            this.feedback[index] = { ...this.feedback[index], ...formData };
            this.addActivity('feedback', `Updated feedback for: ${formData.patientName}`);
        } else {
            this.feedback.push(formData);
            this.addActivity('feedback', `Added feedback for: ${formData.patientName}`);
        }

        this.saveDataToStorage();
        this.renderFeedbackTable();
        this.closeModal('feedback-modal');
        this.showToast('Feedback submitted successfully!', 'success');
        this.resetForm('feedback-form');
        this.currentEditId = null;
    }

    renderFeedbackTable() {
        const tbody = document.getElementById('feedback-table-body');
        const searchTerm = document.getElementById('feedback-search').value.toLowerCase();
        const ratingFilter = document.getElementById('feedback-rating-filter').value;
        const departmentFilter = document.getElementById('feedback-department-filter').value;

        let filteredFeedback = this.feedback.filter(feedback => {
            const matchesSearch = feedback.patientName.toLowerCase().includes(searchTerm) ||
                                feedback.comments.toLowerCase().includes(searchTerm) ||
                                feedback.department.toLowerCase().includes(searchTerm);
            const matchesRating = !ratingFilter || feedback.rating.toString() === ratingFilter;
            const matchesDepartment = !departmentFilter || feedback.department === departmentFilter;
            return matchesSearch && matchesRating && matchesDepartment;
        });

        tbody.innerHTML = '';
        
        if (filteredFeedback.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No feedback found</td></tr>';
            return;
        }

        filteredFeedback.forEach(feedback => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${feedback.id}</td>
                <td>${feedback.patientName}</td>
                <td>${feedback.department}</td>
                <td><span class="star-rating ${feedback.rating}-stars"></span></td>
                <td>${feedback.comments.substring(0, 50)}${feedback.comments.length > 50 ? '...' : ''}</td>
                <td>${feedback.date}</td>
                <td><span class="status ${feedback.status}">${feedback.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="hms.editFeedback('${feedback.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteFeedback('${feedback.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editFeedback(id) {
        const feedback = this.feedback.find(f => f.id === id);
        if (feedback) {
            this.currentEditId = id;
            document.getElementById('feedback-patient').value = feedback.patientId;
            document.getElementById('feedback-department').value = feedback.department;
            document.getElementById('feedback-rating').value = feedback.rating;
            document.getElementById('feedback-comments').value = feedback.comments;
            document.getElementById('feedback-date').value = feedback.date;
            document.getElementById('feedback-status').value = feedback.status;
            this.openModal('feedback-modal');
        }
    }

    deleteFeedback(id) {
        if (confirm('Are you sure you want to delete this feedback?')) {
            const feedback = this.feedback.find(f => f.id === id);
            this.feedback = this.feedback.filter(f => f.id !== id);
            this.saveDataToStorage();
            this.renderFeedbackTable();
            this.showToast('Feedback deleted successfully!', 'success');
            this.addActivity('feedback', `Deleted feedback for: ${feedback.patientName}`);
        }
    }

    filterFeedback() {
        this.renderFeedbackTable();
    }

    getPatientName(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        return patient ? patient.name : 'Unknown Patient';
    }

    // Bed Management
    handleBedSubmit() {
        const formData = {
            id: this.currentEditId || 'B' + Date.now(),
            bedNumber: document.getElementById('bed-number').value,
            type: document.getElementById('bed-type').value,
            department: document.getElementById('bed-department').value,
            floor: parseInt(document.getElementById('bed-floor').value),
            rate: parseInt(document.getElementById('bed-rate').value),
            status: document.getElementById('bed-status').value,
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.beds.findIndex(b => b.id === this.currentEditId);
            this.beds[index] = { ...this.beds[index], ...formData };
            this.addActivity('bed', `Updated bed: ${formData.bedNumber}`);
        } else {
            this.beds.push(formData);
            this.addActivity('bed', `Added new bed: ${formData.bedNumber}`);
        }

        this.saveDataToStorage();
        this.renderBedsGrid();
        this.closeModal('bed-modal');
        this.showToast('Bed saved successfully!', 'success');
        this.resetForm('bed-form');
        this.currentEditId = null;
    }

    renderBedsGrid() {
        console.log("Rendering beds grid, total beds:", this.beds.length);
        const container = document.getElementById('beds-grid');
        container.innerHTML = '';

        if (this.beds.length === 0) {
            container.innerHTML = '<div class="empty-state">No beds available</div>';
            console.log("No beds to display");
            return;
        }

        this.beds.forEach(bed => {
            const bedCard = document.createElement('div');
            bedCard.className = 'bed-card';
            bedCard.innerHTML = `
                <div class="bed-header">
                    <div class="bed-number">${bed.bedNumber}</div>
                    <span class="status ${bed.status}">${bed.status}</span>
                </div>
                <div class="bed-info">
                    <div class="bed-info-item">
                        <span class="bed-info-label">Type:</span>
                        <span class="bed-info-value">${bed.type}</span>
                    </div>
                    <div class="bed-info-item">
                        <span class="bed-info-label">Department:</span>
                        <span class="bed-info-value">${bed.department}</span>
                    </div>
                    <div class="bed-info-item">
                        <span class="bed-info-label">Floor:</span>
                        <span class="bed-info-value">${bed.floor}</span>
                    </div>
                    <div class="bed-info-item">
                        <span class="bed-info-label">Rate:</span>
                        <span class="bed-info-value">${this.formatIndianCurrency(bed.rate)}/day</span>
                    </div>
                </div>
                <div class="bed-actions">
                    <button class="btn btn-sm btn-primary" onclick="hms.editBed('${bed.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="hms.deleteBed('${bed.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(bedCard);
        });
    }

    editBed(id) {
        const bed = this.beds.find(b => b.id === id);
        if (bed) {
            this.currentEditId = id;
            document.getElementById('bed-number').value = bed.bedNumber;
            document.getElementById('bed-type').value = bed.type;
            document.getElementById('bed-department').value = bed.department;
            document.getElementById('bed-floor').value = bed.floor;
            document.getElementById('bed-rate').value = bed.rate;
            document.getElementById('bed-status').value = bed.status;
            this.openModal('bed-modal');
        }
    }

    deleteBed(id) {
        if (confirm('Are you sure you want to delete this bed?')) {
            const bed = this.beds.find(b => b.id === id);
            this.beds = this.beds.filter(b => b.id !== id);
            this.saveDataToStorage();
            this.renderBedsGrid();
            this.showToast('Bed deleted successfully!', 'success');
            this.addActivity('bed', `Deleted bed: ${bed.bedNumber}`);
        }
    }

    // Laboratory Management
    handleLabTestSubmit() {
        const patientId = document.getElementById('lab-patient').value;
        const doctorId = document.getElementById('lab-doctor').value;
        const patient = this.patients.find(p => p.id === patientId);
        const doctor = this.doctors.find(d => d.id === doctorId);

        const formData = {
            id: this.currentEditId || 'L' + Date.now(),
            patientId: patientId,
            patientName: patient.name,
            doctorId: doctorId,
            doctorName: doctor.name,
            testType: document.getElementById('lab-test-type').value,
            date: document.getElementById('lab-date').value,
            notes: document.getElementById('lab-notes').value,
            amount: parseInt(document.getElementById('lab-amount').value),
            status: 'pending',
            results: '',
            createdAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            const index = this.labTests.findIndex(l => l.id === this.currentEditId);
            this.labTests[index] = { ...this.labTests[index], ...formData };
            this.addActivity('lab', `Updated lab test for ${patient.name}`);
        } else {
            this.labTests.push(formData);
            this.addActivity('lab', `Created lab test for ${patient.name} - ${formData.testType}`);
        }

        this.saveDataToStorage();
        this.renderLabTestsTable();
        this.closeModal('lab-test-modal');
        this.showToast('Lab test created successfully!', 'success');
        this.resetForm('lab-test-form');
        this.currentEditId = null;
    }

    renderLabTestsTable() {
        const tbody = document.getElementById('lab-table-body');
        const searchTerm = document.getElementById('lab-search').value.toLowerCase();
        const statusFilter = document.getElementById('lab-status-filter').value;

        let filteredTests = this.labTests.filter(test => {
            const matchesSearch = test.patientName.toLowerCase().includes(searchTerm) ||
                                test.testType.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || test.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        tbody.innerHTML = '';
        
        if (filteredTests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No lab tests found</td></tr>';
            return;
        }

        filteredTests.forEach(test => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${test.id}</td>
                <td>${test.patientName}</td>
                <td>${test.testType}</td>
                <td>${test.doctorName}</td>
                <td>${test.date}</td>
                <td><span class="status ${test.status}">${test.status}</span></td>
                <td>${test.results || 'Pending'}</td>
                <td>${this.formatIndianCurrency(test.amount)}</td>
                <td>
                    <div class="btn-group">
                        ${test.status === 'pending' ? 
                            `<button class="btn btn-sm btn-success" onclick="hms.completeLabTest('${test.id}')">
                                <i class="fas fa-check"></i>
                            </button>` : ''
                        }
                        <button class="btn btn-sm btn-primary" onclick="hms.editLabTest('${test.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteLabTest('${test.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    completeLabTest(id) {
        const test = this.labTests.find(l => l.id === id);
        if (test) {
            const results = prompt('Enter test results:');
            if (results) {
                test.status = 'completed';
                test.results = results;
                this.saveDataToStorage();
                this.renderLabTestsTable();
                this.showToast('Lab test completed!', 'success');
                this.addActivity('lab', `Completed lab test for ${test.patientName}`);
            }
        }
    }

    editLabTest(id) {
        const test = this.labTests.find(l => l.id === id);
        if (test) {
            this.currentEditId = id;
            document.getElementById('lab-patient').value = test.patientId;
            document.getElementById('lab-doctor').value = test.doctorId;
            document.getElementById('lab-test-type').value = test.testType;
            document.getElementById('lab-date').value = test.date;
            document.getElementById('lab-notes').value = test.notes;
            document.getElementById('lab-amount').value = test.amount;
            this.openModal('lab-test-modal');
        }
    }

    deleteLabTest(id) {
        if (confirm('Are you sure you want to delete this lab test?')) {
            const test = this.labTests.find(l => l.id === id);
            this.labTests = this.labTests.filter(l => l.id !== id);
            this.saveDataToStorage();
            this.renderLabTestsTable();
            this.showToast('Lab test deleted successfully!', 'success');
            this.addActivity('lab', `Deleted lab test for ${test.patientName}`);
        }
    }

    filterLabTests() {
        this.renderLabTestsTable();
    }

    updateSelectOptions() {
        // Update patient select in appointment and billing forms
        const patientSelects = [
            document.getElementById('appointment-patient'),
            document.getElementById('billing-patient'),
            document.getElementById('feedback-patient')
        ];
        
        patientSelects.forEach(select => {
            if (select) {
                select.innerHTML = '<option value="">Select Patient</option>';
                this.patients.forEach(patient => {
                    const option = document.createElement('option');
                    option.value = patient.id;
                    option.textContent = `${patient.name} (${patient.id})`;
                    select.appendChild(option);
                });
            }
        });

        // Update doctor select in appointment and lab test forms
        const doctorSelects = [
            document.getElementById('appointment-doctor'),
            document.getElementById('lab-doctor')
        ];
        
        doctorSelects.forEach(select => {
            if (select) {
                select.innerHTML = '<option value="">Select Doctor</option>';
                this.doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = `${doctor.name} (${doctor.id})`;
                    select.appendChild(option);
                });
            }
        });
    }

    filterPatients() {
        this.renderPatientsTable();
    }

    filterDoctors() {
        this.renderDoctorsTable();
    }

    filterAppointments() {
        this.renderAppointmentsTable();
    }

    filterBills() {
        this.renderBillingTable();
    }

    calculateBillTotal() {
        const serviceItems = document.querySelectorAll('.service-item');
        let total = 0;
        
        serviceItems.forEach(item => {
            const amount = parseFloat(item.querySelector('.service-amount').value) || 0;
            total += amount;
        });
        
        document.getElementById('billing-total').value = total.toFixed(2);
    }

    addServiceItem() {
        const serviceList = document.getElementById('service-list');
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.innerHTML = `
            <input type="text" placeholder="Service Description" class="service-desc">
            <input type="number" placeholder="Amount" class="service-amount">
            <button type="button" onclick="this.parentElement.remove(); hms.calculateBillTotal();">-</button>
        `;
        serviceList.appendChild(serviceItem);
    }

    // Modal Functions
    openModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    'exclamation-triangle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Sample Data
    addSampleData() {
        // Add sample data if any section is empty
        const needsSampleData = this.patients.length === 0 || 
                               this.doctors.length === 0 || 
                               this.nurses.length === 0 || 
                               this.medicines.length === 0 || 
                               this.beds.length === 0 || 
                               this.labTests.length === 0 || 
                               this.appointments.length === 0 || 
                               this.bills.length === 0;
        
        if (needsSampleData) {
            // Add sample patients with Indian names
            const samplePatients = [
                {
                    id: 'P001',
                    name: 'Rajesh Kumar',
                    age: 35,
                    gender: 'Male',
                    phone: '+91-98765-0101',
                    email: 'rajesh.kumar@email.com',
                    address: '123 MG Road, Bangalore, Karnataka',
                    bloodGroup: 'B+',
                    emergencyContact: 'Sunita Kumar - +91-98765-0102',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P002',
                    name: 'Anjali Sharma',
                    age: 28,
                    gender: 'Female',
                    phone: '+91-98765-0201',
                    email: 'anjali.sharma@email.com',
                    address: '456 Park Street, Mumbai, Maharashtra',
                    bloodGroup: 'O+',
                    emergencyContact: 'Vikram Sharma - +91-98765-0202',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P003',
                    name: 'Amit Patel',
                    age: 42,
                    gender: 'Male',
                    phone: '+91-98765-0301',
                    email: 'amit.patel@email.com',
                    address: '789 Gandhi Nagar, Ahmedabad, Gujarat',
                    bloodGroup: 'A+',
                    emergencyContact: 'Rekha Patel - +91-98765-0304',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P004',
                    name: 'Priya Nair',
                    age: 31,
                    gender: 'Female',
                    phone: '+91-98765-0401',
                    email: 'priya.nair@email.com',
                    address: '321 Marine Drive, Chennai, Tamil Nadu',
                    bloodGroup: 'AB+',
                    emergencyContact: 'Ramesh Nair - +91-98765-0402',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P005',
                    name: 'Sanjay Singh',
                    age: 55,
                    gender: 'Male',
                    phone: '+91-98765-0501',
                    email: 'sanjay.singh@email.com',
                    address: '654 Nehru Place, New Delhi',
                    bloodGroup: 'O-',
                    emergencyContact: 'Meena Singh - +91-98765-0502',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P006',
                    name: 'Kavita Reddy',
                    age: 24,
                    gender: 'Female',
                    phone: '+91-98765-0601',
                    email: 'kavita.reddy@email.com',
                    address: '987 Jubilee Hills, Hyderabad, Telangana',
                    bloodGroup: 'B-',
                    emergencyContact: 'Ravi Reddy - +91-98765-0602',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P007',
                    name: 'Rahul Verma',
                    age: 38,
                    gender: 'Male',
                    phone: '+91-98765-0701',
                    email: 'rahul.verma@email.com',
                    address: '147 Connaught Place, New Delhi',
                    bloodGroup: 'A-',
                    emergencyContact: 'Anita Verma - +91-98765-0702',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P008',
                    name: 'Meera Joshi',
                    age: 29,
                    gender: 'Female',
                    phone: '+91-98765-0801',
                    email: 'meera.joshi@email.com',
                    address: '258 FC Road, Pune, Maharashtra',
                    bloodGroup: 'O+',
                    emergencyContact: 'Ashok Joshi - +91-98765-0802',
                    status: 'inactive',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P009',
                    name: 'Deepak Gupta',
                    age: 45,
                    gender: 'Male',
                    phone: '+91-98765-0901',
                    email: 'deepak.gupta@email.com',
                    address: '369 Sector 17, Chandigarh',
                    bloodGroup: 'B+',
                    emergencyContact: 'Savita Gupta - +91-98765-0902',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'P010',
                    name: 'Anita Desai',
                    age: 33,
                    gender: 'Female',
                    phone: '+91-98765-1001',
                    email: 'anita.desai@email.com',
                    address: '741 Brigade Road, Bangalore, Karnataka',
                    bloodGroup: 'AB-',
                    emergencyContact: 'Mahesh Desai - +91-98765-1002',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];
            
            // Add sample doctors with Indian names
            const sampleDoctors = [
                {
                    id: 'D001',
                    name: 'Dr. Sanjay Gupta',
                    department: 'Cardiology',
                    specialization: 'Interventional Cardiology',
                    phone: '+91-98765-1001',
                    email: 'dr.sanjay.gupta@adimed.com',
                    experience: 15,
                    qualification: 'MD, DM (Cardiology)',
                    schedule: 'Mon-Fri 9AM-5PM',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'D002',
                    name: 'Dr. Priya Nair',
                    department: 'Pediatrics',
                    specialization: 'General Pediatrics',
                    phone: '+91-98765-1002',
                    email: 'dr.priya.nair@adimed.com',
                    experience: 8,
                    qualification: 'MD, DCH',
                    schedule: 'Mon-Thu 8AM-4PM',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'D003',
                    name: 'Dr. Rahul Verma',
                    department: 'Orthopedics',
                    specialization: 'Joint Replacement Surgery',
                    phone: '+91-98765-1003',
                    email: 'dr.rahul.verma@adimed.com',
                    experience: 12,
                    qualification: 'MS Ortho, MCh',
                    schedule: 'Mon-Sat 10AM-6PM',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];

            // Add sample nurses with Indian names
            const sampleNurses = [
                {
                    id: 'N001',
                    name: 'Sunita Reddy',
                    department: 'Cardiology',
                    phone: '+91-98765-2001',
                    email: 'sunita.reddy@adimed.com',
                    experience: 6,
                    shift: 'Day',
                    qualification: 'BSc Nursing',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'N002',
                    name: 'Meera Joshi',
                    department: 'Pediatrics',
                    phone: '+91-98765-2002',
                    email: 'meera.joshi@adimed.com',
                    experience: 4,
                    shift: 'Evening',
                    qualification: 'GNM',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'N003',
                    name: 'Anita Singh',
                    department: 'ICU',
                    phone: '+91-98765-2003',
                    email: 'anita.singh@adimed.com',
                    experience: 8,
                    shift: 'Night',
                    qualification: 'MSc Nursing',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'N004',
                    name: 'Priya Sharma',
                    department: 'Emergency',
                    phone: '+91-98765-2004',
                    email: 'priya.sharma@adimed.com',
                    experience: 5,
                    shift: 'Day',
                    qualification: 'BSc Nursing',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'N005',
                    name: 'Kavita Nair',
                    department: 'Orthopedics',
                    phone: '+91-98765-2005',
                    email: 'kavita.nair@adimed.com',
                    experience: 7,
                    shift: 'Evening',
                    qualification: 'Post BSc',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'N006',
                    name: 'Rashmi Patel',
                    department: 'General',
                    phone: '+91-98765-2006',
                    email: 'rashmi.patel@adimed.com',
                    experience: 3,
                    shift: 'Night',
                    qualification: 'GNM',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'N007',
                    name: 'Deepa Gupta',
                    department: 'Neurology',
                    phone: '+91-98765-2007',
                    email: 'deepa.gupta@adimed.com',
                    experience: 10,
                    shift: 'Day',
                    qualification: 'MSc Nursing',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'N008',
                    name: 'Anjali Verma',
                    department: 'Surgery',
                    phone: '+91-98765-2008',
                    email: 'anjali.verma@adimed.com',
                    experience: 12,
                    shift: 'Evening',
                    qualification: 'Post BSc',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];

            // Add sample medicines
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 2);
            const futureDateStr = futureDate.toISOString().split('T')[0];
            
            const sampleMedicines = [
                {
                    id: 'M001',
                    name: 'Paracetamol 500mg',
                    category: 'Painkillers',
                    manufacturer: 'Cipla Ltd',
                    composition: 'Paracetamol 500mg',
                    stock: 150,
                    unit: 'Tablets',
                    price: 5.50,
                    expiryDate: futureDateStr,
                    dosage: '1 tablet twice daily after meals',
                    sideEffects: 'Rare allergic reactions',
                    description: 'Used for fever and mild to moderate pain relief',
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M002',
                    name: 'Amoxicillin 500mg',
                    category: 'Antibiotics',
                    manufacturer: 'Pfizer India',
                    composition: 'Amoxicillin Trihydrate 500mg',
                    stock: 8,
                    unit: 'Capsules',
                    price: 25.00,
                    expiryDate: futureDateStr,
                    dosage: '1 capsule three times daily',
                    sideEffects: 'Nausea, diarrhea, allergic reactions',
                    description: 'Broad-spectrum antibiotic for bacterial infections',
                    status: 'low-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M003',
                    name: 'Metformin 500mg',
                    category: 'Diabetes',
                    manufacturer: 'Sun Pharma',
                    composition: 'Metformin Hydrochloride 500mg',
                    stock: 200,
                    unit: 'Tablets',
                    price: 8.00,
                    expiryDate: futureDateStr,
                    dosage: '1 tablet twice daily with meals',
                    sideEffects: 'Gastrointestinal upset',
                    description: 'Oral diabetes medication for type 2 diabetes',
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M004',
                    name: 'Aspirin 75mg',
                    category: 'Cardiac',
                    manufacturer: 'Dr. Reddy\'s',
                    composition: 'Aspirin 75mg',
                    stock: 0,
                    unit: 'Tablets',
                    price: 2.00,
                    expiryDate: futureDateStr,
                    dosage: '1 tablet daily',
                    sideEffects: 'Stomach irritation, bleeding risk',
                    description: 'Low-dose aspirin for cardiovascular protection',
                    status: 'out-of-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M005',
                    name: 'Vitamin D3 60K IU',
                    category: 'Vitamins',
                    manufacturer: 'Zydus Healthcare',
                    composition: 'Cholecalciferol 60,000 IU',
                    stock: 50,
                    unit: 'Capsules',
                    price: 15.00,
                    expiryDate: futureDateStr,
                    dosage: '1 capsule weekly',
                    sideEffects: 'Rare hypercalcemia',
                    description: 'Vitamin D supplement for bone health',
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M006',
                    name: 'Ibuprofen 400mg',
                    category: 'Painkillers',
                    manufacturer: 'Mankind Pharma',
                    composition: 'Ibuprofen 400mg',
                    stock: 75,
                    unit: 'Tablets',
                    price: 12.00,
                    expiryDate: futureDateStr,
                    dosage: '1 tablet three times daily after food',
                    sideEffects: 'Stomach upset, dizziness',
                    description: 'NSAID for pain and inflammation',
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M007',
                    name: 'Azithromycin 250mg',
                    category: 'Antibiotics',
                    manufacturer: 'Lupin Ltd',
                    composition: 'Azithromycin 250mg',
                    stock: 5,
                    unit: 'Tablets',
                    price: 45.00,
                    expiryDate: futureDateStr,
                    dosage: '2 tablets on day 1, then 1 tablet daily for 4 days',
                    sideEffects: 'Nausea, abdominal pain',
                    description: 'Macrolide antibiotic for respiratory infections',
                    status: 'low-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M008',
                    name: 'Atorvastatin 10mg',
                    category: 'Cardiac',
                    manufacturer: 'Ranbaxy',
                    composition: 'Atorvastatin Calcium 10mg',
                    stock: 120,
                    unit: 'Tablets',
                    price: 18.00,
                    expiryDate: futureDateStr,
                    dosage: '1 tablet daily at bedtime',
                    sideEffects: 'Muscle pain, liver enzyme elevation',
                    description: 'Statin for cholesterol management',
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M009',
                    name: 'Omeprazole 20mg',
                    category: 'General',
                    manufacturer: 'Torrent Pharma',
                    composition: 'Omeprazole 20mg',
                    stock: 90,
                    unit: 'Capsules',
                    price: 22.00,
                    expiryDate: futureDateStr,
                    dosage: '1 capsule before breakfast',
                    sideEffects: 'Headache, diarrhea',
                    description: 'Proton pump inhibitor for acid reflux',
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'M010',
                    name: 'Cetirizine 10mg',
                    category: 'General',
                    manufacturer: 'Cipla Ltd',
                    composition: 'Cetirizine Hydrochloride 10mg',
                    stock: 200,
                    unit: 'Tablets',
                    price: 6.00,
                    expiryDate: futureDateStr,
                    dosage: '1 tablet daily at night',
                    sideEffects: 'Drowsiness, dry mouth',
                    description: 'Antihistamine for allergies',
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                }
            ];

            // Add sample beds
            const sampleBeds = [
                {
                    id: 'B001',
                    bedNumber: 'ICU-001',
                    type: 'ICU',
                    department: 'ICU',
                    floor: 3,
                    rate: 8000,
                    status: 'occupied',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B002',
                    bedNumber: 'ICU-002',
                    type: 'ICU',
                    department: 'ICU',
                    floor: 3,
                    rate: 8000,
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B003',
                    bedNumber: 'ICU-003',
                    type: 'Ventilator',
                    department: 'ICU',
                    floor: 3,
                    rate: 12000,
                    status: 'occupied',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B004',
                    bedNumber: 'G-101',
                    type: 'General',
                    department: 'General',
                    floor: 2,
                    rate: 1500,
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B005',
                    bedNumber: 'G-102',
                    type: 'General',
                    department: 'General',
                    floor: 2,
                    rate: 1500,
                    status: 'occupied',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B006',
                    bedNumber: 'G-103',
                    type: 'General',
                    department: 'General',
                    floor: 2,
                    rate: 1500,
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B007',
                    bedNumber: 'P-201',
                    type: 'Private',
                    department: 'Cardiology',
                    floor: 4,
                    rate: 5000,
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B008',
                    bedNumber: 'P-202',
                    type: 'Private',
                    department: 'Orthopedics',
                    floor: 4,
                    rate: 5000,
                    status: 'occupied',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B009',
                    bedNumber: 'SP-301',
                    type: 'Semi-Private',
                    department: 'Orthopedics',
                    floor: 3,
                    rate: 3000,
                    status: 'maintenance',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B010',
                    bedNumber: 'SP-302',
                    type: 'Semi-Private',
                    department: 'Pediatrics',
                    floor: 3,
                    rate: 3000,
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B011',
                    bedNumber: 'P-203',
                    type: 'Private',
                    department: 'Neurology',
                    floor: 4,
                    rate: 5000,
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B012',
                    bedNumber: 'G-104',
                    type: 'General',
                    department: 'Emergency',
                    floor: 1,
                    rate: 1500,
                    status: 'occupied',
                    createdAt: new Date().toISOString()
                }
            ];

            // Add sample lab tests
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const sampleLabTests = [
                {
                    id: 'L001',
                    patientId: 'P001',
                    patientName: 'Rajesh Kumar',
                    doctorId: 'D001',
                    doctorName: 'Dr. Sanjay Gupta',
                    testType: 'Blood Test',
                    date: today,
                    notes: 'Routine health checkup',
                    amount: 800,
                    status: 'completed',
                    results: 'Hemoglobin: 14.5 g/dL, WBC: 7500/mm³, Platelets: 2.5 lac/mm³ - All normal',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'L002',
                    patientId: 'P002',
                    patientName: 'Anjali Sharma',
                    doctorId: 'D002',
                    doctorName: 'Dr. Priya Nair',
                    testType: 'Urine Test',
                    date: today,
                    notes: 'Follow-up test for UTI',
                    amount: 500,
                    status: 'in-progress',
                    results: '',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'L003',
                    patientId: 'P003',
                    patientName: 'Amit Patel',
                    doctorId: 'D003',
                    doctorName: 'Dr. Rahul Verma',
                    testType: 'X-Ray',
                    date: yesterdayStr,
                    notes: 'Knee joint examination',
                    amount: 1200,
                    status: 'completed',
                    results: 'Mild degenerative changes in right knee joint - No fracture detected',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'L004',
                    patientId: 'P001',
                    patientName: 'Rajesh Kumar',
                    doctorId: 'D001',
                    doctorName: 'Dr. Sanjay Gupta',
                    testType: 'ECG',
                    date: yesterdayStr,
                    notes: 'Cardiac evaluation',
                    amount: 600,
                    status: 'completed',
                    results: 'Normal sinus rhythm, No ST-T changes, Heart rate: 72 bpm',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'L005',
                    patientId: 'P002',
                    patientName: 'Anjali Sharma',
                    doctorId: 'D002',
                    doctorName: 'Dr. Priya Nair',
                    testType: 'CT Scan',
                    date: today,
                    notes: 'Head injury evaluation',
                    amount: 3500,
                    status: 'pending',
                    results: '',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'L006',
                    patientId: 'P003',
                    patientName: 'Amit Patel',
                    doctorId: 'D003',
                    doctorName: 'Dr. Rahul Verma',
                    testType: 'MRI',
                    date: yesterdayStr,
                    notes: 'Spinal examination',
                    amount: 8000,
                    status: 'completed',
                    results: 'Mild disc bulge at L4-L5, No significant neural compression',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'L007',
                    patientId: 'P001',
                    patientName: 'Rajesh Kumar',
                    doctorId: 'D001',
                    doctorName: 'Dr. Sanjay Gupta',
                    testType: 'Ultrasound',
                    date: today,
                    notes: 'Abdominal examination',
                    amount: 1500,
                    status: 'in-progress',
                    results: '',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'L008',
                    patientId: 'P002',
                    patientName: 'Anjali Sharma',
                    doctorId: 'D002',
                    doctorName: 'Dr. Priya Nair',
                    testType: 'Pathology',
                    date: yesterdayStr,
                    notes: 'Biopsy analysis',
                    amount: 2000,
                    status: 'completed',
                    results: 'Benign tissue, No malignant cells detected',
                    createdAt: new Date().toISOString()
                }
            ];
            
            // Add sample appointments
            const sampleAppointments = [
                {
                    id: 'A001',
                    patientId: 'P001',
                    patientName: 'Rajesh Kumar',
                    doctorId: 'D001',
                    doctorName: 'Dr. Sanjay Gupta',
                    date: today,
                    time: '10:00',
                    reason: 'Regular heart checkup',
                    type: 'consultation',
                    department: 'Cardiology',
                    status: 'scheduled',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'A002',
                    patientId: 'P002',
                    patientName: 'Anjali Sharma',
                    doctorId: 'D002',
                    doctorName: 'Dr. Priya Nair',
                    date: today,
                    time: '14:00',
                    reason: 'Child vaccination',
                    type: 'consultation',
                    department: 'Pediatrics',
                    status: 'scheduled',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'A003',
                    patientId: 'P003',
                    patientName: 'Amit Patel',
                    doctorId: 'D003',
                    doctorName: 'Dr. Rahul Verma',
                    date: today,
                    time: '16:00',
                    reason: 'Knee pain consultation',
                    type: 'consultation',
                    department: 'Orthopedics',
                    status: 'scheduled',
                    createdAt: new Date().toISOString()
                }
            ];
            
            // Add sample bills with Indian currency
            const sampleBills = [
                {
                    id: 'B001',
                    patientId: 'P001',
                    patientName: 'Rajesh Kumar',
                    date: today,
                    services: [
                        { description: 'Cardiology Consultation', amount: 1500 },
                        { description: 'ECG Test', amount: 800 },
                        { description: 'Blood Tests', amount: 1200 }
                    ],
                    amount: 3500,
                    status: 'paid',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'B002',
                    patientId: 'P002',
                    patientName: 'Anjali Sharma',
                    date: today,
                    services: [
                        { description: 'Pediatric Consultation', amount: 1000 },
                        { description: 'Vaccination', amount: 2000 }
                    ],
                    amount: 3000,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            ];

            // Add sample feedback with Indian context
            const sampleFeedback = [
                {
                    id: 'F001',
                    patientId: 'P001',
                    patientName: 'Rajesh Kumar',
                    department: 'Cardiology',
                    rating: 5,
                    comments: 'Excellent care and treatment. Doctor was very professional and explained everything clearly. Hospital facilities are clean and well-maintained.',
                    date: new Date().toISOString().split('T')[0],
                    status: 'resolved',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'F002',
                    patientId: 'P002',
                    patientName: 'Anjali Sharma',
                    department: 'Pediatrics',
                    rating: 4,
                    comments: 'Good experience overall. Staff was caring with my child. Waiting time could be improved during peak hours.',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    status: 'reviewed',
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 'F003',
                    patientId: 'P003',
                    patientName: 'Amit Patel',
                    department: 'Orthopedics',
                    rating: 5,
                    comments: 'Outstanding service! Dr. Sanjay provided excellent treatment for my knee injury. Recovery process was smooth and well-guided.',
                    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                    status: 'resolved',
                    createdAt: new Date(Date.now() - 172800000).toISOString()
                },
                {
                    id: 'F004',
                    patientId: 'P004',
                    patientName: 'Priya Nair',
                    department: 'General',
                    rating: 3,
                    comments: 'Average experience. Pharmacy queue was quite long during my visit. Medication availability needs improvement.',
                    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
                    status: 'reviewed',
                    createdAt: new Date(Date.now() - 259200000).toISOString()
                },
                {
                    id: 'F005',
                    patientId: 'P005',
                    patientName: 'Sanjay Singh',
                    department: 'Cardiology',
                    rating: 4,
                    comments: 'Good cardiac care. Follow-up appointments were well-organized. Hospital environment is comfortable.',
                    date: new Date().toISOString().split('T')[0],
                    status: 'submitted',
                    createdAt: new Date().toISOString()
                }
            ];
            
            // Only add sample data for sections that are empty
            if (this.patients.length === 0) this.patients = samplePatients;
            if (this.doctors.length === 0) this.doctors = sampleDoctors;
            if (this.nurses.length === 0) this.nurses = sampleNurses;
            if (this.medicines.length === 0) this.medicines = sampleMedicines;
            if (this.beds.length === 0) this.beds = sampleBeds;
            if (this.labTests.length === 0) this.labTests = sampleLabTests;
            if (this.appointments.length === 0) this.appointments = sampleAppointments;
            if (this.bills.length === 0) this.bills = sampleBills;
            if (this.feedback.length === 0) this.feedback = sampleFeedback;
            
            // Debug: Force add beds data if still empty
            if (this.beds.length === 0) {
                console.log("Force loading bed sample data...");
                this.beds = sampleBeds;
            }
            
            this.saveDataToStorage();
            this.renderAllTables();
            this.updateDashboard();
            this.updateSelectOptions();
            
            // Add initial activities
            this.addActivity('patient', 'System initialized with sample data');
            this.addActivity('doctor', 'System initialized with sample data');
            this.addActivity('nurse', 'System initialized with sample data');
            this.addActivity('pharmacy', 'System initialized with sample data');
            this.addActivity('bed', 'System initialized with sample data');
            this.addActivity('lab', 'System initialized with sample data');
            this.addActivity('appointment', 'System initialized with sample data');
        }
    }
}

// Global functions for onclick handlers
function openPatientModal() {
    hms.currentEditId = null;
    hms.resetForm('patient-form');
    hms.openModal('patient-modal');
}

function openDoctorModal() {
    hms.currentEditId = null;
    hms.resetForm('doctor-form');
    hms.openModal('doctor-modal');
}

function openAppointmentModal() {
    hms.currentEditId = null;
    hms.resetForm('appointment-form');
    hms.updateSelectOptions();
    hms.openModal('appointment-modal');
}

function openBillingModal() {
    hms.currentEditId = null;
    hms.resetForm('billing-form');
    hms.updateSelectOptions();
    document.getElementById('billing-date').value = new Date().toISOString().split('T')[0];
    hms.openModal('billing-modal');
}

function closeModal(modalId) {
    hms.closeModal(modalId);
}

function addServiceItem() {
    hms.addServiceItem();
}

// Additional modal functions
function openNurseModal() {
    hms.currentEditId = null;
    hms.resetForm('nurse-form');
    hms.openModal('nurse-modal');
}

function openBedModal() {
    hms.currentEditId = null;
    hms.resetForm('bed-form');
    hms.openModal('bed-modal');
}

function openLabTestModal() {
    hms.currentEditId = null;
    hms.resetForm('lab-test-form');
    hms.updateSelectOptions();
    document.getElementById('lab-date').value = new Date().toISOString().split('T')[0];
    hms.openModal('lab-test-modal');
}

function openMedicineModal() {
    hms.currentEditId = null;
    hms.resetForm('medicine-form');
    // Set minimum expiry date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('medicine-expiry').min = today;
    hms.openModal('medicine-modal');
}

function openFeedbackModal() {
    hms.currentEditId = null;
    hms.resetForm('feedback-form');
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('feedback-date').value = today;
    hms.openModal('feedback-modal');
}

// Additional utility functions
function exportData(type) {
    let data = [];
    let filename = '';
    
    switch(type) {
        case 'patients':
            data = hms.patients;
            filename = 'patients.csv';
            break;
        case 'doctors':
            data = hms.doctors;
            filename = 'doctors.csv';
            break;
        case 'nurses':
            data = hms.nurses;
            filename = 'nurses.csv';
            break;
        case 'medicines':
            data = hms.medicines;
            filename = 'medicines.csv';
            break;
        case 'beds':
            data = hms.beds;
            filename = 'beds.csv';
            break;
        case 'appointments':
            data = hms.appointments;
            filename = 'appointments.csv';
            break;
        case 'bills':
            data = hms.bills;
            filename = 'bills.csv';
            break;
    }
    
    if (data.length === 0) {
        hms.showToast('No data to export', 'warning');
        return;
    }
    
    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    hms.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`, 'success');
}

function printData(type) {
    let content = '';
    let title = '';
    
    switch(type) {
        case 'patients':
            title = 'Patients Report';
            content = document.getElementById('patients-table-body').innerHTML;
            break;
        case 'doctors':
            title = 'Doctors Report';
            content = document.getElementById('doctors-table-body').innerHTML;
            break;
        case 'nurses':
            title = 'Nurses Report';
            content = document.getElementById('nurses-table-body').innerHTML;
            break;
        case 'medicines':
            title = 'Medicines Report';
            content = document.getElementById('medicines-table-body').innerHTML;
            break;
        case 'beds':
            title = 'Beds Report';
            content = document.getElementById('beds-grid').innerHTML;
            break;
        case 'appointments':
            title = 'Appointments Report';
            content = document.getElementById('appointments-table-body').innerHTML;
            break;
        case 'bills':
            title = 'Billing Report';
            content = document.getElementById('billing-table-body').innerHTML;
            break;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h1 { color: #333; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <table>
                    <thead>
                        <tr>${document.querySelector(`#${type}-table-body`).previousElementSibling.innerHTML}</tr>
                    </thead>
                    <tbody>${content}</tbody>
                </table>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    hms.showToast(`${title} sent to printer!`, 'success');
}

// Initialize the system
let hms;
document.addEventListener('DOMContentLoaded', () => {
    hms = new HospitalManagementSystem();
    
    // Set today's date as default for appointment date
    const today = new Date().toISOString().split('T')[0];
    const appointmentDateInput = document.getElementById('appointment-date');
    if (appointmentDateInput) {
        appointmentDateInput.min = today;
    }
});
