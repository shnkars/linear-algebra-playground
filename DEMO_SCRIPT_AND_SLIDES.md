# Linear Algebra Playground: Demonstration Script & Presentation Slides
**Course:** BAMAT205 Discrete Mathematics and Linear Algebra  
**Module Coverage:** Module 4 (Vector Spaces & Linear Transformations) and Module 5 (Inner Product Spaces)  

---

## Part 1: 5-Minute Demonstration Script

### Demo Objective
Demonstrate how the Linear Algebra Playground bridges mathematical formalism and geometric intuition through live, interactive manipulation of matrices, subspaces, coordinate transformations, and orthogonalization.

---

### Step 1: Transformation Studio (Lab 1) — [0:00 – 1:00]
1. **Initial State:** Point out the 2D grid, standard basis arrows $\hat{i}$ (red) and $\hat{j}$ (green), and the unit square with area shaded blue ($\det(A) = 1$).
2. **Action — Drag Basis Vectors:** Drag the handle for $\hat{i}$ to $(2, 0)$ and $\hat{j}$ to $(1, 1.5)$. Show how the matrix editor updates in real time (two-way data binding), and point out the shaded area updating to $\det(A) = 3.00$.
3. **Action — Linear Interpolation:** Drag the animation slider $t$ from $0$ to $1$, demonstrating how the space deforms smoothly from the identity matrix $I$ to transformation $A$.
4. **Action — Singular Collapse:** Select the **Singular (Collapse)** preset ($A = \begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$). Show that the 2D grid collapses onto a single line, the determinant drops to $0$, the area disappears, and the warning banner appears: *"This transformation collapses space, so it has no inverse."*
5. **3D View:** Switch to the **3D** toggle to show the transformed unit cube flattening into a 2D plane in space.

---

### Step 2: Subspaces & Rank-Nullity (Lab 2) — [1:00 – 2:00]
1. **Initial Matrix:** Load a rank-deficient $3 \times 3$ matrix:
   $$A = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 0 & 1 \end{pmatrix}$$
2. **Action — Step-by-Step RREF:** Click through the **Next** button in the lower steps panel. Highlight:
   - Row swap: $R_1 \leftrightarrow R_2$ (or partial pivot stabilization).
   - Row reduction: $R_2 \gets R_2 - 2R_1$.
   - The pivot cells pulsing on the matrix display table with explanation reasoning for each step.
3. **Rank-Nullity Banner:** Point to the live banner:
   $$\text{rank}(A) [2] + \text{nullity}(A) [1] = 3 \text{ columns } \checkmark$$
   Show the visual teal-and-orange proportional bar filling the column width.
4. **Subspace Tester:** Open the Subspace Condition Tester. Click **$x \ge 0$ (Octant)** and point out the counterexample showing why closure under scalar multiplication fails.

---

### Step 3: Span & Linear Independence (Lab 3) — [2:00 – 3:00]
1. **Initial Vectors:** Examine $\mathbf{v}_1 = (1, 0, 0)$ and $\mathbf{v}_2 = (0, 1, 0)$.
2. **Action — Tip-to-Tail Linear Combination:** Adjust sliders $c_1$ and $c_2$. Show the dashed tip-to-tail vector chaining leading to the white resultant vector $\mathbf{w} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2$.
3. **Action — Linear Dependence:** Add a third vector $\mathbf{v}_3 = (1, 1, 0)$. The badge immediately updates to **Dependent $\times$**, accompanied by the exact linear dependence relation:
   $$\mathbf{v}_1 + \mathbf{v}_2 - \mathbf{v}_3 = \mathbf{0}$$
4. **Target Vector Check:** Drag target vector $\mathbf{b}$. Show how the system determines whether $\mathbf{b} \in \text{Span}\{\mathbf{v}_i\}$ and solves for the exact linear combination coefficients.

---

### Step 4: Change of Basis (Lab 4) — [3:00 – 3:45]
1. **Dual Coordinate Grids:** Point out the standard Cartesian grid overlaid with the blue Basis $B$ grid and green Basis $B'$ grid.
2. **Action — Move Sample Vector $\mathbf{v}$:** Drag vector $\mathbf{v}$. Observe the simultaneous readout of:
   - $[\mathbf{v}]_B$ (coordinates with respect to Basis $B$)
   - $[\mathbf{v}]_{B'}$ (coordinates with respect to Basis $B'$)
3. **Transition Matrix:** Show the transition matrix $P = (B')^{-1}B$ and explain how $[T]_B = B^{-1} T B$ preserves the linear transformation across different frames of reference.

---

### Step 5: Gram-Schmidt Orthogonalization (Lab 5) — [3:45 – 4:30]
1. **Initial Non-Orthogonal Vectors:** Start with $\mathbf{v}_1 = (1, 1, 0)$, $\mathbf{v}_2 = (1, 0, 1)$, and $\mathbf{v}_3 = (0, 1, 1)$.
2. **Action — Animated Gram-Schmidt:** Click the **Play** button:
   - **Stage 1:** $\mathbf{u}_1 = \mathbf{v}_1$ is highlighted.
   - **Stage 2:** Projection $\text{proj}_{\mathbf{u}_1}(\mathbf{v}_2)$ is subtracted, displaying the perpendicular right-angle marker for $\mathbf{u}_2$.
   - **Stage 3:** Projections onto $\mathbf{u}_1$ and $\mathbf{u}_2$ are subtracted to produce $\mathbf{u}_3$.
   - **Stage 4:** Normalization scales all vectors to unit length $\mathbf{e}_i = \frac{\mathbf{u}_i}{\|\mathbf{u}_i\|}$, surrounded by the unit sphere.
3. **Verification:** Highlight the final readout showing $Q^T Q = I$ within numerical precision $< 10^{-10}$.

---

### Step 6: Quadratic Forms (Lab 6) — [4:30 – 5:00]
1. **Interactive Surface:** Start with the positive definite matrix $S = \begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix}$. Rotate the 3D bowl-shaped elliptic paraboloid ($z = 2x^2 + 3y^2$).
2. **Action — Symmetrized Matrix Editing:** Click the **Saddle (Indefinite)** preset ($S = \begin{pmatrix} 1 & 2 \\ 2 & 1 \end{pmatrix}$). Show the 3D surface transform into a saddle (hyperbolic paraboloid).
3. **Sylvester’s Criterion Readout:** Point to the eigenvalues ($\lambda_1 = 3, \lambda_2 = -1$) and leading principal minors ($\Delta_1 = 1 > 0, \Delta_2 = -3 < 0$) justifying the **Indefinite** classification.

---

## Part 2: Presentation Slides Outline

### Slide 1: Title & Overview
- **Title:** Linear Algebra Playground (BAMAT205)
- **Subtitle:** An Interactive, Self-Contained Geometry & Algebra Suite for Modules 4 & 5
- **Key Points:**
  - Zero-installation, single-file web application.
  - Pure mathematical core with exact `BigInt` rational arithmetic.
  - Dual 2D Canvas & 3D Three.js rendering pipelines.

### Slide 2: Pedagogical Motivation
- **The Challenge:** Linear algebra students often memorize row operations without developing spatial intuition for subspaces, kernel, rank, or change of basis.
- **The Solution:** A direct manipulation playground where every vector is draggable, every row operation is replayable, and every calculation exposes its underlying mathematical justification.

### Slide 3: System Architecture
- **Layered Design:** UI Layer $\to$ State Layer (Store) $\to$ Pure Math Core $\to$ View Layer.
- **Key Tech Stack:**
  - Vanilla JavaScript ES2020 (no build step).
  - Canvas 2D API for high-DPI transformed grids.
  - Three.js (r128) with custom pointer-event orbit controllers.
  - Native `BigInt` fraction arithmetic (`Frac`).

### Slide 4: Module 4 Highlights — Vector Spaces & Transformations
- **Transformation Studio:** Visualizing eigenvalues, determinant area scaling, and orientation flips.
- **Subspaces & Rank-Nullity:** Step-by-step Gauss-Jordan RREF timeline, fundamental subspaces $\text{Col}(A)$ and $\text{Null}(A)$, and subspace axiom counterexamples.
- **Span & Independence:** Dynamic tip-to-tail linear combination chains and explicit linear dependence relations.
- **Change of Basis:** Overlaid dual coordinate systems and the commutative diagram square.

### Slide 5: Module 5 Highlights — Inner Product Spaces
- **Inner Products & Projections:** Live dot products, norm scaling, and right-angle projection markers.
- **Gram Matrix:** Positive semidefiniteness and volume interpretations.
- **Gram-Schmidt Showcase:** 4-stage orthogonalization animation with numerical $Q^T Q = I$ proof.
- **Quadratic Forms:** 3D surface elevation meshes and Sylvester's criterion minors.

### Slide 6: Verification & Test Rigor
- **100% Pass Rate Across All Test Suites:**
  - 11 Deterministic Unit Tests (RREF, Null Space, Inverse, Change of Basis, Gram-Schmidt, Quadratic Classification).
  - 5 Randomized Property Tests (over 1,000 matrix trials: $A A^{-1} = I$, $\text{rank} + \text{nullity} = n$, $A\mathbf{x} = \mathbf{0}$, $Q^T Q = I$, $S\mathbf{v} = \lambda\mathbf{v}$).
- **Built-in `?test=1` Harness:** Accessible directly inside the running web page.

---

## Part 3: Viva Voce Questions & Model Answers

### Question 1: Why are the pivot columns of the original matrix used for the column space, while the non-zero rows of RREF give the row space?
**Model Answer:**
- **Row Operations Preserve Row Space:** Elementary row operations consist of taking linear combinations of rows. Therefore, the span of the rows is completely unchanged throughout Gauss-Jordan elimination:
  $$\text{Row}(A) = \text{Row}(\text{RREF}(A))$$
  Because the non-zero rows of an RREF matrix have leading 1s in distinct columns, they are automatically linearly independent, providing an exact basis for $\text{Row}(A)$.
- **Row Operations Change Column Space:** Elementary row operations alter linear combinations of column entries, meaning $\text{Col}(A) \ne \text{Col}(\text{RREF}(A))$. However, row operations *preserve linear dependence relations among columns*. If the $j$-th column of RREF is a linear combination of preceding pivot columns, the exact same relationship holds for the columns of the original matrix $A$. Consequently, the columns of the *original* matrix corresponding to the pivot column indices form a basis for $\text{Col}(A)$.

---

### Question 2: Why does $\det(A) = 0$ mean that matrix $A$ has no inverse?
**Model Answer:**
- **Geometric Explanation:** The determinant represents the signed volume scaling factor of a transformation. If $\det(A) = 0$, the transformation collapses $n$-dimensional space into a lower-dimensional subspace (e.g., in $\mathbb{R}^2$, a 2D plane is squashed onto a 1D line or a single point). Since multiple distinct vectors in the domain are collapsed into the same output vector (non-trivial null space, $\text{nullity}(A) > 0$), the transformation is not one-to-one (injective) and information is permanently lost. It is therefore impossible to define an inverse function that maps each point back to a unique original vector.
- **Algebraic Explanation:** The matrix inverse formula states $A^{-1} = \frac{1}{\det(A)} \text{adj}(A)$. If $\det(A) = 0$, division by zero is undefined, and Gauss-Jordan reduction on $[A \mid I]$ terminates with fewer than $n$ pivots.

---

### Question 3: How does the matrix of a linear transformation change when the basis is changed?
**Model Answer:**
- If $T: V \to V$ is represented by matrix $A$ with respect to the standard basis, and $B$ is a matrix whose columns are the basis vectors of an alternate basis, then any vector $\mathbf{v}$ relates to its coordinate representation $[\mathbf{v}]_B$ via:
  $$\mathbf{v} = B [\mathbf{v}]_B \implies [\mathbf{v}]_B = B^{-1} \mathbf{v}$$
- Applying transformation $T$ in coordinates of basis $B$:
  1. Convert $[\mathbf{v}]_B$ to standard coordinates by multiplying by $B$.
  2. Apply the transformation in standard coordinates by multiplying by $A$.
  3. Convert the resulting vector back to $B$-coordinates by multiplying by $B^{-1}$.
- Combining these steps gives the similarity transformation:
  $$[T]_B = B^{-1} A B$$
  Matrices $A$ and $[T]_B$ are **similar matrices**; they represent the exact same geometric transformation, differing only in the coordinate frame used to measure space. They share identical invariants, including trace, determinant, and eigenvalues.

---

### Question 4: Why is the Gram-Schmidt orthogonalization result dependent on the order of the input vectors?
**Model Answer:**
- In the Gram-Schmidt process, the first vector is never altered; its direction is accepted as the primary axis: $\mathbf{u}_1 = \mathbf{v}_1$.
- Each subsequent vector $\mathbf{u}_k$ is formed by projecting $\mathbf{v}_k$ onto the subspace spanned by the *preceding* orthogonalized vectors $\text{Span}\{\mathbf{u}_1, \dots, \mathbf{u}_{k-1}\}$ and subtracting those projections.
- If the ordering of the input vectors is permuted (e.g., starting with $\mathbf{v}_2$ instead of $\mathbf{v}_1$), the initial direction chosen for $\mathbf{u}_1$ is different, altering the sequence of subspaces being projected onto.
- While the final orthogonalized set $\{\mathbf{u}_1, \dots, \mathbf{u}_k\}$ will span the *same overall subspace* $\text{Span}\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$, the individual orthogonal basis vectors will point in entirely different directions.
