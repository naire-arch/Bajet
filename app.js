const USERS_KEY = "bajetWaziriUsers";
const SESSION_KEY = "bajetWaziriActivePhone";
const FUEL_RATE_PER_MIN = { gas: 1.4, charcoal: 1.1, electric: 2.1 };

let authMode = "login";
let pendingOtp = null;
let currentUser = null;

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createDefaultUserData(name, phone) {
  return {
    name: name || "Waziri Chef",
    phone,
    pin: "1234",
    lang: "en",
    weeklyBudget: 3500,
    monthlyGoal: 6000,
    householdSize: 2,
    priceSource: "market",
    regionFilter: "all",
    dietFilter: "all",
    fuelType: "gas",
    shopStrategy: "wakulima",
    selectedMeals: ["ugali-sukuma", "githeri", "chapati-ndengu", "mandazi-chai"],
    checkedGroceries: {},
    schedule: {},
    expenses: [],
    customMeals: []
  };
}

function saveCurrentUser() {
  if (!currentUser) return;
  const users = getUsers();
  users[currentUser.phone] = currentUser;
  saveUsers(users);
}

// --- AUTH LOGIC ---
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const nameField = document.getElementById("nameField");
const otpBox = document.getElementById("otpBox");
const authError = document.getElementById("authError");

function setAuthMode(mode) {
  authMode = mode;
  pendingOtp = null;
  otpBox.classList.add("hidden");
  authError.classList.add("hidden");
  tabLogin.classList.toggle("active", mode === "login");
  tabRegister.classList.toggle("active", mode === "register");
  nameField.classList.toggle("hidden", mode === "login");
  document.getElementById("authSubmitBtn").textContent = mode === "login" ? "Log In" : "Send Verification Code";
}

tabLogin.onclick = () => setAuthMode("login");
tabRegister.onclick = () => setAuthMode("register");

function normalizePhone(code, raw) {
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  return `${code}${digits}`;
}

document.getElementById("authForm").onsubmit = (e) => {
  e.preventDefault();
  authError.classList.add("hidden");
  const code = document.getElementById("countryCode").value;
  const rawPhone = document.getElementById("phoneNumber").value.trim();
  const pin = document.getElementById("userPin").value.trim();
  const fullPhone = normalizePhone(code, rawPhone);

  if (rawPhone.replace(/\D/g, "").length < 7) {
    authError.textContent = "Please enter a valid mobile number.";
    authError.classList.remove("hidden");
    return;
  }
  if (!/^\d{4}$/.test(pin)) {
    authError.textContent = "PIN must be exactly 4 digits.";
    authError.classList.remove("hidden");
    return;
  }

  const users = getUsers();

  if (authMode === "login") {
    const user = users[fullPhone];
    if (!user) {
      authError.textContent = "Number not registered. Switch to 'Create Account'.";
      authError.classList.remove("hidden");
      return;
    }
    if (user.pin !== pin) {
      authError.textContent = "Incorrect 4-digit PIN.";
      authError.classList.remove("hidden");
      return;
    }
    loginUser(user);
  } else {
    if (users[fullPhone]) {
      authError.textContent = "Mobile number already exists. Please log in.";
      authError.classList.remove("hidden");
      return;
    }
    if (!pendingOtp) {
      pendingOtp = String(Math.floor(1000 + Math.random() * 9000));
      document.getElementById("demoOtpDisplay").textContent = pendingOtp;
      otpBox.classList.remove("hidden");
      document.getElementById("authSubmitBtn").textContent = "Verify & Launch App";
      return;
    }
    const enteredOtp = document.getElementById("otpInput").value.trim();
    if (enteredOtp !== pendingOtp) {
      authError.textContent = "Invalid OTP code. Check the demo code shown above.";
      authError.classList.remove("hidden");
      return;
    }
    const name = document.getElementById("userName").value.trim() || "Waziri Member";
    const newUser = createDefaultUserData(name, fullPhone);
    newUser.pin = pin;
    users[fullPhone] = newUser;
    saveUsers(users);
    loginUser(newUser);
  }
};

document.getElementById("demoLoginBtn").onclick = () => {
  const demoPhone = "+254700000000";
  const users = getUsers();
  if (!users[demoPhone]) {
    users[demoPhone] = createDefaultUserData("Waziri Demo", demoPhone);
    saveUsers(users);
  }
  loginUser(users[demoPhone]);
};

function loginUser(user) {
  currentUser = user;
  localStorage.setItem(SESSION_KEY, user.phone);
  document.getElementById("authScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.remove("hidden");
  renderApp();
}

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem(SESSION_KEY);
  currentUser = null;
  document.getElementById("appScreen").classList.add("hidden");
  document.getElementById("authScreen").classList.remove("hidden");
};

// --- NAVIGATION TABS ---
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.view;
    document.querySelectorAll(".view-section").forEach(v => v.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");
  };
});

// --- MAIN APP RENDER ---
function getAllMeals() {
  return [...DEFAULT_MEALS, ...(currentUser.customMeals || [])];
}

function renderApp() {
  if (!currentUser) return;
  const isSw = currentUser.lang === "sw";
  const allMeals = getAllMeals();

  document.getElementById("userGreeting").textContent = `${isSw ? "Karibu" : "Welcome"}, ${currentUser.name} (${currentUser.phone})`;
  document.getElementById("langToggle").textContent = isSw ? "English" : "Kiswahili";

  ["weeklyBudget", "monthlyGoal", "householdSize", "priceSource", "regionFilter", "dietFilter", "fuelType", "shopStrategy"]
    .forEach(id => { document.getElementById(id).value = currentUser[id]; });

  const scale = Number(currentUser.householdSize) / 2;

  // Render Meal Cards
  const grid = document.getElementById("mealGrid");
  grid.innerHTML = "";
  const filtered = allMeals.filter(m =>
    (currentUser.regionFilter === "all" || m.region === currentUser.regionFilter) &&
    (currentUser.dietFilter === "all" || m.tags.includes(currentUser.dietFilter))
  );

  filtered.forEach(meal => {
    const selected = currentUser.selectedMeals.includes(meal.id);
    const mealCost = Math.round(
      meal.ingredients.reduce((sum, i) => sum + (i[currentUser.priceSource] || i.market), 0) * scale
    );
    const card = document.createElement("div");
    card.className = `meal-item ${selected ? "selected" : ""}`;
    card.innerHTML = `
      <div>
        <span class="badge">${meal.region}</span>
        <h3>${meal.name[currentUser.lang] || meal.name.en}</h3>
        <p class="muted">~KES ${mealCost} (${currentUser.householdSize} ${isSw ? "watu" : "ppl"})</p>
      </div>
      <button class="${selected ? "btn-danger" : "btn-primary"}">
        ${selected ? (isSw ? "Ondoa" : "Remove") : (isSw ? "Ongeza" : "Add to Week")}
      </button>
    `;
    card.querySelector("button").onclick = () => {
      currentUser.selectedMeals = selected
        ? currentUser.selectedMeals.filter(id => id !== meal.id)
        : [...currentUser.selectedMeals, meal.id];
      saveCurrentUser();
      renderApp();
    };
    grid.appendChild(card);
  });

  // Consolidate Groceries & Reuse Discount
  const consolidated = {};
  let rawTotal = 0;
  let totalFuelMins = 0;

  currentUser.selectedMeals.forEach(id => {
    const meal = allMeals.find(m => m.id === id);
    if (!meal) return;
    totalFuelMins += meal.fuelMins || 30;
    meal.ingredients.forEach(ing => {
      const basePrice = ing[currentUser.priceSource] || ing.market;
      const unitCost = Math.round(basePrice * scale);
      rawTotal += unitCost;
      if (!consolidated[ing.id]) {
        consolidated[ing.id] = { ...ing, count: 1, totalCost: unitCost };
      } else {
        consolidated[ing.id].count += 1;
        consolidated[ing.id].totalCost += Math.round(unitCost * 0.7);
      }
    });
  });

  const groceryTotal = Object.values(consolidated).reduce((s, i) => s + i.totalCost, 0);
  const reuseSaved = rawTotal - groceryTotal;
  const fuelCost = Math.round(totalFuelMins * FUEL_RATE_PER_MIN[currentUser.fuelType]);
  const grandTotal = groceryTotal + fuelCost;

  // Alerts
  const proteinSpend = Object.values(consolidated).filter(i => i.cat === "protein").reduce((s, i) => s + i.totalCost, 0);
  const produceSpend = Object.values(consolidated).filter(i => i.cat === "produce").reduce((s, i) => s + i.totalCost, 0);
  const alertBox = document.getElementById("alertBanner");
  const alerts = [];
  if (grandTotal > currentUser.weeklyBudget) {
    alerts.push(isSw
      ? `Tahadhari: Bajeti imezidi kwa KES ${grandTotal - currentUser.weeklyBudget}!`
      : `Over weekly budget by KES ${grandTotal - currentUser.weeklyBudget}!`);
  }
  if (proteinSpend > currentUser.weeklyBudget * 0.45) {
    alerts.push(isSw ? "Tahadhari: Protini imezidi 45% ya bajeti." : "Alert: Protein spending exceeds 45% of budget.");
  }
  if (produceSpend > currentUser.weeklyBudget * 0.35) {
    alerts.push(isSw ? "Tahadhari: Mboga zimezidi 35% ya bajeti." : "Alert: Fresh produce exceeds 35% of budget.");
  }
  alertBox.textContent = alerts.join(" | ");
  alertBox.classList.toggle("hidden", alerts.length === 0);

  // Dashboard Metrics
  const weeklyRemainder = Math.max(0, currentUser.weeklyBudget - grandTotal);
  const monthlyProjected = weeklyRemainder * 4;
  document.getElementById("totalCost").textContent = `KES ${grandTotal}`;
  document.getElementById("fuelCost").textContent = `KES ${fuelCost}`;
  document.getElementById("reuseSaved").textContent = `KES ${reuseSaved}`;
  document.getElementById("projectedSavings").textContent = `KES ${monthlyProjected} / ${currentUser.monthlyGoal}`;

  // Shopping List
  document.getElementById("shopNote").textContent = currentUser.shopStrategy === "wakulima"
    ? (isSw ? "Mpango: Nunua kwa jumla Wakulima Market Jumamosi asubuhi." : "Strategy: Buy staples & produce in bulk at Wakulima Market on Saturday.")
    : (isSw ? "Mpango: Nunua nafaka Jumamosi, mboga mbichi Jumatano." : "Strategy: Buy dry staples Saturday; top up fresh greens midweek.");

  const listEl = document.getElementById("groceryList");
  listEl.innerHTML = "";
  Object.values(consolidated).forEach(item => {
    const isChecked = !!currentUser.checkedGroceries[item.id];
    const li = document.createElement("li");
    if (isChecked) li.classList.add("checked");
    li.innerHTML = `
      <label style="display:flex;align-items:center;gap:0.5rem;margin:0;cursor:pointer;color:inherit;">
        <input type="checkbox" ${isChecked ? "checked" : ""} style="width:auto;" />
        <span>${item[currentUser.lang] || item.en} (x${item.count})</span>
      </label>
      <strong>KES ${item.totalCost}</strong>
    `;
    li.querySelector("input").onchange = (e) => {
      currentUser.checkedGroceries[item.id] = e.target.checked;
      saveCurrentUser();
      renderApp();
    };
    listEl.appendChild(li);
  });

  // 7-Day Schedule
  const schedGrid = document.getElementById("scheduleGrid");
  schedGrid.innerHTML = "";
  const chosenMealObjs = allMeals.filter(m => currentUser.selectedMeals.includes(m.id));
  DAYS_OF_WEEK.forEach(day => {
    const dayData = currentUser.schedule[day] || { lunch: "", dinner: "" };
    const optionsHtml = [`<option value="">-- Select Dish --</option>`]
      .concat(chosenMealObjs.map(m => `<option value="${m.id}">${m.name[currentUser.lang] || m.name.en}</option>`))
      .join("");
    const div = document.createElement("div");
    div.className = "day-card";
    div.innerHTML = `
      <h4>${day}</h4>
      <label>Lunch</label>
      <select data-day="${day}" data-slot="lunch">${optionsHtml}</select>
      <label style="margin-top:0.5rem;">Dinner</label>
      <select data-day="${day}" data-slot="dinner">${optionsHtml}</select>
    `;
    const selects = div.querySelectorAll("select");
    selects[0].value = dayData.lunch || "";
    selects[1].value = dayData.dinner || "";
    selects.forEach(sel => {
      sel.onchange = () => {
        if (!currentUser.schedule[day]) currentUser.schedule[day] = {};
        currentUser.schedule[day][sel.dataset.slot] = sel.value;
        saveCurrentUser();
      };
    });
    schedGrid.appendChild(div);
  });

  // Expenses Log
  const expList = document.getElementById("expenseList");
  expList.innerHTML = "";
  let actualSum = 0;
  (currentUser.expenses || []).forEach((exp, idx) => {
    actualSum += Number(exp.amount);
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${exp.item} <small class="muted">(${exp.date})</small></span>
      <div>
        <strong>KES ${exp.amount}</strong>
        <button class="btn-danger" style="padding:0.2rem 0.5rem;margin-left:0.5rem;">×</button>
      </div>
    `;
    li.querySelector("button").onclick = () => {
      currentUser.expenses.splice(idx, 1);
      saveCurrentUser();
      renderApp();
    };
    expList.appendChild(li);
  });
  document.getElementById("actualSpendSummary").textContent = `Actual Spent This Week: KES ${actualSum} (Remaining Budget: KES ${currentUser.weeklyBudget - actualSum})`;
}

// --- EVENT LISTENERS ---
["weeklyBudget", "monthlyGoal", "householdSize"].forEach(id => {
  document.getElementById(id).addEventListener("input", e => {
    currentUser[id] = Number(e.target.value);
    saveCurrentUser();
    renderApp();
  });
});

["priceSource", "regionFilter", "dietFilter", "fuelType", "shopStrategy"].forEach(id => {
  document.getElementById(id).addEventListener("change", e => {
    currentUser[id] = e.target.value;
    saveCurrentUser();
    renderApp();
  });
});

document.getElementById("langToggle").onclick = () => {
  currentUser.lang = currentUser.lang === "en" ? "sw" : "en";
  saveCurrentUser();
  renderApp();
};

document.getElementById("clearPlan").onclick = () => {
  currentUser.selectedMeals = [];
  saveCurrentUser();
  renderApp();
};

document.getElementById("autoPlanBtn").onclick = () => {
  const allMeals = getAllMeals();
  const scale = Number(currentUser.householdSize) / 2;
  const shuffled = [...allMeals].sort(() => Math.random() - 0.5);
  const picked = [];
  let runningCost = 0;
  for (const meal of shuffled) {
    const cost = Math.round(meal.ingredients.reduce((s, i) => s + (i[currentUser.priceSource] || i.market), 0) * scale);
    if (runningCost + cost <= currentUser.weeklyBudget * 0.85) {
      picked.push(meal.id);
      runningCost += cost;
    }
  }
  currentUser.selectedMeals = picked;
  saveCurrentUser();
  renderApp();
};

document.getElementById("copyWhatsApp").onclick = () => {
  const lines = [`*Bajet by Waziri — Shopping List (${currentUser.priceSource.toUpperCase()})*`];
  document.querySelectorAll("#groceryList li").forEach(li => {
    lines.push(`• ${li.innerText.replace(/\n+/g, " - ")}`);
  });
  lines.push(`\n*Est. Total (incl. fuel):* ${document.getElementById("totalCost").textContent}`);
  navigator.clipboard.writeText(lines.join("\n"));
  alert("Shopping list copied! Ready to paste in WhatsApp.");
};

document.getElementById("expenseForm").onsubmit = (e) => {
  e.preventDefault();
  const item = document.getElementById("expItem").value.trim();
  const amount = Number(document.getElementById("expAmount").value);
  if (!item || amount <= 0) return;
  currentUser.expenses.unshift({
    item,
    amount,
    date: new Date().toLocaleDateString("en-KE", { month: "short", day: "numeric" })
  });
  e.target.reset();
  saveCurrentUser();
  renderApp();
};

document.getElementById("customMealForm").onsubmit = (e) => {
  e.preventDefault();
  const en = document.getElementById("custNameEn").value.trim();
  const sw = document.getElementById("custNameSw").value.trim();
  const region = document.getElementById("custRegion").value;
  const cost = Number(document.getElementById("custCost").value);
  const id = "custom-" + Date.now();
  currentUser.customMeals.push({
    id,
    name: { en, sw },
    region,
    tags: ["student"],
    fuelMins: 30,
    ingredients: [
      { id: id + "-ing", en: `${en} Ingredients`, sw: `Mahitaji ya ${sw}`, cat: "staple", market: cost, supermarket: Math.round(cost * 1.2) }
    ]
  });
  currentUser.selectedMeals.push(id);
  e.target.reset();
  saveCurrentUser();
  renderApp();
  alert("Custom dish saved & added to your week!");
};

// Auto-restore active session
const activePhone = localStorage.getItem(SESSION_KEY);
if (activePhone) {
  const users = getUsers();
  if (users[activePhone]) {
    loginUser(users[activePhone]);
  }
}
