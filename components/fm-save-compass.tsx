"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  LineChart,
  MapPinned,
  RotateCcw,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  FM_ATTRIBUTE_SECTIONS,
  FM_POSITION_DOTS,
  fmAttrClass,
  fmPositionDotIds,
  fmPrimaryDotForSticker,
  fmRolesForDot,
  fmSelectedRole,
} from "@/lib/fmRoles.js";
import Papa from "papaparse";
import type { Dispatch, PointerEvent as ReactPointerEvent, ReactNode, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RawRow = Record<string, string>;

type AttributeGroup = "Technik" | "Mental" | "Physis" | "Torwart";

type AttributeDef = {
  label: string;
  group: AttributeGroup;
  aliases: string[];
};

type PlayerDetails = {
  lineup: string;
  info: string;
  idealPosition: string;
  birthDate: string;
  height: string;
  squadNumber: string;
  goals: string;
  rating: string;
  personality: string;
  leftFoot: string;
  rightFoot: string;
  mediaDescription: string;
  contractEnd: string;
  minutes: string;
  playerOfMatch: string;
  passCompletion: string;
  cleanSheets: string;
  birthRegion: string;
  secondNation: string;
  appearances: string;
  assists: string;
  internationalGoals: string;
  internationalApps: string;
};

type PlayerSnapshot = {
  key: string;
  name: string;
  uid: string;
  age: number | null;
  position: string;
  nation: string;
  club: string;
  value: number | null;
  wage: number | null;
  abilityRaw: string;
  abilityScore: number | null;
  potentialRaw: string;
  potentialScore: number | null;
  attributes: Record<string, number>;
  details: PlayerDetails;
  raw: RawRow;
};

type Snapshot = {
  id: string;
  season: string;
  source: string;
  uploadedAt: string;
  headers: string[];
  rowCount: number;
  players: PlayerSnapshot[];
};

type StoredLibrary = {
  snapshots: Snapshot[];
  playerImages?: Record<string, string>;
};

type PlayerHistoryPoint = {
  snapshotId: string;
  season: string;
  uploadedAt: string;
  value: number | null;
  wage: number | null;
  age: number | null;
  club: string;
  position: string;
  attributes: Record<string, number>;
  raw: RawRow;
};

type PlayerAggregate = {
  key: string;
  name: string;
  latest: PlayerSnapshot;
  history: PlayerHistoryPoint[];
  valueDelta: number | null;
  valueDeltaPct: number | null;
  attributeDelta: number | null;
  avgAttribute: number | null;
  recommendation: number;
};

type Mapping = {
  uid: string | null;
  name: string | null;
  age: string | null;
  position: string | null;
  nation: string | null;
  club: string | null;
  value: string | null;
  wage: string | null;
  ability: string | null;
  potential: string | null;
  birthDate: string | null;
  details: Record<keyof PlayerDetails, string | null>;
  attributes: Array<{ def: AttributeDef; header: string }>;
};

type SortMode = "value" | "growth" | "potential" | "recommendation" | "name";
type PositionBucket = "Alle" | "Tor" | "Abwehr" | "Mittelfeld" | "Angriff";
type NavMode = "Portal" | "Recruitment" | "Development" | "Market" | "Tactics";
type RoleMode = "ip" | "oop";

type RoleSelection = {
  playerKey: string;
  positionId: string;
  roleName: string;
};

type TacticAssignment = {
  playerKey: string;
  roleName: string;
};

type TacticAssignments = Record<string, TacticAssignment | undefined>;

type FmRole = {
  name: string;
  pos?: string[];
  primary?: string[];
  secondary?: string[];
};

type FmDot = {
  id: string;
  label: string;
  x: number;
  y: number;
  family: string;
  linked?: string[];
};

const DB_NAME = "fm26-save-compass";
const DB_VERSION = 1;
const STORE_NAME = "state";
const STATE_KEY = "library";

const ATTRIBUTE_DEFS: AttributeDef[] = [
  { label: "Ecken", group: "Technik", aliases: ["Corners", "Cor"] },
  { label: "Flanken", group: "Technik", aliases: ["Crossing", "Cro"] },
  { label: "Dribbling", group: "Technik", aliases: ["Dri"] },
  { label: "Abschluss", group: "Technik", aliases: ["Finishing", "Fin"] },
  { label: "Ballannahme", group: "Technik", aliases: ["First Touch", "Fir", "First", "Erster Kontakt"] },
  { label: "Freistöße", group: "Technik", aliases: ["Free Kick Taking", "Free Kicks", "Fre", "Freistoesse", "Freistosse", "Freistösse"] },
  { label: "Kopfballtechnik", group: "Technik", aliases: ["Heading", "Hea", "Kopfball"] },
  { label: "Weitschüsse", group: "Technik", aliases: ["Long Shots", "Lon", "Fernschuesse", "Fernschüsse", "Weitschuesse"] },
  { label: "Weite Einwürfe", group: "Technik", aliases: ["Long Throws", "L Th", "Einwuerfe", "Einwürfe"] },
  { label: "Deckung", group: "Technik", aliases: ["Marking", "Mar"] },
  { label: "Passen", group: "Technik", aliases: ["Passing", "Pas"] },
  { label: "Elfmeter", group: "Technik", aliases: ["Penalty Taking", "Pen"] },
  { label: "Zweikampf", group: "Technik", aliases: ["Tackling", "Tck", "Tack"] },
  { label: "Technik", group: "Technik", aliases: ["Technique", "Tec"] },
  { label: "Aggressivität", group: "Mental", aliases: ["Aggression", "Agg", "Aggressivitaet"] },
  { label: "Antizipation", group: "Mental", aliases: ["Anticipation", "Ant"] },
  { label: "Mut", group: "Mental", aliases: ["Bravery", "Bra"] },
  { label: "Nervenstärke", group: "Mental", aliases: ["Composure", "Cmp", "Nervenstaerke"] },
  { label: "Konzentration", group: "Mental", aliases: ["Concentration", "Cnt"] },
  { label: "Entscheidungen", group: "Mental", aliases: ["Decisions", "Dec"] },
  { label: "Zielstrebigkeit", group: "Mental", aliases: ["Determination", "Det"] },
  { label: "Flair", group: "Mental", aliases: ["Fla"] },
  { label: "Führungsqualitäten", group: "Mental", aliases: ["Leadership", "Ldr", "Fuehrungsqualitaet", "Führungsqualität"] },
  { label: "Ohne Ball", group: "Mental", aliases: ["Off The Ball", "OtB", "Off Ball"] },
  { label: "Stellungsspiel", group: "Mental", aliases: ["Positioning", "Pos"] },
  { label: "Teamfähigkeit", group: "Mental", aliases: ["Teamwork", "Tea", "Teamfaehigkeit"] },
  { label: "Übersicht", group: "Mental", aliases: ["Vision", "Vis", "Uebersicht"] },
  { label: "Einsatzfreude", group: "Mental", aliases: ["Work Rate", "Wor"] },
  { label: "Antritt", group: "Physis", aliases: ["Acceleration", "Acc"] },
  { label: "Beweglichkeit", group: "Physis", aliases: ["Agility", "Agi"] },
  { label: "Gleichgewicht", group: "Physis", aliases: ["Balance", "Bal"] },
  { label: "Sprunghöhe", group: "Physis", aliases: ["Jumping Reach", "Jum", "Sprunghoehe"] },
  { label: "Grundfitness", group: "Physis", aliases: ["Natural Fitness", "Nat Fit", "Natural", "Fitness"] },
  { label: "Schnelligkeit", group: "Physis", aliases: ["Pace", "Pac"] },
  { label: "Ausdauer", group: "Physis", aliases: ["Stamina", "Sta"] },
  { label: "Kraft", group: "Physis", aliases: ["Strength", "Str"] },
  { label: "Hohe Bälle", group: "Torwart", aliases: ["Aerial Reach", "Aer", "Lufthoheit", "Hohe Baelle"] },
  { label: "Strafraumkontrolle", group: "Torwart", aliases: ["Command Of Area", "Cmd", "Strafraumbeherrschung"] },
  { label: "Kommunikation", group: "Torwart", aliases: ["Communication", "Com"] },
  { label: "Exzentrizität", group: "Torwart", aliases: ["Eccentricity", "Ecc", "Exzentrizitaet"] },
  { label: "Halten", group: "Torwart", aliases: ["Handling", "Han", "Fangsicherheit"] },
  { label: "Abschlag", group: "Torwart", aliases: ["Kicking", "Kic"] },
  { label: "Eins gegen Eins", group: "Torwart", aliases: ["One On Ones", "1v1"] },
  { label: "Reflexe", group: "Torwart", aliases: ["Reflexes", "Ref"] },
  { label: "Herauslaufen Tendenz", group: "Torwart", aliases: ["Rushing Out", "TRO", "Herauslaufen"] },
  { label: "Fausten Tendenz", group: "Torwart", aliases: ["Tendency To Punch", "Pun", "Fausten"] },
  { label: "Abwurf", group: "Torwart", aliases: ["Throwing", "Thr"] },
];

const POSITION_BUCKETS: PositionBucket[] = ["Alle", "Tor", "Abwehr", "Mittelfeld", "Angriff"];

const NAV_MODES: Array<{ id: NavMode; icon: typeof Database; label: string }> = [
  { id: "Portal", icon: Database, label: "Übersicht" },
  { id: "Recruitment", icon: Search, label: "Spielersuche" },
  { id: "Development", icon: Activity, label: "Entwicklung" },
  { id: "Market", icon: TrendingUp, label: "Markt" },
  { id: "Tactics", icon: MapPinned, label: "Taktik" },
];

const SORT_LABELS: Record<SortMode, string> = {
  value: "Marktwert",
  growth: "Wertzuwachs",
  potential: "Potenzial",
  recommendation: "Chance",
  name: "Name",
};

export default function FmSaveCompass() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isDemo, setIsDemo] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bucket, setBucket] = useState<PositionBucket>("Alle");
  const [sortMode, setSortMode] = useState<SortMode>("recommendation");
  const [navMode, setNavMode] = useState<NavMode>("Portal");
  const [roleMode, setRoleMode] = useState<RoleMode>("ip");
  const [roleSelection, setRoleSelection] = useState<RoleSelection>({
    playerKey: "",
    positionId: "",
    roleName: "",
  });
  const [tacticAssignments, setTacticAssignments] = useState<TacticAssignments>({});
  const [playerImages, setPlayerImages] = useState<Record<string, string>>({});
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [seasonLabel, setSeasonLabel] = useState("");
  const [notice, setNotice] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const publicLibrary = await fetchPublicLibrary();
        if (!cancelled && publicLibrary?.snapshots?.length) {
          const migrated = hydrateSnapshots(publicLibrary.snapshots);
          setSnapshots(migrated);
          setPlayerImages(publicLibrary.playerImages ?? {});
          setIsDemo(false);
          setSelectedKey(firstPlayerKey(migrated));
          setNotice("Oeffentliche Kaderdaten geladen.");
          return;
        }

        const stored = await idbGet<StoredLibrary>(STATE_KEY);
        if (!cancelled && stored?.snapshots?.length) {
          const migrated = hydrateSnapshots(stored.snapshots);
          setSnapshots(migrated);
          setPlayerImages(stored.playerImages ?? {});
          setIsDemo(false);
          setSelectedKey(firstPlayerKey(migrated));
        } else if (!cancelled) {
          const demo = createDemoSnapshots();
          setSnapshots(demo);
          setIsDemo(true);
          setSelectedKey(firstPlayerKey(demo));
        }
      } catch {
        const demo = createDemoSnapshots();
        if (!cancelled) {
          setSnapshots(demo);
          setIsDemo(true);
          setSelectedKey(firstPlayerKey(demo));
          setNotice("Lokaler Speicher nicht erreichbar. Beispieldaten sind aktiv.");
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || (isDemo && !Object.keys(playerImages).length)) {
      return;
    }

    idbSet(STATE_KEY, { snapshots, playerImages }).catch(() => {
      setNotice("Speichern im Browser ist fehlgeschlagen.");
    });
  }, [hydrated, isDemo, playerImages, snapshots]);

  const players = useMemo(() => buildAggregates(snapshots), [snapshots]);
  const latestSnapshot = snapshots.at(-1) ?? null;

  const visiblePlayers = useMemo(() => {
    const needle = normalizeSearch(query);

    return players
      .filter((player) => {
        const latest = player.latest;
        const haystack = normalizeSearch(
          [
            player.name,
            latest.club,
            latest.nation,
            latest.position,
            latest.details.mediaDescription,
            latest.details.personality,
          ].join(" ")
        );
        return (!needle || haystack.includes(needle)) && matchesBucket(latest.position, bucket);
      })
      .sort((a, b) => sortPlayers(a, b, sortMode));
  }, [bucket, players, query, sortMode]);

  const selectedPlayer = useMemo(() => {
    return players.find((player) => player.key === selectedKey) ?? visiblePlayers[0] ?? players[0] ?? null;
  }, [players, selectedKey, visiblePlayers]);

  const handleClipboardImage = useCallback(
    async (data: DataTransfer | null) => {
      if (!selectedPlayer || !data?.items?.length) {
        return;
      }

      const imageItem = Array.from(data.items).find((item) => item.kind === "file" && item.type.startsWith("image/"));
      const file = imageItem?.getAsFile();
      if (!file) {
        return;
      }

      const dataUrl = await fileToDataUrl(file);
      const nextImages = {
        ...playerImages,
        [selectedPlayer.key]: dataUrl,
      };
      setPlayerImages(nextImages);
      setNotice(`Bild fuer ${selectedPlayer.name} gespeichert.`);

      if (isAdmin) {
        void publishLibrary(snapshots, nextImages, adminPassword)
          .then(() => setNotice(`Bild fuer ${selectedPlayer.name} gespeichert und veroeffentlicht.`))
          .catch((error) => {
            const message = error instanceof Error ? error.message : "Upload fehlgeschlagen";
            setNotice(`Bild lokal gespeichert, Veroeffentlichung fehlgeschlagen: ${message}`);
          });
      }
    },
    [adminPassword, isAdmin, playerImages, selectedPlayer, snapshots]
  );

  useEffect(() => {
    if (!selectedPlayer) {
      return;
    }

    function onPaste(event: ClipboardEvent) {
      void handleClipboardImage(event.clipboardData);
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleClipboardImage, selectedPlayer]);

  useEffect(() => {
    if (!isProfileOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isProfileOpen]);

  const totals = useMemo(() => {
    const latestPlayers = latestSnapshot?.players ?? [];
    const totalValue = latestPlayers.reduce((sum, player) => sum + (player.value ?? 0), 0);
    const ages = latestPlayers
      .map((player) => player.age)
      .filter((age): age is number => typeof age === "number");
    const movers = [...players]
      .filter((player) => player.valueDelta !== null)
      .sort((a, b) => (b.valueDelta ?? 0) - (a.valueDelta ?? 0));
    const prospects = [...players]
      .filter((player) => player.latest.potentialScore !== null)
      .sort((a, b) => (b.latest.potentialScore ?? 0) - (a.latest.potentialScore ?? 0));

    return {
      players: latestPlayers.length,
      totalValue,
      avgAge: ages.length ? ages.reduce((sum, age) => sum + age, 0) / ages.length : null,
      biggestRiser: movers[0] ?? null,
      topProspect: prospects[0] ?? null,
    };
  }, [latestSnapshot, players]);

  async function handleFile(file: File) {
    if (!isAdmin) {
      setNotice("CSV-Uploads sind nur im Adminmodus moeglich.");
      return;
    }

    setIsImporting(true);
    setNotice("");

    try {
      const text = await file.text();
      const parsed = Papa.parse<RawRow>(text, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (header) => header.trim(),
        transform: (value) => (typeof value === "string" ? value.trim() : String(value ?? "")),
        delimitersToGuess: [",", ";", "\t", "|"],
      });

      const rows = parsed.data.filter((row) => Object.values(row).some(Boolean));
      const headers = parsed.meta.fields?.filter(Boolean) ?? Object.keys(rows[0] ?? {});
      const label = seasonLabel.trim() || inferSeasonLabel(file.name, snapshots.length + 1);
      const snapshot = createSnapshot(rows, headers, label, file.name);

      if (!snapshot.players.length) {
        setNotice("Keine Spieler erkannt. Prüfe, ob eine Name- oder Spieler-Spalte vorhanden ist.");
        return;
      }

      const next = isDemo ? [snapshot] : [...snapshots, snapshot];
      setSnapshots(next);
      setIsDemo(false);
      setSelectedKey(snapshot.players[0]?.key ?? "");
      setSeasonLabel("");
      setQuery("");
      setBucket("Alle");
      setNotice(
        `${snapshot.season}: ${snapshot.players.length} Spieler aus ${snapshot.rowCount} Zeilen importiert.`
      );
      await publishLibrary(next, playerImages, adminPassword);
      setNotice(
        `${snapshot.season}: ${snapshot.players.length} Spieler importiert und veroeffentlicht.`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unbekannter Fehler";
      setNotice(`Import fehlgeschlagen: ${message}`);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleAdminLogin() {
    if (!adminPassword.trim()) {
      setNotice("Bitte Admin-Passwort eingeben.");
      return;
    }

    const response = await fetch("/api/admin/verify", {
      headers: { "x-admin-password": adminPassword },
      method: "POST",
    });

    if (!response.ok) {
      setNotice("Admin-Login fehlgeschlagen. Pruefe Passwort und Server-Secrets.");
      return;
    }

    setIsAdmin(true);
    setNotice("Adminmodus aktiv. Neue CSV-Imports werden veroeffentlicht.");
  }

  function handleModeChange(mode: NavMode) {
    setNavMode(mode);
    const modeSort: Record<NavMode, SortMode> = {
      Portal: "recommendation",
      Recruitment: "potential",
      Development: "growth",
      Market: "value",
      Tactics: "recommendation",
    };
    setSortMode(modeSort[mode]);
  }

  function openPlayerProfile(playerKey: string) {
    setSelectedKey(playerKey);
    setIsProfileOpen(true);
  }

  function clearLibrary() {
    const demo = createDemoSnapshots();
    setSnapshots(demo);
    setPlayerImages({});
    setIsDemo(true);
    setSelectedKey(firstPlayerKey(demo));
    setQuery("");
    setBucket("Alle");
    setNotice("Beispieldaten geladen.");
    idbDelete(STATE_KEY).catch(() => undefined);
  }

  function exportLibrary() {
    const payload = JSON.stringify(
      { version: 1, exportedAt: new Date().toISOString(), playerImages, snapshots },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fm26-save-compass.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function removeSnapshot(id: string) {
    const next = snapshots.filter((snapshot) => snapshot.id !== id);
    if (next.length) {
      setSnapshots(next);
      setSelectedKey(firstPlayerKey(next));
      setNotice("Saisonstand entfernt.");
      return;
    }

    clearLibrary();
  }

  return (
    <main className="fm-app">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="crest" aria-hidden="true">
            <Shield size={24} />
          </div>
          <div>
            <span className="eyebrow">FM26 Spielstand-Kompass</span>
            <h1>Kaderanalyse</h1>
          </div>
        </div>

        <nav className="mode-nav" aria-label="Bereiche">
          {NAV_MODES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={navMode === item.id ? "nav-button active" : "nav-button"}
                key={item.id}
                onClick={() => handleModeChange(item.id)}
                type="button"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="top-actions">
          <button className="icon-button" disabled={!isAdmin} onClick={exportLibrary} title="Projekt exportieren" type="button">
            <Download size={18} />
          </button>
          <button className="icon-button danger" disabled={!isAdmin} onClick={clearLibrary} title="Beispieldaten laden / Daten leeren" type="button">
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      <section className="import-ribbon">
        <div className="import-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) {
            void handleFile(file);
          }
        }}>
          <FileSpreadsheet size={19} />
          <input
            aria-label="Saisonname"
            className="season-input"
            disabled={!isAdmin}
            onChange={(event) => setSeasonLabel(event.target.value)}
            placeholder="Saison 2026/27"
            value={seasonLabel}
          />
          <button
            className="primary-command"
            disabled={!isAdmin || isImporting}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload size={17} />
            <span>{isImporting ? "Importiere" : isAdmin ? "CSV importieren" : "Nur Admin"}</span>
          </button>
          <input
            accept=".csv,text/csv"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFile(file);
              }
            }}
            ref={fileInputRef}
            type="file"
          />
        </div>

        <div className="search-control">
          <Search size={17} />
          <input
            aria-label="Spieler suchen"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Spieler, Verein, Nation"
            value={query}
          />
        </div>

        <div className="status-pill">
          <Database size={16} />
          <span>{isDemo ? "Beispiel" : `${snapshots.length} Saisonstände`}</span>
        </div>

        <div className={isAdmin ? "admin-control active" : "admin-control"}>
          <Shield size={16} />
          <input
            aria-label="Admin Passwort"
            disabled={isAdmin}
            onChange={(event) => setAdminPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAdminLogin();
              }
            }}
            placeholder="Admin-Passwort"
            type="password"
            value={adminPassword}
          />
          {isAdmin ? (
            <button className="secondary-command" onClick={() => setIsAdmin(false)} type="button">
              Logout
            </button>
          ) : (
            <button className="secondary-command" onClick={handleAdminLogin} type="button">
              Login
            </button>
          )}
        </div>
      </section>

      {notice ? <div className="notice-line">{notice}</div> : null}

      {navMode === "Tactics" ? (
        <TacticBuilder
          assignments={tacticAssignments}
          images={playerImages}
          mode={roleMode}
          onAssignmentsChange={setTacticAssignments}
          onModeChange={setRoleMode}
          onOpenProfile={openPlayerProfile}
          players={players}
        />
      ) : (
      <>
      <section className="metrics-grid" aria-label="Kader-Kennzahlen">
        <MetricTile icon={Users} label="Spieler" value={formatInteger(totals.players)} detail={latestSnapshot?.season ?? "Kein Saisonstand"} />
        <MetricTile icon={BarChart3} label="Gesamtwert" value={formatMoney(totals.totalValue)} detail="aktuelle Saison" />
        <MetricTile icon={CalendarDays} label="Ø Alter" value={totals.avgAge ? totals.avgAge.toFixed(1) : "-"} detail="aktuelle Auswahl" />
        <MetricTile
          icon={TrendingUp}
          label="Größter Gewinner"
          value={totals.biggestRiser?.name ?? "-"}
          detail={formatDelta(totals.biggestRiser?.valueDelta ?? null)}
        />
        <MetricTile
          icon={Star}
          label="Top-Talent"
          value={totals.topProspect?.name ?? "-"}
          detail={totals.topProspect?.latest.potentialRaw || scoreLabel(totals.topProspect?.latest.potentialScore ?? null)}
        />
      </section>

      <section className="workspace">
        <div className="table-panel">
          <div className="panel-toolbar">
            <div className="panel-title">
              <UserRound size={18} />
              <span>Spielerdatenbank</span>
            </div>

            <div className="toolbar-controls">
              <div className="segmented" aria-label="Positionsfilter">
                {POSITION_BUCKETS.map((item) => (
                  <button
                    className={bucket === item ? "active" : ""}
                    key={item}
                    onClick={() => setBucket(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label className="sort-control">
                <SlidersHorizontal size={15} />
                <select
                  aria-label="Sortierung"
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  value={sortMode}
                >
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="player-table-wrap">
            <table className="player-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Spieler</th>
                  <th>Pos.</th>
                  <th>Alter</th>
                  <th>Verein</th>
                  <th>Eins.</th>
                  <th>Min</th>
                  <th>Note</th>
                  <th>Wert</th>
                  <th>Entwicklung</th>
                  <th>Chance</th>
                </tr>
              </thead>
              <tbody>
                {visiblePlayers.map((player) => (
                  <tr
                    className={selectedPlayer?.key === player.key ? "selected" : ""}
                    key={player.key}
                    onClick={() => openPlayerProfile(player.key)}
                  >
                    <td>
                      <StatusCell player={player.latest} />
                    </td>
                    <td>
                      <div className="player-cell">
                        <PlayerAvatar
                          className="avatar-dot"
                          image={playerImages[player.key]}
                          initialsText={initials(player.name)}
                        />
                        <div>
                          <strong>{player.name}</strong>
                          <small>{player.latest.nation || "N/A"}</small>
                        </div>
                      </div>
                    </td>
                    <td>{compactPosition(player.latest.position)}</td>
                    <td>{player.latest.age ?? "-"}</td>
                    <td>{player.latest.club || "-"}</td>
                    <td>{player.latest.details.appearances || "-"}</td>
                    <td>{player.latest.details.minutes || "-"}</td>
                    <td>{player.latest.details.rating || "-"}</td>
                    <td>{formatMoney(player.latest.value)}</td>
                    <td>
                      <TrendBadge delta={player.valueDelta} pct={player.valueDeltaPct} />
                    </td>
                    <td>
                      <span className="score-badge">{Math.round(player.recommendation)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <Filter size={15} />
            <span>{visiblePlayers.length} von {players.length} Spielern</span>
          </div>
        </div>

        {false ? (
        <aside className="profile-panel">
          {selectedPlayer ? (
            <>
              <div className="profile-head">
                <PlayerAvatar
                  className="profile-avatar"
                  image={playerImages[selectedPlayer.key]}
                  initialsText={initials(selectedPlayer.name)}
                />
                <div>
                  <span className="eyebrow">{selectedPlayer.latest.position || "Position offen"}</span>
                  <h2>{selectedPlayer.name}</h2>
                  <p>{[selectedPlayer.latest.club, selectedPlayer.latest.nation].filter(Boolean).join(" | ") || "Unbekannt"}</p>
                </div>
              </div>

              <div className="profile-stats">
                <MiniStat label="Wert" value={formatMoney(selectedPlayer.latest.value)} />
                <MiniStat label="Veränderung" value={formatDelta(selectedPlayer.valueDelta)} tone={selectedPlayer.valueDelta && selectedPlayer.valueDelta < 0 ? "red" : "green"} />
                <MiniStat label="Fähigkeit" value={selectedPlayer.latest.abilityRaw || scoreLabel(selectedPlayer.latest.abilityScore)} />
                <MiniStat label="Potenzial" value={selectedPlayer.latest.potentialRaw || scoreLabel(selectedPlayer.latest.potentialScore)} />
                <MiniStat label="Wertung" value={selectedPlayer.latest.details.rating || "-"} />
                <MiniStat label="Einsätze" value={selectedPlayer.latest.details.appearances || "-"} />
                <MiniStat label="Minuten" value={selectedPlayer.latest.details.minutes || "-"} />
                <MiniStat label="Vertrag" value={selectedPlayer.latest.details.contractEnd || "-"} />
                <MiniStat label="Attribut Ø" value={selectedPlayer.avgAttribute ? selectedPlayer.avgAttribute.toFixed(1) : "-"} />
              </div>

              <div className="csv-detail-board">
                <div className="block-title">
                  <FileSpreadsheet size={17} />
                  <span>CSV-Ansicht</span>
                </div>
                <CsvDetails player={selectedPlayer.latest} />
              </div>

              <RoleAnalyzer
                mode={roleMode}
                onModeChange={setRoleMode}
                onSelectionChange={setRoleSelection}
                player={selectedPlayer}
                selection={roleSelection}
              />

              <div className="chart-block">
                <div className="block-title">
                  <LineChart size={17} />
                  <span>Marktwertentwicklung</span>
                </div>
                <ValueChart history={selectedPlayer.history} />
              </div>
            </>
          ) : (
            <div className="empty-profile">
              <Eye size={24} />
              <span>Keine Spielerdaten</span>
            </div>
          )}
        </aside>
        ) : null}
      </section>

      <section className="lower-grid">
        <div className="timeline-panel">
          <div className="panel-title">
            <CalendarDays size={18} />
            <span>Saisonstände</span>
          </div>
          <div className="snapshot-list">
            {snapshots.map((snapshot, index) => (
              <div className="snapshot-item" key={snapshot.id}>
                <span className="snapshot-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{snapshot.season}</strong>
                  <small>{snapshot.players.length} Spieler | {snapshot.source}</small>
                </div>
                <button className="icon-button small danger" disabled={!isAdmin} onClick={() => removeSnapshot(snapshot.id)} title="Saisonstand entfernen" type="button">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="movers-panel">
          <div className="panel-title">
            <TrendingUp size={18} />
            <span>Wertbewegungen</span>
          </div>
          <div className="mover-list">
            {[...players]
              .filter((player) => player.valueDelta !== null)
              .sort((a, b) => Math.abs(b.valueDelta ?? 0) - Math.abs(a.valueDelta ?? 0))
              .slice(0, 6)
              .map((player) => (
                <button className="mover-row" key={player.key} onClick={() => openPlayerProfile(player.key)} type="button">
                  <span>{player.name}</span>
                  <TrendBadge delta={player.valueDelta} pct={player.valueDeltaPct} />
                </button>
              ))}
          </div>
        </div>
      </section>
      </>
      )}

      {selectedPlayer && isProfileOpen ? (
        <PlayerProfileOverlay
          image={playerImages[selectedPlayer.key]}
          mode={roleMode}
          onClose={() => setIsProfileOpen(false)}
          onModeChange={setRoleMode}
          onSelectionChange={setRoleSelection}
          player={selectedPlayer}
          selection={roleSelection}
        />
      ) : null}
    </main>
  );
}

function TacticBuilder({
  assignments,
  images,
  mode,
  onAssignmentsChange,
  onModeChange,
  onOpenProfile,
  players,
}: {
  assignments: TacticAssignments;
  images: Record<string, string>;
  mode: RoleMode;
  onAssignmentsChange: Dispatch<SetStateAction<TacticAssignments>>;
  onModeChange: (mode: RoleMode) => void;
  onOpenProfile: (playerKey: string) => void;
  players: PlayerAggregate[];
}) {
  const [activeSlot, setActiveSlot] = useState("ZM");
  const usedPlayerKeys = new Set(
    Object.values(assignments)
      .map((assignment) => assignment?.playerKey)
      .filter((key): key is string => Boolean(key))
  );
  const filledSlots = Object.values(assignments).filter(Boolean).length;
  const fitScores = Object.entries(assignments)
    .map(([positionId, assignment]) => {
      const player = players.find((item) => item.key === assignment?.playerKey);
      if (!player || !assignment?.roleName) {
        return null;
      }
      return tacticSlotFit(player, positionId, assignment.roleName, mode)?.score ?? null;
    })
    .filter((score): score is number => score !== null);
  const avgFit = average(fitScores);
  const activeDot = (FM_POSITION_DOTS as FmDot[]).find((dot) => dot.id === activeSlot) ?? (FM_POSITION_DOTS as FmDot[])[0];
  const activeRoles = tacticRoleOptions(activeDot?.id ?? "ZM", mode);
  const availablePlayers = [...players].sort((a, b) => {
    const usedA = usedPlayerKeys.has(a.key) ? 1 : 0;
    const usedB = usedPlayerKeys.has(b.key) ? 1 : 0;
    return usedA - usedB || b.recommendation - a.recommendation;
  });

  function assignPlayer(positionId: string, playerKey: string) {
    if (!playerKey) {
      return;
    }

    onAssignmentsChange((current) => {
      const next: TacticAssignments = { ...current };
      Object.entries(next).forEach(([slotId, assignment]) => {
        if (assignment?.playerKey === playerKey) {
          delete next[slotId];
        }
      });
      next[positionId] = {
        playerKey,
        roleName: tacticRoleOptions(positionId, mode)[0]?.name ?? "",
      };
      return next;
    });
    setActiveSlot(positionId);
  }

  function changeRole(positionId: string, roleName: string) {
    onAssignmentsChange((current) => ({
      ...current,
      [positionId]: current[positionId] ? { ...current[positionId], roleName } : undefined,
    }));
  }

  function clearSlot(positionId: string) {
    onAssignmentsChange((current) => {
      const next = { ...current };
      delete next[positionId];
      return next;
    });
  }

  function clearTactic() {
    onAssignmentsChange({});
  }

  return (
    <section className="tactic-screen" aria-label="Taktik bauen">
      <div className="tactic-header">
        <div>
          <span className="eyebrow">Taktikzentrale</span>
          <h2>{tacticFormationLabel(assignments)} bauen</h2>
          <p>Spieler rechts greifen und auf eine Position ziehen. Rollen kommen direkt aus dem Rollenprofil.</p>
        </div>
        <div className="tactic-header-actions">
          <div className="role-mode-switch" aria-label="Taktikphase">
            <button className={mode === "ip" ? "active" : ""} onClick={() => onModeChange("ip")} type="button">
              Mit Ball
            </button>
            <button className={mode === "oop" ? "active" : ""} onClick={() => onModeChange("oop")} type="button">
              Ohne Ball
            </button>
          </div>
          <button className="secondary-command" onClick={clearTactic} type="button">
            Leeren
          </button>
        </div>
      </div>

      <div className="tactic-grid">
        <div className="tactic-main-panel">
          <div className="tactic-stats">
            <MiniStat label="Slots" value={`${filledSlots}/11`} />
            <MiniStat label="Rollenfit" value={avgFit !== null ? `${Math.round(avgFit)}/100` : "-"} />
            <MiniStat label="Phase" value={mode === "ip" ? "Mit Ball" : "Ohne Ball"} />
          </div>

          <div className="tactic-pitch" aria-label="Taktikfeld">
            <div className="tactic-midline" aria-hidden="true" />
            <div className="tactic-circle" aria-hidden="true" />
            <div className="tactic-box top" aria-hidden="true" />
            <div className="tactic-box bottom" aria-hidden="true" />
            {(FM_POSITION_DOTS as FmDot[]).map((dot) => {
              const assignment = assignments[dot.id];
              const player = players.find((item) => item.key === assignment?.playerKey) ?? null;
              const roles = tacticRoleOptions(dot.id, mode);
              const roleName = assignment?.roleName && roles.some((role) => role.name === assignment.roleName)
                ? assignment.roleName
                : roles[0]?.name ?? "";
              const fit = player && roleName ? tacticSlotFit(player, dot.id, roleName, mode) : null;

              return (
                <div
                  className={activeSlot === dot.id ? "tactic-slot active" : "tactic-slot"}
                  key={dot.id}
                  onClick={() => setActiveSlot(dot.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    assignPlayer(dot.id, event.dataTransfer.getData("text/plain"));
                  }}
                  style={{ left: `${dot.y}%`, top: `${100 - dot.x}%` }}
                >
                  <button
                    className={player ? "tactic-slot-card filled" : "tactic-slot-card"}
                    draggable={Boolean(player)}
                    onClick={(event) => {
                      if (player) {
                        event.stopPropagation();
                        onOpenProfile(player.key);
                      }
                    }}
                    onDragStart={(event) => {
                      if (player) {
                        event.dataTransfer.setData("text/plain", player.key);
                      }
                    }}
                    type="button"
                  >
                    <span className="tactic-slot-pos">{dot.id}</span>
                    {player ? (
                      <>
                        <PlayerAvatar
                          className="tactic-slot-avatar"
                          image={images[player.key]}
                          initialsText={initials(player.name)}
                        />
                        <strong>{player.name}</strong>
                        <small>{fit ? `${fit.score}/100` : "Fit -"}</small>
                      </>
                    ) : (
                      <>
                        <span className="tactic-empty-dot" />
                        <strong>Ziehen</strong>
                        <small>{prettyGermanText(dot.label)}</small>
                      </>
                    )}
                  </button>
                  {player ? (
                    <div className="tactic-role-row">
                      <select
                        aria-label={`Rolle ${dot.id}`}
                        onChange={(event) => changeRole(dot.id, event.target.value)}
                        value={roleName}
                      >
                        {roles.map((role) => (
                          <option key={role.name} value={role.name}>
                            {prettyGermanText(role.name)}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => clearSlot(dot.id)} title="Slot leeren" type="button">
                        <X size={13} />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="tactic-sidebar" aria-label="Spielerkarten">
          <div className="tactic-sidebar-head">
            <div>
              <span className="eyebrow">Kaderkarten</span>
              <h3>Spieler ziehen</h3>
            </div>
            <span>{players.length}</span>
          </div>

          <div className="tactic-active-slot">
            <strong>{prettyGermanText(activeDot?.label ?? "Position")}</strong>
            <select
              aria-label="Rollen fuer aktive Position"
              disabled={!activeRoles.length}
              onChange={(event) => {
                if (assignments[activeSlot]) {
                  changeRole(activeSlot, event.target.value);
                }
              }}
              value={assignments[activeSlot]?.roleName ?? activeRoles[0]?.name ?? ""}
            >
              {activeRoles.map((role) => (
                <option key={role.name} value={role.name}>
                  {prettyGermanText(role.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="tactic-player-list">
            {availablePlayers.map((player) => {
              const naturalDots = new Set(fmPositionDotIds(toFmSticker(player.latest)) as string[]);
              const isNatural = naturalDots.has(activeSlot);
              const isUsed = usedPlayerKeys.has(player.key);
              return (
                <button
                  className={[
                    "tactic-player-card",
                    isNatural ? "natural" : "",
                    isUsed ? "used" : "",
                  ].filter(Boolean).join(" ")}
                  draggable
                  key={player.key}
                  onClick={() => onOpenProfile(player.key)}
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", player.key)}
                  onDoubleClick={() => assignPlayer(activeSlot, player.key)}
                  type="button"
                >
                  <PlayerAvatar
                    className="tactic-player-avatar"
                    image={images[player.key]}
                    initialsText={initials(player.name)}
                  />
                  <span>
                    <strong>{player.name}</strong>
                    <small>{compactPosition(player.latest.position)} | {formatMoney(player.latest.value)}</small>
                  </span>
                  <em>{Math.round(player.recommendation)}</em>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}

function PlayerProfileOverlay({
  image,
  mode,
  onClose,
  onModeChange,
  onSelectionChange,
  player,
  selection,
}: {
  image?: string;
  mode: RoleMode;
  onClose: () => void;
  onModeChange: (mode: RoleMode) => void;
  onSelectionChange: (selection: RoleSelection) => void;
  player: PlayerAggregate;
  selection: RoleSelection;
}) {
  const [isCardViewerOpen, setIsCardViewerOpen] = useState(false);
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });
  const profileMeta = [
    player.latest.club,
    player.latest.nation,
    player.latest.details.squadNumber ? `#${player.latest.details.squadNumber}` : "",
  ].filter(Boolean).join(" | ");

  function handleCardViewerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setCardTilt({
      rotateX: -y * 16,
      rotateY: x * 18,
    });
  }

  function resetCardTilt() {
    setCardTilt({ rotateX: 0, rotateY: 0 });
  }

  return (
    <div className="profile-overlay" role="dialog" aria-modal="true" aria-label={`Profil ${player.name}`}>
      <div className="profile-shell">
        <header className="profile-overlay-head">
          <div className="profile-title-lockup">
            <button
              className="card-popout-trigger"
              onClick={() => setIsCardViewerOpen(true)}
              title="Karte gross ansehen"
              type="button"
            >
              <PlayerCard player={player} image={image} />
            </button>
            <div>
              <span className="eyebrow">{player.latest.position || "Position offen"}</span>
              <h2>{player.name}</h2>
              <p>{profileMeta || "Unbekannt"}</p>
            </div>
            <div className="profile-hero-facts" aria-label="Spielerwerte">
              <MiniStat label="Wert" value={formatMoney(player.latest.value)} />
              <MiniStat label="Gehalt" value={formatMoney(player.latest.wage)} />
              <MiniStat label="Vertrag" value={player.latest.details.contractEnd || "-"} />
              <MiniStat label="Fähigkeit" value={<StarRating score={player.latest.abilityScore} />} />
              <MiniStat label="Potenzial" value={<StarRating score={player.latest.potentialScore} />} />
            </div>
          </div>

          <div className="profile-head-actions">
            <TrendBadge delta={player.valueDelta} pct={player.valueDeltaPct} />
            <button className="close-button" onClick={onClose} title="Schliessen" type="button">
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="profile-overlay-body">
          <section className="profile-analysis">
            <RoleAnalyzer
              mode={mode}
              onModeChange={onModeChange}
              onSelectionChange={onSelectionChange}
              player={player}
              selection={selection}
            />

            <div className="csv-detail-board compact">
              <div className="block-title">
                <FileSpreadsheet size={17} />
                <span>CSV-Ansicht</span>
              </div>
              <CsvDetails player={player.latest} />
            </div>

            <div className="chart-block compact">
              <div className="block-title">
                <LineChart size={17} />
                <span>Marktwertentwicklung</span>
              </div>
              <ValueChart history={player.history} />
            </div>
          </section>
        </div>
      </div>

      {isCardViewerOpen ? (
        <div className="card-viewer-overlay" role="dialog" aria-modal="true" aria-label={`Karte ${player.name}`}>
          <div className="card-viewer">
            <button
              className="close-button card-viewer-close"
              onClick={() => {
                resetCardTilt();
                setIsCardViewerOpen(false);
              }}
              title="Karte schliessen"
              type="button"
            >
              <X size={20} />
            </button>
            <div
              className="card-viewer-stage"
              onPointerLeave={resetCardTilt}
              onPointerMove={handleCardViewerMove}
            >
              <div
                className="card-viewer-tilt"
                style={{ transform: `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)` }}
              >
                <PlayerCard player={player} image={image} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PlayerCard({ image, player }: { image?: string; player: PlayerAggregate }) {
  const number = player.latest.details.squadNumber || "--";
  const position = player.latest.details.idealPosition || player.latest.position || "FM";

  return (
    <div className="player-card" aria-label={`Sammelkarte ${player.name}`}>
      <div className="player-card-pattern" aria-hidden="true" />
      <div className="player-card-shine" aria-hidden="true" />
      <div className="player-card-topline">
        <small>2026</small>
        <span>{compactPosition(position)}</span>
        <strong>#{number}</strong>
      </div>
      <PlayerAvatar
        className="profile-avatar card-portrait"
        image={image}
        initialsText={initials(player.name)}
      />
      <div className="player-card-footer">
        <strong>{player.name}</strong>
        <span>{player.latest.nation || player.latest.club || "FM"}</span>
      </div>
    </div>
  );
}

function MetricTile({
  detail,
  icon: Icon,
  label,
  value,
}: {
  detail: string;
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <article className="metric-tile">
      <div className="metric-icon">
        <Icon size={18} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function MiniStat({ label, tone, value }: { label: string; tone?: "green" | "red"; value: ReactNode }) {
  return (
    <div className={tone ? `mini-stat ${tone}` : "mini-stat"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StarRating({ score }: { score: number | null }) {
  const rating = score === null ? 0 : score <= 5 ? score : score / 20;
  const filledStars = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span className="star-rating" aria-label={`${filledStars} von 5 Sternen`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span className={index < filledStars ? "filled" : "empty"} key={index} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

function StatusCell({ player }: { player: PlayerSnapshot }) {
  const primary = player.details.lineup || player.details.info || "-";
  const secondary = [player.details.squadNumber && `#${player.details.squadNumber}`, player.details.info]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="status-cell">
      <strong>{primary}</strong>
      {secondary && secondary !== primary ? <small>{secondary}</small> : null}
    </div>
  );
}

function CsvDetails({ player }: { player: PlayerSnapshot }) {
  const details = player.details;
  const groups: Array<{ title: string; fields: Array<[string, string]> }> = [
    {
      title: "Saison",
      fields: [
        ["Minuten", details.minutes],
        ["Einsätze", details.appearances],
        ["Tore", details.goals],
        ["Vorlagen", details.assists],
        ["SdS", details.playerOfMatch],
        ["Wertung", details.rating],
        ["Pas %", details.passCompletion],
        ["Zu Null", details.cleanSheets],
        ["Lsp Eins", details.internationalApps],
        ["Lsp Tore", details.internationalGoals],
      ],
    },
    {
      title: "Profil",
      fields: [
        ["Geb.", details.birthDate],
        ["Alter", player.age !== null ? String(player.age) : ""],
        ["Größe", details.height],
        ["Nation", player.nation],
        ["2. Nation", details.secondNation],
        ["Geb.-Region", details.birthRegion],
        ["Idealpos", details.idealPosition],
        ["Medien", details.mediaDescription],
        ["Persönlichkeit", details.personality],
        ["Linker Fuß", details.leftFoot],
        ["Rechter Fuß", details.rightFoot],
      ],
    },
  ];

  return (
    <div className="csv-detail-grid">
      {groups.map((group) => (
        <div className="csv-detail-group" key={group.title}>
          <h3>{group.title}</h3>
          <dl>
            {group.fields
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div key={`${group.title}-${label}`}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function RoleAnalyzer({
  mode,
  onModeChange,
  onSelectionChange,
  player,
  selection,
}: {
  mode: RoleMode;
  onModeChange: (mode: RoleMode) => void;
  onSelectionChange: (selection: RoleSelection) => void;
  player: PlayerAggregate;
  selection: RoleSelection;
}) {
  const snapshot = player.latest;
  const sticker = toFmSticker(snapshot);
  const defaultPositionId = String(fmPrimaryDotForSticker(sticker) || "ZM");
  const positionId =
    selection.playerKey === player.key && selection.positionId
      ? selection.positionId
      : defaultPositionId;
  const roleName = selection.playerKey === player.key ? selection.roleName : "";
  const roles = fmRolesForDot(positionId, mode) as FmRole[];
  const selectedRole = fmSelectedRole(positionId, mode, roleName) as FmRole | null;
  const activeDot =
    (FM_POSITION_DOTS as FmDot[]).find((dot) => dot.id === positionId) ??
    ((FM_POSITION_DOTS as FmDot[])[0] as FmDot | undefined);
  const capableDots = new Set(fmPositionDotIds(sticker) as string[]);
  const fit = selectedRole ? calculateRoleFit(snapshot, selectedRole) : null;

  function chooseMode(nextMode: RoleMode) {
    onModeChange(nextMode);
    onSelectionChange({
      playerKey: player.key,
      positionId,
      roleName: "",
    });
  }

  function choosePosition(nextPositionId: string) {
    onSelectionChange({
      playerKey: player.key,
      positionId: nextPositionId,
      roleName: "",
    });
  }

  function chooseRole(nextRoleName: string) {
    onSelectionChange({
      playerKey: player.key,
      positionId,
      roleName: nextRoleName,
    });
  }

  return (
    <div className="role-lab">
      <div className="block-title">
        <MapPinned size={17} />
        <span>Rollenprofil</span>
      </div>

      <div className="role-lab-grid">
        <section className="role-pitch-card">
          <div className="role-card-head">
            <div>
              <strong>Spielpositionen</strong>
              <span>{snapshot.details.idealPosition || snapshot.position || "-"}</span>
            </div>
            <div className="role-mode-switch" aria-label="Rollenphase">
              <button className={mode === "ip" ? "active" : ""} onClick={() => chooseMode("ip")} type="button">
                Mit Ball
              </button>
              <button className={mode === "oop" ? "active" : ""} onClick={() => chooseMode("oop")} type="button">
                Ohne Ball
              </button>
            </div>
          </div>


          <div className="role-choice-list role-choice-list-inline-hidden">
            <div className="role-choice-head">
              <span />
              <span>Rolle</span>
            </div>
            {roles.length ? (
              roles.map((role) => {
                const active = roleKey(role.name) === roleKey(selectedRole?.name ?? "");
                return (
                  <button
                    className={active ? "role-choice active" : "role-choice"}
                    key={role.name}
                    onClick={() => chooseRole(role.name)}
                    type="button"
                  >
                    <span className="role-radio-dot" />
                    <span>{prettyGermanText(role.name)}</span>
                  </button>
                );
              })
            ) : (
              <div className="role-empty">FÃ¼r diese Position sind keine Rollen hinterlegt.</div>
            )}
          </div>

          <div className="role-pitch" aria-label="Positionsfeld">
            <div className="role-pitch-box" />
            <div className="role-pitch-box right" />
            <div className="role-pitch-goalarea" />
            <div className="role-pitch-goalarea right" />
            <div className="role-pitch-spot left" />
            <div className="role-pitch-spot center" />
            <div className="role-pitch-spot right" />
            {(FM_POSITION_DOTS as FmDot[]).map((dot) => {
              const isActive = dot.id === positionId;
              const isCapable = capableDots.has(dot.id);

              return (
                <button
                  className={[
                    "role-pos-dot",
                    isActive ? "is-active" : "",
                    isCapable ? "is-capable" : "",
                  ].filter(Boolean).join(" ")}
                  key={dot.id}
                  onClick={() => choosePosition(dot.id)}
                  style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  title={`${prettyGermanText(dot.label)} - ${isCapable ? "vom Spieler abgedeckt" : "Rollen ansehen"}`}
                  type="button"
                />
              );
            })}
          </div>

          <div className="role-selected-dot">{prettyGermanText(activeDot?.label ?? "Position")}</div>
          <div className="role-csv-note">CSV: {snapshot.position || "-"}</div>

          <div className="role-fit-row">
            <MiniStat label="Rolleneignung" value={fit ? `${fit.score}/100` : "-"} />
            <MiniStat label="Primär Ø" value={fit?.primaryAvg ? fit.primaryAvg.toFixed(1) : "-"} />
            <MiniStat label="Sekundär Ø" value={fit?.secondaryAvg ? fit.secondaryAvg.toFixed(1) : "-"} />
          </div>

          <div className="role-choice-list role-choice-list-top">
            <div className="role-choice-head">
              <span />
              <span>Rolle</span>
            </div>
            {roles.length ? (
              roles.map((role) => {
                const active = roleKey(role.name) === roleKey(selectedRole?.name ?? "");
                return (
                  <button
                    className={active ? "role-choice active" : "role-choice"}
                    key={role.name}
                    onClick={() => chooseRole(role.name)}
                    type="button"
                  >
                    <span className="role-radio-dot" />
                    <span>{prettyGermanText(role.name)}</span>
                  </button>
                );
              })
            ) : (
              <div className="role-empty">Für diese Position sind keine Rollen hinterlegt.</div>
            )}
          </div>
        </section>

        <RoleAttributeMatrix player={player} role={selectedRole} />
      </div>
    </div>
  );
}

function RoleAttributeMatrix({ player, role }: { player: PlayerAggregate; role: FmRole | null }) {
  const snapshot = player.latest;
  const previousAttributes = player.history.length > 1 ? player.history.at(-2)?.attributes ?? null : null;
  const firstSections = role?.pos?.includes("GK")
    ? (FM_ATTRIBUTE_SECTIONS.keeper as Array<[string, string[]]>)
    : (FM_ATTRIBUTE_SECTIONS.field as Array<[string, string[]]>);
  const sections = [
    { title: role?.pos?.includes("GK") ? "Torhüter" : "Technik", groups: firstSections },
    { title: "Mental", groups: FM_ATTRIBUTE_SECTIONS.mental as Array<[string, string[]]> },
    { title: "Athletik", groups: FM_ATTRIBUTE_SECTIONS.athletic as Array<[string, string[]]> },
  ];

  return (
    <div className="role-attribute-board">
      <div className="role-legend">
        <span className="primary">Primär</span>
        <span className="secondary">Sekundär</span>
      </div>
      {sections.map((section) => (
        <section className="role-attr-card" key={section.title}>
          <h3>{section.title}</h3>
          {section.groups.map(([groupTitle, labels]) => (
            <div className="role-attr-section" key={`${section.title}-${groupTitle}`}>
              <h4>{prettyGermanText(groupTitle)}</h4>
              {labels.map((label) => {
                const value = attributeValueForRoleLabel(snapshot.attributes, label);
                const delta = attributeDeltaForRoleLabel(snapshot.attributes, previousAttributes, label);
                const missing = value === null;
                return (
                  <div
                    className={[
                      "role-attr-row",
                      missing ? "missing" : "",
                      fmAttrClass(label, role),
                    ].filter(Boolean).join(" ")}
                    key={label}
                  >
                    <AttributeDeltaBadge delta={delta} />
                    <span>{prettyGermanText(label)}</span>
                    <strong className={missing ? "missing" : attributeValueClass(value)}>{missing ? "-" : value}</strong>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function PlayerAvatar({
  className,
  image,
  initialsText,
}: {
  className: string;
  image?: string;
  initialsText: string;
}) {
  return (
    <span className={image ? `${className} has-image` : className} title="Spielerbild">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image ? <img alt="" src={image} /> : <UserRound aria-hidden="true" size={18} />}
      {!image ? <span>{initialsText}</span> : null}
    </span>
  );
}

function AttributeDeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null || delta === 0) {
    return <span className="attr-delta-placeholder" aria-hidden="true" />;
  }

  const isUp = delta > 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={isUp ? "attr-delta up" : "attr-delta down"} title={`Entwicklung ${formatAttributeDelta(delta)}`}>
      <Icon size={11} />
      {formatAttributeDelta(delta)}
    </span>
  );
}

function TrendBadge({ delta, pct }: { delta: number | null; pct: number | null }) {
  if (delta === null) {
    return <span className="trend-badge neutral">neu</span>;
  }

  const isUp = delta >= 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={isUp ? "trend-badge up" : "trend-badge down"}>
      <Icon size={14} />
      {formatDelta(delta)}
      {pct !== null ? <small>{pct > 0 ? "+" : ""}{pct.toFixed(0)}%</small> : null}
    </span>
  );
}

function ValueChart({ history }: { history: PlayerHistoryPoint[] }) {
  const points = history
    .map((point, index) => ({ ...point, index }))
    .filter((point) => point.value !== null) as Array<PlayerHistoryPoint & { value: number; index: number }>;

  if (!points.length) {
    return <div className="chart-empty">Keine Marktwerte</div>;
  }

  const width = 420;
  const height = 150;
  const pad = 24;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  const xStep = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;
  const coords = points.map((point, index) => {
    const x = points.length > 1 ? pad + index * xStep : width / 2;
    const y = height - pad - ((point.value - min) / spread) * (height - pad * 2);
    return { ...point, x, y };
  });
  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${coords.at(-1)?.x ?? pad} ${height - pad} L ${coords[0]?.x ?? pad} ${height - pad} Z`;

  return (
    <div className="value-chart">
      <svg aria-label="Marktwertentwicklung" role="img" viewBox={`0 0 ${width} ${height}`}>
        <path className="chart-area" d={area} />
        <path className="chart-line" d={path} />
        {coords.map((point) => (
          <g key={`${point.season}-${point.value}`}>
            <circle className="chart-dot" cx={point.x} cy={point.y} r="4" />
            <text className="chart-label" x={point.x} y={height - 6}>
              {shortSeason(point.season)}
            </text>
          </g>
        ))}
      </svg>
      <div className="chart-range">
        <span>{formatMoney(min)}</span>
        <span>{formatMoney(max)}</span>
      </div>
    </div>
  );
}

function createSnapshot(rows: RawRow[], headers: string[], season: string, source: string): Snapshot {
  const mapping = createMapping(headers);
  const id = createId();
  const players = rows
    .map((row, index) => normalizePlayer(row, mapping, index))
    .filter((player): player is PlayerSnapshot => Boolean(player));

  return {
    id,
    season,
    source,
    uploadedAt: new Date().toISOString(),
    headers,
    rowCount: rows.length,
    players,
  };
}

function hydrateSnapshots(snapshots: Snapshot[]): Snapshot[] {
  return snapshots.map((snapshot) => {
    const headers = snapshot.headers?.length
      ? snapshot.headers
      : Object.keys(snapshot.players[0]?.raw ?? {});
    const mapping = createMapping(headers);
    const players = snapshot.players.map((player, index) => {
      const normalized = player.raw ? normalizePlayer(player.raw, mapping, index) : null;
      if (normalized) {
        return { ...normalized, key: player.key || normalized.key };
      }

      return {
        ...player,
        details: player.details ?? emptyPlayerDetails(),
      };
    });

    return { ...snapshot, headers, players };
  });
}

function normalizePlayer(row: RawRow, mapping: Mapping, index: number): PlayerSnapshot | null {
  const name = read(row, mapping.name);

  if (!name) {
    return null;
  }

  const uid = read(row, mapping.uid);
  const age = parseMaybeNumber(read(row, mapping.age));
  const position = read(row, mapping.position);
  const rawNation = read(row, mapping.nation);
  const nation = /^\d+$/.test(rawNation) ? "" : rawNation;
  const club = read(row, mapping.club);
  const value = parseMoney(read(row, mapping.value));
  const wage = parseMoney(read(row, mapping.wage));
  const abilityRaw = read(row, mapping.ability);
  const potentialRaw = read(row, mapping.potential);
  const birthDate = read(row, mapping.birthDate);
  const details = readDetails(row, mapping.details);
  const attributes: Record<string, number> = {};

  mapping.attributes.forEach(({ def, header }) => {
    const parsed = parseAttribute(read(row, header));
    if (parsed !== null) {
      attributes[def.label] = parsed;
    }
  });

  return {
    key: uid ? `uid:${compact(uid)}` : `soft:${compact([name, birthDate, nation].join("|")) || `row-${index}`}`,
    name,
    uid,
    age,
    position,
    nation,
    club,
    value,
    wage,
    abilityRaw,
    abilityScore: parseRating(abilityRaw),
    potentialRaw,
    potentialScore: parseRating(potentialRaw),
    attributes,
    details,
    raw: row,
  };
}

function createMapping(headers: string[]): Mapping {
  return {
    uid: findHeader(headers, ["UID", "Unique ID", "Player ID", "ID", "Person ID"]),
    name: findHeader(headers, ["Player", "Player Name", "Name", "Spieler", "Full Name"]),
    age: findHeader(headers, ["Age", "Alter"]),
    position: findHeader(headers, ["Position", "Positions", "Pos", "Best Position", "Position(s)"]),
    nation: findHeader(headers, ["Nationality", "Nation", "Nat", "Land", "Nationalitaet", "Nationalität"]),
    club: findHeader(headers, ["Club", "Team", "Verein", "Current Club"]),
    value: findHeader(headers, ["Transfer Value", "Market Value", "Value", "Wert", "Marktwert", "Transferwert"]),
    wage: findHeader(headers, ["Wage", "Wages", "Salary", "Gehalt", "Lohn", "Weekly Wage"]),
    ability: findHeader(headers, ["Ability", "Current Ability", "CA", "Ability Stars", "Aktuelle Fähigkeit", "Fähigkeit"]),
    potential: findHeader(headers, ["Potential", "Potential Ability", "PA", "Potential Stars", "Potential Ability Stars", "Potenzial"]),
    birthDate: findHeader(headers, ["Date of Birth", "DOB", "Born", "Geburtsdatum", "Geb."]),
    details: {
      lineup: findHeader(headers, ["Aufgestellt", "Selected", "Picked"]),
      info: findHeader(headers, ["Info", "Inf"]),
      idealPosition: findHeader(headers, ["Idealpos", "Ideal Position", "Best Position"]),
      birthDate: findHeader(headers, ["Geb.", "Date of Birth", "DOB", "Born", "Geburtsdatum"]),
      height: findHeader(headers, ["Größe", "Groesse", "Height"]),
      squadNumber: findHeader(headers, ["Nr.", "No.", "Squad Number", "Number", "Nummer"]),
      goals: findHeader(headers, ["Tore", "Goals", "Gls"]),
      rating: findHeader(headers, ["Wertung", "Average Rating", "Avg Rating", "Rating"]),
      personality: findHeader(headers, ["Persönlichkeit", "Personality"]),
      leftFoot: findHeader(headers, ["Linker Fuß", "Linker Fuss", "Left Foot"]),
      rightFoot: findHeader(headers, ["Rechter Fuß", "Rechter Fuss", "Right Foot"]),
      mediaDescription: findHeader(headers, ["Medienbeschreibung", "Media Description"]),
      contractEnd: findHeader(headers, ["Endet", "Contract Expires", "Expires", "Vertrag bis"]),
      minutes: findHeader(headers, ["Minuten", "Minutes", "Mins"]),
      playerOfMatch: findHeader(headers, ["SdS", "PoM", "Player of Match", "Man of the Match"]),
      passCompletion: findHeader(headers, ["Pas %", "Pass %", "Pass Completion", "Passquote"]),
      cleanSheets: findHeader(headers, ["Zu-Null-Spiele", "Clean Sheets"]),
      birthRegion: findHeader(headers, ["Geb.-Region", "Birth Region", "Region of Birth"]),
      secondNation: findHeader(headers, ["2. Nation", "Second Nation", "Other Nationality"]),
      appearances: findHeader(headers, ["Einsätze", "Apps", "Appearances"]),
      assists: findHeader(headers, ["Vorlagen", "Assists", "Ast"]),
      internationalGoals: findHeader(headers, ["Lsp Tore", "International Goals"]),
      internationalApps: findHeader(headers, ["Lsp Eins", "International Apps", "Caps"]),
    },
    attributes: ATTRIBUTE_DEFS.map((def) => ({
      def,
      header: findHeader(headers, [def.label, ...def.aliases]),
    })).filter((entry): entry is { def: AttributeDef; header: string } => Boolean(entry.header)),
  };
}

function readDetails(row: RawRow, details: Mapping["details"]): PlayerDetails {
  return {
    lineup: read(row, details.lineup),
    info: read(row, details.info),
    idealPosition: read(row, details.idealPosition),
    birthDate: read(row, details.birthDate),
    height: read(row, details.height),
    squadNumber: read(row, details.squadNumber),
    goals: read(row, details.goals),
    rating: read(row, details.rating),
    personality: read(row, details.personality),
    leftFoot: read(row, details.leftFoot),
    rightFoot: read(row, details.rightFoot),
    mediaDescription: read(row, details.mediaDescription),
    contractEnd: read(row, details.contractEnd),
    minutes: read(row, details.minutes),
    playerOfMatch: read(row, details.playerOfMatch),
    passCompletion: read(row, details.passCompletion),
    cleanSheets: read(row, details.cleanSheets),
    birthRegion: read(row, details.birthRegion),
    secondNation: read(row, details.secondNation),
    appearances: read(row, details.appearances),
    assists: read(row, details.assists),
    internationalGoals: read(row, details.internationalGoals),
    internationalApps: read(row, details.internationalApps),
  };
}

function emptyPlayerDetails(): PlayerDetails {
  return {
    lineup: "",
    info: "",
    idealPosition: "",
    birthDate: "",
    height: "",
    squadNumber: "",
    goals: "",
    rating: "",
    personality: "",
    leftFoot: "",
    rightFoot: "",
    mediaDescription: "",
    contractEnd: "",
    minutes: "",
    playerOfMatch: "",
    passCompletion: "",
    cleanSheets: "",
    birthRegion: "",
    secondNation: "",
    appearances: "",
    assists: "",
    internationalGoals: "",
    internationalApps: "",
  };
}

function buildAggregates(snapshots: Snapshot[]): PlayerAggregate[] {
  const byPlayer = new Map<string, { latest: PlayerSnapshot; history: PlayerHistoryPoint[] }>();

  snapshots.forEach((snapshot) => {
    snapshot.players.forEach((player) => {
      const point: PlayerHistoryPoint = {
        snapshotId: snapshot.id,
        season: snapshot.season,
        uploadedAt: snapshot.uploadedAt,
        value: player.value,
        wage: player.wage,
        age: player.age,
        club: player.club,
        position: player.position,
        attributes: player.attributes,
        raw: player.raw,
      };

      const existing = byPlayer.get(player.key);
      if (existing) {
        existing.latest = player;
        existing.history.push(point);
      } else {
        byPlayer.set(player.key, { latest: player, history: [point] });
      }
    });
  });

  return Array.from(byPlayer.entries()).map(([key, item]) => {
    const valuePoints = item.history.filter((point) => point.value !== null);
    const latestValue = valuePoints.at(-1)?.value ?? null;
    const previousValue = valuePoints.length > 1 ? valuePoints.at(-2)?.value ?? null : null;
    const valueDelta = latestValue !== null && previousValue !== null ? latestValue - previousValue : null;
    const valueDeltaPct =
      valueDelta !== null && previousValue && previousValue > 0 ? (valueDelta / previousValue) * 100 : null;
    const avgAttribute = average(Object.values(item.latest.attributes));
    const previousAttributes = item.history.length > 1 ? item.history.at(-2)?.attributes ?? {} : {};
    const previousAvg = average(Object.values(previousAttributes));
    const attributeDelta = avgAttribute !== null && previousAvg !== null ? avgAttribute - previousAvg : null;
    const recommendation = calculateRecommendation(item.latest, valueDeltaPct, avgAttribute);

    return {
      key,
      name: item.latest.name,
      latest: item.latest,
      history: item.history,
      valueDelta,
      valueDeltaPct,
      attributeDelta,
      avgAttribute,
      recommendation,
    };
  });
}

function calculateRecommendation(player: PlayerSnapshot, valueDeltaPct: number | null, avgAttribute: number | null) {
  const age = player.age ?? 25;
  const youth = Math.max(0, 26 - age) * 2.2;
  const potential = player.potentialScore ?? player.abilityScore ?? 50;
  const attributes = avgAttribute ? avgAttribute * 4 : 45;
  const growth = valueDeltaPct ? Math.max(-12, Math.min(18, valueDeltaPct / 2)) : 0;
  const priceBrake = player.value ? Math.min(18, Math.log10(Math.max(player.value, 1)) * 2.2) : 4;

  return Math.max(0, Math.min(100, youth + potential * 0.38 + attributes * 0.42 + growth - priceBrake));
}

function toFmSticker(player: PlayerSnapshot) {
  return {
    allPositionsRaw: player.position,
    csvPosition: player.position,
    idealPosition: player.details.idealPosition,
    importPosition: player.position,
    position: player.position,
    rawPosition: player.position,
  };
}

function calculateRoleFit(player: PlayerSnapshot, role: FmRole) {
  const primaryAvg = averageRoleAttributes(player.attributes, role.primary ?? []);
  const secondaryAvg = averageRoleAttributes(player.attributes, role.secondary ?? []);

  if (primaryAvg === null && secondaryAvg === null) {
    return null;
  }

  const primaryScore = primaryAvg ?? secondaryAvg ?? 0;
  const secondaryScore = secondaryAvg ?? primaryScore;
  const score = Math.round(((primaryScore / 20) * 0.72 + (secondaryScore / 20) * 0.28) * 100);

  return {
    primaryAvg,
    score: Math.max(0, Math.min(100, score)),
    secondaryAvg,
  };
}

function tacticRoleOptions(positionId: string, mode: RoleMode) {
  const relatedPositionIds: Record<string, string[]> = {
    LV: ["LV", "LAV"],
    RV: ["RV", "RAV"],
    LAV: ["LAV", "LV", "LM"],
    RAV: ["RAV", "RV", "RM"],
    LM: ["LM", "LAV", "LA"],
    RM: ["RM", "RAV", "RA"],
    LA: ["LA", "LM"],
    RA: ["RA", "RM"],
    DM: ["DM", "ZM"],
    ZM: ["ZM", "DM", "OM"],
    OM: ["OM", "ZM", "MS"],
    MS: ["MS", "OM"],
  };
  const seen = new Set<string>();

  return (relatedPositionIds[positionId] ?? [positionId])
    .flatMap((id) => fmRolesForDot(id, mode) as FmRole[])
    .filter((role) => {
      const key = roleKey(role.name);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function tacticSlotFit(player: PlayerAggregate, positionId: string, roleName: string, mode: RoleMode) {
  const role =
    tacticRoleOptions(positionId, mode).find((item) => item.name === roleName) ??
    tacticRoleOptions(positionId, mode)[0] ??
    null;
  return role ? calculateRoleFit(player.latest, role) : null;
}

function tacticFormationLabel(assignments: TacticAssignments) {
  const assignedDotIds = Object.keys(assignments).filter((positionId) => assignments[positionId]);
  const dots = assignedDotIds
    .map((positionId) => (FM_POSITION_DOTS as FmDot[]).find((dot) => dot.id === positionId))
    .filter((dot): dot is FmDot => Boolean(dot));
  const defenders = dots.filter((dot) => ["FB", "CB", "WB"].includes(dot.family)).length;
  const midfielders = dots.filter((dot) => ["DM", "CM", "WM", "AM", "W"].includes(dot.family)).length;
  const forwards = dots.filter((dot) => dot.family === "ST").length;

  if (!assignedDotIds.length) {
    return "Neue Taktik";
  }

  return [defenders, midfielders, forwards].filter((count) => count > 0).join("-") || "Eigene Taktik";
}

function averageRoleAttributes(attributes: Record<string, number>, labels: string[]) {
  const values = labels
    .map((label) => attributeValueForRoleLabel(attributes, label))
    .filter((value): value is number => value !== null);

  return average(values);
}

function attributeValueForRoleLabel(attributes: Record<string, number>, label: string) {
  const direct = Object.entries(attributes).find(([attributeLabel]) => roleKey(attributeLabel) === roleKey(label));
  if (direct) {
    return direct[1];
  }

  const def = ATTRIBUTE_DEFS.find((item) => {
    const wanted = roleKey(label);
    return [item.label, ...item.aliases].some((alias) => {
      const candidate = roleKey(alias);
      return candidate === wanted || wanted.includes(candidate) || candidate.includes(wanted);
    });
  });

  return def ? attributes[def.label] ?? null : null;
}

function attributeDeltaForRoleLabel(
  currentAttributes: Record<string, number>,
  previousAttributes: Record<string, number> | null,
  label: string
) {
  if (!previousAttributes) {
    return null;
  }

  const current = attributeValueForRoleLabel(currentAttributes, label);
  const previous = attributeValueForRoleLabel(previousAttributes, label);
  return current !== null && previous !== null ? current - previous : null;
}

function attributeValueClass(value: number | null) {
  if (value === null || value <= 5) {
    return "vlow";
  }

  if (value <= 10) {
    return "mid";
  }

  if (value <= 15) {
    return "yellow";
  }

  return "green";
}

function prettyGermanText(label: string) {
  return label
    .replace(/\bTackling\b/g, "Zweikampf")
    .replace(/\bTeamwork\b/g, "Teamfähigkeit")
    .replace(/\bBalance\b/g, "Gleichgewicht")
    .replace(/Aeusser/g, "Äußer")
    .replace(/aeusser/g, "äußer")
    .replace(/Aussen/g, "Außen")
    .replace(/aussen/g, "außen")
    .replace(/Aufrueck/g, "Aufrück")
    .replace(/aufrueck/g, "aufrück")
    .replace(/Baelle/g, "Bälle")
    .replace(/baelle/g, "bälle")
    .replace(/Einrueck/g, "Einrück")
    .replace(/einrueck/g, "einrück")
    .replace(/Einwuerfe/g, "Einwürfe")
    .replace(/einwuerfe/g, "einwürfe")
    .replace(/Freistoesse/g, "Freistöße")
    .replace(/freistoesse/g, "freistöße")
    .replace(/Fluegel/g, "Flügel")
    .replace(/fluegel/g, "flügel")
    .replace(/Fuehrungsqualitaeten/g, "Führungsqualitäten")
    .replace(/fuehrungsqualitaeten/g, "führungsqualitäten")
    .replace(/Fuehrung/g, "Führung")
    .replace(/fuehrung/g, "führung")
    .replace(/Haeng/g, "Häng")
    .replace(/haeng/g, "häng")
    .replace(/Sprunghoehe/g, "Sprunghöhe")
    .replace(/sprunghoehe/g, "sprunghöhe")
    .replace(/Nervenstaerke/g, "Nervenstärke")
    .replace(/nervenstaerke/g, "nervenstärke")
    .replace(/Aggressivitaet/g, "Aggressivität")
    .replace(/aggressivitaet/g, "aggressivität")
    .replace(/Exzentrizitaet/g, "Exzentrizität")
    .replace(/exzentrizitaet/g, "exzentrizität")
    .replace(/Stuermer/g, "Stürmer")
    .replace(/stuermer/g, "stürmer")
    .replace(/Torhueter/g, "Torhüter")
    .replace(/torhueter/g, "torhüter")
    .replace(/Uebersicht/g, "Übersicht")
    .replace(/uebersicht/g, "übersicht")
    .replace(/Weitschuesse/g, "Weitschüsse")
    .replace(/weitschuesse/g, "weitschüsse");
}

function createDemoSnapshots(): Snapshot[] {
  const firstRows: RawRow[] = [
    demoRow("1001", "Nico Falk", "GER", "Hansa Nordstadt", "AM (R), ST (C)", 19, "€4.8M", "€12K", 52, 88, [13, 15, 12, 14, 16, 17, 13, 16, 11, 14]),
    demoRow("1002", "Mika Voss", "AUT", "Rheinbrueck", "DM, M (C)", 21, "€7.2M", "€18K", 61, 82, [8, 10, 16, 13, 12, 12, 18, 17, 15, 9]),
    demoRow("1003", "Jonas Bell", "ENG", "Southgate Athletic", "D (C)", 23, "€11M", "€34K", 68, 79, [5, 7, 13, 11, 13, 12, 15, 16, 14, 6]),
    demoRow("1004", "Tiago Moura", "POR", "Estrela Praia", "M/AM (L)", 18, "€2.4M", "€6K", 48, 90, [12, 16, 11, 15, 15, 16, 10, 15, 10, 13]),
    demoRow("1005", "Lars Eklund", "SWE", "IFK Sund", "GK", 20, "€1.8M", "€7K", 49, 78, [2, 3, 8, 7, 9, 10, 11, 14, 13, 4]),
    demoRow("1006", "Enzo Ritter", "SUI", "Baselstadt", "WB/M (R)", 22, "€5.6M", "€16K", 58, 80, [11, 13, 12, 13, 15, 15, 17, 16, 12, 11]),
    demoRow("1007", "Adem Karic", "BIH", "FK Mostar", "ST (C)", 24, "€8.4M", "€21K", 64, 76, [16, 11, 9, 12, 14, 13, 12, 15, 10, 16]),
    demoRow("1008", "Oskar Lund", "DEN", "Aarhus 1902", "D/WB (L)", 19, "€3.1M", "€9K", 50, 84, [7, 12, 11, 10, 15, 14, 16, 14, 13, 8]),
  ];

  const secondRows: RawRow[] = [
    demoRow("1001", "Nico Falk", "GER", "Hansa Nordstadt", "AM (R), ST (C)", 20, "€12.5M", "€22K", 63, 88, [15, 17, 13, 16, 17, 18, 14, 18, 13, 16]),
    demoRow("1002", "Mika Voss", "AUT", "Rheinbrueck", "DM, M (C)", 22, "€9.1M", "€23K", 66, 82, [9, 11, 17, 14, 13, 13, 19, 18, 16, 10]),
    demoRow("1003", "Jonas Bell", "ENG", "Southgate Athletic", "D (C)", 24, "€10.4M", "€38K", 69, 79, [5, 7, 14, 11, 13, 12, 15, 16, 15, 6]),
    demoRow("1004", "Tiago Moura", "POR", "Estrela Praia", "M/AM (L)", 19, "€8.8M", "€15K", 60, 91, [14, 18, 12, 17, 17, 17, 12, 16, 12, 15]),
    demoRow("1005", "Lars Eklund", "SWE", "IFK Sund", "GK", 21, "€2.7M", "€10K", 55, 79, [2, 3, 9, 8, 10, 11, 12, 15, 14, 4]),
    demoRow("1006", "Enzo Ritter", "SUI", "Baselstadt", "WB/M (R)", 23, "€6.9M", "€19K", 61, 80, [12, 14, 13, 14, 16, 16, 17, 16, 13, 12]),
    demoRow("1007", "Adem Karic", "BIH", "FK Mostar", "ST (C)", 25, "€7.5M", "€24K", 65, 76, [17, 11, 9, 12, 14, 13, 12, 15, 11, 17]),
    demoRow("1008", "Oskar Lund", "DEN", "Aarhus 1902", "D/WB (L)", 20, "€5.9M", "€13K", 57, 85, [8, 13, 12, 11, 16, 15, 17, 15, 14, 9]),
    demoRow("1009", "Rafael Simoes", "BRA", "Curitiba Azul", "AM (C)", 18, "€1.6M", "€5K", 46, 87, [11, 15, 13, 16, 13, 14, 9, 14, 12, 12]),
  ];

  return [
    createSnapshot(firstRows, demoHeaders(), "2025/26", "demo_2025_26.csv"),
    createSnapshot(secondRows, demoHeaders(), "2026/27", "demo_2026_27.csv"),
  ].map((snapshot, index) => ({
    ...snapshot,
    id: `demo-${index + 1}`,
    uploadedAt: `2026-06-${10 + index}T12:00:00.000Z`,
  }));
}

function demoRow(
  uid: string,
  player: string,
  nation: string,
  club: string,
  position: string,
  age: number,
  value: string,
  wage: string,
  ability: number,
  potential: number,
  attrs: number[]
): RawRow {
  const [
    finishing,
    dribbling,
    passing,
    technique,
    pace,
    acceleration,
    workRate,
    determination,
    decisions,
    offTheBall,
  ] = attrs;
  const squadNumber = String(Number(uid.slice(-2)) || 10);

  return {
    UID: uid,
    Aufgestellt: position.includes("GK") ? "TW" : position.includes("D") ? "V" : position.includes("ST") ? "ST" : "M",
    Info: "",
    Player: player,
    Nation: nation,
    Club: club,
    Position: position,
    Idealpos: position.split(",")[0],
    "Geb.": `1.7.${2026 - age}`,
    "Größe": `${175 + (Number(uid.slice(-1)) % 18)} cm`,
    "Nr.": squadNumber,
    Age: String(age),
    "Transfer Value": value,
    Wage: wage,
    "Einsätze": `${30 + (Number(uid.slice(-1)) % 12)}`,
    Minuten: `${2200 + Number(uid.slice(-1)) * 143}`,
    Tore: String(position.includes("ST") || position.includes("AM") ? Number(uid.slice(-1)) + 6 : Number(uid.slice(-1)) % 3),
    Vorlagen: String(Number(uid.slice(-1)) + 2),
    Wertung: `7,0${Number(uid.slice(-1)) % 9}`,
    "Pas %": `${78 + (Number(uid.slice(-1)) % 14)} %`,
    Persönlichkeit: Number(uid.slice(-1)) % 2 ? "Professionell" : "Energisch",
    "Linker Fuß": "Gut",
    "Rechter Fuß": "Sehr stark",
    Medienbeschreibung: position.includes("GK") ? "Torwart" : position.includes("ST") ? "Stuermer" : "Talent",
    Endet: `30.6.${2027 + (Number(uid.slice(-1)) % 3)}`,
    Ability: String(ability),
    Potential: String(potential),
    Finishing: String(finishing),
    Dribbling: String(dribbling),
    Passing: String(passing),
    Technique: String(technique),
    Pace: String(pace),
    Acceleration: String(acceleration),
    "Work Rate": String(workRate),
    Determination: String(determination),
    Decisions: String(decisions),
    "Off The Ball": String(offTheBall),
  };
}

function demoHeaders() {
  return Object.keys(demoRow("0", "", "", "", "", 0, "", "", 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
}

function findHeader(headers: string[], candidates: string[]) {
  const headerTokens = headers.map((header) => ({
    original: header,
    normalized: normalizeHeader(header),
    compacted: compact(header),
  }));
  const candidateTokens = candidates.map((candidate) => ({
    normalized: normalizeHeader(candidate),
    compacted: compact(candidate),
  }));

  for (const candidate of candidateTokens) {
    const exact = headerTokens.find((header) => header.compacted === candidate.compacted);
    if (exact) {
      return exact.original;
    }
  }

  for (const candidate of candidateTokens) {
    if (candidate.compacted.length < 4) {
      continue;
    }
    const partial = headerTokens.find((header) => header.normalized.includes(candidate.normalized));
    if (partial) {
      return partial.original;
    }
  }

  return null;
}

function read(row: RawRow, header: string | null) {
  if (!header) {
    return "";
  }

  return String(row[header] ?? "").trim();
}

function readAny(row: RawRow, candidates: string[]) {
  const header = findHeader(Object.keys(row), candidates);
  return read(row, header);
}

function parseAttribute(raw: string) {
  const value = parseMaybeNumber(raw);
  if (value === null || value < 1 || value > 20) {
    return null;
  }

  return Math.round(value);
}

function parseRating(raw: string) {
  if (!raw) {
    return null;
  }

  const starMatches = raw.match(/★/g);
  const halfMatches = raw.match(/[½]/g);
  if (starMatches || halfMatches) {
    return Math.min(100, ((starMatches?.length ?? 0) + (halfMatches?.length ?? 0) * 0.5) * 20);
  }

  const numeric = parseMaybeNumber(raw);
  if (numeric === null) {
    return null;
  }

  if (numeric <= 5) {
    return numeric * 20;
  }

  if (numeric <= 20) {
    return numeric * 5;
  }

  return Math.min(100, numeric);
}

function parseMoney(raw: string) {
  const value = raw.replace(/\u00a0/g, " ").trim().toLowerCase();

  if (!value || /^(-|n\/a|none|unknown|unbekannt)$/.test(value)) {
    return null;
  }

  const rangeParts = value.split(/\s(?:-|–|—|to|bis)\s/).filter(Boolean);
  if (rangeParts.length === 2) {
    const parsed = rangeParts.map(parseMoneyPart).filter((part): part is number => part !== null);
    return parsed.length === 2 ? (parsed[0] + parsed[1]) / 2 : parsed[0] ?? null;
  }

  return parseMoneyPart(value);
}

function parseMoneyPart(raw: string) {
  let value = raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[€£$]/g, "")
    .replace(/mio\.?/g, "m")
    .replace(/million(en)?/g, "m")
    .replace(/mrd\.?|bio\.?|bn|billion/g, "b")
    .replace(/tausend/g, "k");
  const multiplier = value.includes("b") ? 1_000_000_000 : value.includes("m") ? 1_000_000 : value.includes("k") ? 1_000 : 1;
  value = value.replace(/[a-z]/g, "").replace(/[^0-9,.-]/g, "");
  const parsed = parseLocalizedNumber(value);
  return parsed === null ? null : parsed * multiplier;
}

function parseMaybeNumber(raw: string) {
  const match = raw.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function parseLocalizedNumber(value: string) {
  if (!value) {
    return null;
  }

  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");
  let normalized = value;

  if (lastComma >= 0 && lastDot >= 0) {
    const decimal = lastComma > lastDot ? "," : ".";
    const thousands = decimal === "," ? "." : ",";
    normalized = normalized.split(thousands).join("").replace(decimal, ".");
  } else if (lastComma >= 0) {
    const parts = normalized.split(",");
    normalized = parts.at(-1)?.length === 3 && parts.length > 1 ? parts.join("") : normalized.replace(",", ".");
  } else if (lastDot >= 0) {
    const parts = normalized.split(".");
    normalized = parts.at(-1)?.length === 3 && parts.length > 1 ? parts.join("") : normalized;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function sortPlayers(a: PlayerAggregate, b: PlayerAggregate, mode: SortMode) {
  if (mode === "name") {
    return a.name.localeCompare(b.name);
  }

  if (mode === "growth") {
    return (b.valueDelta ?? -Infinity) - (a.valueDelta ?? -Infinity);
  }

  if (mode === "potential") {
    return (b.latest.potentialScore ?? -Infinity) - (a.latest.potentialScore ?? -Infinity);
  }

  if (mode === "recommendation") {
    return b.recommendation - a.recommendation;
  }

  return (b.latest.value ?? -Infinity) - (a.latest.value ?? -Infinity);
}

function matchesBucket(position: string, bucket: PositionBucket) {
  const value = normalizeHeader(position);

  if (bucket === "Alle") {
    return true;
  }

  if (bucket === "Tor") {
    return /\bgk\b|\btw\b|goalkeeper|torwart/.test(value);
  }

  if (bucket === "Abwehr") {
    return /\bd\b|\bv\b|def|wb|cb|fb|lib|iv|av|verteidiger/.test(value);
  }

  if (bucket === "Mittelfeld") {
    return /\bdm\b|\bmc?\b|\bam\b|mid|zm|dm|om|mittelfeld/.test(value);
  }

  return /\bst\b|\bs\b|striker|forward|cf|af|tj|stuermer|sturmer/.test(value);
}

function average(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "-";
  }

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mrd. €`;
  }

  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio. €`;
  }

  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toLocaleString("de-DE", { maximumFractionDigits: 0 })} Tsd. €`;
  }

  return `${sign}${abs.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €`;
}

function formatDelta(value: number | null) {
  if (value === null) {
    return "-";
  }

  return `${value >= 0 ? "+" : ""}${formatMoney(value)}`;
}

function formatAttributeDelta(value: number) {
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return value > 0 ? `+${rounded}` : rounded;
}

function formatInteger(value: number) {
  return value.toLocaleString("de-DE", { maximumFractionDigits: 0 });
}

function scoreLabel(value: number | null | undefined) {
  return value === null || value === undefined ? "-" : `${Math.round(value)}/100`;
}

function compactPosition(position: string) {
  return position || "-";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "FM";
}

function shortSeason(season: string) {
  return season.replace(/^20/, "").replace("/20", "/");
}

function inferSeasonLabel(fileName: string, index: number) {
  const compactName = fileName.replace(/\.[^.]+$/, "");
  const season = compactName.match(/20\d{2}\s*[-_/]\s*\d{2,4}/)?.[0];
  if (season) {
    return season.replace(/\s+/g, "").replace(/[-_]/g, "/");
  }

  const year = compactName.match(/20\d{2}/)?.[0];
  return year ? `Saison ${year}` : `Datenstand ${index}`;
}

function firstPlayerKey(snapshots: Snapshot[]) {
  return snapshots.at(-1)?.players[0]?.key ?? "";
}

function normalizeHeader(value: string) {
  return value
    .replace(/ß/g, "ss")
    .replace(/ẞ/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeSearch(value: string) {
  return normalizeHeader(value);
}

function roleKey(value: string) {
  return String(value ?? "")
    .replace(/ß/g, "ss")
    .replace(/ẞ/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .replace(/[^a-z0-9]+/g, "");
}

function compact(value: string) {
  return normalizeHeader(value).replace(/\s+/g, "");
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fileToDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

async function fetchPublicLibrary() {
  try {
    const response = await fetch("/api/library", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const library = (await response.json()) as StoredLibrary;
    return Array.isArray(library.snapshots) ? library : null;
  } catch {
    return null;
  }
}

async function publishLibrary(snapshots: Snapshot[], playerImages: Record<string, string>, password: string) {
  const response = await fetch("/api/library", {
    body: JSON.stringify({ playerImages, snapshots }),
    headers: {
      "content-type": "application/json",
      "x-admin-password": password,
    },
    method: "POST",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Veroeffentlichung fehlgeschlagen");
  }
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function idbGet<T>(key: string) {
  const db = await openDb();
  return new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve((request.result as T) ?? null);
    tx.oncomplete = () => db.close();
  });
}

async function idbSet<T>(key: string, value: T) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const request = tx.objectStore(STORE_NAME).put(value, key);
    request.onerror = () => reject(request.error);
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

async function idbDelete(key: string) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const request = tx.objectStore(STORE_NAME).delete(key);
    request.onerror = () => reject(request.error);
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}
