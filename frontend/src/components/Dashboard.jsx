import LobBreakdown from "./ui/LobBreakdown";

import { useEffect, useMemo, useState } from "react";

import { useJDStore } from "../store/useJDStore";

import Card from "./ui/Card";

import Button from "./ui/Button";

import PageHeader from "./ui/PageHeader";

import FilterChips from "./ui/FilterChips";

import { DonutChart } from "./ui/Chart";

function Dashboard({ onCreateNew, onOpenJd }) {
  const jdsList = useJDStore((s) => s.jdsList);

  const loadJDsList = useJDStore((s) => s.loadJDsList);

  const committeesList = useJDStore((s) => s.committeesList);

  const loadCommitteesList = useJDStore((s) => s.loadCommitteesList);

  const deleteJd = useJDStore((s) => s.deleteJd);

  const resetWizard = useJDStore((s) => s.resetWizard);

  const [lobFilter, setLobFilter] = useState([]);

  const [statusFilter, setStatusFilter] = useState([]);

  useEffect(() => {
    loadJDsList();

    loadCommitteesList();
  }, [loadJDsList, loadCommitteesList]);

  const handleCreate = () => {
    resetWizard();
    onCreateNew();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this JD? This cannot be undone.")) {
      await deleteJd(id);
    }
  };

  const allLobs = useMemo(
    () => [
      ...new Set(jdsList.map((j) => j.lob).filter((l) => l && l !== "Unknown")),
    ],

    [jdsList],
  );

  const allStatuses = ["DRAFT", "FINALIZED"];

  const filtered = useMemo(() => {
    let list = jdsList;

    if (lobFilter.length > 0)
      list = list.filter((j) => lobFilter.includes(j.lob));

    if (statusFilter.length > 0)
      list = list.filter((j) => statusFilter.includes(j.status));

    return list;
  }, [jdsList, lobFilter, statusFilter]);

  // KPIs

  const totalJds = jdsList.length;

  const drafts = jdsList.filter((j) => j.status === "DRAFT").length;

  const finalized = jdsList.filter((j) => j.status === "FINALIZED").length;

  const totalCommittees = committeesList.length;

  // Chart data

  const lobCounts = allLobs.map((lob) => ({
    label: lob.length > 6 ? lob.slice(0, 6) : lob,

    value: jdsList.filter((j) => j.lob === lob).length,

    color: lob === "AMC" ? "#8B0000" : "#0066CC",
  }));

  const statusDonut = [
    { label: "Draft", value: drafts, color: "#F59E0B" },

    { label: "Finalized", value: finalized, color: "#10B981" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Create and manage Hay-aligned Job Descriptions and JAE evaluations."
        action={
          <Button variant="primary" onClick={handleCreate} icon="＋">
            Create New JD
          </Button>
        }
      />

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total JDs"
          value={totalJds}
          accent="bg-abc-red"
          icon="📊"
        />

        <KpiCard label="Drafts" value={drafts} accent="bg-warning" icon="✏️" />

        <KpiCard
          label="Finalized"
          value={finalized}
          accent="bg-success"
          icon="✅"
        />

        <KpiCard
          label="Committees Run"
          value={totalCommittees}
          accent="bg-info"
          icon="⚖️"
        />
      </div>

      {/* Charts row */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card
          title="JDs by LOB"
          subtitle="Distribution across Lines of Business"
        >
          <LobBreakdown jdsList={jdsList} />
        </Card>

        <Card title="JD Status" subtitle="Current lifecycle distribution">
          {totalJds > 0 ? (
            <div className="flex justify-center py-4">
              <DonutChart data={statusDonut} size={180} />
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-400 text-sm">
              No JDs yet
            </div>
          )}
        </Card>
      </div>

      {/* Filters */}

      {allLobs.length > 0 && (
        <Card padding="md" className="mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <FilterChips
              label="LOB"
              options={allLobs}
              selected={lobFilter}
              onChange={setLobFilter}
            />

            <FilterChips
              label="Status"
              options={allStatuses}
              selected={statusFilter}
              onChange={setStatusFilter}
            />

            {(lobFilter.length > 0 || statusFilter.length > 0) && (
              <button
                onClick={() => {
                  setLobFilter([]);
                  setStatusFilter([]);
                }}
                className="text-sm text-abc-red font-medium hover:underline self-end"
              >
                Clear all
              </button>
            )}
          </div>
        </Card>
      )}

      {/* JD Table */}

      <Card
        title="Recent JDs"
        subtitle={`Showing ${filtered.length} of ${totalJds}`}
        padding="sm"
      >
        {filtered.length === 0 ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          <div className="overflow-hidden -mx-4">
            <table className="w-full">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 tracking-wider">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">
                    Designation
                  </th>

                  <th className="text-left px-6 py-3 font-medium">LOB</th>

                  <th className="text-left px-6 py-3 font-medium">Status</th>

                  <th className="text-left px-6 py-3 font-medium">
                    Last Updated
                  </th>

                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filtered.map((jd) => (
                  <tr
                    key={jd.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-neutral-900">
                        {jd.designation || "Untitled"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="badge bg-neutral-100 text-neutral-700">
                        {jd.lob || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={jd.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(jd.updatedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenJd(jd.id)}
                          className="text-abc-red hover:text-abc-red-hover text-sm font-medium"
                        >
                          Open
                        </button>

                        <span className="text-neutral-300">|</span>

                        <button
                          onClick={() => handleDelete(jd.id)}
                          className="text-danger hover:opacity-80 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function KpiCard({ label, value, accent, icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            {label}
          </div>

          <div className="text-3xl font-bold text-neutral-900 mt-2">
            {value}
          </div>
        </div>

        <div
          className={`w-10 h-10 rounded-lg ${accent} flex items-center justify-center text-white text-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    DRAFT: "bg-warning-light text-warning-dark",

    FINALIZED: "bg-success-light text-success-dark",
  };

  return <span className={`badge ${map[status] || map.DRAFT}`}>{status}</span>;
}

function EmptyState({ onCreate }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-5xl mb-4">📝</div>

      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        No JDs match filters
      </h3>

      <p className="text-sm text-neutral-500 mb-6">
        Try adjusting filters, or create a new JD to get started.
      </p>

      <Button variant="primary" onClick={onCreate} icon="＋">
        Create New JD
      </Button>
    </div>
  );
}

export default Dashboard;
