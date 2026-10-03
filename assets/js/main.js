/**
 * MALATH (ملاذ) — PREMIER REAL ESTATE CONSULTANCY & ADVISORY
 * By properties-e
 * Front-end Logic, Form Routing & WhatsApp Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Lead Capture Form Submission & Routing
  // Routing Destinations:
  // - Rahma@irtkaz.com
  // - Mostafa.a.ashmawy@gmail.com
  // - Mostafa.ashmawy@irtkaz.com
  const leadForm = document.getElementById('consultationForm');
  const submitBtn = document.getElementById('submitAdvisoryBtn');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalWaBtn = document.getElementById('modalWaBtn');
  const modalLeadName = document.getElementById('modalLeadName');

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('fullName');
      const countryCodeSelect = document.getElementById('countryCode');
      const phoneInput = document.getElementById('phoneNumber');

      const fullName = nameInput?.value.trim();
      const countryCode = countryCodeSelect?.value || '+20';
      const rawPhone = phoneInput?.value.trim();

      if (!fullName) {
        alert('Please enter your full name.');
        nameInput?.focus();
        return;
      }

      if (!rawPhone || rawPhone.length < 6) {
        alert('Please enter a valid phone number.');
        phoneInput?.focus();
        return;
      }

      const fullPhoneNumber = `${countryCode} ${rawPhone}`;

      // UI Submitting State
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite; display: inline-block;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        PROCESSING ADVISORY...
      `;

      const leadPayload = {
        name: fullName,
        phone: fullPhoneNumber,
        country_code: countryCode,
        advisory_entity: 'Malath (ملاذ)',
        platform: 'properties-e Strategic Advisory',
        target_region: 'New Cairo & Fifth Settlement Master Developments',
        _subject: `New Lead: ${fullName} - Malath Real Estate Advisory`,
        _cc: 'Mostafa.a.ashmawy@gmail.com,Mostafa.ashmawy@irtkaz.com',
        _template: 'table',
        submitted_at: new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' })
      };

      try {
        // Secure AJAX Dispatch via FormSubmit endpoint
        const response = await fetch('https://formsubmit.co/ajax/Rahma@irtkaz.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(leadPayload)
        });

        // Local storage backup
        const storedLeads = JSON.parse(localStorage.getItem('malath_leads') || '[]');
        storedLeads.push(leadPayload);
        localStorage.setItem('malath_leads', JSON.stringify(storedLeads));

        // Configure Modal WhatsApp Link
        if (modalLeadName) {
          modalLeadName.textContent = fullName;
        }
        if (modalWaBtn) {
          const waMsg = encodeURIComponent(
            `Hello Malath Consultancy, my name is ${fullName}. I just requested an exclusive advisory consultation for New Cairo developments (+201033373331).`
          );
          modalWaBtn.href = `https://wa.me/201033373331?text=${waMsg}`;
        }

        // Display Success Modal
        successModal?.classList.add('active');
        leadForm.reset();

      } catch (err) {
        console.warn('Form routing fallback triggered:', err);
        // Fallback local backup
        const storedLeads = JSON.parse(localStorage.getItem('malath_leads') || '[]');
        storedLeads.push(leadPayload);
        localStorage.setItem('malath_leads', JSON.stringify(storedLeads));

        if (modalLeadName) {
          modalLeadName.textContent = fullName;
        }
        if (modalWaBtn) {
          const waMsg = encodeURIComponent(
            `Hello Malath Consultancy, my name is ${fullName}. I just requested an exclusive advisory consultation for New Cairo developments.`
          );
          modalWaBtn.href = `https://wa.me/201033373331?text=${waMsg}`;
        }

        successModal?.classList.add('active');
        leadForm.reset();

      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 4. Modal Close Handlers
  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal?.classList.contains('active')) {
      successModal.classList.remove('active');
    }
  });
});

// CSS keyframes helper for submit spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);
