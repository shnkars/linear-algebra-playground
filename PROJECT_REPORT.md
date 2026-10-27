# Linear Algebra Playground: Project Report
**Course:** BAMAT205 Discrete Mathematics and Linear Algebra  
**Syllabus Coverage:** Module 4 (Vector Spaces and Linear Transformations) and Module 5 (Inner Product Spaces)  
**Project Type:** Interactive Single-Page Web Application  
**Document Version:** 1.0  

---

## 1. Executive Summary & Objectives

The **Linear Algebra Playground** is a modern, responsive, browser-based pedagogical instrument designed to give students direct visual, geometric, and tactile intuition for abstract linear algebraic concepts. Rather than treating matrices as static arrays of numbers, the application renders matrices as dynamic transformations of space, vector spans as interactive geometric subspaces, and matrix factorizations as animated geometric procedures.

### Core Objectives
1. **Interactive Geometric Manipulation:** Make abstract concepts—such as vector spans, null spaces, column spaces, coordinate transformations, and orthogonal projections—visible, draggable, and tangible in both $\mathbb{R}^2$ and $\mathbb{R}^3$.
2. **Transparent Mathematical Reasoning:** Provide step-by-step worked explanations for every computational procedure (Gauss-Jordan RREF, determinants, Gram-Schmidt orthogonalization, and subspace validation), generated directly by the underlying mathematical engine.
3. **Zero Configuration & Universal Access:** Run completely inside modern web browsers with zero installation, zero server requirements, and zero external build tooling. The entire application is delivered as a single self-contained `index.html` file that opens immediately upon double-clicking.
4. **Hybrid Exact/Float Numeric Precision:** Provide exact rational arithmetic using arbitrary-precision `BigInt` fractions (`Frac`) for integer and terminating decimal inputs, falling back cleanly to tolerance-aware IEEE floating-point arithmetic with $\epsilon = 10^{-10}$ when necessary.
5. **Universal Accessibility:** Fully support keyboard navigation, ARIA live region status reporting for screen readers, high-DPI Retina rendering, and persistent state serialization via URL hashes.

---

## 2. Syllabus Mapping (BAMAT205 Modules 4 & 5)

| Syllabus Topic | Module | Playground Feature & Lab | Pedagogical Mechanism |
| :--- | :---: | :--- | :--- |
| **Vector Spaces, Subspaces, and Axioms** | Module 4 | **Lab 2: Subspaces & Nullity** | Interactive 3-axiom tester with randomized counterexamples for sets violating closure under addition or scalar multiplication. |
| **Linear Combinations and Span** | Module 4 | **Lab 3: Span & Independence** | Tip-to-tail animated vector chaining, span visualization (planes/lines), and target vector span-membership solver. |
| **Linear Dependence and Independence** | Module 4 | **Lab 3: Span & Independence** | Automatic null space decomposition returning non-trivial dependence relations (e.g., $2\mathbf{v}_1 - \mathbf{v}_2 - \mathbf{v}_3 = \mathbf{0}$). |
| **Basis and Dimension** | Module 4 | **Lab 2 & Lab 3** | Extraction of basis vectors via pivot columns of RREF; live dimension readouts. |
| **Four Fundamental Subspaces & Rank-Nullity** | Module 4 | **Lab 2: Subspaces & Nullity** | Real-time calculation and visualization of $\text{Col}(A)$, $\text{Row}(A)$, and $\text{Null}(A)$, alongside the interactive $\text{rank}(A) + \text{nullity}(A) = n$ banner. |
| **Linear Transformations and Properties** | Module 4 | **Lab 1: Transformation Studio** | Direct transformation of the coordinate grid, unit circle/square into ellipses, eigenvector lines, and determinant area shading. |
| **Matrix Representation and Invertibility** | Module 4 | **Lab 1 & Lab 4** | Two-way binding between draggable basis tips and matrix cells; detection of singular collapse ($\det(A) = 0$). |
| **Change of Basis and Coordinate Vectors** | Module 4 | **Lab 4: Change of Basis** | Dual overlaid coordinate grids (Bases $B$ and $B'$), coordinate decomposition of vector $\mathbf{v}$, and transition matrix $P = (B')^{-1}B$. |
| **Dot Product, Norm, and Angle** | Module 5 | **Lab 5: Gram-Schmidt** | Numeric and geometric computation of $\mathbf{u} \cdot \mathbf{v}$, $\|\mathbf{u}\|$, $\|\mathbf{v}\|$, acute/right/obtuse classification, and orthogonal projections. |
| **Matrix Representation of Inner Products** | Module 5 | **Lab 5: Gram-Schmidt** | Live Gram matrix $G_{ij} = \mathbf{v}_i \cdot \mathbf{v}_j$ computation, and weighted inner product $\langle \mathbf{u}, \mathbf{v} \rangle_W = \mathbf{u}^T W \mathbf{v}$. |
| **Gram-Schmidt Process & Orthonormal Bases** | Module 5 | **Lab 5: Gram-Schmidt** | 4-stage interactive animation scrubbing through projection subtraction, vector normalization, and numerical verification $Q^T Q = I$. |
| **Quadratic Forms and Definiteness** | Module 5 | **Lab 6: Quadratic Forms** | 3D surface mesh $z = \mathbf{x}^T S \mathbf{x}$, leading principal minors (Sylvester's criterion), and eigenvalue classification. |

---

## 3. System Architecture

The application adopts a strictly decoupled, unidirectional data flow architecture structured into four distinct layers:

```
+--------------------------------------------------------------------------+
|                               UI LAYER                                   |
|   Tabs, Matrix Editors (with drag-scrubbing), Range Sliders, Readouts     |
+--------------------------------------------------------------------------+
                                    │ UI Action (Named Actions)
                                    ▼
+--------------------------------------------------------------------------+
|                              STATE LAYER                                 |
|   Store (Single Source of Truth), Undo/Redo (100 stack), URL Hash Sync    |
+--------------------------------------------------------------------------+
                                    │ Pure State Transition
                                    ▼
+--------------------------------------------------------------------------+
|                               MATH CORE                                  |
|   Frac (BigInt Rationals), Mat, Vec, RREF, Jacobi Eigen, Gram-Schmidt    |
+--------------------------------------------------------------------------+
                                    │ Derived Data (Rank, Det, Bases)
                                    ▼
+--------------------------------------------------------------------------+
|                               VIEW LAYER                                 |
|   Canvas2DView (Retina, Pan/Zoom), Three3DView (Orbit Controls), Steps   |
+--------------------------------------------------------------------------+
```

### Architectural Invariants
- **Purity of Math Core:** The mathematics engine contains no DOM references or side effects. Every algebraic routine is completely pure and testable outside the browser environment (e.g., via Node.js).
- **Passive Views:** Renderers never perform mathematical calculations or matrix inverses directly; they consume derived states from the store and project them onto the screen.
- **Unidirectional Dispatch:** State mutations only take place via `store.dispatch(action)`. Components subscribe to specific state keys to prevent redundant layout passes.

---

## 4. Algorithms and Numerical Precision

### 4.1 Exact Rational Arithmetic (`Frac`)
All rational operations are executed over arbitrary-precision integers using native JavaScript `BigInt`:
$$\text{Frac} = \left\{ \frac{n}{d} \;\middle|\; n, d \in \mathbb{Z}, \; d > 0, \; \gcd(|n|, d) = 1 \right\}$$
Any input entered as an integer or terminating decimal (e.g., $0.25 \to \frac{1}{4}$) triggers the **Exact Mode** pipeline. Operations that intrinsically produce irrational results (such as vector normalization involving square roots, eigenvalues, or trigonometric angles) smoothly transition to floating-point representation, marking values with an approximation badge ($\approx$).

### 4.2 Gauss-Jordan Elimination with Step Snapshots
The `rref(A)` routine implements Gauss-Jordan elimination with deep matrix snapshots:
1. **Pivot Selection:** In Exact Mode, the first non-zero entry in column $c$ below row $r$ is selected. In Float Mode, partial pivoting chooses the row with the maximum absolute magnitude $\max_{i \ge r} |M_{i,c}|$.
2. **Row Swapping:** If $p \ne r$, rows $R_r$ and $R_p$ are exchanged, generating an elementary operation step: $R_r \leftrightarrow R_p$.
3. **Pivot Normalization:** Row $r$ is scaled by $\frac{1}{M_{r,c}}$ to establish a leading 1.
4. **Column Clearance:** Every row $i \ne r$ with $M_{i,c} \ne 0$ is eliminated via $R_i \gets R_i - M_{i,c} R_r$.
5. **State Capture:** Each step records an immutable clone of the matrix alongside coordinate highlight metadata:
```json
{
  "id": 4,
  "kind": "rowOp",
  "text": "R2 → R2 - (2)·R1",
  "why": "Clear entry at row 2, column 1 below the pivot",
  "matrix": [["1", "2", "3"], ["0", "0", "0"], ["0", "-2", "-2"]],
  "highlight": { "cells": [[1, 0]], "rows": [1], "cols": [0] }
}
```

### 4.3 Jacobi Eigenvalue Algorithm for Symmetric Matrices
For symmetric matrices $S = S^T \in \mathbb{R}^{n \times n}$ ($n \in \{2, 3\}$), the engine implements Jacobi rotations. Successive Givens rotation matrices $J(p, q, \phi)$ are applied to eliminate off-diagonal entries:
$$\tan(2\phi) = \frac{2 S_{pq}}{S_{qq} - S_{pp}}$$
The iteration proceeds up to 50 sweeps or until the maximum off-diagonal magnitude falls below $10^{-12}$, yielding exact orthogonal eigenvectors and real eigenvalues.

### 4.4 Classical Gram-Schmidt with Linear Dependence Guard
Given input vectors $\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$:
1. $\mathbf{u}_1 = \mathbf{v}_1$.
2. For $i = 2, \dots, k$:
   $$\mathbf{u}_i = \mathbf{v}_i - \sum_{j=1}^{i-1} \frac{\mathbf{v}_i \cdot \mathbf{u}_j}{\|\mathbf{u}_j\|^2} \mathbf{u}_j$$
3. If $\|\mathbf{u}_i\| < 10^{-10}$, the algorithm detects linear dependence, logs an explanatory notice, and skips $\mathbf{v}_i$ to avoid division by zero.
4. Orthonormal basis vectors are computed as $\mathbf{e}_i = \frac{\mathbf{u}_i}{\|\mathbf{u}_i\|}$, validating $Q^T Q = I$.

---

## 5. Visual Labs Overview

### Lab 1: Transformation Studio (2D & 3D)
- Displays linear maps $\mathbf{x} \mapsto A\mathbf{x}$.
- Interactive draggable basis handles $\hat{i}$ (red) and $\hat{j}$ (green) with two-way data binding.
- Animated slider $t \in [0, 1]$ blending $M(t) = (1 - t)I + tA$.
- Eigenvector invariant lines (amber) and determinant area shading (blue for orientation preservation, orange for orientation reversal).
- 3D mode with transformed unit cube and singular collapse detection.

### Lab 2: Subspaces and Rank-Nullity
- Dynamic $m \times n$ matrix editor ($m \le 4, n \le 5$) with row/column insertion.
- Step-by-step interactive Gauss-Jordan animation with row-operation playback.
- Color-coded pivot columns vs. free columns.
- Bases for $\text{Col}(A)$ (teal), $\text{Row}(A)$ (purple), and $\text{Null}(A)$ (orange).
- Interactive Rank-Nullity theorem bar checking $\text{rank} + \text{nullity} = n$.
- 3-Axiom Subspace Tester with randomized counterexample generator.

### Lab 3: Span, Independence, Basis and Dimension
- Vector collection $\{\mathbf{v}_1, \dots, \mathbf{v}_4\}$ with coefficient sliders $c_i \in [-3, 3]$.
- Dynamic tip-to-tail linear combination chain visual.
- Real-time independence verification with non-trivial dependency relation output.
- Target vector $\mathbf{b}$ membership testing with exact coordinates.

### Lab 4: Linear Maps, Matrix Representation & Change of Basis
- Overlaid dual coordinate systems for basis $B$ (blue) and basis $B'$ (green).
- Coordinate vectors $[\mathbf{v}]_B$ and $[\mathbf{v}]_{B'}$.
- Transition matrix $P_{B' \leftarrow B} = (B')^{-1}B$.
- Transformation representation $[T]_B = B^{-1}TB$ with commutative diagram.

### Lab 5: Inner Products, Angles and Gram-Schmidt
- Geometric dot product, norms, angles (degrees & radians), and classification (acute/right/obtuse).
- Dynamic vector projection with right-angle marker.
- Gram matrix $G$ calculation.
- 4-stage Gram-Schmidt animated orthogonalization with unit circle/sphere envelope and $Q^T Q = I$ verification.

### Lab 6: Quadratic Forms
- Symmetric matrix editor with automatic diagonal mirroring.
- 2D contour ellipses/hyperbolas with eigenvector principal axes.
- 3D interactive surface $z = \mathbf{x}^T S \mathbf{x}$ elevation mesh with height-based color ramp.
- Sylvester's criterion (leading principal minors) and eigenvalue definiteness classification.

---

## 6. Verification and Test Results

The mathematical and algorithmic core was rigorously validated against the specification test plan (Section 11) using both deterministic unit benchmarks and automated randomized property tests:

```
=== RUNNING LINEAR ALGEBRA PLAYGROUND TEST SUITE ===

[PASS] Unit Test 1: rref [[1,2,3],[2,4,6],[1,0,1]] -> rank 2, pivots at cols 0 and 1
[PASS] Unit Test 2: nullSpaceBasis vector proportional to (-1, -1, 1)
[PASS] Unit Test 3: rankNullity on 3x5 matrix of rank 2 -> nullity 3, sum = 5
[PASS] Unit Test 4: det [[2,0],[0,3]] = 6
[PASS] Unit Test 5: inverse [[1,2],[3,4]] = [[-2, 1], [3/2, -1/2]]
[PASS] Unit Test 6: isIndependent dependent with relation 2v1 - v2 = 0
[PASS] Unit Test 7: changeOfBasis B=I, B'=[[1,1],[-1,1]] has entries +-1/2
[PASS] Unit Test 8: gramSchmidt orthonormal set with Q^T Q = I (err < 1e-10)
[PASS] Unit Test 9: angle (1,0) and (0,1) is π/2
[PASS] Unit Test 10: classifyQuadratic [[2,0],[0,3]] is positive definite
[PASS] Unit Test 11: classifyQuadratic [[1,2],[2,1]] is indefinite (eigenvalues 3 and -1)

--- Property Tests (200 random inputs each, total 1000 trials) ---
[PASS] Property Test 1: A · A⁻¹ = I for 200 random invertible matrices
[PASS] Property Test 2: rank(A) + nullity(A) = n for 200 random matrices
[PASS] Property Test 3: ||A x|| < 1e-9 for all null space basis vectors (200 random matrices)
[PASS] Property Test 4: Gram-Schmidt vectors are pairwise orthonormal (200 random sets)
[PASS] Property Test 5: S v = λ v for 200 random symmetric matrices

=== TEST RESULTS: 16 PASSED, 0 FAILED ===
```

In addition, clicking the **Tests** button in the application header executes these test suites directly within the browser client, displaying live green indicators and benchmark timings.
