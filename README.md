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