const skeletonStyle = {
  background: "linear-gradient(90deg, #1C1C1C 25%, #252525 50%, #1C1C1C 75%)",
  backgroundSize: "200% 100%",
  animation: "skeleton-shimmer 1.5s infinite",
  borderRadius: "4px",
};

export function PostSkeleton() {
  return (
    <div style={{
      backgroundColor: "#141414",
      border: "1px solid #232323",
      borderRadius: "12px",
      padding: "20px",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{ ...skeletonStyle, height: "20px", width: "80px" }} />
        <div style={{ ...skeletonStyle, height: "16px", width: "96px" }} />
        <div style={{ ...skeletonStyle, height: "16px", width: "48px", marginLeft: "auto" }} />
      </div>
      {/* Content lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        <div style={{ ...skeletonStyle, height: "16px", width: "100%" }} />
        <div style={{ ...skeletonStyle, height: "16px", width: "83%" }} />
        <div style={{ ...skeletonStyle, height: "16px", width: "67%" }} />
      </div>
      {/* Identity */}
      <div style={{ ...skeletonStyle, height: "12px", width: "112px", marginBottom: "16px" }} />
      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid rgba(35,35,35,0.6)" }}>
        <div style={{ ...skeletonStyle, height: "32px", width: "64px", borderRadius: "8px" }} />
        <div style={{ ...skeletonStyle, height: "32px", width: "64px", borderRadius: "8px" }} />
        <div style={{ ...skeletonStyle, height: "32px", width: "64px", borderRadius: "8px" }} />
      </div>

      <style>{`
        @keyframes skeleton-shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
    </div>
  );
}
