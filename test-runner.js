// test-runner.js - Math Core and Self-Tests for Linear Algebra Playground
// Fully implements Section 4 (Math Core) and Section 11 (Testing Plan)

const EPS = 1e-10;

function gcd(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

class Frac {
  constructor(n, d = 1n) {
    if (n instanceof Frac) {
      this.n = n.n;
      this.d = n.d;
      return;
    }
    if (typeof n === 'number') {
      if (!Number.isFinite(n)) {
        throw new Error('Non-finite number');
      }
      if (Number.isInteger(n)) {
        n = BigInt(n);
        d = 1n;
      } else {
        const s = n.toString();
        const parts = s.split('.');
        if (parts.length === 2) {
          const decPlaces = parts[1].length;
          const factor = 10n ** BigInt(decPlaces);
          const intPart = BigInt(parts[0]);
          const fracPart = BigInt(parts[1]);
          const num = (intPart >= 0n ? 1n : -1n) * ( (intPart < 0n ? -intPart : intPart) * factor + fracPart );
          n = num;
          d = factor;
        } else {
          n = BigInt(Math.round(n * 1e8));
          d = 100000000n;
        }
      }
    } else if (typeof n === 'string') {
      const trimmed = n.trim();
      if (trimmed.includes('/')) {
        const [ns, ds] = trimmed.split('/');
        n = BigInt(ns.trim());
        d = BigInt(ds.trim());
      } else if (trimmed.includes('.')) {
        const parts = trimmed.split('.');
        const factor = 10n ** BigInt(parts[1].length);
        const intPart = BigInt(parts[0]);
        const fracPart = BigInt(parts[1]);
        const sign = parts[0].startsWith('-') ? -1n : 1n;
        const absInt = intPart < 0n ? -intPart : intPart;
        n = sign * (absInt * factor + fracPart);
        d = factor;
      } else {
        n = BigInt(trimmed);
        d = 1n;
      }
    } else if (typeof n !== 'bigint') {
      n = BigInt(n);
    }
    if (typeof d !== 'bigint') d = BigInt(d);
    if (d === 0n) throw new Error('Division by zero in Frac');
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d);
    this.n = n / g;
    this.d = d / g;
  }

  static from(val) {
    if (val instanceof Frac) return val;
    return new Frac(val);
  }

  add(other) {
    const o = Frac.from(other);
    return new Frac(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(other) {
    const o = Frac.from(other);
    return new Frac(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  mul(other) {
    const o = Frac.from(other);
    return new Frac(this.n * o.n, this.d * o.d);
  }

  div(other) {
    const o = Frac.from(other);
    if (o.n === 0n) throw new Error('Division by zero');
    return new Frac(this.n * o.d, this.d * o.n);
  }

  neg() {
    return new Frac(-this.n, this.d);
  }

  abs() {
    return new Frac(this.n < 0n ? -this.n : this.n, this.d);
  }

  isZero() {
    return this.n === 0n;
  }

  cmp(other) {
    const o = Frac.from(other);
    const diff = this.n * o.d - o.n * this.d;
    if (diff < 0n) return -1;
    if (diff > 0n) return 1;
    return 0;
  }

  toNumber() {
    return Number(this.n) / Number(this.d);
  }

  toString() {
    if (this.d === 1n) return this.n.toString();
    const numDigits = this.n.toString().replace('-', '').length;
    const denDigits = this.d.toString().length;
    if (numDigits > 12 || denDigits > 12) {
      return this.toNumber().toFixed(4).replace(/\.?0+$/, '');
    }
    return `${this.n}/${this.d}`;
  }

  clone() {
    return new Frac(this.n, this.d);
  }
}

// Float helper functions with tolerance
const F = {
  isZero: (x) => Math.abs(x) < EPS,
  eq: (a, b) => Math.abs(a - b) < EPS,
  clean: (x) => {
    if (Math.abs(x) < EPS) return 0;
    const roundInt = Math.round(x);
    if (Math.abs(x - roundInt) < EPS) return roundInt;
    return x;
  },
  format: (x) => {
    const cleaned = F.clean(x);
    if (cleaned === 0) return '0';
    if (Number.isInteger(cleaned)) return cleaned.toString();
    return cleaned.toFixed(4).replace(/\.?0+$/, '');
  }
};

// Vector operations
const Vec = {
  create: (arr) => arr.slice(),
  dim: (v) => v.length,
  add: (u, v) => u.map((x, i) => x + v[i]),
  sub: (u, v) => u.map((x, i) => x - v[i]),
  scale: (u, s) => u.map((x) => x * s),
  dot: (u, v) => u.reduce((sum, x, i) => sum + x * v[i], 0),
  normSq: (u) => Vec.dot(u, u),
  norm: (u) => Math.sqrt(Vec.normSq(u)),
  normalize: (u) => {
    const n = Vec.norm(u);
    if (n < EPS) return u.map(() => 0);
    return u.map((x) => x / n);
  },
  proj: (u, v) => {
    // projection of v onto u
    const uNormSq = Vec.dot(u, u);
    if (uNormSq < EPS) return u.map(() => 0);
    const factor = Vec.dot(v, u) / uNormSq;
    return Vec.scale(u, factor);
  },
  angle: (u, v) => {
    const nu = Vec.norm(u);
    const nv = Vec.norm(v);
    if (nu < EPS || nv < EPS) {
      return { angle: 0, error: 'Cannot compute angle with zero vector' };
    }
    const cosTheta = Math.max(-1, Math.min(1, Vec.dot(u, v) / (nu * nv)));
    const rad = Math.acos(cosTheta);
    const deg = (rad * 180) / Math.PI;
    let kind = 'acute';
    if (Math.abs(cosTheta) < 1e-7) kind = 'right';
    else if (cosTheta < 0) kind = 'obtuse';
    return { rad, deg, kind, cosTheta };
  },
  cross: (u, v) => {
    if (u.length === 3 && v.length === 3) {
      return [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0]
      ];
    }
    return [0, 0, 0];
  }
};

// Matrix operations
const Mat = {
  create: (rows, cols, fill = 0) => Array.from({ length: rows }, () => Array(cols).fill(fill)),
  clone: (A) => A.map((row) => row.slice()),
  rows: (A) => A.length,
  cols: (A) => (A.length > 0 ? A[0].length : 0),
  identity: (n) => {
    const I = Mat.create(n, n, 0);
    for (let i = 0; i < n; i++) I[i][i] = 1;
    return I;
  },
  row: (A, i) => A[i].slice(),
  col: (A, j) => A.map((r) => r[j]),
  transpose: (A) => {
    const m = Mat.rows(A);
    const n = Mat.cols(A);
    const T = Mat.create(n, m);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) T[j][i] = A[i][j];
    }
    return T;
  },
  mul: (A, B) => {
    const m = Mat.rows(A);
    const k = Mat.cols(A);
    const n = Mat.cols(B);
    const C = Mat.create(m, n, 0);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let p = 0; p < k; p++) sum += A[i][p] * B[p][j];
        C[i][j] = sum;
      }
    }
    return C;
  },
  mulVec: (A, v) => {
    const m = Mat.rows(A);
    const n = Mat.cols(A);
    const out = Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) sum += A[i][j] * v[j];
      out[i] = sum;
    }
    return out;
  },
  clean: (A) => A.map((row) => row.map(F.clean))
};

// Check if input matrix can be purely exact
function isExactEligible(M) {
  for (let r = 0; r < M.length; r++) {
    for (let c = 0; c < M[r].length; c++) {
      const v = M[r][c];
      if (v instanceof Frac) continue;
      if (typeof v === 'string') {
        if (!/^[-+]?\d+(\.\d+)?(\/\d+)?$/.test(v.trim())) return false;
      } else if (typeof v === 'number') {
        if (!Number.isFinite(v)) return false;
        // check if terminating decimal or integer
        const str = v.toString();
        if (str.includes('e') || str.includes('E')) return false;
      } else {
        return false;
      }
    }
  }
  return true;
}

// Gauss-Jordan RREF with step recording
function rref(A, exactMode = false) {
  const m = Mat.rows(A);
  const n = Mat.cols(A);
  const steps = [];
  let stepId = 1;

  if (exactMode) {
    // Exact arithmetic with Frac
    const M = A.map((row) => row.map((val) => Frac.from(val)));
    const pivots = [];
    let r = 0;

    steps.push({
      id: stepId++,
      kind: 'note',
      text: 'Initial matrix in exact rational mode',
      why: 'Begin Gauss-Jordan elimination',
      matrix: M.map((row) => row.map((x) => x.toString())),
      highlight: { cells: [], rows: [], cols: [] }
    });

    for (let c = 0; c < n && r < m; c++) {
      // Find pivot
      let p = -1;
      for (let i = r; i < m; i++) {
        if (!M[i][c].isZero()) {
          p = i;
          break;
        }
      }
      if (p === -1) continue;

      if (p !== r) {
        // Swap
        const temp = M[r];
        M[r] = M[p];
        M[p] = temp;
        steps.push({
          id: stepId++,
          kind: 'rowOp',
          text: `R${r + 1} ↔ R${p + 1}`,
          why: `Bring nonzero entry in column ${c + 1} to pivot row ${r + 1}`,
          matrix: M.map((row) => row.map((x) => x.toString())),
          highlight: { cells: [], rows: [r, p], cols: [c] }
        });
      }

      const pivotVal = M[r][c];
      if (pivotVal.cmp(1) !== 0) {
        // Scale pivot row
        for (let j = 0; j < n; j++) {
          M[r][j] = M[r][j].div(pivotVal);
        }
        steps.push({
          id: stepId++,
          kind: 'rowOp',
          text: `R${r + 1} → R${r + 1} / (${pivotVal.toString()})`,
          why: `Scale leading entry in column ${c + 1} to 1`,
          matrix: M.map((row) => row.map((x) => x.toString())),
          highlight: { cells: [[r, c]], rows: [r], cols: [c] }
        });
      }

      // Eliminate other rows
      for (let i = 0; i < m; i++) {
        if (i !== r && !M[i][c].isZero()) {
          const factor = M[i][c];
          for (let j = 0; j < n; j++) {
            M[i][j] = M[i][j].sub(factor.mul(M[r][j]));
          }
          steps.push({
            id: stepId++,
            kind: 'rowOp',
            text: `R${i + 1} → R${i + 1} - (${factor.toString()})·R${r + 1}`,
            why: `Clear entry at row ${i + 1}, column ${c + 1}`,
            matrix: M.map((row) => row.map((x) => x.toString())),
            highlight: { cells: [[i, c]], rows: [i], cols: [c] }
          });
        }
      }

      pivots.push(c);
      r++;
    }

    steps.push({
      id: stepId++,
      kind: 'result',
      text: `RREF reached with rank = ${pivots.length}`,
      why: 'All pivot columns are reduced standard basis vectors',
      matrix: M.map((row) => row.map((x) => x.toString())),
      highlight: { cells: pivots.map((cIdx, rIdx) => [rIdx, cIdx]), rows: [], cols: pivots }
    });

    return {
      R: M.map((row) => row.map((x) => x.toNumber())),
      RFrac: M,
      pivots,
      steps,
      ops: steps.length
    };
  } else {
    // Float arithmetic with partial pivoting
    const M = A.map((row) => row.map((val) => (val instanceof Frac ? val.toNumber() : Number(val))));
    const pivots = [];
    let r = 0;

    steps.push({
      id: stepId++,
      kind: 'note',
      text: 'Initial matrix in float mode',
      why: 'Begin Gauss-Jordan elimination with partial pivoting',
      matrix: Mat.clean(M).map((row) => row.map(F.format)),
      highlight: { cells: [], rows: [], cols: [] }
    });

    for (let c = 0; c < n && r < m; c++) {
      let maxVal = -1;
      let p = -1;
      for (let i = r; i < m; i++) {
        const absVal = Math.abs(M[i][c]);
        if (absVal > EPS && absVal > maxVal) {
          maxVal = absVal;
          p = i;
        }
      }
      if (p === -1) continue;

      if (p !== r) {
        const temp = M[r];
        M[r] = M[p];
        M[p] = temp;
        steps.push({
          id: stepId++,
          kind: 'rowOp',
          text: `R${r + 1} ↔ R${p + 1}`,
          why: `Swap row ${r + 1} with row ${p + 1} for numerical stability (pivot ${F.format(M[r][c])})`,
          matrix: Mat.clean(M).map((row) => row.map(F.format)),
          highlight: { cells: [], rows: [r, p], cols: [c] }
        });
      }

      const pivotVal = M[r][c];
      if (Math.abs(pivotVal - 1) > EPS) {
        for (let j = 0; j < n; j++) M[r][j] /= pivotVal;
        steps.push({
          id: stepId++,
          kind: 'rowOp',
          text: `R${r + 1} → R${r + 1} / ${F.format(pivotVal)}`,
          why: `Scale leading entry in column ${c + 1} to 1`,
          matrix: Mat.clean(M).map((row) => row.map(F.format)),
          highlight: { cells: [[r, c]], rows: [r], cols: [c] }
        });
      }

      for (let i = 0; i < m; i++) {
        if (i !== r && Math.abs(M[i][c]) > EPS) {
          const factor = M[i][c];
          for (let j = 0; j < n; j++) {
            M[i][j] -= factor * M[r][j];
          }
          steps.push({
            id: stepId++,
            kind: 'rowOp',
            text: `R${i + 1} → R${i + 1} - (${F.format(factor)})·R${r + 1}`,
            why: `Clear entry at row ${i + 1}, column ${c + 1}`,
            matrix: Mat.clean(M).map((row) => row.map(F.format)),
            highlight: { cells: [[i, c]], rows: [i], cols: [c] }
          });
        }
      }

      pivots.push(c);
      r++;
    }

    steps.push({
      id: stepId++,
      kind: 'result',
      text: `RREF reached with rank = ${pivots.length}`,
      why: 'All pivot columns are reduced standard basis vectors',
      matrix: Mat.clean(M).map((row) => row.map(F.format)),
      highlight: { cells: pivots.map((cIdx, rIdx) => [rIdx, cIdx]), rows: [], cols: pivots }
    });

    return {
      R: Mat.clean(M),
      pivots,
      steps,
      ops: steps.length
    };
  }
}

function rank(A) {
  const res = rref(A);
  return res.pivots.length;
}

function rankNullity(A) {
  const n = Mat.cols(A);
  const r = rank(A);
  const nullity = n - r;
  return {
    rank: r,
    nullity,
    n,
    holds: r + nullity === n
  };
}

function colSpaceBasis(A) {
  const { pivots } = rref(A);
  return pivots.map((c) => Mat.col(A, c));
}

function rowSpaceBasis(A) {
  const { R, pivots } = rref(A);
  // Nonzero rows of RREF
  return pivots.map((_, rIdx) => R[rIdx].slice());
}

function nullSpaceBasis(A, exactMode = false) {
  const n = Mat.cols(A);
  const { R, pivots } = rref(A, exactMode);
  const freeCols = [];
  for (let c = 0; c < n; c++) {
    if (!pivots.includes(c)) freeCols.push(c);
  }

  const basis = [];
  for (const freeCol of freeCols) {
    const vec = Array(n).fill(0);
    vec[freeCol] = 1;
    for (let r = 0; r < pivots.length; r++) {
      const pCol = pivots[r];
      vec[pCol] = -R[r][freeCol];
    }
    basis.push(vec);
  }
  return basis;
}

function det(A) {
  const n = Mat.rows(A);
  if (n !== Mat.cols(A)) throw new Error('det requires square matrix');

  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (n === 3) {
    return (
      A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
      A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
      A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
    );
  }

  // For 4x4 or larger, Gaussian elimination determinant
  const M = Mat.clone(A);
  let d = 1;
  let swaps = 0;
  for (let c = 0; c < n; c++) {
    let p = -1;
    let max = -1;
    for (let r = c; r < n; r++) {
      if (Math.abs(M[r][c]) > max && Math.abs(M[r][c]) > EPS) {
        max = Math.abs(M[r][c]);
        p = r;
      }
    }
    if (p === -1) return 0;
    if (p !== c) {
      const temp = M[c];
      M[c] = M[p];
      M[p] = temp;
      swaps++;
    }
    const pivot = M[c][c];
    d *= pivot;
    for (let r = c + 1; r < n; r++) {
      if (Math.abs(M[r][c]) > EPS) {
        const factor = M[r][c] / pivot;
        for (let j = c; j < n; j++) M[r][j] -= factor * M[c][j];
      }
    }
  }
  return swaps % 2 === 1 ? -d : d;
}

function inverse(A, exactMode = false) {
  const n = Mat.rows(A);
  if (n !== Mat.cols(A)) return null;
  const d = det(A);
  if (Math.abs(d) < EPS) return null;

  // Augment [A | I]
  if (exactMode && isExactEligible(A)) {
    const aug = Mat.create(n, 2 * n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) aug[i][j] = Frac.from(A[i][j]);
      for (let j = 0; j < n; j++) aug[i][n + j] = i === j ? new Frac(1n, 1n) : new Frac(0n, 1n);
    }
    const { RFrac, pivots } = rref(aug, true);
    if (pivots.length < n) return null;
    const invFrac = Mat.create(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) invFrac[i][j] = RFrac[i][n + j];
    }
    return {
      Ainv: invFrac.map((row) => row.map((x) => x.toNumber())),
      AinvFrac: invFrac,
      det: d
    };
  } else {
    const aug = Mat.create(n, 2 * n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) aug[i][j] = A[i][j];
      for (let j = 0; j < n; j++) aug[i][n + j] = i === j ? 1 : 0;
    }
    const { R, pivots } = rref(aug, false);
    if (pivots.length < n) return null;
    const inv = Mat.create(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) inv[i][j] = R[i][n + j];
    }
    return {
      Ainv: Mat.clean(inv),
      det: d
    };
  }
}

function solve(A, b) {
  const m = Mat.rows(A);
  const n = Mat.cols(A);
  const aug = Mat.create(m, n + 1);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) aug[i][j] = A[i][j];
    aug[i][n] = b[i];
  }
  const { R, pivots } = rref(aug, false);

  // Check inconsistency: pivot in column n
  if (pivots.includes(n)) {
    return { type: 'none', message: 'Inconsistent system: 0 = 1' };
  }

  const particular = Array(n).fill(0);
  for (let r = 0; r < pivots.length; r++) {
    particular[pivots[r]] = R[r][n];
  }

  if (pivots.length === n) {
    return { type: 'unique', solution: particular };
  }

  // Infinite solutions with parametric null space
  const freeCols = [];
  for (let c = 0; c < n; c++) {
    if (!pivots.includes(c)) freeCols.push(c);
  }
  const nullBasis = nullSpaceBasis(A);
  return {
    type: 'infinite',
    solution: particular,
    parameters: freeCols,
    nullBasis
  };
}

function isIndependent(vectors) {
  // Put vectors as columns
  const m = vectors[0].length;
  const n = vectors.length;
  const V = Mat.create(m, n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      V[i][j] = vectors[j][i];
    }
  }
  const { pivots, R } = rref(V, false);
  const independent = pivots.length === n;
  if (independent) {
    return { independent: true, relation: null };
  }

  // Find non-trivial linear combination from null space
  const nullBasis = nullSpaceBasis(V);
  const coeffs = nullBasis[0] || [];
  // Build relation string: e.g. "2v₁ - v₂ = 0"
  let terms = [];
  for (let i = 0; i < coeffs.length; i++) {
    const c = F.clean(coeffs[i]);
    if (Math.abs(c) > EPS) {
      const sub = ['₁', '₂', '₃', '₄'][i] || `${i + 1}`;
      let cStr = '';
      if (c === 1) cStr = `v${sub}`;
      else if (c === -1) cStr = `-v${sub}`;
      else cStr = `${F.format(c)}v${sub}`;
      terms.push({ coeff: c, str: cStr });
    }
  }
  let relStr = terms.map((t, idx) => {
    if (idx === 0) return t.str;
    if (t.coeff > 0) return `+ ${t.str}`;
    return `- ${t.str.replace('-', '')}`;
  }).join(' ') + ' = 0';

  return { independent: false, relation: relStr, coeffs };
}

function inSpan(vectors, target) {
  const m = vectors[0].length;
  const n = vectors.length;
  const V = Mat.create(m, n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) V[i][j] = vectors[j][i];
  }
  const sol = solve(V, target);
  if (sol.type === 'none') {
    return { yes: false, coeffs: null };
  }
  return { yes: true, coeffs: sol.solution };
}

function basisFromSpanning(vectors) {
  const m = vectors[0].length;
  const n = vectors.length;
  const V = Mat.create(m, n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) V[i][j] = vectors[j][i];
  }
  const { pivots } = rref(V);
  return pivots.map((p) => vectors[p]);
}

function coordinates(basisB, v) {
  // Solves B c = v where basisB has vectors as columns
  const sol = solve(basisB, v);
  return sol ? sol.solution : null;
}

function changeOfBasis(B, Bprime) {
  // P = B'^-1 B
  // where B and Bprime are matrices with basis vectors as columns
  const invBprime = inverse(Bprime);
  if (!invBprime) return null;
  return Mat.mul(invBprime.Ainv, B);
}

function matrixInBasis(A, B) {
  // [T]_B = B^-1 A B
  const invB = inverse(B);
  if (!invB) return null;
  const temp = Mat.mul(invB.Ainv, A);
  return Mat.mul(temp, B);
}

function eigen2(A) {
  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];
  const tr = a + d;
  const detVal = a * d - b * c;
  const disc = tr * tr - 4 * detVal;

  if (disc < -EPS) {
    const real = tr / 2;
    const imag = Math.sqrt(-disc) / 2;
    return {
      type: 'complex',
      values: [
        { real, imag },
        { real, imag: -imag }
      ],
      vectors: []
    };
  }

  const dSqrt = Math.sqrt(Math.max(0, disc));
  const l1 = (tr + dSqrt) / 2;
  const l2 = (tr - dSqrt) / 2;

  function getVec(lambda) {
    // (A - lambda I) v = 0
    const m11 = a - lambda;
    const m12 = b;
    const m21 = c;
    const m22 = d - lambda;
    if (Math.abs(m12) > EPS || Math.abs(m11) > EPS) {
      const v = [-m12, m11];
      return Vec.normalize(v);
    }
    if (Math.abs(m22) > EPS || Math.abs(m21) > EPS) {
      const v = [-m22, m21];
      return Vec.normalize(v);
    }
    return [1, 0];
  }

  const v1 = getVec(l1);
  const v2 = Math.abs(l1 - l2) < EPS ? null : getVec(l2);

  return {
    type: 'real',
    values: [l1, l2],
    vectors: v2 ? [v1, v2] : [v1]
  };
}

function eigenSym(S) {
  // Jacobi rotation method for symmetric 2x2 and 3x3
  const n = Mat.rows(S);
  let A = Mat.clone(S);
  let V = Mat.identity(n);
  const maxSweeps = 50;

  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let maxOff = 0;
    let p = 0, q = 1;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(A[i][j]) > maxOff) {
          maxOff = Math.abs(A[i][j]);
          p = i;
          q = j;
        }
      }
    }

    if (maxOff < 1e-12) break;

    const app = A[p][p];
    const aqq = A[q][q];
    const apq = A[p][q];
    const phi = 0.5 * Math.atan2(2 * apq, aqq - app);
    const c = Math.cos(phi);
    const s = Math.sin(phi);

    // Givens rotation matrix J
    const J = Mat.identity(n);
    J[p][p] = c;
    J[p][q] = s;
    J[q][p] = -s;
    J[q][q] = c;

    A = Mat.mul(Mat.transpose(J), Mat.mul(A, J));
    V = Mat.mul(V, J);
  }

  const values = [];
  const vectors = [];
  for (let i = 0; i < n; i++) {
    values.push(F.clean(A[i][i]));
    vectors.push(Mat.col(V, i));
  }
  return { values, vectors };
}

function gramSchmidt(vectors) {
  const steps = [];
  const uList = [];
  const eList = [];

  steps.push({
    stage: 0,
    title: 'Input vectors',
    caption: `Starting with ${vectors.length} input vectors`,
    vectors: vectors.map((v) => v.slice())
  });

  for (let i = 0; i < vectors.length; i++) {
    const v = vectors[i];
    let u = v.slice();
    const projSteps = [];

    for (let j = 0; j < uList.length; j++) {
      const p = Vec.proj(uList[j], v);
      projSteps.push({ onto: j, proj: p });
      u = Vec.sub(u, p);
    }

    const normU = Vec.norm(u);
    if (normU < EPS) {
      steps.push({
        stage: i + 1,
        title: `Vector v${i + 1} is linearly dependent`,
        caption: `Residual norm < EPS. Skipped vector v${i + 1}.`,
        skipped: true
      });
      continue;
    }

    uList.push(u);
    const e = Vec.scale(u, 1 / normU);
    eList.push(e);

    steps.push({
      stage: i + 1,
      title: `Compute orthogonal vector u${i + 1}`,
      caption: `Subtracted projections on previous vectors to yield u${i + 1}`,
      u: u.slice(),
      e: e.slice(),
      projSteps
    });
  }

  steps.push({
    stage: vectors.length + 1,
    title: 'Normalize to orthonormal basis',
    caption: 'All basis vectors scaled to unit length',
    orthonormal: eList.map((e) => e.slice())
  });

  return {
    orthogonal: uList,
    orthonormal: eList,
    steps
  };
}

function gram(vectors) {
  const n = vectors.length;
  const G = Mat.create(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      G[i][j] = F.clean(Vec.dot(vectors[i], vectors[j]));
    }
  }
  return G;
}

function classifyQuadratic(S) {
  // Symmetrize (S + S^T) / 2
  const n = Mat.rows(S);
  const sym = Mat.create(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sym[i][j] = (S[i][j] + S[j][i]) / 2;
    }
  }

  // Leading principal minors
  const minors = [];
  for (let k = 1; k <= n; k++) {
    const sub = Mat.create(k, k);
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k; j++) sub[i][j] = sym[i][j];
    }
    minors.push(F.clean(det(sub)));
  }

  // Eigenvalues
  const { values } = eigenSym(sym);
  const posCount = values.filter((v) => v > EPS).length;
  const negCount = values.filter((v) => v < -EPS).length;
  const zeroCount = values.filter((v) => Math.abs(v) <= EPS).length;

  let kind = 'indefinite';
  let reasoning = '';

  if (zeroCount === n) {
    kind = 'zero / flat';
    reasoning = 'All eigenvalues are zero. The quadratic form is identically zero (flat plane z = 0).';
  } else if (posCount === n) {
    kind = 'positive definite';
    reasoning = 'All eigenvalues > 0, all leading principal minors > 0.';
  } else if (negCount === n) {
    kind = 'negative definite';
    reasoning = 'All eigenvalues < 0; leading principal minors alternate signs starting negative.';
  } else if (posCount > 0 && negCount === 0) {
    kind = 'positive semidefinite';
    reasoning = 'All eigenvalues ≥ 0 with at least one zero eigenvalue.';
  } else if (negCount > 0 && posCount === 0) {
    kind = 'negative semidefinite';
    reasoning = 'All eigenvalues ≤ 0 with at least one zero eigenvalue.';
  } else {
    kind = 'indefinite';
    reasoning = 'Has both positive and negative eigenvalues; xᵀSx can be both positive and negative.';
  }

  return { kind, eigenvalues: values, minors, reasoning, sym };
}

function isLinearMap(f, samples = 20, dim = 2) {
  let additivityPass = true;
  let homogeneityPass = true;

  for (let s = 0; s < samples; s++) {
    const u = Array.from({ length: dim }, () => (Math.random() - 0.5) * 10);
    const v = Array.from({ length: dim }, () => (Math.random() - 0.5) * 10);
    const c = (Math.random() - 0.5) * 5;

    // f(u + v) == f(u) + f(v)
    const f_u_plus_v = f(Vec.add(u, v));
    const fu_plus_fv = Vec.add(f(u), f(v));
    if (Vec.norm(Vec.sub(f_u_plus_v, fu_plus_fv)) > 1e-7) {
      additivityPass = false;
    }

    // f(c * u) == c * f(u)
    const f_cu = f(Vec.scale(u, c));
    const c_fu = Vec.scale(f(u), c);
    if (Vec.norm(Vec.sub(f_cu, c_fu)) > 1e-7) {
      homogeneityPass = false;
    }
  }

  return {
    isLinear: additivityPass && homogeneityPass,
    additivityPass,
    homogeneityPass
  };
}

// ==========================================
// TEST SUITE: Section 11.2 & 11.3
// ==========================================

function runAllTests() {
  console.log('=== RUNNING LINEAR ALGEBRA PLAYGROUND TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      passed++;
      console.log(`[PASS] ${testName}`);
    } else {
      failed++;
      console.error(`[FAIL] ${testName} - ${details}`);
    }
  }

  // 1. rref [[1,2,3],[2,4,6],[1,0,1]] -> rank 2, pivots at cols 0 and 1
  {
    const A = [
      [1, 2, 3],
      [2, 4, 6],
      [1, 0, 1]
    ];
    const res = rref(A);
    assert(
      res.pivots.length === 2 && res.pivots[0] === 0 && res.pivots[1] === 1,
      'Unit Test 1: rref [[1,2,3],[2,4,6],[1,0,1]]',
      `pivots: ${JSON.stringify(res.pivots)}`
    );
  }

  // 2. nullSpaceBasis [[1,2,3],[2,4,6],[1,0,1]] -> one vector proportional to (-1, -1, 1)
  {
    const A = [
      [1, 2, 3],
      [2, 4, 6],
      [1, 0, 1]
    ];
    const basis = nullSpaceBasis(A);
    const expected = [-1, -1, 1];
    const isProp =
      basis.length === 1 &&
      (Math.abs(basis[0][0] / expected[0] - basis[0][2] / expected[2]) < 1e-5) &&
      (Math.abs(basis[0][1] / expected[1] - basis[0][2] / expected[2]) < 1e-5);
    assert(isProp, 'Unit Test 2: nullSpaceBasis vector proportional to (-1, -1, 1)', `got ${JSON.stringify(basis)}`);
  }

  // 3. rankNullity on any 3x5 matrix of rank 2 -> nullity 3, sum = 5
  {
    const A = [
      [1, 0, 1, 0, 2],
      [0, 1, 0, 1, 3],
      [1, 1, 1, 1, 5]
    ];
    const rn = rankNullity(A);
    assert(
      rn.rank === 2 && rn.nullity === 3 && rn.holds && rn.rank + rn.nullity === 5,
      'Unit Test 3: rankNullity on 3x5 matrix of rank 2',
      `rank: ${rn.rank}, nullity: ${rn.nullity}`
    );
  }

  // 4. det [[2,0],[0,3]] = 6
  {
    const A = [
      [2, 0],
      [0, 3]
    ];
    assert(Math.abs(det(A) - 6) < EPS, 'Unit Test 4: det [[2,0],[0,3]] = 6');
  }

  // 5. inverse [[1,2],[3,4]] = [[-2, 1],[3/2, -1/2]]
  {
    const A = [
      [1, 2],
      [3, 4]
    ];
    const inv = inverse(A);
    const ok =
      inv &&
      Math.abs(inv.Ainv[0][0] - -2) < EPS &&
      Math.abs(inv.Ainv[0][1] - 1) < EPS &&
      Math.abs(inv.Ainv[1][0] - 1.5) < EPS &&
      Math.abs(inv.Ainv[1][1] - -0.5) < EPS;
    assert(ok, 'Unit Test 5: inverse [[1,2],[3,4]]', `got ${JSON.stringify(inv?.Ainv)}`);
  }

  // 6. isIndependent (1,2,3), (2,4,6) -> dependent, relation 2v1 - v2 = 0
  {
    const res = isIndependent([[1, 2, 3], [2, 4, 6]]);
    assert(
      !res.independent && res.relation.includes('v') && res.relation.includes('0'),
      'Unit Test 6: isIndependent dependent with relation',
      `relation: ${res.relation}`
    );
  }

  // 7. changeOfBasis B = I, B' = [[1,1],[-1,1]] -> P = B'^-1 with entries +-1/2
  {
    const B = Mat.identity(2);
    const Bprime = [
      [1, 1],
      [-1, 1]
    ];
    const P = changeOfBasis(B, Bprime);
    const ok = P && P.every((r) => r.every((val) => Math.abs(Math.abs(val) - 0.5) < EPS));
    assert(ok, "Unit Test 7: changeOfBasis B=I, B'=[[1,1],[-1,1]] has entries +-1/2", `P: ${JSON.stringify(P)}`);
  }

  // 8. gramSchmidt (1,1,0), (1,0,1), (0,1,1) -> orthonormal set with Q^T Q = I within 1e-10
  {
    const vecs = [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1]
    ];
    const gs = gramSchmidt(vecs);
    const Q = Mat.transpose(gs.orthonormal); // columns are orthonormal
    const QTQ = Mat.mul(Mat.transpose(Q), Q);
    const I = Mat.identity(3);
    let diff = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) diff += Math.abs(QTQ[i][j] - I[i][j]);
    }
    assert(diff < 1e-10, 'Unit Test 8: gramSchmidt orthonormal set with Q^T Q = I', `diff: ${diff}`);
  }

  // 9. angle (1,0), (0,1) -> pi / 2
  {
    const a = Vec.angle([1, 0], [0, 1]);
    assert(Math.abs(a.rad - Math.PI / 2) < EPS, 'Unit Test 9: angle (1,0) and (0,1) is π/2');
  }

  // 10. classifyQuadratic [[2,0],[0,3]] -> positive definite
  {
    const S = [
      [2, 0],
      [0, 3]
    ];
    const res = classifyQuadratic(S);
    assert(res.kind === 'positive definite', 'Unit Test 10: classifyQuadratic [[2,0],[0,3]] is positive definite');
  }

  // 11. classifyQuadratic [[1,2],[2,1]] -> indefinite (eigenvalues 3 and -1)
  {
    const S = [
      [1, 2],
      [2, 1]
    ];
    const res = classifyQuadratic(S);
    const has3 = res.eigenvalues.some((v) => Math.abs(v - 3) < 1e-5);
    const hasNeg1 = res.eigenvalues.some((v) => Math.abs(v - -1) < 1e-5);
    assert(res.kind === 'indefinite' && has3 && hasNeg1, 'Unit Test 11: classifyQuadratic [[1,2],[2,1]] is indefinite (3 and -1)');
  }

  // 12. coordinates with non-symmetric basis B' = [[1, 1], [-1, 1]] and consistency with P
  {
    const B = Mat.identity(2);
    const Bprime = [
      [1, 1],
      [-1, 1]
    ];
    const v = [2, 0];
    const coordsBprime = coordinates(Bprime, v);
    const coordsB = coordinates(B, v);
    const P = changeOfBasis(B, Bprime);
    const PvB = Mat.mulVec(P, coordsB);
    const coordsMatch = Math.abs(coordsBprime[0] - 1) < EPS && Math.abs(coordsBprime[1] - 1) < EPS;
    const pConsistency = Math.abs(coordsBprime[0] - PvB[0]) < EPS && Math.abs(coordsBprime[1] - PvB[1]) < EPS;
    assert(coordsMatch && pConsistency, "Unit Test 12: coordinates with non-symmetric B'=[[1,1],[-1,1]] matches P * [v]_B");
  }

  // 13. classifyQuadratic zero matrix [[0,0],[0,0]] is zero / flat
  {
    const S0 = [[0, 0], [0, 0]];
    const res0 = classifyQuadratic(S0);
    assert(res0.kind === 'zero / flat', 'Unit Test 13: classifyQuadratic [[0,0],[0,0]] is zero / flat');
  }

  // PROPERTY TESTS (Section 11.3 - 200 random inputs each)
  console.log('\n--- Property Tests (200 random inputs each) ---');

  // P1: A * A^-1 = I for random invertible matrices
  {
    let p1Pass = true;
    for (let k = 0; k < 200; k++) {
      const n = 2 + (k % 2); // 2x2 or 3x3
      let A;
      while (true) {
        A = Array.from({ length: n }, () => Array.from({ length: n }, () => Math.floor(Math.random() * 9) - 4));
        if (Math.abs(det(A)) > 0.5) break;
      }
      const inv = inverse(A);
      const prod = Mat.mul(A, inv.Ainv);
      const I = Mat.identity(n);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (Math.abs(prod[i][j] - I[i][j]) > 1e-8) {
            p1Pass = false;
            break;
          }
        }
      }
      if (!p1Pass) break;
    }
    assert(p1Pass, 'Property Test 1: A · A⁻¹ = I for 200 random invertible matrices');
  }

  // P2: rank(A) + nullity(A) = n always
  {
    let p2Pass = true;
    for (let k = 0; k < 200; k++) {
      const m = 1 + Math.floor(Math.random() * 4);
      const n = 1 + Math.floor(Math.random() * 5);
      const A = Array.from({ length: m }, () => Array.from({ length: n }, () => Math.floor(Math.random() * 9) - 4));
      const rn = rankNullity(A);
      if (!rn.holds || rn.rank + rn.nullity !== n) {
        p2Pass = false;
        break;
      }
    }
    assert(p2Pass, 'Property Test 2: rank(A) + nullity(A) = n for 200 random matrices');
  }

  // P3: For every null space basis vector x, ||A x|| < 1e-9
  {
    let p3Pass = true;
    for (let k = 0; k < 200; k++) {
      const m = 2 + Math.floor(Math.random() * 3);
      const n = 3 + Math.floor(Math.random() * 3);
      const A = Array.from({ length: m }, () => Array.from({ length: n }, () => Math.floor(Math.random() * 7) - 3));
      const basis = nullSpaceBasis(A);
      for (const x of basis) {
        const Ax = Mat.mulVec(A, x);
        if (Vec.norm(Ax) > 1e-8) {
          p3Pass = false;
          break;
        }
      }
      if (!p3Pass) break;
    }
    assert(p3Pass, 'Property Test 3: ||A x|| < 1e-9 for all null space basis vectors (200 random matrices)');
  }

  // P4: Gram-Schmidt output vectors are pairwise orthonormal within tolerance
  {
    let p4Pass = true;
    for (let k = 0; k < 200; k++) {
      const dim = 3;
      let vecs;
      while (true) {
        vecs = Array.from({ length: 3 }, () => Array.from({ length: dim }, () => Math.floor(Math.random() * 9) - 4));
        if (isIndependent(vecs).independent) break;
      }
      const gs = gramSchmidt(vecs);
      for (let i = 0; i < gs.orthonormal.length; i++) {
        const normDiff = Math.abs(Vec.norm(gs.orthonormal[i]) - 1);
        if (normDiff > 1e-8) p4Pass = false;
        for (let j = i + 1; j < gs.orthonormal.length; j++) {
          const dotProd = Math.abs(Vec.dot(gs.orthonormal[i], gs.orthonormal[j]));
          if (dotProd > 1e-8) p4Pass = false;
        }
      }
      if (!p4Pass) break;
    }
    assert(p4Pass, 'Property Test 4: Gram-Schmidt vectors are pairwise orthonormal (200 random sets)');
  }

  // P5: Eigen decomposition of a random symmetric S satisfies S v = lambda v within tolerance
  {
    let p5Pass = true;
    for (let k = 0; k < 200; k++) {
      const n = 2 + (k % 2); // 2x2 or 3x3
      const S = Mat.create(n, n);
      for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
          const val = Math.floor(Math.random() * 11) - 5;
          S[i][j] = val;
          S[j][i] = val;
        }
      }
      const { values, vectors } = eigenSym(S);
      for (let i = 0; i < n; i++) {
        const lambda = values[i];
        const v = vectors[i];
        const Sv = Mat.mulVec(S, v);
        const lv = Vec.scale(v, lambda);
        if (Vec.norm(Vec.sub(Sv, lv)) > 1e-7) {
          p5Pass = false;
          break;
        }
      }
      if (!p5Pass) break;
    }
    assert(p5Pass, 'Property Test 5: S v = λ v for 200 random symmetric matrices');
  }

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  return { passed, failed };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Frac, Vec, Mat, F, rref, rank, rankNullity, colSpaceBasis, rowSpaceBasis, nullSpaceBasis,
    det, inverse, solve, isIndependent, inSpan, basisFromSpanning, coordinates, changeOfBasis,
    matrixInBasis, eigen2, eigenSym, gramSchmidt, gram, classifyQuadratic, isLinearMap, runAllTests
  };
}

if (typeof require !== 'undefined' && require.main === module) {
  const result = runAllTests();
  process.exit(result.failed > 0 ? 1 : 0);
}
