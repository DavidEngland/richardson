import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Info } from 'lucide-react';

const MOSTStabilityTool = () => {
  const [profile, setProfile] = useState('BD71');
  const [regime, setRegime] = useState('full');
  const [showTable, setShowTable] = useState(false);
  const [conversionMode, setConversionMode] = useState('rig_to_zeta');
  const [inputValue, setInputValue] = useState('0.1');
  const [conversionResult, setConversionResult] = useState(null);

  // Canonical profile parameters
  const profiles = {
    BD71: {
      name: 'Businger-Dyer 1971',
      unstable: { am: 16, ah: 16, bm: 0.25, bh: 0.5 },
      stable: { bm: 5, bh: 5 }
    },
    HOG88: {
      name: 'Högström 1988',
      unstable: { am: 19.3, ah: 11.6, bm: 0.25, bh: 0.5 },
      stable: { bm: 6, bh: 7.8 }
    },
    CB05: {
      name: 'Cheng-Brutsaert 2005',
      unstable: { am: 16, ah: 16, bm: 0.25, bh: 0.5 },
      stable: { bm: 6.1, bh: 6.1, cm: 5.3, ch: 5.3 }
    }
  };

  // Stability functions phi_m and phi_h
  const phi_m = (zeta, prof) => {
    const p = profiles[prof];
    if (zeta < 0) {
      return Math.pow(1 - p.unstable.am * zeta, -p.unstable.bm);
    } else {
      if (prof === 'CB05') {
        return 1 + p.stable.bm * zeta + p.stable.cm * zeta * zeta;
      }
      return 1 + p.stable.bm * zeta;
    }
  };

  const phi_h = (zeta, prof) => {
    const p = profiles[prof];
    if (zeta < 0) {
      return Math.pow(1 - p.unstable.ah * zeta, -p.unstable.bh);
    } else {
      if (prof === 'CB05') {
        return 1 + p.stable.bh * zeta + p.stable.ch * zeta * zeta;
      }
      return 1 + p.stable.bh * zeta;
    }
  };

  // Gradient Richardson number
  const ri_g = (zeta, prof) => {
    const pm = phi_m(zeta, prof);
    const ph = phi_h(zeta, prof);
    return zeta * ph / (pm * pm);
  };

  // Integral stability functions (Psi) - numerical integration
  const psi_m = (zeta, prof) => {
    if (Math.abs(zeta) < 1e-10) return 0;

    const p = profiles[prof];
    if (zeta < 0) {
      // Analytical for BD71-type unstable
      const x = Math.pow(1 - p.unstable.am * zeta, 0.25);
      return 2 * Math.log((1 + x) / 2) + Math.log((1 + x * x) / 2) - 2 * Math.atan(x) + Math.PI / 2;
    } else {
      // Numerical integration for stable
      const steps = 100;
      const dz = zeta / steps;
      let sum = 0;
      for (let i = 1; i <= steps; i++) {
        const z = i * dz;
        sum += (1 / phi_m(z, prof) - 1) * dz;
      }
      return sum;
    }
  };

  const psi_h = (zeta, prof) => {
    if (Math.abs(zeta) < 1e-10) return 0;

    const p = profiles[prof];
    if (zeta < 0) {
      // Analytical for BD71-type unstable
      const y = Math.pow(1 - p.unstable.ah * zeta, 0.5);
      return 2 * Math.log((1 + y) / 2);
    } else {
      // Numerical integration for stable
      const steps = 100;
      const dz = zeta / steps;
      let sum = 0;
      for (let i = 1; i <= steps; i++) {
        const z = i * dz;
        sum += (1 / phi_h(z, prof) - 1) * dz;
      }
      return sum;
    }
  };

  // Bulk Richardson number (simplified form assuming z >> z0)
  const ri_b = (zeta, prof) => {
    const psim = psi_m(zeta, prof);
    const psih = psi_h(zeta, prof);
    return zeta * (Math.log(zeta) - psih) / Math.pow(Math.log(zeta) - psim, 2);
  };

  // Newton's method: Ri_g -> zeta
  const zeta_from_rig = (rig_target, prof, initial_guess = 0.1) => {
    let zeta = initial_guess;
    const tol = 1e-10;
    const max_iter = 100;

    for (let i = 0; i < max_iter; i++) {
      const f = ri_g(zeta, prof) - rig_target;
      if (Math.abs(f) < tol) return zeta;

      // Numerical derivative
      const dz = 1e-8;
      const df = (ri_g(zeta + dz, prof) - ri_g(zeta - dz, prof)) / (2 * dz);

      if (Math.abs(df) < 1e-15) break;
      zeta = zeta - f / df;

      // Bounds checking
      if (zeta < -10) zeta = -10;
      if (zeta > 10) zeta = 10;
    }
    return zeta;
  };

  // Newton's method: Ri_b -> zeta
  const zeta_from_rib = (rib_target, prof, initial_guess = 0.1) => {
    let zeta = initial_guess;
    const tol = 1e-10;
    const max_iter = 100;

    for (let i = 0; i < max_iter; i++) {
      if (Math.abs(zeta) < 1e-10) zeta = 1e-10; // Avoid singularity

      const f = ri_b(zeta, prof) - rib_target;
      if (Math.abs(f) < tol) return zeta;

      // Numerical derivative
      const dz = 1e-8;
      const df = (ri_b(zeta + dz, prof) - ri_b(zeta - dz, prof)) / (2 * dz);

      if (Math.abs(df) < 1e-15) break;
      zeta = zeta - f / df;

      // Bounds checking
      if (zeta < -10) zeta = -10;
      if (zeta > 10) zeta = 10;
    }
    return zeta;
  };

  // Generate reference data
  const referenceData = useMemo(() => {
    const data = [];
    let zetaRange = [];

    if (regime === 'unstable') {
      zetaRange = Array.from({ length: 101 }, (_, i) => -10 + i * 0.1);
    } else if (regime === 'stable') {
      zetaRange = Array.from({ length: 101 }, (_, i) => i * 0.1);
    } else {
      zetaRange = Array.from({ length: 201 }, (_, i) => -10 + i * 0.1);
    }

    for (const zeta of zetaRange) {
      const pm = phi_m(zeta, profile);
      const ph = phi_h(zeta, profile);
      const rig = ri_g(zeta, profile);
      const rib = Math.abs(zeta) > 1e-5 ? ri_b(zeta, profile) : 0;

      data.push({
        zeta: parseFloat(zeta.toFixed(4)),
        phi_m: parseFloat(pm.toFixed(4)),
        phi_h: parseFloat(ph.toFixed(4)),
        Ri_g: parseFloat(rig.toFixed(4)),
        Ri_b: parseFloat(rib.toFixed(4))
      });
    }

    return data;
  }, [profile, regime]);

  // Handle conversion
  const handleConversion = () => {
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      setConversionResult({ error: 'Invalid input' });
      return;
    }

    let result = {};

    try {
      if (conversionMode === 'rig_to_zeta') {
        const zeta = zeta_from_rig(input, profile, input > 0 ? 0.1 : -0.1);
        result = {
          input: `Ri_g = ${input}`,
          zeta: zeta.toFixed(6),
          Ri_b: ri_b(zeta, profile).toFixed(6),
          phi_m: phi_m(zeta, profile).toFixed(4),
          phi_h: phi_h(zeta, profile).toFixed(4)
        };
      } else if (conversionMode === 'rib_to_zeta') {
        const zeta = zeta_from_rib(input, profile, input > 0 ? 0.1 : -0.1);
        result = {
          input: `Ri_b = ${input}`,
          zeta: zeta.toFixed(6),
          Ri_g: ri_g(zeta, profile).toFixed(6),
          phi_m: phi_m(zeta, profile).toFixed(4),
          phi_h: phi_h(zeta, profile).toFixed(4)
        };
      } else if (conversionMode === 'zeta_to_all') {
        const zeta = input;
        result = {
          input: `ζ = ${input}`,
          Ri_g: ri_g(zeta, profile).toFixed(6),
          Ri_b: ri_b(zeta, profile).toFixed(6),
          phi_m: phi_m(zeta, profile).toFixed(4),
          phi_h: phi_h(zeta, profile).toFixed(4)
        };
      }
      setConversionResult(result);
    } catch (e) {
      setConversionResult({ error: 'Conversion failed' });
    }
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ['zeta', 'phi_m', 'phi_h', 'Ri_g', 'Ri_b'];
    const csv = [
      headers.join(','),
      ...referenceData.map(row =>
        headers.map(h => row[h]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MOST_reference_${profile}_${regime}.csv`;
    a.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          MOST Stability Universal Reference Tool
        </h1>
        <p className="text-gray-600 mb-4">
          Canonical reference data and conversions for Monin-Obukhov Similarity Theory
        </p>

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">About this tool:</p>
            <p>Provides high-precision (10⁻¹⁰ tolerance) conversions between stability parameters:
            ζ (z/L), Ri_g (gradient Richardson), and Ri_b (bulk Richardson) using canonical MOST profiles.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Function
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {Object.entries(profiles).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stability Regime
            </label>
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="full">Full Range (ζ: -10 to 10)</option>
              <option value="unstable">Unstable (ζ: -10 to 0)</option>
              <option value="stable">Stable (ζ: 0 to 10)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowTable(!showTable)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showTable ? 'Hide' : 'Show'} Table
            </button>
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        {/* Conversion Tool */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Parameter Conversion</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Conversion Type
              </label>
              <select
                value={conversionMode}
                onChange={(e) => setConversionMode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="rig_to_zeta">Ri_g → ζ (and Ri_b)</option>
                <option value="rib_to_zeta">Ri_b → ζ (and Ri_g)</option>
                <option value="zeta_to_all">ζ → All parameters</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Input Value
              </label>
              <input
                type="number"
                step="0.001"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleConversion}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Convert
              </button>
            </div>
          </div>

          {conversionResult && (
            <div className="bg-white border border-gray-300 rounded p-4">
              {conversionResult.error ? (
                <p className="text-red-600">{conversionResult.error}</p>
              ) : (
                <div>
                  <p className="font-semibold text-gray-700 mb-2">{conversionResult.input}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(conversionResult).filter(([k]) => k !== 'input').map(([key, val]) => (
                      <div key={key} className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-600">{key}</p>
                        <p className="text-lg font-mono font-bold text-gray-800">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Stability Relationships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">ζ vs Richardson Numbers</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={referenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zeta" label={{ value: 'ζ = z/L', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Richardson Number', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Ri_g" stroke="#8884d8" dot={false} name="Ri_g" />
                  <Line type="monotone" dataKey="Ri_b" stroke="#82ca9d" dot={false} name="Ri_b" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-gray-200 rounded p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Stability Functions φ</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={referenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zeta" label={{ value: 'ζ = z/L', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'φ', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="phi_m" stroke="#ff7300" dot={false} name="φ_m" />
                  <Line type="monotone" dataKey="phi_h" stroke="#d84aff" dot={false} name="φ_h" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Reference Table */}
        {showTable && (
          <div className="overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reference Data Table</h2>
            <div className="max-h-96 overflow-y-auto border border-gray-300 rounded">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ζ</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">φ_m</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">φ_h</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ri_g</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ri_b</th>
                  </tr>
                </thead>
                <tbody>
                  {referenceData.map((row, i) => (
                    <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-mono">{row.zeta}</td>
                      <td className="px-4 py-2 text-sm font-mono">{row.phi_m}</td>
                      <td className="px-4 py-2 text-sm font-mono">{row.phi_h}</td>
                      <td className="px-4 py-2 text-sm font-mono">{row.Ri_g}</td>
                      <td className="px-4 py-2 text-sm font-mono">{row.Ri_b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Current Profile: {profiles[profile].name}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Unstable (ζ < 0):</p>
              <p className="font-mono text-gray-600">
                φ_m = (1 - {profiles[profile].unstable.am}ζ)^(-{profiles[profile].unstable.bm})
              </p>
              <p className="font-mono text-gray-600">
                φ_h = (1 - {profiles[profile].unstable.ah}ζ)^(-{profiles[profile].unstable.bh})
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Stable (ζ > 0):</p>
              <p className="font-mono text-gray-600">
                φ_m = 1 + {profiles[profile].stable.bm}ζ
                {profiles[profile].stable.cm && ` + ${profiles[profile].stable.cm}ζ²`}
              </p>
              <p className="font-mono text-gray-600">
                φ_h = 1 + {profiles[profile].stable.bh}ζ
                {profiles[profile].stable.ch && ` + ${profiles[profile].stable.ch}ζ²`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MOSTStabilityTool;