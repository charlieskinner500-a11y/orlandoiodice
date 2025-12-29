


const screens = Array.from(document.querySelectorAll('.screen'));
const tabbar = document.querySelector('.tabbar');
const tabs = Array.from(document.querySelectorAll('.tab'));
const saveBtn = document.getElementById('saveBtn');
const form = document.querySelector('.form');
const profileAdminBtn = document.getElementById('profileAdminBtn');

const inputs = {
  fullName: form?.querySelector('[name="fullName"]'),
  firstName: form?.querySelector('[name="firstName"]'),
  address1: form?.querySelector('[name="address1"]'),
  address2: form?.querySelector('[name="address2"]'),
  dob: form?.querySelector('[name="dob"]'),
  permit: form?.querySelector('[name="permit"]'),
  issueDate: form?.querySelector('[name="issueDate"]'),
  expiryDate: form?.querySelector('[name="expiryDate"]'),
  cardNumber: form?.querySelector('[name="cardNumber"]'),
};


const state = {
  fullName: inputs.fullName?.value || 'Charlie Skinner',
  firstName: inputs.firstName?.value || 'Charlie',
  address1: inputs.address1?.value || '76 Nott st',
  address2: inputs.address2?.value || 'Springfield, VIC 3000',
  dob: inputs.dob?.value || '22/07/07',
  permit: inputs.permit?.value || '73204715',
  issueDate: inputs.issueDate?.value || '05/02/2025',
  expiryDate: inputs.expiryDate?.value || '05/02/2028',
  cardNumber: inputs.cardNumber?.value || 'P5295804',
  photo: '',
  signature: '',
};

const params = new URLSearchParams(window.location.search);
const VERSION_ID = params.get("v") || "default";
const KV_KEY = `config:${VERSION_ID}`;


// --- KV API helpers (put under `state`) ---
const getAdminToken = () => localStorage.getItem("adminToken") || "";


async function loadConfig() {
  const token = getAdminToken();
  const res = await fetch(`/api/config?key=${encodeURIComponent(KV_KEY)}`, {
  cache: "no-store",
});


  if (!res.ok) return null;
  const data = await res.json();
  return data.value ?? null;
}



async function saveConfig(value) {
  const token = getAdminToken();
  const res = await fetch(`/api/save?key=${encodeURIComponent(KV_KEY)}`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-admin-token": localStorage.getItem("adminToken") || "",
  },
  body: JSON.stringify({
    value: dataToSave,
  }),
});



  if (!res.ok) throw new Error(await res.text());
  return res.json();
}



const showScreen = (id) => {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === id);
  });
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.target === id);
  });
  tabbar.classList.toggle('hidden', id === 'lock');
};

// Lock screen logic
const dots = Array.from(document.querySelectorAll('.pin-dots span'));
const keypad = document.querySelector('.keypad');
let pin = [];

const refreshDots = () => {
  dots.forEach((dot, idx) => {
    dot.classList.toggle('filled', idx < pin.length);
  });
};

keypad?.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (!btn) return;

  const val = btn.textContent.trim();
  if (btn.classList.contains('icon-back')) {
    pin.pop();
    refreshDots();
    return;
  }

  if (btn.classList.contains('forgot')) {
    pin = [];
    refreshDots();
    return;
  }

  if (/^[0-9]$/.test(val)) {
    if (pin.length < 6) {
      pin.push(val);
      refreshDots();
    }
    if (pin.length === 6) {
      setTimeout(() => {
        showScreen('home');
        pin = [];
        refreshDots();
      }, 200);
    }
  }
});

// Tab navigation
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    showScreen(tab.dataset.target);
  });
});

// Cards that drill into other screens (e.g. admin)
document.querySelectorAll('[data-target-screen]').forEach((item) => {
  item.addEventListener('click', () => showScreen(item.dataset.targetScreen));
});

profileAdminBtn?.addEventListener('click', () => showScreen('admin'));

// File uploads
const photoBtn = document.getElementById('photoBtn');
const photoInput = document.getElementById('photoInput');
const signatureBtn = document.getElementById('signatureBtn');
const signatureInput = document.getElementById('signatureInput');
const avatarPreview = document.getElementById('avatarPreview');
const signaturePreview = document.getElementById('signaturePreview');

const loadFile = (file, cb) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => cb(e.target?.result || '');
  reader.readAsDataURL(file);
};

photoBtn?.addEventListener('click', () => photoInput?.click());
signatureBtn?.addEventListener('click', () => signatureInput?.click());

photoInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  loadFile(file, (dataUrl) => {
    state.photo = dataUrl;
    if (avatarPreview) avatarPreview.src = dataUrl;
    renderLicence();
  });
});

signatureInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  loadFile(file, (dataUrl) => {
    state.signature = dataUrl;
    if (signaturePreview) signaturePreview.src = dataUrl;
    renderLicence();
  });
});

// Licence view bindings
const licName = document.getElementById('licName');
const licPermit = document.getElementById('licPermit');
const licPermitType = document.getElementById('licPermitType');
const licExpiry = document.getElementById('licExpiry');
const licExpiry2 = document.getElementById('licExpiry2');
const licDob = document.getElementById('licDob');
const licAddress = document.getElementById('licAddress');
const licIssue = document.getElementById('licIssue');
const licCard = document.getElementById('licCard');
const licPhoto = document.getElementById('licPhoto');
const licSignature = document.getElementById('licSignature');
const refreshTime = document.getElementById('refreshTime');
const licSignatureEmpty = document.getElementById('licSignatureEmpty');

const defaultPhoto =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="%23e8ecf2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%238a93a3" font-size="18" font-family="Arial">Photo</text></svg>';
const defaultSignature =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="90"><rect width="180" height="90" fill="%23f6f7fa" stroke="%23d4d7de"/><path d="M20 50 C40 30, 70 70, 110 40 S160 70 150 50" stroke="%238a93a3" stroke-width="2" fill="none"/></svg>';

const renderLicence = () => {
  if (licName) licName.textContent = state.fullName;
  if (licPermit) licPermit.textContent = state.permit;
  if (licPermitType) licPermitType.textContent = 'Car';
  if (licExpiry) licExpiry.textContent = state.expiryDate;
  if (licExpiry2) licExpiry2.textContent = state.expiryDate;
  if (licDob) licDob.textContent = state.dob;
  if (licAddress) licAddress.textContent = `${state.address1}, ${state.address2}`;
  if (licIssue) licIssue.textContent = state.issueDate;
  if (licCard) licCard.textContent = state.cardNumber || '********';
  if (licPhoto) licPhoto.src = state.photo || defaultPhoto;
  if (licSignature) {
    if (state.signature) {
      licSignature.src = state.signature;
      licSignature.style.display = 'block';
      if (licSignatureEmpty) licSignatureEmpty.style.display = 'none';
    } else {
      licSignature.src = defaultSignature;
      licSignature.style.display = 'block';
      if (licSignatureEmpty) licSignatureEmpty.style.display = 'block';
    }
  }
  if (refreshTime) {
    const now = new Date();
    refreshTime.textContent = now.toLocaleString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

// Save button updates state from form
saveBtn?.addEventListener('click', async () => {
  console.log("SAVE CLICKED");
  state.fullName = inputs.fullName?.value || state.fullName;
  state.firstName = inputs.firstName?.value || state.firstName;
  state.address1 = inputs.address1?.value || state.address1;
  state.address2 = inputs.address2?.value || state.address2;
  state.dob = inputs.dob?.value || state.dob;
  state.permit = inputs.permit?.value || state.permit;
  state.issueDate = inputs.issueDate?.value || state.issueDate;
  state.expiryDate = inputs.expiryDate?.value || state.expiryDate;
  state.cardNumber = inputs.cardNumber?.value || state.cardNumber;

  const hello = document.querySelector('.hello');
  if (hello) hello.textContent = `Hi ${state.firstName}`;

  renderLicence();

  // --- SAVE hook (put RIGHT HERE) ---
  try {
    await saveConfig(state); // saves the whole state object into KV under key=config
    // optional: show a tiny "Saved" toast/label if you have one
  } catch (err) {
    console.error("Save failed:", err);
    alert("Save failed (check admin token / KV route)");
  }
});


// Initialize previews with placeholder
if (avatarPreview && !state.photo) {
  avatarPreview.src = defaultPhoto;
}
if (signaturePreview && !state.signature) {
  signaturePreview.src = defaultSignature;
}

// Loading screen then start on lock
// --- LOAD hook (put right before the loading-screen code) ---
(async () => {
  const saved = await loadConfig();
  if (saved && typeof saved === "object") {
    Object.assign(state, saved);

    // push loaded values into the admin form
    if (inputs.fullName) inputs.fullName.value = state.fullName || "";
    if (inputs.firstName) inputs.firstName.value = state.firstName || "";
    if (inputs.address1) inputs.address1.value = state.address1 || "";
    if (inputs.address2) inputs.address2.value = state.address2 || "";
    if (inputs.dob) inputs.dob.value = state.dob || "";
    if (inputs.permit) inputs.permit.value = state.permit || "";
    if (inputs.issueDate) inputs.issueDate.value = state.issueDate || "";
    if (inputs.expiryDate) inputs.expiryDate.value = state.expiryDate || "";
    if (inputs.cardNumber) inputs.cardNumber.value = state.cardNumber || "";

    // update greeting too
    const hello = document.querySelector(".hello");
    if (hello) hello.textContent = `Hi ${state.firstName || ""}`;
  }

  renderLicence(); // render AFTER load
})();

const loading = document.getElementById('loading-screen');
setTimeout(() => {
  if (loading) loading.style.display = 'none';
  showScreen('lock');
}, 1000);
