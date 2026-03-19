import { FiCheck, FiCheckCircle } from "react-icons/fi";

export function SeenStatus({ status }) {
  if (!status) return null;

  const isSeen = status === "seen";

  return (
    <div className="px-4 pb-2 pt-0.5">
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-1 text-[11px] text-[rgb(var(--muted))]">
          {isSeen ? (
            <FiCheckCircle className="text-[rgb(var(--primary))]" />
          ) : (
            <>
              <FiCheck className="opacity-80" />
              <FiCheck className="opacity-80 -ml-2" />
            </>
          )}
          <span>{isSeen ? "Seen" : "Delivered"}</span>
        </div>
      </div>
    </div>
  );
}

