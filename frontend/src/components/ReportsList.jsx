import { useEffect } from "react";

import { useJDStore } from "../store/useJDStore";

import Card from "./ui/Card";

import PageHeader from "./ui/PageHeader";

function ReportsList() {
  const committeesList = useJDStore((s) => s.committeesList);

  const loadCommitteesList = useJDStore((s) => s.loadCommitteesList);

  const downloadCommitteeReportById = useJDStore(
    (s) => s.downloadCommitteeReportById,
  );

  useEffect(() => {
    loadCommitteesList();
  }, [loadCommitteesList]);

  const completed = committeesList.filter((c) => c.status === "COMPLETED");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Reports"
        subtitle="Downloadable PDF reports from completed JAE committees"
      />

      {completed.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📄</div>

            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No reports yet
            </h3>

            <p className="text-sm text-neutral-500">
              Reports appear here once JAE committees complete evaluation.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completed.map((c) => (
            <Card
              key={c.id}
              padding="md"
              className="hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-abc-red flex items-center justify-center text-white">
                  📄
                </div>

                <span className="text-xs text-neutral-500">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h4 className="font-semibold text-neutral-900 mb-1 truncate">
                {c.jdDesignation || "Untitled Role"}
              </h4>

              <div className="text-xs text-neutral-500 mb-4">
                {c.jdLob || "-"} · {c.jdDepartment || "-"}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-neutral-500">Recommended</div>

                  <div className="text-lg font-bold text-abc-red">
                    {c.finalVerdict?.recommendedBand || "-"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-500">Hay Points</div>

                  <div className="text-lg font-bold text-info">
                    {c.finalVerdict?.totalPoints || "-"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => downloadCommitteeReportById(c.id)}
                className="w-full btn-primary text-sm py-2"
              >
                📄 Download PDF
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportsList;
