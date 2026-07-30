import { useEffect, useState } from "react";

import { useJDStore } from "../store/useJDStore";

import Card from "./ui/Card";

import PageHeader from "./ui/PageHeader";

import FilterChips from "./ui/FilterChips";

function CommitteesList({ onOpenVerdict }) {
  const committeesList = useJDStore((s) => s.committeesList);

  const loadCommitteesList = useJDStore((s) => s.loadCommitteesList);

  const loadCommitteeById = useJDStore((s) => s.loadCommitteeById);

  const downloadCommitteeReportById = useJDStore(
    (s) => s.downloadCommitteeReportById,
  );

  const loading = useJDStore((s) => s.committeesLoading);

  const [statusFilter, setStatusFilter] = useState([]);

  const [lobFilter, setLobFilter] = useState([]);

  useEffect(() => {
    loadCommitteesList();
  }, [loadCommitteesList]);

  const allLobs = [
    ...new Set(committeesList.map((c) => c.jdLob).filter(Boolean)),
  ];

  const allStatuses = ["RUNNING", "COMPLETED", "FAILED", "PENDING"];

  let filtered = committeesList;

  if (statusFilter.length > 0) {
    filtered = filtered.filter((c) => statusFilter.includes(c.status));
  }

  if (lobFilter.length > 0) {
    filtered = filtered.filter((c) => lobFilter.includes(c.jdLob));
  }

  const handleOpenVerdict = async (id) => {
    await loadCommitteeById(id);

    onOpenVerdict();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="JAE Committees"
        subtitle={`${committeesList.length} committees run across all JDs`}
      />

      <Card padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {allStatuses.length > 0 && (
            <FilterChips
              label="Status"
              options={allStatuses}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          )}

          {allLobs.length > 0 && (
            <FilterChips
              label="LOB"
              options={allLobs}
              selected={lobFilter}
              onChange={setLobFilter}
            />
          )}

          {(statusFilter.length > 0 || lobFilter.length > 0) && (
            <button
              onClick={() => {
                setStatusFilter([]);
                setLobFilter([]);
              }}
              className="text-sm text-abc-red font-medium hover:underline self-end"
            >
              Clear all
            </button>
          )}
        </div>
      </Card>

      {loading ? (
        <Card padding="lg">
          <div className="text-center text-neutral-500">
            Loading committees...
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⚖️</div>

            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No committees yet
            </h3>

            <p className="text-sm text-neutral-500">
              Launch a committee from any generated JD to see it here.
            </p>
          </div>
        </Card>
      ) : (
        <Card padding="sm" title={`Showing ${filtered.length}`}>
          <div className="overflow-hidden -mx-4">
            <table className="w-full">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 tracking-wider">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Date</th>

                  <th className="text-left px-6 py-3 font-medium">
                    Designation
                  </th>

                  <th className="text-left px-6 py-3 font-medium">
                    LOB / Dept
                  </th>

                  <th className="text-left px-6 py-3 font-medium">Target</th>

                  <th className="text-left px-6 py-3 font-medium">
                    Recommended
                  </th>

                  <th className="text-left px-6 py-3 font-medium">Points</th>

                  <th className="text-left px-6 py-3 font-medium">Status</th>

                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-neutral-900">
                        {c.jdDesignation || "Untitled"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="text-neutral-700">{c.jdLob || "-"}</div>

                      <div className="text-xs text-neutral-500">
                        {c.jdDepartment || ""}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="badge bg-neutral-100 text-neutral-700">
                        {c.jdBand || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="badge bg-info-light text-info-dark">
                        {c.finalVerdict?.recommendedBand || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {c.finalVerdict?.totalPoints || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === "COMPLETED" && (
                          <>
                            <button
                              onClick={() => handleOpenVerdict(c.id)}
                              className="text-abc-red hover:text-abc-red-hover text-sm font-medium"
                            >
                              View
                            </button>

                            <span className="text-neutral-300">|</span>

                            <button
                              onClick={() => downloadCommitteeReportById(c.id)}
                              className="text-info hover:opacity-80 text-sm font-medium"
                            >
                              PDF
                            </button>
                          </>
                        )}

                        {c.status !== "COMPLETED" && (
                          <span className="text-xs text-neutral-400">
                            {c.status === "RUNNING"
                              ? "In progress"
                              : c.status.toLowerCase()}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PENDING: "bg-warning-light text-warning-dark",

    RUNNING: "bg-info-light text-info-dark",

    COMPLETED: "bg-success-light text-success-dark",

    FAILED: "bg-danger-light text-danger-dark",
  };

  return (
    <span className={`badge ${map[status] || map.PENDING}`}>{status}</span>
  );
}

export default CommitteesList;
