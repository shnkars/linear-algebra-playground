# Linear Algebra Playground 📐

> **Course:** BAMAT205 Discrete Mathematics and Linear Algebra  
> **Syllabus Coverage:** Module 4 (Vector Spaces and Linear Transformations) & Module 5 (Inner Product Spaces)  
> **Application Type:** Interactive Single-Page Web Application  

[![Tests](https://img.shields.io/badge/tests-16%20passed%2C%200%20failed-brightgreen.svg)](#built-in-test-suite)
[![Architecture](https://img.shields.io/badge/architecture-zero%20build%20step-blue.svg)](#architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive, browser-based tool for students and educators to explore linear algebra geometrically and intuitively in real time. Every algorithm features live, step-by-step worked explanations generated directly by the underlying mathematical core.

---

## 🌟 Features by Lab

### 1. 🔄 Transformation Studio (2D & 3D)
- Directly manipulate linear transformations $\mathbf{x} \mapsto A\mathbf{x}$ in $\mathbb{R}^2$ and $\mathbb{R}^3$.
- Draggable basis vector handles for $\hat{i}$ (red) and $\hat{j}$ (green) with two-way data binding.
- Dynamic interpolation slider $t \in [0, 1]$ for $M(t) = (1 - t)I + tA$.
- Presets: Identity, Rotation (45°, 90°), Scaling, Shear, Reflections, Projections, and Singular Collapse.
- Real-time invariant eigenvector lines, signed determinant area shading (blue for orientation preservation, orange for orientation reversal), and singular collapse detection.

### 2. 🏛️ Subspaces & Rank-Nullity
- Dynamic $m \times n$ matrix editor ($m \le 4, n \le 5$) with row/column insertion.
- Step-by-step replayable Gauss-Jordan elimination (RREF) with pivot pulsing and explanations for every row operation.
- Color-coded pivot columns vs. free columns.
- Bases and dimension readouts for Column Space $\text{Col}(A)$, Row Space $\text{Row}(A)$, and Null Space $\text{Null}(A)$.
- Visual Rank-Nullity theorem bar: $\text{rank}(A) + \text{nullity}(A) = n$.
- Interactive 3-Axiom Subspace Tester with concrete counterexamples for sets violating closure.

### 3. 🎯 Span, Independence, Basis and Dimension
- Vector collections $\{\mathbf{v}_1, \dots, \mathbf{v}_4\}$ with coefficient range sliders $c_i \in [-3, 3]$.
- Tip-to-tail linear combination chaining to resultant vector $\mathbf{w} = \sum c_i \mathbf{v}_i$.
- Linear dependence detection with explicit non-trivial dependency relations (e.g., $2\mathbf{v}_1 - \mathbf{v}_2 = \mathbf{0}$).
- Draggable target vector $\mathbf{b}$ membership check with exact linear combination coordinates.

### 4. 🔀 Linear Maps & Change of Basis
- Overlaid dual coordinate systems for Basis $B$ (blue) and Basis $B'$ (green).
- Coordinate representations $[\mathbf{v}]_B$ and $[\mathbf{v}]_{B'}$.
- Transition matrix $P_{B' \leftarrow B} = (B')^{-1}B$ and its inverse.
- Matrix representation of transformation $T$ in basis $B$: $[T]_B = B^{-1} T B$ with commutative diagram.

### 5. 📏 Inner Products, Angles and Gram-Schmidt
- Geometric dot product $\mathbf{u} \cdot \mathbf{v}$, norms, angles (radians & degrees), acute/right/obtuse classification.
- Dynamic vector projection $\text{proj}_{\mathbf{u}}(\mathbf{v})$ with perpendicular right-angle markers.
- Gram matrix $G_{ij} = \mathbf{v}_i \cdot \mathbf{v}_j$ readout.
- **4-Stage Animated Gram-Schmidt Process:**
  1. $\mathbf{u}_1 = \mathbf{v}_1$.
  2. Subtraction of projections: $\mathbf{u}_2 = \mathbf{v}_2 - \text{proj}_{\mathbf{u}_1}(\mathbf{v}_2)$.
  3. Subtraction of projections for $\mathbf{u}_3$.
  4. Unit length normalization $\mathbf{e}_i = \frac{\mathbf{u}_i}{\|\mathbf{u}_i\|}$, surrounded by unit sphere/circle.
  5. Numerical verification: $Q^T Q = I$ (error $< 10^{-10}$).

### 6. 🏔️ Quadratic Forms & Definiteness
- Symmetric matrix editor with automatic diagonal mirroring.
- 2D contour plot with principal eigenvector axes.
- 3D interactive surface $z = \mathbf{x}^T S \mathbf{x}$ elevation mesh with height-based color ramp.
- Definiteness classification (Positive/Negative Definite, Semidefinite, Indefinite) via Sylvester's Criterion (leading principal minors) and eigenvalues.

---

## 🚀 Quick Start

The entire application is completely self-contained in a single file: `index.html`.

### Run Locally
Simply double-click `index.html` to open it in any modern web browser (Chrome, Edge, Firefox, Safari).

Alternatively, serve with any local HTTP server:
```bash
# Python
python3 -m http.server 8080

# Or Node.js
npx serve .
```
Then visit `http://localhost:8080`.

---

## 🧪 Built-in Test Suite

The math engine contains a comprehensive test runner covering both deterministic unit tests and randomized property tests:

### CLI Test Runner (Node.js)
```bash
node test-runner.js
```

### Browser Test Runner
Open the application with `?test=1`:
```
http://localhost:8080/?test=1
```
Or click the **Tests** button in the header bar.

All 16 test suites pass with 100% success rate:
- **Unit Tests:** RREF, Null Space, Rank-Nullity, Determinants, Matrix Inverse, Independence Relations, Change of Basis, Gram-Schmidt Orthonormality, Angles, Quadratic Forms.
- **Property Tests (1,000 randomized trials):** $A A^{-1} = I$, $\text{rank} + \text{nullity} = n$, $A\mathbf{x} = \mathbf{0}$, $Q^T Q = I$, $S\mathbf{v} = \lambda\mathbf{v}$.

---

## 📂 Project Structure

```
linear-algebra-playground/
├── index.html                  # Self-contained single-page application
├── test-runner.js              # Standalone CLI test harness
├── PROJECT_REPORT.md           # Formal project report & syllabus mapping
├── DEMO_SCRIPT_AND_SLIDES.md   # 5-min demonstration script & Viva Q&A
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```

---

## 📐 Technology Stack

- **Language:** Vanilla JavaScript (ES2020), HTML5, CSS3.
- **2D Graphics:** HTML5 Canvas 2D API (High-DPI Retina scaling, sub-16ms render loop).
- **3D Graphics:** Three.js (r128 UMD build from cdnjs) with custom pointer-event orbit controllers.
- **Arithmetic:** Exact rational arithmetic on native `BigInt` (`Frac` class) with tolerance-aware floating point fallback ($\epsilon = 10^{-10}$).
- **State Management:** Unidirectional flux store with 100-step undo/redo stack and URL hash serialization.
- **Design:** CSS tokens supporting Light & Dark modes, WCAG AA accessibility, and responsive layouts.
