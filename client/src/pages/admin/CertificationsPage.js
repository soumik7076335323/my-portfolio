import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAPI, extractError } from "../../services/api";
import {
  AdminCard,
  ConfirmDelete,
  Field,
  Spinner,
  useToast,
} from "../../components/admin/kit";
import { EditIcon } from "../../components/Icons";

const BLANK = { name: "", issuer: "", year: "", url: "" };

export default function CertificationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const load = () =>
    adminAPI.crud
      .list("certifications", token)
      .then((res) => setItems(res.data.data))
      .catch((err) =>
        toast.show(extractError(err, "Could not load certifications."), "err"),
      );

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.show("Certification name is required.", "err");
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await adminAPI.crud.update("certifications", token, editingId, form);
        toast.show("Certification updated.");
      } else {
        await adminAPI.crud.create("certifications", token, form);
        toast.show("Certification added.");
      }
      setForm(BLANK);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.show(extractError(err, "Could not save."), "err");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    try {
      await adminAPI.crud.remove("certifications", token, id);
      toast.show("Certification deleted.");
      await load();
    } catch (err) {
      toast.show(extractError(err, "Could not delete."), "err");
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <AdminCard
        title={editingId ? "Edit certification" : "Add certification"}
        hint="Issuer, year and URL are optional — leave them blank if the resume doesn't specify them."
      >
        <form className="admin-form" onSubmit={submit}>
          <div className="grid-2">
            <Field label="Certification name" required>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={160}
              />
            </Field>
            <Field label="Issuer (if known)">
              <input
                className="input"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                maxLength={120}
              />
            </Field>
          </div>
          <div className="grid-2">
            <Field label="Year (if known)">
              <input
                className="input"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2023"
                maxLength={10}
              />
            </Field>
            <Field label="Certificate URL (if available)">
              <input
                className="input"
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://…"
              />
            </Field>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className={`btn btn-primary btn-sm ${busy ? "loading" : ""}`}
              disabled={busy}
            >
              {busy && <span className="spinner" aria-hidden="true" />}
              {editingId ? "Save changes" : "+ Add certification"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditingId(null);
                  setForm(BLANK);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Certifications (${items.length})`}>
        {items.length === 0 ? (
          <div className="empty-state">
            <p>No certifications yet.</p>
          </div>
        ) : (
          <div className="list-rows">
            {items.map((it) => (
              <div className="list-row" key={it._id}>
                <div className="grow">
                  <div className="title">{it.name}</div>
                  <div className="meta">
                    {[it.issuer, it.year].filter(Boolean).join(" · ") ||
                      "no issuer/year on record"}
                  </div>
                </div>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setEditingId(it._id);
                      setForm({
                        name: it.name,
                        issuer: it.issuer || "",
                        year: it.year || "",
                        url: it.url || "",
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <EditIcon size={13} /> Edit
                  </button>
                  <ConfirmDelete onConfirm={() => remove(it._id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      {toast.node}
    </>
  );
}
