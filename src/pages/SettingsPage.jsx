import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Settings as SettingsIcon,
  Mail,
  KeyRound,
  SunMoon,
  LayoutGrid,
  LayoutList,
  Palette,
  ArrowUpDown,
  Download,
  Upload,
  Trash2,
  Check,
} from "lucide-react";

import { AuthContext } from "../contexts/AuthContext";
import { NotesContext } from "../contexts/NotesContext";
import { UIContext } from "../contexts/UIContext";
import { NOTE_COLORS } from "../constants";
import { supabase } from "../lib/supabase";

import ThemeToggle from "../components/ThemeToggle";

const SWATCH_CLASSES = {
  yellow: "bg-yellow-400",
  red: "bg-red-400",
  green: "bg-green-400",
  orange: "bg-orange-400",
  blue: "bg-blue-400",
  gray: "bg-gray-400",
};

const SORT_OPTIONS = [
  { value: "date-created-newest", label: "Date Created (Newest)" },
  { value: "date-created-oldest", label: "Date Created (Oldest)" },
  { value: "last-edited-newest", label: "Last Edited (Newest)" },
  { value: "last-edited-oldest", label: "Last Edited (Oldest)" },
  { value: "color", label: "Color" },
];

function SettingsRow({ icon, label, description, danger = false, children }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div
        className={`shrink-0 ${
          danger ? "text-red-500" : "text-amber-600 dark:text-amber-500"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? "text-red-500" : ""}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div className="space-y-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        {title}
      </h2>
      <div className="rounded-2xl border border-orange-100 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm divide-y divide-orange-100 dark:divide-zinc-700">
        {children}
      </div>
    </div>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const { user, updatePassword, signOut } = useContext(AuthContext);
  const { notes, folders, addNote } = useContext(NotesContext);
  const {
    notesLayout,
    setNotesLayout,
    defaultNoteColor,
    setDefaultNoteColor,
    defaultSortOrder,
    setDefaultSortOrder,
    addToast,
    setConfirmAction,
  } = useContext(UIContext);

  const displayEmail = user?.email;

  // Change password
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setPasswordError("Both fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setIsSavingPassword(true);
    setPasswordError("");
    try {
      await updatePassword(newPassword);
      addToast({ message: "Password updated" });
      setPasswordFormOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  // Data export
  function handleExport() {
    const payload = {
      exportedAt: new Date().toISOString(),
      notes,
      folders,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    addToast({ message: "Notes exported" });
  }

  // Data import
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const importedNotes = Array.isArray(parsed) ? parsed : parsed.notes;
      if (!Array.isArray(importedNotes)) {
        throw new Error("That file doesn't look like a notes export.");
      }

      const validNotes = importedNotes.filter(
        (note) => note && typeof note.title === "string" && typeof note.body === "string",
      );

      for (const note of validNotes) {
        await addNote({
          title: note.title,
          body: note.body,
          color: NOTE_COLORS.includes(note.color) ? note.color : defaultNoteColor,
          folderId: null,
        });
      }

      addToast({
        message: `Imported ${validNotes.length} note${validNotes.length === 1 ? "" : "s"}`,
      });
    } catch (err) {
      addToast({ message: err.message || "Failed to import notes." });
    } finally {
      setIsImporting(false);
    }
  }

  // Delete account
  async function handleDeleteAccount() {
    try {
      const { error: notesError } = await supabase
        .from("notes")
        .delete()
        .eq("user_id", user.id);
      if (notesError) throw notesError;
      const { error: foldersError } = await supabase
        .from("folders")
        .delete()
        .eq("user_id", user.id);
      if (foldersError) throw foldersError;
      addToast({ message: "Your notes and folders have been deleted." });
      navigate("/", { replace: true });
      await signOut();
    } catch (err) {
      addToast({ message: err.message || "Failed to delete account data." });
    }
  }

  function confirmDeleteAccount() {
    setConfirmAction({ action: "deleteAccount", onConfirm: handleDeleteAccount });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <SettingsIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        <h1 className="font-bold text-4xl text-gray-500 dark:text-gray-400">
          Settings
        </h1>
      </div>

      <SettingsSection title="Account">
        <SettingsRow icon={<Mail className="w-5 h-5" />} label="Email">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {displayEmail}
          </span>
        </SettingsRow>

        <div>
          <SettingsRow
            icon={<KeyRound className="w-5 h-5" />}
            label="Change password"
          >
            <button
              type="button"
              onClick={() => setPasswordFormOpen((prev) => !prev)}
              className="cursor-pointer rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-amber-900 dark:hover:bg-amber-800 px-3 py-1.5 text-sm font-medium transition"
            >
              {passwordFormOpen ? "Cancel" : "Change"}
            </button>
          </SettingsRow>

          {passwordFormOpen && (
            <form
              onSubmit={handleChangePassword}
              className="px-4 pb-4 space-y-3"
            >
              <input
                type="password"
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-gray-400 rounded-sm bg-transparent"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-gray-400 rounded-sm bg-transparent"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
              <button
                type="submit"
                disabled={isSavingPassword}
                className="cursor-pointer rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPassword ? "Saving…" : "Save password"}
              </button>
            </form>
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SettingsRow
          icon={<SunMoon className="w-5 h-5" />}
          label="Theme"
          description="Light, dark, or match system"
        >
          <ThemeToggle />
        </SettingsRow>

        <SettingsRow
          icon={<LayoutGrid className="w-5 h-5" />}
          label="Default note view"
          description="Layout used when opening the dashboard"
        >
          <div
            role="radiogroup"
            aria-label="Default note view"
            className="inline-flex items-center gap-0.5 p-1 rounded-full backdrop-blur-sm bg-white/70 dark:bg-zinc-800/60 border border-black/5 dark:border-white/10 shadow-sm"
          >
            {[
              { value: "grid", label: "Grid", icon: LayoutGrid },
              { value: "list", label: "List", icon: LayoutList },
            ].map((option) => {
              const active = notesLayout === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => setNotesLayout(option.value)}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    active
                      ? "bg-amber-500 text-white"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Notes defaults">
        <SettingsRow
          icon={<Palette className="w-5 h-5" />}
          label="Default note color"
          description="Preselected color for new notes"
        >
          <div className="flex items-center gap-1.5">
            {NOTE_COLORS.map((color) => {
              const active = defaultNoteColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                  onClick={() => setDefaultNoteColor(color)}
                  className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ${SWATCH_CLASSES[color]} ${
                    active ? "ring-2 ring-amber-500" : ""
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </SettingsRow>

        <SettingsRow
          icon={<ArrowUpDown className="w-5 h-5" />}
          label="Default sort order"
          description="Sort applied when the dashboard loads"
        >
          <select
            value={defaultSortOrder}
            onChange={(e) => setDefaultSortOrder(e.target.value)}
            className="rounded-md border border-gray-400 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsRow
          icon={<Download className="w-5 h-5" />}
          label="Export notes"
          description="Download all your notes as a file"
        >
          <button
            type="button"
            onClick={handleExport}
            className="cursor-pointer rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-amber-900 dark:hover:bg-amber-800 px-3 py-1.5 text-sm font-medium transition"
          >
            Export
          </button>
        </SettingsRow>

        <SettingsRow
          icon={<Upload className="w-5 h-5" />}
          label="Import notes"
          description="Add notes from a previously exported file"
        >
          <button
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
            className="cursor-pointer rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-amber-900 dark:hover:bg-amber-800 px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? "Importing…" : "Import"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <SettingsRow
          icon={<Trash2 className="w-5 h-5" />}
          label="Delete account"
          description="Permanently delete all your notes and folders"
          danger
        >
          <button
            type="button"
            onClick={confirmDeleteAccount}
            className="cursor-pointer rounded-lg bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-400 px-3 py-1.5 text-sm font-medium transition"
          >
            Delete
          </button>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}

export default SettingsPage;
