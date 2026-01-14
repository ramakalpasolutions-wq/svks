"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "/api/event-photos";
const SIGNATURE_API = "/api/upload-signature";

export default function AdminPage() {
  const router = useRouter();

  // main form state
  const [eventName, setEventName] = useState("");
  const [files, setFiles] = useState([]);
  const [singleFile, setSingleFile] = useState(null);

  // galleries
  const [gallery, setGallery] = useState({});
  const [selectedEvent, setSelectedEvent] = useState("");
  const [heroGallery, setHeroGallery] = useState([]);

  // UI state
  const [useExisting, setUseExisting] = useState(true);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  // hero card state
  const [heroFiles, setHeroFiles] = useState([]);
  const [heroUploading, setHeroUploading] = useState(false);

  // YouTube input
  const [youtubeUrls, setYoutubeUrls] = useState("");

  // YouTube edit state
  const [editingYoutube, setEditingYoutube] = useState(null);
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");

  // Allowed extensions
  const allowedExts = [".webp", ".jpg", ".jpeg", ".png"];

  function isValidImageFile(file) {
    if (!file) return false;
    if (file.type && !file.type.startsWith("image/")) return false;
    const name = (file.name || "").toLowerCase();
    if (allowedExts.length === 0) return true;
    return allowedExts.some(ext => name.endsWith(ext));
  }

  const HERO_KEYS = new Set(["home_slider", "home-slider", "homeSlider"]);

  // Auth check
  useEffect(() => {
    const logged = localStorage.getItem("isAdmin");
    if (!logged) router.push("/admin-login");
  }, [router]);

  // Helpers
  function getImgUrl(img) {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.original || img.optimized || img.thumb || img.url || "";
  }

  function safeSrc(img) {
    const s = getImgUrl(img);
    return s && s.trim() !== "" ? s : null;
  }

  function getHeroUrlSet(heroArr) {
    return new Set((heroArr || []).map(getImgUrl).filter(Boolean));
  }

  function isYoutubeFolder(ev) {
    const items = gallery[ev];
    return Array.isArray(items) && items.length > 0 && items[0]?.youtube === true;
  }

  // Load gallery
  async function loadGallery() {
    try {
      const res = await fetch(API);
      const text = await res.text().catch(() => "");
      let body = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch (e) {
        setGallery({});
        setHeroGallery([]);
        setSelectedEvent("");
        setStatus("Error loading gallery: invalid server response");
        return;
      }

      if (!res.ok) {
        const errMsg = body?.error || `Failed to load gallery (status ${res.status})`;
        throw new Error(errMsg);
      }

      const galleryFromBody = body.gallery ?? body;
      const sliderFromBody = body.slider ?? body.home_slider ?? body.homeSlider ?? [];

      const finalGallery = galleryFromBody.gallery ?? galleryFromBody;

      setGallery(finalGallery || {});
      setHeroGallery(Array.isArray(sliderFromBody) ? sliderFromBody : []);
      setSelectedEvent("");
      setStatus("");
    } catch (err) {
      console.error("loadGallery error:", err);
      setGallery({});
      setHeroGallery([]);
      setSelectedEvent("");
      setStatus("Error loading gallery: " + (err.message || String(err)));
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  const heroUrlSet = getHeroUrlSet(heroGallery);
  const events = Object.keys(gallery).filter(k => !HERO_KEYS.has(k)).sort((a, b) => a.localeCompare(b));

  const safeCount = (ev) => {
    const list = gallery[ev] || [];
    return list.filter((img) => !heroUrlSet.has(getImgUrl(img))).length;
  };

  // Upload to Cloudinary with signature
  async function uploadToCloudinary(file, folder) {
    const sigRes = await fetch(`${SIGNATURE_API}?folder=${encodeURIComponent(folder)}`);
    if (!sigRes.ok) throw new Error("Failed to get upload signature");
    const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
    return await uploadRes.json();
  }

  // Create folder
  async function createFolder() {
    const name = (eventName || "").trim();
    if (!name) return alert("Enter a new event name to create a folder.");
    setStatus("Creating folder...");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createEvent: true, eventName: name }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to create folder");
      setGallery(body.gallery || {});
      setSelectedEvent(name);
      setEventName("");
      setStatus("Folder created");
    } catch (err) {
      setStatus("Error creating folder: " + (err.message || String(err)));
    }
  }

  // Upload images to event - UPDATED to prevent mixing
  async function handleFilesUpload(e) {
    e?.preventDefault?.();
    const target = useExisting ? selectedEvent : eventName;
    if (!target) return alert("Please choose or enter an event name.");
    
    // CHECK IF FOLDER IS YOUTUBE FOLDER
    if (gallery[target] && isYoutubeFolder(target)) {
      return alert(`Folder "${target.replace(/_/g, " ")}" contains YouTube videos. Images cannot be added to YouTube folders. Please create a new folder for images.`);
    }

    const toUpload = singleFile ? [singleFile] : files;
    if (!toUpload || toUpload.length === 0) return alert("Pick one or more images to upload.");

    const valid = toUpload.filter(isValidImageFile);
    const invalidCount = toUpload.length - valid.length;
    if (invalidCount > 0) {
      setStatus(`Rejected ${invalidCount} file(s). Allowed: ${allowedExts.join(", ")}`);
    }
    if (valid.length === 0) return alert("No valid image files to upload.");

    setUploading(true);
    setStatus("Uploading to Cloudinary...");
    
    try {
      const uploaded = [];
      
      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        setStatus(`Uploading ${i + 1}/${valid.length}...`);
        const result = await uploadToCloudinary(file, `events/${target}`);
        uploaded.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          uploaded, 
          eventName: target, 
          hero: false 
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to register images");

      setGallery(body.gallery || {});
      setHeroGallery(body.slider || []);
      setSelectedEvent(target);
      setFiles([]);
      setSingleFile(null);
      setEventName("");
      setStatus("Upload complete!");
    } catch (err) {
      setStatus("Error: " + (err.message || String(err)));
    } finally {
      setUploading(false);
    }
  }

  // Rename event
  async function renameEvent() {
    if (!selectedEvent) return alert("Select an event to rename.");
    const current = selectedEvent;
    const suggested = current.replace(/_/g, " ");
    const newNameRaw = prompt(`Rename event "${suggested}" to:`, suggested);
    if (!newNameRaw) return;
    const newName = newNameRaw.trim();
    if (!newName) return alert("Please provide a non-empty name.");
    const newKey = newName.replace(/\s+/g, "_");

    setStatus("Renaming event...");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renameEvent: true, oldName: current, newName: newKey }),
      });
      const body = await res.json();

      if (!res.ok) throw new Error(body.error || "Server refused rename");
      setGallery(body.gallery || {});
      setSelectedEvent(newKey);
      setStatus("Renamed successfully");
    } catch (err) {
      setStatus("Error renaming: " + (err.message || String(err)));
    }
  }

  // Delete event
  async function handleDeleteEvent(ev) {
    if (!ev) return alert("Select an event to delete.");
    if (HERO_KEYS.has(ev)) {
      return alert("Cannot delete the home slider here.");
    }
    if (!confirm(`Delete entire event '${ev}' and all its photos? This is irreversible.`)) return;
    setStatus("Deleting event...");
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: ev, deleteEvent: true, hero: false }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Delete failed");
      setGallery(body.gallery || {});
      setHeroGallery(body.slider || []);
      setSelectedEvent("");
      setStatus(`Deleted ${ev}`);
    } catch (err) {
      setStatus("Error: " + (err.message || String(err)));
    }
  }

  // Delete single image
  async function deleteImageFromServer(event, url, opts = { hero: false }) {
    let targetUrl = (typeof url === "string" && url.trim()) ? url : null;

    if (!targetUrl && event && gallery[event] && Array.isArray(gallery[event])) {
      for (const it of gallery[event]) {
        const u = getImgUrl(it);
        if (u) {
          targetUrl = u;
          break;
        }
      }
    }

    if (!targetUrl && opts.hero) {
      for (const it of heroGallery || []) {
        const u = getImgUrl(it);
        if (u) {
          targetUrl = u;
          break;
        }
      }
    }

    if (!targetUrl) {
      return alert("No image URL provided to delete.");
    }

    if (!confirm("Remove this image / link?")) return;

    setStatus("Removing...");
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: opts.hero ? "home_slider" : event, url: targetUrl, hero: !!opts.hero }),
      });

      const text = await res.text().catch(() => "");
      let body;
      try {
        body = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Invalid server response");
      }

      if (!res.ok) throw new Error(body?.error || `Delete failed (status ${res.status})`);

      setGallery(body.gallery || {});
      setHeroGallery(body.slider || []);
      setStatus("Removed");
    } catch (err) {
      setStatus("Error: " + (err.message || String(err)));
    }
  }

  // Hero upload
  async function handleHeroUpload() {
    if (!heroFiles || heroFiles.length === 0) return alert("Select hero images first.");
    const validHero = heroFiles.filter(isValidImageFile);
    if (validHero.length === 0) return alert("No valid hero image files to upload.");
    
    setHeroUploading(true);
    setStatus("Uploading hero images to Cloudinary...");
    
    try {
      const uploaded = [];
      
      for (let i = 0; i < validHero.length; i++) {
        const file = validHero[i];
        setStatus(`Uploading hero ${i + 1}/${validHero.length}...`);
        const result = await uploadToCloudinary(file, "hero_slider");
        uploaded.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploaded, hero: true }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Hero upload failed");
      
      setGallery(body.gallery || {});
      setHeroGallery(body.slider || []);
      setHeroFiles([]);
      setStatus("Hero uploaded successfully");
    } catch (err) {
      setStatus("Error: " + (err.message || String(err)));
    } finally {
      setHeroUploading(false);
    }
  }

  function onHeroFilesChange(e) {
    const list = Array.from(e.target.files || []);
    const valid = list.filter(isValidImageFile);
    setHeroFiles(valid);
  }

  function onSingleFileChange(e) {
    const f = e.target.files?.[0] || null;
    if (!f || !isValidImageFile(f)) {
      setSingleFile(null);
      return;
    }
    setSingleFile(f);
  }

  function onMultipleFilesChange(e) {
    const list = Array.from(e.target.files || []);
    const valid = list.filter(isValidImageFile);
    setFiles(valid);
  }

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    router.push("/admin-login");
  }

  function handleResetForm() {
    setFiles([]);
    setSingleFile(null);
    setStatus("");
  }

  // Add YouTube folder - UPDATED to prevent mixing
  async function addYoutubeFolder() {
    const nameRaw = (eventName || selectedEvent || "youtube").trim();
    if (!nameRaw) return alert("Provide a folder name or select an event.");
    const en = nameRaw;

    // CHECK IF FOLDER EXISTS AND HAS IMAGES
    if (gallery[en] && gallery[en].length > 0) {
      const hasImages = !isYoutubeFolder(en);
      if (hasImages) {
        return alert(`Folder "${en.replace(/_/g, " ")}" already contains images. YouTube links cannot be added to image folders. Please create a new folder for YouTube videos.`);
      }
    }

    const rawInput = (youtubeUrls || "").trim();
    let urls = [];
    if (rawInput) {
      urls = rawInput.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    }

    if (urls.length === 0) {
      const single = (prompt("Paste the YouTube URL:") || "").trim();
      if (!single) return alert("No URL provided.");
      urls = [single];
    }

    setStatus(`Adding ${urls.length} YouTube link${urls.length !== 1 ? "s" : ""}...`);

    const failures = [];
    let lastBody = null;

    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addYoutube: true, eventName: en, url: u }),
        });

        const text = await res.text().catch(() => "");
        let body;
        try {
          body = text ? JSON.parse(text) : {};
        } catch (e) {
          throw new Error("Invalid server response");
        }

        if (!res.ok) throw new Error(body?.error || `Failed to add URL`);

        lastBody = body;
        setStatus(`Added ${i + 1}/${urls.length}`);
      } catch (err) {
        failures.push({ url: u, message: err.message || String(err) });
      }
    }

    if (lastBody) {
      setGallery(lastBody.gallery || {});
      setHeroGallery(lastBody.slider || []);
    } else {
      await loadGallery();
    }

    if (failures.length === 0) {
      setStatus("YouTube link(s) added");
      setEventName("");
      setYoutubeUrls("");
    } else {
      setStatus(`Added ${urls.length - failures.length}/${urls.length}`);
    }
  }

  // Edit YouTube URL
  function startEditYoutube(folder, index, currentUrl) {
    setEditingYoutube({ folder, index, url: currentUrl });
    setEditYoutubeUrl(currentUrl);
  }

  async function saveYoutubeEdit() {
    if (!editingYoutube) return;
    
    const { folder, index } = editingYoutube;
    const newUrl = editYoutubeUrl.trim();
    
    if (!newUrl) return alert("URL cannot be empty");

    setStatus("Updating YouTube link...");

    try {
      const oldUrl = gallery[folder][index]?.url;
      if (oldUrl) {
        await fetch(API, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventName: folder, url: oldUrl, hero: false }),
        });
      }

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addYoutube: true, eventName: folder, url: newUrl }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to update");

      setGallery(body.gallery || {});
      setHeroGallery(body.slider || []);
      setEditingYoutube(null);
      setEditYoutubeUrl("");
      setStatus("YouTube link updated");
    } catch (err) {
      setStatus("Error: " + (err.message || String(err)));
    }
  }

  function cancelYoutubeEdit() {
    setEditingYoutube(null);
    setEditYoutubeUrl("");
  }

  // YouTube helpers
  function parseYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
      return null;
    } catch (e) {
      const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{6,})/);
      return m ? m[1] : null;
    }
  }

  function youtubeThumbUrl(url) {
    const id = parseYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  function youTubeEmbedSrc(url) {
    const id = parseYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  const youtubeFolders = Object.entries(gallery).filter(
    ([k, items]) => Array.isArray(items) && items.length > 0 && items[0]?.youtube === true
  );

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-[#1a0a0a] via-[#4a1515] to-[#1a0a0a] text-white">
      <div className="max-w-8xl mx-auto bg-gradient-to-br from-[#2a0e0e] via-[#4a1f1f] to-[#2a0e0e] border-2 border-yellow-600/40 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Event Photos — Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-700 text-white rounded-xl hover:bg-red-800 transition-colors shadow-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left - Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-black/40 to-black/20 p-6 rounded-xl border-2 border-yellow-600/30 shadow-xl">
              <p className="text-md text-yellow-200/80 mb-4">
                Choose or create an event and upload photos. Images are uploaded directly to Cloudinary.
              </p>

              <form onSubmit={handleFilesUpload} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="inline-flex items-center gap-2 text-2xl cursor-pointer">
                    <input type="radio" checked={useExisting} onChange={() => setUseExisting(true)} className="text-yellow-500" />
                    <span>Use Existing</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-2xl cursor-pointer">
                    <input type="radio" checked={!useExisting} onChange={() => setUseExisting(false)} className="text-yellow-500" />
                    <span>Create New</span>
                  </label>
                </div>

                {useExisting ? (
                  <div>
                    <label className="block text-md mb-1 text-yellow-300 font-bold">Existing Event</label>
                    <select 
                      value={selectedEvent} 
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full p-3 bg-black/50 text-white rounded-xl border-2 border-yellow-600/40 focus:border-yellow-500 focus:outline-none"
                    >
                      <option value="">-- Select Event --</option>
                      {events.map(ev => (
                        <option key={ev} value={ev}>
                          {ev.replace(/_/g, " ")} ({safeCount(ev)} {isYoutubeFolder(ev) ? "videos" : "images"})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-md mb-1 text-yellow-300 font-semibold">New Event Name</label>
                    <input 
                      value={eventName} 
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full p-3 bg-black/50 text-white text-2xl rounded-xl border-2 border-yellow-600/40 focus:border-yellow-500 focus:outline-none"
                      placeholder="e.g. Festival_2025"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-md mb-1 text-yellow-300 font-bold">Single Image (optional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={onSingleFileChange}
                    className="w-full p-2 bg-black/50 text-white rounded-xl border-2 border-yellow-600/40 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-black file:font-semibold hover:file:bg-yellow-500"
                  />
                </div>

                <div className="text-center font-bold text-yellow-400">OR</div>

                <div>
                  <label className="block text-md mb-1  text-yellow-300 font-semibold">Multiple Images</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={onMultipleFilesChange}
                    className="w-full p-2 bg-black/50 text-white rounded-xl border-2 border-yellow-600/40 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-black file:font-semibold hover:file:bg-yellow-500"
                  />
                  <p className="text-sm mt-1 text-yellow-200">{files.length} file(s) selected</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button" 
                    onClick={handleFilesUpload}
                    disabled={uploading}
                    className="px-6 py-3 text-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Upload Event Photos"}
                  </button>

                  <button 
                    type="button" 
                    onClick={renameEvent}
                    className="px-6 py-3 border-2 text-2xl border-yellow-600/40 rounded-xl hover:bg-black/30 transition-colors"
                  >
                    Rename Event
                  </button>

                  <button 
                    type="button" 
                    onClick={handleResetForm}
                    className="px-6 py-3 text-2xl bg-black/50 rounded-xl hover:bg-black/70 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>

              {status && (
                <div className="mt-3 text-sm text-yellow-300 bg-black/30 p-3 rounded-lg border border-yellow-600/30">
                  {status}
                </div>
              )}
            </div>
          </div>

          {/* Right - Events List */}
          <aside className="bg-gradient-to-br from-black/40 to-black/20 p-4 rounded-xl border-2 border-yellow-600/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-300">Events Folders</h3>
              <button
                onClick={() => {
                  if (!selectedEvent) return alert("Select an event to delete");
                  handleDeleteEvent(selectedEvent);
                }}
                className="text-sm text-red-400 px-3 py-1 border border-red-400 rounded-lg hover:bg-red-400/20 transition-colors"
              >
                Delete
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-auto pr-2 custom-scrollbar">
              {events.length === 0 && (
                <div className="text-sm text-yellow-200/60 text-center py-8">No events yet</div>
              )}

              {events.map(ev => {
                const isYoutube = isYoutubeFolder(ev);
                return (
                  <div 
                    key={ev}
                    className={`p-3 rounded-xl cursor-pointer border-2 transition-all ${
                      selectedEvent === ev 
                        ? "bg-yellow-600/20 border-yellow-400 shadow-lg" 
                        : "border-yellow-600/20 hover:bg-black/30 hover:border-yellow-600/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div onClick={() => setSelectedEvent(ev)} className="flex-1">
                        <div className="font-semibold text-yellow-200 flex items-center gap-2">
                          {ev.replace(/_/g, " ")}
                          {isYoutube && (
                            <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded-full font-bold">
                              YouTube
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-yellow-300/60 mt-1">
                          {safeCount(ev)} {isYoutube ? "videos" : "images"}
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedEvent(ev)}
                        className="text-xs px-3 py-1 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        
        </div>
          <section className="mt-8">
          <h3 className="text-2xl font-bold text-yellow-300 mb-4">
            Gallery {selectedEvent && `— ${selectedEvent.replace(/_/g, " ")}`}
          </h3>
          
          {!selectedEvent && (
            <p className="text-sm text-yellow-200/70 text-center py-8 bg-black/20 rounded-xl border border-yellow-600/20">
              Select a folder from the right sidebar to view its content.
            </p>
          )}

          {selectedEvent && (
            <>
              {isYoutubeFolder(selectedEvent) ? (
                <div className="mt-4 space-y-4">
                  <div className="text-sm text-yellow-200/80 mb-2 bg-red-900/20 p-3 rounded-lg border border-red-600/30">
                    📺 YouTube Folder - Videos displayed below
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(gallery[selectedEvent] || []).map((item, i) => {
                      const url = item?.url || "";
                      const embed = youTubeEmbedSrc(url);
                      const title = item?.title || `Video ${i + 1}`;
                      const isEditing = editingYoutube?.folder === selectedEvent && editingYoutube?.index === i;

                      return (
                        <div key={i} className="bg-gradient-to-br from-black/40 to-black/20 border-2 border-yellow-600/30 rounded-xl overflow-hidden p-3 shadow-lg">
                          <div className="font-medium mb-2 text-yellow-200">{title}</div>
                          
                          {isEditing ? (
                            <div className="space-y-2 mb-2">
                              <input
                                type="text"
                                value={editYoutubeUrl}
                                onChange={(e) => setEditYoutubeUrl(e.target.value)}
                                className="w-full p-2 bg-black/50 text-white rounded border-2 border-yellow-600/40 focus:border-yellow-500 focus:outline-none"
                                placeholder="YouTube URL"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={saveYoutubeEdit}
                                  className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-500 transition-colors"
                                >
                                  ✓ Save
                                </button>
                                <button
                                  onClick={cancelYoutubeEdit}
                                  className="flex-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors"
                                >
                                  ✕ Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {embed ? (
                                <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ paddingTop: "56.25%" }}>
                                  <iframe
                                    src={embed}
                                    title={title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-sm rounded-lg">
                                  Invalid YouTube URL
                                </div>
                              )}

                              <div className="mt-2 flex items-center justify-between text-xs gap-2">
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-yellow-400 underline hover:text-yellow-300"
                                >
                                  🔗 Open on YouTube
                                </a>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditYoutube(selectedEvent, i, url)}
                                    className="text-blue-400 underline hover:text-blue-300"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => deleteImageFromServer(selectedEvent, url)}
                                    className="text-red-400 underline hover:text-red-300"
                                  >
                                    🗑️ Remove
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                  {((gallery[selectedEvent] || []).filter(img => !heroUrlSet.has(getImgUrl(img)))).map((img, i) => {
                    const src = safeSrc(img);
                    const url = getImgUrl(img);
                    return (
                      <div key={i} className="bg-gradient-to-br from-black/40 to-black/20 border-2 border-yellow-600/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        {src ? (
                          <img src={src} alt={`img-${i}`} className="w-full h-48 object-cover" />
                        ) : (
                          <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-sm">
                            No preview
                          </div>
                        )}
                        <div className="p-2 flex items-center justify-between text-xs bg-black/30">
                          <a 
                            href={src || url || "#"} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-yellow-400 underline hover:text-yellow-300"
                          >
                            🔗 Open
                          </a>
                          <button 
                            onClick={() => deleteImageFromServer(selectedEvent, url)}
                            className="text-red-400 underline hover:text-red-300"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        {/* Gallery Section */}
        
      </div>

      {/* Hero Upload Section */}
      <div className="mt-8 max-w-8xl mx-auto bg-gradient-to-br from-[#2a0e0e] via-[#4a1f1f] to-[#2a0e0e] border-2 border-yellow-600/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent text-center mb-4">
          🎭 Hero Slider Upload
        </h3>
        <p className="text-sm mb-4 text-yellow-200/80 text-center bg-black/20 p-3 rounded-lg border border-yellow-600/20">
          Images uploaded here appear <strong>ONLY on the home page carousel</strong> and will NOT appear in event galleries
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onHeroFilesChange}
              className="w-full p-2 bg-black/50 text-white rounded-xl border-2 border-yellow-600/40 mb-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-black file:font-semibold hover:file:bg-yellow-500"
            />
            <p className="text-sm mb-3 text-yellow-200">{heroFiles.length} file(s) selected</p>

            <div className="flex gap-2">
              <button
                onClick={handleHeroUpload}
                disabled={heroUploading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {heroUploading ? "⏳ Uploading..." : "⬆️ Upload"}
              </button>
              <button
                onClick={() => setHeroFiles([])}
                className="px-4 py-2 bg-black/50 rounded-xl hover:bg-black/70 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-bold text-yellow-300 mb-3">Current Hero Images</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {heroGallery.length === 0 && (
                <div className="col-span-full text-yellow-200/60 text-sm text-center py-8 bg-black/20 rounded-lg border border-yellow-600/20">
                  No hero images yet
                </div>
              )}

              {heroGallery.map((h, i) => {
                const src = safeSrc(h);
                const url = getImgUrl(h);
                return (
                  <div key={i} className="bg-gradient-to-br from-black/40 to-black/20 border-2 border-yellow-600/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    {src ? (
                      <img src={src} className="w-full h-32 object-cover" alt={`hero-${i}`} />
                    ) : (
                      <div className="w-full h-32 bg-gray-800 flex items-center justify-center text-xs">
                        No preview
                      </div>
                    )}
                    <div className="p-2 flex justify-between items-center text-xs bg-black/30">
                      <a href={src || url || "#"} target="_blank" rel="noreferrer" className="text-yellow-400 underline hover:text-yellow-300">
                        View
                      </a>
                      <button
                        onClick={() => deleteImageFromServer("home_slider", url, { hero: true })}
                        className="text-red-400 underline hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Section */}
      <div className="mt-8 max-w-8xl mx-auto bg-gradient-to-br from-[#2a0e0e] via-[#4a1f1f] to-[#2a0e0e] border-2 border-yellow-600/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
          📺 YouTube Videos Management
        </h3>
        <p className="text-sm mb-4 text-yellow-200/80 bg-black/20 p-3 rounded-lg border border-yellow-600/20">
          Add YouTube links to folders. Paste multiple URLs (one per line or comma separated). YouTube videos are stored in separate folders from images.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Folder name for YouTube videos"
            className="flex-1 p-3 bg-black/50 text-white rounded-xl border-2 border-yellow-600/40 focus:border-yellow-500 focus:outline-none"
          />
          <button 
            onClick={addYoutubeFolder}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg"
          >
            ➕ Add
          </button>
          <button 
            onClick={() => { setEventName(""); setYoutubeUrls(""); }}
            className="px-6 py-3 bg-black/50 rounded-xl hover:bg-black/70 transition-colors"
          >
            Clear
          </button>
        </div>

        <textarea
          value={youtubeUrls}
          onChange={(e) => setYoutubeUrls(e.target.value)}
          placeholder="Paste YouTube URLs here (one per line or comma separated)&#10;Example:&#10;https://www.youtube.com/watch?v=abc123&#10;https://youtu.be/xyz456"
          className="w-full p-3 bg-black/50 text-white rounded-xl border-2 border-yellow-600/40 resize-y min-h-[100px] mb-4 focus:border-yellow-500 focus:outline-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {youtubeFolders.length === 0 && (
            <div className="col-span-full text-yellow-200/60 text-sm text-center py-8 bg-black/20 rounded-lg border border-yellow-600/20">
              No YouTube folders yet
            </div>
          )}

          {youtubeFolders.map(([folder, items]) => {
            const url = items?.[0]?.url || "";
            const thumb = youtubeThumbUrl(url);
            const count = items.length;
            return (
              <div key={folder} className="bg-gradient-to-br from-black/40 to-black/20 p-3 border-2 border-yellow-600/30 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="font-semibold mb-2 text-yellow-200 flex items-center justify-between">
                  <span>{folder.replace(/_/g, " ")}</span>
                  <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded-full">{count}</span>
                </div>
                <div className="h-40 mb-2 rounded overflow-hidden shadow-md">
                  {thumb ? (
                    <img src={thumb} alt={`yt-${folder}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-sm">
                      No thumbnail
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-between">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1 bg-yellow-600 text-black rounded text-sm font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    🔗 Open
                  </a>
                  <button 
                    onClick={() => setSelectedEvent(folder)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-500 transition-colors"
                  >
                    👁️ View All
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(234, 179, 8, 0.7);
        }
      `}</style>
    </main>
  );
}
