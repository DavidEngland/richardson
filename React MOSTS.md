The React component you provided, `MOSTStabilityTool`, is a sophisticated, self-contained application for Monin-Obukhov Similarity Theory (MOST) stability conversions.

To make this React application runnable and functional, you need a standard development environment that includes **Node.js**, **npm (or yarn)**, and a modern **React framework** like Create React App (CRA), Next.js, or Vite.

Here is a step-by-step guide covering the necessary external dependencies, required files, and execution commands.

-----

## 🛠️ Requirements to Run the Code

This code relies on external libraries for charting, icons, and the React framework itself.

### 1\. External Dependencies (Libraries)

You need to install the following packages into your project's dependencies:

  * **`react`** and **`react-dom`**: Core React libraries.
  * **`recharts`**: The charting library used for visualizations.
  * **`lucide-react`**: The icon library used for the Download and Info icons.
  * **`tailwindcss`**: The styling framework referenced by class names (e.g., `bg-white`, `shadow-lg`, `text-3xl`).

### 2\. Required Setup Steps

Assuming you start with a new project using **Vite** (a fast, modern toolchain):

#### Step 1: Create a React Project (if starting fresh)

```bash
npm create vite@latest most-stability-tool -- --template react
cd most-stability-tool
npm install
```

#### Step 2: Install Dependencies

You must install the specific packages imported in the code:

```bash
npm install recharts lucide-react
```

#### Step 3: Install and Configure Tailwind CSS

Since the code uses Tailwind CSS utility classes, you must install and initialize it:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then, you need to update two configuration files:

**A. `tailwind.config.js`:** Configure Tailwind to scan your React files.

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**B. `src/index.css` (or equivalent global CSS file):** Import Tailwind's base styles.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Add basic body styling here */
body {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 3\. File Structure and Placement

The provided code is a functional React component. It needs to be saved and imported correctly.

**A. Save the Code:**
Create a file named `MOSTStabilityTool.jsx` inside the `src/` directory and paste your entire code into it.

```
/most-stability-tool
└── /src
    ├── **MOSTStabilityTool.jsx** (Your component code goes here)
    ├── App.jsx
    └── main.jsx
```

**B. Integrate into `App.jsx`:**
Replace the contents of the default `App.jsx` to render your component.

```jsx
import MOSTStabilityTool from './MOSTStabilityTool';

function App() {
  return (
    <div className="App">
      <MOSTStabilityTool />
    </div>
  );
}

export default App;
```

### 4\. Running the Application

Execute the start command defined in your `package.json` (usually `npm run dev` for Vite or `npm start` for CRA):

```bash
npm run dev
```

Your browser should open to the local development server (e.g., `http://localhost:5173`), and the interactive tool will be visible.

-----

## 🧪 Quick Note on the MOST Physics Implementation

The **physics implementation** within the component is sophisticated, but the $\text{Ri}_b$ calculation contains a simplification that requires attention:

The $\text{Ri}_b$ function uses `Math.log(zeta)` in the denominator, which is mathematically incorrect for the standard $\text{Ri}_b$ formula.

The correct term in the denominator should be $\ln(z/z_0)$, where $z_0$ is the roughness length. The code appears to be attempting to use $\zeta = z/L$ to approximate the profile, but $\ln(z)$ where $z$ is $z/L$ is not the standard $\ln(z/z_0)$ term.

$$\text{Ri}_b(\zeta, \frac{z_0}{z}) = \frac{\zeta [\ln(z/z_0) - \Psi_h(\zeta)]}{[\ln(z/z_0) - \Psi_m(\zeta)]^2}$$

*The component's current implementation for the denominator is:*

```javascript
// Incorrectly uses Math.log(zeta) as a proxy for ln(z/z0)
const denominator = Math.pow(Math.log(zeta) - psim, 2);
```

**To make the $\text{Ri}_b$ calculation physically accurate, you would need to:**

1.  Add a `z_over_z0` parameter (e.g., set to a common value like $1000$ for $z=10\text{m}, z_0=0.01\text{m}$) to the component's state or constants.
2.  Replace `Math.log(zeta)` with `Math.log(Z_OVER_Z0_CONST)` in the `ri_b` function.

Would you like me to provide a quick fix for the `ri_b` function by including a canonical $z/z_0$ value?

-----

## 📦 Standalone HTML/JS Alternative (No React)

If React is problematic, use a single HTML page plus a small `most.js` with the same physics. Suggested placement:
```
web/
├─ index.html
└─ most.js
```

Key points:
- Implement φ_m, φ_h, ψ_m, ψ_h, Ri_g, Ri_b in `most.js`.
- Use `SURFACE_PARAMS.Z_OVER_Z0 = 1000` so Ri_b uses ln(z/z0) correctly.
- Expose functions via `window.MOST = { ... }`.

Example `web/most.js` sketch to copy:
```html
<script>
(function(){
  const profiles = {
    BD71: { unstable:{am=16,ah=16,bm=0.25,bh=0.5}, stable:{bm=5,bh=5} },
    HOG88: { unstable:{am=19.3,ah=11.6,bm=0.25,bh=0.5}, stable:{bm=6,bh=7.8} },
    CB05: { unstable:{am=16,ah=16,bm=0.25,bh=0.5}, stable:{bm=6.1,bh=6.1,cm=5.3,ch=5.3} }
  };
  const NUM = { PSI_STEPS=100, SINGULAR=1e-10, DZ=1e-8, BOUNDS=[-10,10] };
  const SURFACE = { Z_OVER_Z0: 1000 };

  const phi_m = (z, p) => {
    const prof = profiles[p];
    if (z < 0) return Math.pow(1 - prof.unstable.am*z, -prof.unstable.bm);
    return p==='CB05' ? 1 + prof.stable.bm*z + (prof.stable.cm||0)*z*z : 1 + prof.stable.bm*z;
  };
  const phi_h = (z, p) => {
    const prof = profiles[p];
    if (z < 0) return Math.pow(1 - prof.unstable.ah*z, -prof.unstable.bh);
    return p==='CB05' ? 1 + prof.stable.bh*z + (prof.stable.ch||0)*z*z : 1 + prof.stable.bh*z;
  };
  const psi_m = (z, p) => {
    if (Math.abs(z) < NUM.SINGULAR) return 0;
    const prof = profiles[p];
    if (z < 0) {
      const x = Math.pow(1 - prof.unstable.am*z, 0.25);
      return 2*Math.log((1+x)/2) + Math.log((1+x*x)/2) - 2*Math.atan(x) + Math.PI/2;
    }
    const steps = NUM.PSI_STEPS, dz = z/steps; let sum = 0;
    for (let i=1;i<=steps;i++){ const zi=i*dz; sum += (1/phi_m(zi,p)-1)*dz; }
    return sum;
  };
  const psi_h = (z, p) => {
    if (Math.abs(z) < NUM.SINGULAR) return 0;
    const prof = profiles[p];
    if (z < 0) { const y = Math.pow(1 - prof.unstable.ah*z, 0.5); return 2*Math.log((1+y)/2); }
    const steps = NUM.PSI_STEPS, dz = z/steps; let sum = 0;
    for (let i=1;i<=steps;i++){ const zi=i*dz; sum += (1/phi_h(zi,p)-1)*dz; }
    return sum;
  };
  const ri_g = (z, p) => { const pm=phi_m(z,p), ph=phi_h(z,p); return z*ph/(pm*pm); };
  const ri_b = (z, p) => {
    if (Math.abs(z) < NUM.SINGULAR) return 0;
    const lnz = Math.log(SURFACE.Z_OVER_Z0);
    if (!(lnz>0)) return 0;
    const psim = psi_m(z,p), psih = psi_h(z,p);
    const denom = Math.pow(lnz - psim, 2);
    return denom < 1e-15 ? 0 : z*(lnz - psih)/denom;
  };
  const zeta_from_rig = (rig, p, guess=0.1) => {
    let z=guess;
    for (let i=0;i<100;i++){
      const f = ri_g(z,p) - rig;
      if (Math.abs(f) < 1e-10) return z;
      const df = (ri_g(z+NUM.DZ,p)-ri_g(z-NUM.DZ,p))/(2*NUM.DZ);
      if (Math.abs(df) < 1e-15) break;
      z = Math.max(NUM.BOUNDS[0], Math.min(NUM.BOUNDS[1], z - f/df));
    }
    return z;
  };
  const zeta_from_rib = (rib, p, guess=0.1) => {
    let z=guess;
    for (let i=0;i<100;i++){
      if (Math.abs(z) < NUM.SINGULAR) z = NUM.SINGULAR;
      const f = ri_b(z,p) - rib;
      if (Math.abs(f) < 1e-10) return z;
      const df = (ri_b(z+NUM.DZ,p)-ri_b(z-NUM.DZ,p))/(2*NUM.DZ);
      if (Math.abs(df) < 1e-15) break;
      z = Math.max(NUM.BOUNDS[0], Math.min(NUM.BOUNDS[1], z - f/df));
    }
    return z;
  };
  window.MOST = { phi_m, phi_h, psi_m, psi_h, ri_g, ri_b, zeta_from_rig, zeta_from_rib, SURFACE };
})();
</script>
```

Open `web/index.html` in your browser to run it locally. No Node.js or bundlers required.