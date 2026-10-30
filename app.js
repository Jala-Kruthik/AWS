/* RTC Portal demo. Data is stored in this browser using localStorage.
   This is not production authentication; use a secure backend for real users. */
const STORAGE = {
  staff: "rtc_staff_creds", members: "rtc_members", attendance: "rtc_attendance",
  locked: "rtc_locked", feedback: "rtc_feedback"
};
const read = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
};
let staffCreds = read(STORAGE.staff, { user: "staff", pass: "123" });
let members = read(STORAGE.members, []);
let attendance = read(STORAGE.attendance, {});
let lockedDates = read(STORAGE.locked, []);
let feedback = read(STORAGE.feedback, []);
let loggedInUser = null;

const $ = id => document.getElementById(id);
const save = () => {
  localStorage.setItem(STORAGE.staff, JSON.stringify(staffCreds));
  localStorage.setItem(STORAGE.members, JSON.stringify(members));
  localStorage.setItem(STORAGE.attendance, JSON.stringify(attendance));
  localStorage.setItem(STORAGE.locked, JSON.stringify(lockedDates));
  localStorage.setItem(STORAGE.feedback, JSON.stringify(feedback));
};
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(message) {
  const el = $("toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}
function showView(id) {
  ["login-screen","staff-app","student-app"].forEach(view => $(view).classList.toggle("hidden", view !== id));
}
function today() { return new Date().toISOString().slice(0,10); }

$("login-form").addEventListener("submit", event => {
  event.preventDefault();
  const username = $("user-input").value.trim();
  const password = $("pass-input").value;
  $("login-error").textContent = "";
  if (username === staffCreds.user && password === staffCreds.pass) {
    showView("staff-app"); $("att-date").value = today(); renderStaffTable();
    return;
  }
  const student = members.find(m => m.name.toLowerCase() === username.toLowerCase() && m.password === password);
  if (student) { loggedInUser = student; showView("student-app"); renderStudentDashboard(); }
  else $("login-error").textContent = "Invalid username or password.";
});
document.querySelectorAll("[data-logout]").forEach(button => button.addEventListener("click", () => {
  loggedInUser = null; $("login-form").reset(); showView("login-screen");
}));
$("student-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("reg-name").value.trim(), dept = $("reg-dept").value.trim(), password = $("reg-pass").value;
  const idx = $("edit-idx").value;
  if (!name || !password) return toast("Name and password are required.");
  const duplicate = members.some((m, i) => m.name.toLowerCase() === name.toLowerCase() && String(i) !== idx);
  if (duplicate) return toast("A student with that name already exists.");
  const record = { name, dept, password };
  if (idx === "") members.push(record); else members[Number(idx)] = record;
  save(); resetStudentForm(); renderStaffTable(); toast("Student saved.");
});
function resetStudentForm() {
  $("student-form").reset(); $("edit-idx").value = ""; $("form-title").textContent = "Student manager";
  $("save-btn").textContent = "Save student"; $("cancel-edit").classList.add("hidden");
}
$("cancel-edit").addEventListener("click", resetStudentForm);
$("staff-search").addEventListener("input", renderStaffTable);
$("att-date").addEventListener("change", renderStaffTable);

function renderStaffTable() {
  const date = $("att-date").value || today(), query = $("staff-search").value.toLowerCase();
  const tbody = $("staff-table-body"); tbody.innerHTML = "";
  let present = 0, absent = 0, shown = 0;
  members.forEach((member, idx) => {
    const status = attendance[date]?.[member.name] || "Present";
    status === "Present" ? present++ : absent++;
    if (!member.name.toLowerCase().includes(query) && !member.dept.toLowerCase().includes(query)) return;
    shown++;
    const row = document.createElement("tr");
    row.innerHTML = `<td><strong>${escapeHTML(member.name)}</strong></td>
      <td>${escapeHTML(member.dept)}</td>
      <td><button class="btn table-action ${status === "Present" ? "status-present" : "status-absent"}" data-action="toggle" data-index="${idx}" ${lockedDates.includes(date) ? "disabled" : ""}>${status}</button></td>
      <td><button class="btn btn-light table-action" data-action="edit" data-index="${idx}">Edit</button>
      <button class="btn btn-logout table-action" data-action="delete" data-index="${idx}">Delete</button></td>`;
    tbody.appendChild(row);
  });
  $("s-total").textContent = members.length; $("s-present").textContent = present; $("s-absent").textContent = absent;
  $("empty-students").classList.toggle("hidden", shown !== 0);
}
$("staff-table-body").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const idx = Number(button.dataset.index), action = button.dataset.action, member = members[idx];
  if (!member) return;
  if (action === "edit") {
    $("reg-name").value = member.name; $("reg-dept").value = member.dept; $("reg-pass").value = member.password;
    $("edit-idx").value = idx; $("form-title").textContent = "Edit student"; $("save-btn").textContent = "Update student";
    $("cancel-edit").classList.remove("hidden"); window.scrollTo({top:0,behavior:"smooth"});
  } else if (action === "delete" && confirm(`Delete ${member.name}?`)) {
    members.splice(idx,1); save(); renderStaffTable(); toast("Student deleted.");
  } else if (action === "toggle") {
    const date = $("att-date").value || today();
    if (lockedDates.includes(date)) return toast("Attendance for this date is locked.");
    attendance[date] ||= {};
    attendance[date][member.name] = (attendance[date][member.name] || "Present") === "Present" ? "Absent" : "Present";
    save(); renderStaffTable();
  }
});
$("lock-date").addEventListener("click", () => {
  const date = $("att-date").value;
  if (!date) return toast("Choose a date first.");
  if (!lockedDates.includes(date)) lockedDates.push(date);
  save(); renderStaffTable(); toast("Attendance date locked.");
});

function renderStudentDashboard() {
  $("welcome-student").textContent = `Welcome, ${loggedInUser.name}`;
  $("student-details").textContent = `Department: ${loggedInUser.dept || "Not specified"}`;
  const dates = [...lockedDates].sort();
  let present = 0; $("history-body").innerHTML = "";
  dates.forEach(date => {
    const status = attendance[date]?.[loggedInUser.name] || "Present";
    if (status === "Present") present++;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${escapeHTML(date)}</td><td>${escapeHTML(status)}</td>`;
    $("history-body").appendChild(row);
  });
  $("student-perc").textContent = `${dates.length ? Math.round(present / dates.length * 100) : 0}%`;
  const replies = feedback.filter(f => f.from === loggedInUser.name && f.reply);
  $("reply-container").innerHTML = replies.length ? replies.map(f =>
    `<div class="reply-item"><strong>You asked:</strong> ${escapeHTML(f.msg)}<br><strong>Staff:</strong> ${escapeHTML(f.reply)}</div>`
  ).join("") : "No replies yet.";
}
$("feedback-form").addEventListener("submit", event => {
  event.preventDefault();
  const msg = $("feedback-msg").value.trim(); if (!msg) return;
  feedback.push({ from: loggedInUser.name, msg, time: new Date().toLocaleString(), reply: "" });
  save(); $("feedback-form").reset(); toast("Message sent to staff.");
});

$("open-settings").addEventListener("click", () => { $("settings-modal").classList.remove("hidden"); renderFeedback(); });
$("close-settings").addEventListener("click", () => $("settings-modal").classList.add("hidden"));
$("settings-modal").addEventListener("click", event => { if (event.target === $("settings-modal")) $("settings-modal").classList.add("hidden"); });
function renderFeedback() {
  const container = $("feedback-list"); container.innerHTML = "";
  if (!feedback.length) { container.textContent = "No messages yet."; return; }
  feedback.forEach((item, idx) => {
    const card = document.createElement("div"); card.className = "feedback-item";
    card.innerHTML = `<strong>${escapeHTML(item.from)}</strong> <span class="muted">${escapeHTML(item.time)}</span>
      <p>${escapeHTML(item.msg)}</p>
      <div class="feedback-reply"><input aria-label="Reply" id="reply-${idx}" value="${escapeHTML(item.reply)}" placeholder="Type a reply">
      <button class="btn btn-primary" data-reply="${idx}">Save reply</button>
      <button class="btn btn-logout" data-delete-feedback="${idx}">Delete</button></div>`;
    container.appendChild(card);
  });
}
$("feedback-list").addEventListener("click", event => {
  const reply = event.target.closest("[data-reply]"), del = event.target.closest("[data-delete-feedback]");
  if (reply) {
    const idx = Number(reply.dataset.reply); feedback[idx].reply = $(`reply-${idx}`).value.trim();
    save(); toast("Reply saved.");
  }
  if (del) { feedback.splice(Number(del.dataset.deleteFeedback),1); save(); renderFeedback(); toast("Message deleted."); }
});
$("staff-credentials-form").addEventListener("submit", event => {
  event.preventDefault();
  const user = $("new-staff-user").value.trim(), pass = $("new-staff-pass").value;
  if (!user || !pass) return toast("Enter both username and password.");
  staffCreds = { user, pass }; save(); event.target.reset(); toast("Staff credentials updated.");
});
$("wipe-data").addEventListener("click", () => {
  if (!confirm("Clear all students, attendance, messages and staff credentials?")) return;
  Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
  location.reload();
});
