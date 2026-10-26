import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import Avatar from "../components/Avatar.jsx";
import Icon from "../components/Icon.jsx";
import { TEAM, IMG } from "../data/index.js";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "👍",
  "🙏",
  "🎉",
  "🏗️",
  "🔨",
  "📐",
  "🏠",
  "✅",
  "🤝",
];
const ME = { name: "Safora Mirzaee", photo: null };
const now = Date.now();

const topicFor = [
  "Slab pour schedule",
  "Facade glazing samples",
  "Floor plan v3 — approved?",
  "Kitchen layout options",
  "Rendering ready for review",
  "Site safety checklist",
];
const INITIAL = TEAM.map((t, i) => ({
  id: t.id,
  name: t.name,
  role: t.role,
  photo: t.photo,
  messages: [
    {
      id: i + 1,
      from: "them",
      text: topicFor[i],
      time: now - 60000 * (i + 1) * 7,
    },
  ],
}));

const REPLIES = [
  "Thanks — I'll check the drawings and get back to you shortly.",
  "Noted. I've added it to the site schedule for this week.",
  "Great, that works for the project timeline.",
  "Can you share the latest revision? I'll review it on site tomorrow.",
];

const fmt = (ms) =>
  new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
const preview = (c) => {
  const m = c.messages[c.messages.length - 1];
  return !m ? "No messages yet" : m.image ? "📷 Photo" : m.text;
};

function CallRoom({ mode, onClose, invite }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(mode === "video");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("Connecting to the room…");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("This browser cannot access a camera or microphone.");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: mode === "video",
        });
        if (!alive) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("Room ready — waiting for the other participant.");
      } catch (e) {
        setError(e.message || "Unable to start the call.");
        setStatus("Could not connect");
      }
    })();
    return () => {
      alive = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [mode]);

  const toggleMute = () => {
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
  };
  const toggleCam = () => {
    const next = !camera;
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamera(next);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(invite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError("Could not copy the invite link.");
    }
  };

  return (
    <div
      className="call-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-title"
    >
      <div className="call-card">
        <header>
          <div>
            <h2 id="call-title">
              {mode === "audio" ? "Voice call" : "Site video call"}
            </h2>
            <p>{status}</p>
          </div>
          <button
            className="icon-btn"
            aria-label="Close call"
            onClick={onClose}
          >
            <Icon name="x" />
          </button>
        </header>
        <div className="call-stage">
          {mode === "video" && camera ? (
            <video ref={videoRef} autoPlay playsInline muted />
          ) : (
            <div className="call-audio">
              <Icon name={mode === "video" ? "video" : "phone"} size={42} />
            </div>
          )}
        </div>
        <div className="call-invite">
          <input readOnly value={invite} aria-label="Invite link" />
          <button className="btn-ghost" onClick={copy}>
            {copied ? "Copied" : "Copy invite"}
          </button>
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <div className="call-controls">
          <button
            className={`round${muted ? " off" : ""}`}
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? "Turn microphone on" : "Mute microphone"}
          >
            <Icon name="mic" />
          </button>
          {mode === "video" && (
            <button
              className={`round${camera ? "" : " off"}`}
              onClick={toggleCam}
              aria-label="Toggle camera"
            >
              <Icon name="video" />
            </button>
          )}
          <button className="round end" onClick={onClose} aria-label="End call">
            <Icon name="phone" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const [contacts, setContacts] = useState(INITIAL);
  const [contactQuery, setContactQuery] = useState("");
  const [recipient, setRecipient] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [params, setParams] = useSearchParams();
  const callId = params.get("call");
  const callMode = params.get("mode") === "audio" ? "audio" : "video";
  const endRef = useRef(null);
  const fileRef = useRef(null);

  const active = contacts.find((c) => c.id === activeId) || null;
  const filtered = useMemo(
    () =>
      contacts.filter((c) =>
        c.name.toLowerCase().includes(contactQuery.trim().toLowerCase()),
      ),
    [contacts, contactQuery],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [active?.messages.length, activeId]);

  const push = useCallback(
    (id, msg) =>
      setContacts((cs) =>
        cs.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: Date.now() + Math.random(), time: Date.now(), ...msg },
                ],
              }
            : c,
        ),
      ),
    [],
  );

  const send = (e) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    push(active.id, { from: "me", text });
    setDraft("");
    setShowEmoji(false);
    const id = active.id;
    setTimeout(
      () =>
        push(id, {
          from: "them",
          text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
        }),
      1200,
    );
  };

  const findRecipient = () => {
    const q = recipient.trim().toLowerCase();
    if (!q) return;
    const hit = contacts.find((c) => c.name.toLowerCase().includes(q));
    if (hit) {
      setActiveId(hit.id);
      setRecipient("");
    }
  };

  const attach = (e) => {
    const f = e.target.files?.[0];
    if (!f || !active) return;
    push(active.id, { from: "me", text: "", image: URL.createObjectURL(f) });
    e.target.value = "";
  };

  const startCall = (mode) => {
    if (!window.crypto?.randomUUID) return;
    setParams({ call: window.crypto.randomUUID(), mode });
  };
  const invite = callId
    ? `${window.location.origin}/chat?call=${callId}&mode=${callMode}`
    : "";

  return (
    <AppShell crumb="Chat" title="Chat">
      <div className="page chat-wrap">
        <main className="chat-page">
          <aside className="chat-contacts">
            <div className="chat-me">
              <Avatar name={ME.name} size={44} />
              <div>
                <strong>{ME.name}</strong>
                <span className="online">● online</span>
              </div>
            </div>
            <label className="chat-search">
              <Icon name="search" size={16} />
              <input
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
                placeholder="Search team & clients"
                aria-label="Search contacts"
              />
            </label>
            <ul>
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`contact${c.id === activeId ? " active" : ""}`}
                    onClick={() => setActiveId(c.id)}
                  >
                    <Avatar src={c.photo} name={c.name} size={44} />
                    <span className="contact-text">
                      <strong>{c.name}</strong>
                      <small>{preview(c)}</small>
                    </span>
                  </button>
                </li>
              ))}
              {!filtered.length && (
                <p className="empty-state">No contacts found.</p>
              )}
            </ul>
          </aside>

          <section className="chat-thread">
            <div className="chat-toolbar">
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && findRecipient()}
                placeholder="To: Recipients"
                aria-label="Recipients"
              />
              <button
                className="icon-btn"
                aria-label="Find recipient"
                onClick={findRecipient}
              >
                <Icon name="search" />
              </button>
              <button
                className="icon-btn"
                aria-label="Start voice call"
                title="Start voice call"
                disabled={!active || !!callId}
                onClick={() => startCall("audio")}
              >
                <Icon name="phone" />
              </button>
              <button
                className="icon-btn"
                aria-label="Start video call"
                title="Start site video call"
                disabled={!active || !!callId}
                onClick={() => startCall("video")}
              >
                <Icon name="video" />
              </button>
            </div>

            <div className="chat-messages">
              {active ? (
                <>
                  <div className="chat-with">
                    <Avatar src={active.photo} name={active.name} size={36} />
                    <div>
                      <strong>{active.name}</strong>
                      <small>{active.role}</small>
                    </div>
                  </div>
                  {active.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`bubble ${m.from === "me" ? "mine" : "theirs"}`}
                    >
                      {m.image ? (
                        <img src={m.image} alt="Attachment" />
                      ) : (
                        <p>{m.text}</p>
                      )}
                      <time>{fmt(m.time)}</time>
                    </div>
                  ))}
                  <div ref={endRef} />
                </>
              ) : (
                <div className="chat-empty">
                  <img src={IMG.logo} alt="" />
                  <h3>Select a conversation</h3>
                  <p>
                    Pick a team member or client on the left to discuss
                    drawings, site progress and approvals.
                  </p>
                </div>
              )}
            </div>

            <form className="chat-compose" onSubmit={send}>
              {showEmoji && (
                <div className="emoji-pop" aria-label="Emoji picker">
                  {EMOJIS.map((e) => (
                    <button
                      type="button"
                      key={e}
                      onClick={() => setDraft((d) => d + e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="icon-btn"
                aria-label="Emoji"
                onClick={() => setShowEmoji((s) => !s)}
              >
                <Icon name="smile" />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  active ? "Enter message" : "Select a contact to start"
                }
                disabled={!active}
                aria-label="Message"
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={attach}
              />
              <button
                type="button"
                className="icon-btn"
                aria-label="Attach site photo"
                disabled={!active}
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="image" />
              </button>
              <button
                type="submit"
                className="btn-gold send"
                aria-label="Send"
                disabled={!active || !draft.trim()}
              >
                <Icon name="send" size={18} />
              </button>
            </form>
          </section>
        </main>
      </div>
      {callId && (
        <CallRoom
          mode={callMode}
          invite={invite}
          onClose={() => setParams({})}
        />
      )}
      <SiteFooter />
    </AppShell>
  );
}
