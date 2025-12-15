# richardson

**Canonical Reference Tools and Bias Corrections for Atmospheric Boundary Layer Stability**

A suite of open-source tools for researchers and operational meteorologists working with Monin-Obukhov Similarity Theory (MOST) and boundary layer stability analysis.

## 🌍 Overview

The atmospheric boundary layer (ABL) is critical to weather prediction, climate modeling, and air quality forecasting. Yet current models struggle with stability transitions and turbulence closure. This project bridges **analytic theory with practical tools**, providing:

- **Universal Reference Tables**: Error-controlled, canonical Richardson number conversions
- **Bias Correction Toolkit**: ML-enhanced diagnostics for climate model ABL errors
- **Interactive Educational Platform**: Jupyter notebooks and web tools for ABL pedagogy
- **Hybrid ML-Physics Surrogates**: Constrained machine learning emulators for flux prediction

## ✨ Features

### MOST Stability Tool (`MOST.js`)
- **High-precision conversions** (10⁻¹⁰ tolerance) between:
  - ζ (dimensionless height, z/L)
  - Ri_g (gradient Richardson number)
  - Ri_b (bulk Richardson number)
  - φ_m, φ_h (stability functions)

- **Multiple canonical profiles**:
  - Businger-Dyer 1971 (BD71)
  - Högström 1988 (HOG88)
  - Cheng-Brutsaert 2005 (CB05)

- **Interactive visualization** of stability relationships
- **CSV export** for reference data tables
- **Real-time parameter conversion** with numerical differentiation

### Planned Components
- [ ] Python bias correction toolkit (`richardson-corrections`)
- [ ] Hybrid ML-physics surrogate models
- [ ] Pedagogical Jupyter notebook series
- [ ] Collaborative validation platform

## 🚀 Quick Start

### MOST Tool (Web-based)
```bash
# Clone the repo
git clone https://github.com/DavidEngland/richardson.git
cd richardson

# Install dependencies (React + Recharts)
npm install

# Run development server
npm run dev
```

Then open `http://localhost:3000` and navigate to the MOST Stability Tool.

**Try it interactively:**
1. Select a profile function (BD71, HOG88, CB05)
2. Choose stability regime (unstable, stable, or full range)
3. Use the **Parameter Conversion** tool to convert between Ri_g, Ri_b, and ζ
4. Export reference tables as CSV

### Python Tools (Coming Soon)
```bash
pip install richardson-corrections
```

## 📊 Key Equations

### Stability Functions (example: Businger-Dyer 1971)

**Unstable (ζ < 0):**
```
φ_m(ζ) = (1 - 16ζ)^(-1/4)
φ_h(ζ) = (1 - 16ζ)^(-1/2)
```

**Stable (ζ > 0):**
```
φ_m(ζ) = 1 + 5ζ
φ_h(ζ) = 1 + 5ζ
```

### Richardson Numbers

**Gradient Richardson (local):**
```
Ri_g = (g/θ) * (dθ/dz) / (du/dz)²  ≈  ζ * φ_h / φ_m²
```

**Bulk Richardson (integrated):**
```
Ri_b ≈ ζ * [ln(z) - ψ_h] / [ln(z) - ψ_m]²
```

where ψ_m, ψ_h are integral stability functions.

## 📚 Resources

- **[Monin-Obukhov Similarity Theory](https://en.wikipedia.org/wiki/Monin%E2%80%93Obukhov_similarity_theory)** — Wikipedia overview
- **Businger et al. (1971)** — Flux-profile relationships in the atmospheric surface layer
- **Högström (1988)** — Non-dimensional wind and temperature profiles
- **Cheng & Brutsaert (2005)** — Logarithmic mean wind profiles and neutral stability

## 🛠️ Development Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed phasing:
1. **Phase 1 (Current)**: MOST tool + reference tables
2. **Phase 2**: Python bias correction toolkit
3. **Phase 3**: ML-physics surrogates + validation
4. **Phase 4**: Collaborative platform with UAH

## 🤝 Contributing

We welcome contributions from researchers, engineers, and educators. See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code style and testing requirements
- How to propose new features
- Validation and peer review process
- Attribution and collaboration guidelines

### Current Priorities
- [ ] Expand to additional profile functions (SHEBA, LES-derived)
- [ ] Python implementation of conversions
- [ ] Uncertainty quantification (Monte Carlo, Bayesian)
- [ ] Real-world model validation datasets
- [ ] Interactive Jupyter notebook tutorials

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

## ✉️ Contact & Collaboration

**David E. England, PhD**
University of Alabama in Huntsville (UAH)
📧 [your.email@uah.edu]
🔗 [linkedin.com/in/yourprofile](https://linkedin.com)

Interested in collaboration? Open an issue or reach out directly.

---

**Last updated**: January 2024 | **Status**: Active Development

## 🗂️ Suggested Folder Structure

Use a simple, portable layout that supports standalone web, React, and notebooks:
```
richardson/
├─ web/                 # Standalone HTML/JS (no build tools)
│  ├─ index.html        # Single page app with MOST tool
│  └─ most.js           # Physics functions and plotting
├─ react/               # React app (Vite/CRA)
│  └─ src/MOSTStabilityTool.jsx
├─ notebooks/           # Jupyter notebooks and data
│  └─ MOST_Reference.ipynb
├─ data/                # CSV exports, reference tables
├─ README.md
├─ MOST.js              # React component (current)
└─ projects.md
```

This lets you run the tool via a browser without Node, or via React, or in Jupyter.

## 🌐 Standalone HTML/JS (No React, No Build Tools)

If React is inconvenient on macOS, use a single HTML file:
1. Create `web/index.html` (see React MOSTS.md for a full example).
2. Open the file directly in your browser (double-click).

Key idea:
- Implement φ_m, φ_h, ψ_m, ψ_h, Ri_g, Ri_b in `web/most.js`.
- Use native inputs and Canvas/SVG libraries (or simple DOM elements) for charts.
- Keep SURFACE_PARAMS.Z_OVER_Z0 for physically correct Ri_b.

Minimal HTML sketch to copy:
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>MOST Stability Tool (Standalone)</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
  </head>
  <body>
    <h1>MOST Stability Tool (Standalone)</h1>
    <section>
      <label>Profile:
        <select id="profile">
          <option value="BD71">Businger-Dyer 1971</option>
          <option value="HOG88">Högström 1988</option>
          <option value="CB05">Cheng-Brutsaert 2005</option>
        </select>
      </label>
      <label>Conversion:
        <select id="mode">
          <option value="rig_to_zeta">Ri_g → ζ (and Ri_b)</option>
          <option value="rib_to_zeta">Ri_b → ζ (and Ri_g)</option>
          <option value="zeta_to_all">ζ → All parameters</option>
        </select>
      </label>
      <label>Input:
        <input id="input" type="number" step="0.001" value="0.1"/>
      </label>
      <button id="convert">Convert</button>
      <pre id="output"></pre>
    </section>
    <script src="./most.js"></script>
    <script>
      // Wire up UI (expects window.MOST with functions)
      const els = {
        profile: document.getElementById('profile'),
        mode: document.getElementById('mode'),
        input: document.getElementById('input'),
        output: document.getElementById('output'),
        convert: document.getElementById('convert')
      };
      els.convert.onclick = () => {
        const profile = els.profile.value;
        const mode = els.mode.value;
        const val = parseFloat(els.input.value);
        const { ri_b, ri_g, phi_m, phi_h, zeta_from_rig, zeta_from_rib } = window.MOST;
        if (Number.isNaN(val)) { els.output.textContent = 'Invalid input'; return; }
        let zeta, out = {};
        if (mode === 'rig_to_zeta') {
          zeta = zeta_from_rig(val, profile, val > 0 ? 0.1 : -0.1);
          out = { zeta, Ri_b: ri_b(zeta, profile), Ri_g: ri_g(zeta, profile), phi_m: phi_m(zeta, profile), phi_h: phi_h(zeta, profile) };
        } else if (mode === 'rib_to_zeta') {
          zeta = zeta_from_rib(val, profile, val > 0 ? 0.1 : -0.1);
          out = { zeta, Ri_b: ri_b(zeta, profile), Ri_g: ri_g(zeta, profile), phi_m: phi_m(zeta, profile), phi_h: phi_h(zeta, profile) };
        } else {
          zeta = val;
          out = { zeta, Ri_b: ri_b(zeta, profile), Ri_g: ri_g(zeta, profile), phi_m: phi_m(zeta, profile), phi_h: phi_h(zeta, profile) };
        }
        els.output.textContent = JSON.stringify(out, null, 2);
      };
    </script>
  </body>
</html>
```

## 📓 Jupyter Notebook Template (Copy/Paste)

For reproducible references without React, use this notebook JSON (create `notebooks/MOST_Reference.ipynb` later):

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": { "language": "markdown" },
      "source": [
        "# MOST Stability Reference",
        "Compute φ_m, φ_h, Ri_g, Ri_b vs ζ and export CSV."
      ]
    },
    {
      "cell_type": "code",
      "metadata": { "language": "python" },
      "source": [
        "import numpy as np",
        "import pandas as pd"
      ]
    },
    {
      "cell_type": "code",
      "metadata": { "language": "python" },
      "source": [
        "profiles = {",
        "  'BD71': {'unstable': {'am':16,'ah':16,'bm':0.25,'bh':0.5}, 'stable': {'bm':5,'bh':5}},",
        "  'HOG88': {'unstable': {'am':19.3,'ah':11.6,'bm':0.25,'bh':0.5}, 'stable': {'bm':6,'bh':7.8}},",
        "  'CB05': {'unstable': {'am':16,'ah':16,'bm':0.25,'bh':0.5}, 'stable': {'bm':6.1,'bh':6.1,'cm':5.3,'ch':5.3}}",
        "}",
        "NUM = {'PSI_STEPS':100, 'SINGULAR':1e-10}",
        "SURFACE = {'Z_OVER_Z0':1000.0}",
        "def phi_m(zeta, prof):",
        "    p = profiles[prof]",
        "    if zeta < 0:",
        "        return (1 - p['unstable']['am']*zeta)**(-p['unstable']['bm'])",
        "    if prof=='CB05':",
        "        return 1 + p['stable']['bm']*zeta + p['stable'].get('cm',0)*zeta*zeta",
        "    return 1 + p['stable']['bm']*zeta",
        "def phi_h(zeta, prof):",
        "    p = profiles[prof]",
        "    if zeta < 0:",
        "        return (1 - p['unstable']['ah']*zeta)**(-p['unstable']['bh'])",
        "    if prof=='CB05':",
        "        return 1 + p['stable']['bh']*zeta + p['stable'].get('ch',0)*zeta*zeta",
        "    return 1 + p['stable']['bh']*zeta",
        "def psi_m(zeta, prof):",
        "    if abs(zeta) < NUM['SINGULAR']: return 0.0",
        "    p = profiles[prof]",
        "    if zeta < 0:",
        "        x = (1 - p['unstable']['am']*zeta)**0.25",
        "        return 2*np.log((1+x)/2) + np.log((1+x*x)/2) - 2*np.arctan(x) + np.pi/2",
        "    steps = NUM['PSI_STEPS']",
        "    dz = zeta/steps",
        "    z = np.linspace(dz, zeta, steps)",
        "    return np.sum((1/np.array([phi_m(zi, prof) for zi in z]) - 1)*dz)",
        "def psi_h(zeta, prof):",
        "    if abs(zeta) < NUM['SINGULAR']: return 0.0",
        "    p = profiles[prof]",
        "    if zeta < 0:",
        "        y = (1 - p['unstable']['ah']*zeta)**0.5",
        "        return 2*np.log((1+y)/2)",
        "    steps = NUM['PSI_STEPS']",
        "    dz = zeta/steps",
        "    z = np.linspace(dz, zeta, steps)",
        "    return np.sum((1/np.array([phi_h(zi, prof) for zi in z]) - 1)*dz)",
        "def ri_g(zeta, prof):",
        "    pm = phi_m(zeta, prof); ph = phi_h(zeta, prof)",
        "    return zeta*ph/(pm*pm)",
        "def ri_b(zeta, prof):",
        "    if abs(zeta) < NUM['SINGULAR']: return 0.0",
        "    lnz = np.log(SURFACE['Z_OVER_Z0'])",
        "    psim = psi_m(zeta, prof); psih = psi_h(zeta, prof)",
        "    denom = (lnz - psim)**2",
        "    return 0.0 if denom < 1e-15 else zeta*(lnz - psih)/denom"
      ]
    },
    {
      "cell_type": "code",
      "metadata": { "language": "python" },
      "source": [
        "prof = 'BD71'",
        "zeta = np.linspace(-10, 10, 201)",
        "rows = []",
        "for z in zeta:",
        "    pm = phi_m(z, prof); ph = phi_h(z, prof)",
        "    rig = ri_g(z, prof); rib = ri_b(z, prof) if abs(z) > 1e-5 else 0.0",
        "    rows.append({'zeta':round(z,4),'phi_m':round(pm,4),'phi_h':round(ph,4),'Ri_g':round(rig,4),'Ri_b':round(rib,4)})",
        "df = pd.DataFrame(rows)",
        "df.head()"
      ]
    },
    {
      "cell_type": "code",
      "metadata": { "language": "python" },
      "source": [
        "df.to_csv('../data/MOST_reference_BD71_full.csv', index=False)"
      ]
    }
  ]
}
```

## 🧰 Troubleshooting on macOS (No React)

- Prefer the `web/` standalone: no Node, no bundlers.
- If using React, Vite is the least friction: `npm create vite@latest`.
- For notebooks, use `conda` or `pip` + `jupyterlab`.