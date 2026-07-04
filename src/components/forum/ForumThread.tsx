"use client";

import { useCallback, useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  deleted: boolean;
  user: { name: string; role: string; warned: boolean };
};

function PostCard({
  post,
  isReply,
  isAdmin,
  canParticipate,
  replies,
  expanded,
  onToggleExpand,
  onDelete,
  deletingId,
  replyOpen,
  replyValue,
  onReplyChange,
  onToggleReplyOpen,
  onReplySubmit,
  posting,
}: {
  post: Post;
  isReply: boolean;
  isAdmin: boolean;
  canParticipate: boolean;
  replies: Post[];
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  replyOpen: boolean;
  replyValue: string;
  onReplyChange: (id: string, value: string) => void;
  onToggleReplyOpen: (id: string) => void;
  onReplySubmit: (parentId: string) => void;
  posting: boolean;
}) {
  const isStaffAuthor = post.user.role === "ADMIN" || post.user.role === "MODERATOR";
  // Le nom réel de l'auteur n'est jamais affiché publiquement pour un compte
  // staff — seul son rôle l'est. L'auteur exact reste toutefois traçable
  // côté admin via le compte utilisé pour publier (userId en base).
  const displayName = isStaffAuthor ? (post.user.role === "ADMIN" ? "Administrateur" : "Modérateur") : post.user.name;

  return (
    <div className={isReply ? "ml-6 mt-3 border-l-2 border-charcoal/10 pl-4" : ""}>
      <div className="rounded-sm border border-charcoal/10 bg-white p-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className={`font-semibold ${isStaffAuthor ? "text-cmr-green" : "text-ink"}`}>{displayName}</span>
          {post.user.warned && (
            <span className="rounded-full bg-rust/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-rust">⚠ averti</span>
          )}
          <span className="font-mono text-[11px] text-charcoal/40">
            {new Date(post.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
          {isAdmin && !post.deleted && (
            <button
              onClick={() => onDelete(post.id)}
              disabled={deletingId === post.id}
              className="ml-auto text-[11px] font-semibold text-rust disabled:opacity-50"
            >
              Supprimer
            </button>
          )}
        </div>
        {post.deleted ? (
          <p className="text-sm italic text-charcoal/40">Message supprimé</p>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-charcoal/80">{post.content}</p>
        )}

        {!isReply && canParticipate && !post.deleted && (
          <button
            onClick={() => onToggleReplyOpen(post.id)}
            aria-label={`Répondre à ${displayName}`}
            title="Répondre à ce message"
            className={`mt-2 flex h-6 w-6 items-center justify-center rounded-full border text-sm ${
              replyOpen ? "border-gold bg-gold/20 text-ink" : "border-charcoal/20 text-charcoal/50"
            }`}
          >
            ↳
          </button>
        )}

        {replyOpen && (
          <div className="mt-2 flex gap-2">
            <input
              value={replyValue}
              onChange={(e) => onReplyChange(post.id, e.target.value)}
              placeholder={`Répondre à ${displayName}…`}
              className="flex-1 rounded-sm border border-charcoal/15 px-3 py-2 text-sm"
            />
            <button
              onClick={() => onReplySubmit(post.id)}
              disabled={posting}
              className="rounded-sm bg-gold px-3 py-2 text-xs font-semibold text-ink disabled:opacity-60"
            >
              Envoyer
            </button>
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div className="mt-1">
          <button onClick={() => onToggleExpand(post.id)} className="ml-6 text-xs font-semibold text-charcoal/50">
            {expanded ? "▾ Masquer les réponses" : `▸ Voir ${replies.length} réponse${replies.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ForumThread({
  topicId,
  initialPosts,
  isAdmin,
  canParticipate,
}: {
  topicId: string;
  initialPosts: Post[];
  isAdmin: boolean;
  canParticipate: boolean;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [newMessage, setNewMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openReplyFor, setOpenReplyFor] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/forum/topics/${topicId}/posts`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts ?? []);
    }
  }, [topicId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitPost = useCallback(
    async (content: string, parentId?: string) => {
      if (!content.trim()) return;
      setError(null);
      setPosting(true);

      const res = await fetch(`/api/forum/topics/${topicId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });

      setPosting(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      if (parentId) {
        setReplyDrafts((prev) => ({ ...prev, [parentId]: "" }));
        setOpenReplyFor(null);
        setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
      } else {
        setNewMessage("");
      }
      await refresh();
    },
    [topicId, refresh]
  );

  const removePost = useCallback(
    async (id: string) => {
      if (!window.confirm("Supprimer ce message ? Cette action est définitive.")) return;
      setDeletingId(id);
      await fetch(`/api/forum/posts/${id}`, { method: "DELETE" });
      setDeletingId(null);
      await refresh();
    },
    [refresh]
  );

  const handleReplyChange = useCallback((id: string, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleToggleReplyOpen = useCallback((id: string) => {
    setOpenReplyFor((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const topLevel = posts.filter((p) => !p.parentId);
  const repliesOf = (id: string) => posts.filter((p) => p.parentId === id);

  return (
    <div>
      {/* Cadre unique à défilement interne : tous les messages y restent,
          la page elle-même ne s'allonge pas indéfiniment. */}
      <div className="mb-4 max-h-[560px] space-y-1 overflow-y-auto rounded-sm border border-charcoal/10 bg-parchment2/30 p-4">
        {topLevel.length === 0 ? (
          <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">
            Aucune réponse pour le moment — sois le premier à participer.
          </p>
        ) : (
          topLevel.map((post) => (
            <div key={post.id} className="mb-3">
              <PostCard
                post={post}
                isReply={false}
                isAdmin={isAdmin}
                canParticipate={canParticipate}
                replies={repliesOf(post.id)}
                expanded={expandedReplies[post.id] ?? false}
                onToggleExpand={handleToggleExpand}
                onDelete={removePost}
                deletingId={deletingId}
                replyOpen={openReplyFor === post.id}
                replyValue={replyDrafts[post.id] ?? ""}
                onReplyChange={handleReplyChange}
                onToggleReplyOpen={handleToggleReplyOpen}
                onReplySubmit={(parentId) => submitPost(replyDrafts[parentId] ?? "", parentId)}
                posting={posting}
              />
              {(expandedReplies[post.id] ?? false) &&
                repliesOf(post.id).map((reply) => (
                  <PostCard
                    key={reply.id}
                    post={reply}
                    isReply
                    isAdmin={isAdmin}
                    canParticipate={canParticipate}
                    replies={[]}
                    expanded={false}
                    onToggleExpand={handleToggleExpand}
                    onDelete={removePost}
                    deletingId={deletingId}
                    replyOpen={false}
                    replyValue=""
                    onReplyChange={handleReplyChange}
                    onToggleReplyOpen={handleToggleReplyOpen}
                    onReplySubmit={() => {}}
                    posting={posting}
                  />
                ))}
            </div>
          ))
        )}
      </div>

      {canParticipate ? (
        <div className="space-y-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écris ta réponse…"
            rows={3}
            className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
          />
          {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
          <button
            onClick={() => submitPost(newMessage)}
            disabled={posting}
            className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {posting ? "Envoi…" : "Répondre"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-charcoal/50">Les réponses ouvriront dès que ce sujet sera validé.</p>
      )}
    </div>
  );
}
