# DESIGN.md — SIAK UFD Design System & UI Tokens
*Standardized via `@pbakaus/impeccable` & `ui-ux-pro-max-skill`*

## 1. Product Modes
- **Operate Mode (Default for Portals):**
  - **Applied on:** Dashboard, FRS Online, Jadwal Kuliah, Input Nilai Dosen, Validasi Nilai BAK, Publikasi Nilai.
  - **Characteristics:** Information density, clear scanability, sticky table headers, instant hover feedback, compact 8–12px padding, zero visual fluff.
- **Read Mode (Academic Documents):**
  - **Applied on:** Kartu Rencana Studi (KRS), Kartu Hasil Studi (KHS), Transkrip Akademik Resmi.
  - **Characteristics:** Standardized A4 paper sheet ratio, formal typography, institutional Kop Surat, cryptographic verification hash (SHA-256), QR-validated digital signatures.

---

## 2. Color Palette & Semantic Tokens
*Curated from UI-UX Pro Max `colors.csv` (LMS / Academic Enterprise profile)*

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--primary` | `#237757` | Institutional Emerald (Primary action buttons, brand marker, active nav) |
| `--primary-dark` | `#1D302D` | Dark forest emerald (Hover state, dark toasts, high-contrast headers) |
| `--primary-light` | `#EBF5F0` | Soft pastel tint (Banner backgrounds, active selection backgrounds) |
| `--primary-border`| `#8EC5B0` | Subtle emerald border (Focus outlines, badge borders) |
| `--accent-amber`  | `#D97706` | Status: Menunggu Persetujuan / Draft diajukan |
| `--accent-green`  | `#166534` | Status: Disetujui (ACC) / Published / Passed |
| `--destructive`   | `#DC2626` | Status: Ditolak / Hapus mata kuliah / Batal |
| `--bg-main`       | `#F8FAFC` | Clean neutral slate canvas |
| `--bg-card`       | `#FFFFFF` | Crisp surface elevation |
| `--border-subtle` | `#E2E8F0` | Structural dividers and table grid borders |

---

## 3. Typography & Numerical Formatting
- **Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Tabular Figures (`font-mono`):** Applied to all student numbers (NIM, NIDN), scores (NA, Tugas, Kuis, UTS, UAS), GPA (IPS, IPK), SKS weights, and course codes.
- **Hierarchical Scale:**
  - Page Titles: `20px`, SemiBold `600`, tracking `-0.3px`
  - Section Headings: `16px`, Bold `700`
  - Body Text: `13px`, Regular `400`, line-height `1.5`
  - Metadata / Sublabels: `11.5px`, Regular `400`, color `#64748B`
  - Micro Badges: `10.5px`, SemiBold `600`

---

## 4. Anti-Patterns & Hard Quality Constraints
1. **Zero Emoji Rule:** Emojis are strictly banned in enterprise UI. All visual indicators must use crisp, vector SVG icons with 1.5–2px stroke weights.
2. **Zero Layout Shift:** Shell CSS enforces `overflow-x: hidden !important` on main containers to eliminate unwanted horizontal jumping.
3. **Responsive Degradation:** Tables maintain min-width with smooth horizontal containment inside `.table-responsive` cards, never forcing the browser viewport to overflow.
4. **Accessible Contrast:** Text on badges and cards strictly maintains minimum WCAG AA contrast (≥ 4.5:1).
