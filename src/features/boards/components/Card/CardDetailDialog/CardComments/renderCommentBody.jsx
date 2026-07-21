export function renderCommentBody(text, mentions = [], replyTo) {
  const parts = [];
  let remaining = text || "";
  let key = 0;

  if (replyTo?.full_name) {
    parts.push(
      <span
        key={`reply-${key++}`}
        className="text-primary font-medium bg-primary/10 rounded px-1 mr-1"
      >
        @{replyTo.full_name}
      </span>
    );
  }

  const mentionNames = (mentions || [])
    .map((m) => m?.full_name)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (mentionNames.length === 0) {
    parts.push(remaining);
    return parts;
  }

  const pattern = new RegExp(
    `(@(?:${mentionNames
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")}))`,
    "gi"
  );

  const nameSet = new Set(mentionNames.map((n) => n.toLowerCase()));

  remaining.split(pattern).forEach((chunk) => {
    if (!chunk) return;
    if (chunk.startsWith("@") && nameSet.has(chunk.slice(1).toLowerCase())) {
      parts.push(
        <span
          key={`m-${key++}`}
          className="text-primary font-medium bg-primary/10 rounded px-1"
        >
          {chunk}
        </span>
      );
    } else {
      parts.push(<span key={`t-${key++}`}>{chunk}</span>);
    }
  });

  return parts;
}
