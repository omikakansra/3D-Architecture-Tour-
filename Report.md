# COSC3306 Final Course Project
## Interactive 3D Architecture Tour

**Student Name:** [Omika Kansra]  
**Student ID:** [Your Student ID]  
**Date:** December 2025

---

## Table of Contents
1. [Instructions to Run the Application](#1-instructions-to-run-the-application)
2. [Description of Implemented Features](#2-description-of-implemented-features)
3. [External Assets, Textures, and Libraries Used](#3-external-assets-textures-and-libraries-used)
4. [Known Limitations or Bugs](#4-known-limitations-or-bugs)
5. [Screenshots](#5-screenshots)

---

## 1. Instructions to Run the Application

### Prerequisites
- Node.js (version 18 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Extract the project files** to a folder on your computer

2. **Open a terminal** and navigate to the project folder:
   \`\`\`bash
   cd 3d-architecture-tour
   \`\`\`

3. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open the application** in your web browser:
   - Navigate to `http://localhost:3000`

### Controls

| Control | Action |
|---------|--------|
| Left Mouse Drag | Rotate camera view |
| Right Mouse Drag | Pan camera |
| Scroll Wheel | Zoom in/out |
| Navigation Buttons | Quick camera transitions to preset views |
| Light Toggle Buttons | Turn room lights on/off |

---

## 2. Description of Implemented Features

### 2.1 3D Scene Design & Implementation

**Two Distinct Rooms:**
- **Living Room** (Left side): A spacious area featuring seating arrangements, dining furniture, entertainment center, bookshelf, and a ceiling fan
- **Bedroom** (Right side): A cozy sleeping area with bed, nightstand with lamp, and wardrobe

**Architectural Elements:**
- Walls with proper thickness (0.2 units) providing realistic depth
- Wooden floor with warm tones
- Off-white ceiling panels
- Connecting doorway between rooms with animated swinging door
- Window openings on side walls with glass panes and visible sky
- Consistent proportions throughout the scene

**Materials & Textures (9+ different materials):**
1. Wall material - light beige with matte finish
2. Floor material - warm wood tone with slight metalness
3. Dark wood material - for furniture pieces
4. Blue fabric - sofa and dining chairs
5. Orange fabric - decorative rugs
6. Purple fabric - bedroom bedding
7. Gray fabric - cushions and pillows
8. Metal material - lamp stands, handles, ceiling fan
9. Glass material - windows and lamp shades (transparent)
10. Lamp shade material - emissive glow effect

### 2.2 Interactivity, Animation & Lighting

**Camera Navigation (OrbitControls):**
- Full 360-degree rotation around the scene
- Smooth damping for natural camera movement
- Pan functionality for moving the view point
- Zoom in/out with scroll wheel
- Minimum and maximum distance limits for usability

**Smooth Camera Transitions (Bonus Feature):**
- Four preset camera positions: Overview, Living Room, Bedroom, Top Down
- Smooth animated transitions using linear interpolation (lerp)
- Navigation buttons in the UI for quick access

**Collision Detection (Bonus Feature):**
- Camera bounded within room walls
- Prevents camera from passing through floor or ceiling
- Allows passage through doorway between rooms
- Real-time collision checking each frame

**Animation:**
1. **Rotating Ceiling Fan**
   - Located in living room ceiling
   - Continuous smooth rotation using delta time
   - Five fan blades with motor housing
   - Frame-rate independent animation

2. **Swinging Door**
   - Positioned in doorway between rooms
   - Oscillating swing using sinusoidal motion
   - Natural opening/closing movement
   - Proper pivot point on door frame

**Dynamic Lighting:**
- Ambient light for general illumination
- Directional light simulating sun with shadow casting
- Spot lights through windows with blue tint (natural light effect)
- Point lights in lamps (floor lamp, ceiling fan light, nightstand lamp)
- **Interactive light toggles** - users can turn lights on/off

### 2.3 Room Furniture Details

**Living Room Furniture (10 items):**
1. Sofa with cushions and throw pillows (blue fabric)
2. Coffee table with two tiers (wooden)
3. Dining table (wooden)
4. Four dining chairs with cushioned seats
5. Floor lamp with emissive shade
6. Bookshelf with decorative books
7. TV stand with television
8. Orange decorative rug
9. Ceiling fan with light
10. Window with glass pane

**Bedroom Furniture (5 items):**
1. Bed with headboard, mattress, comforter, and pillows
2. Nightstand with drawer and table lamp
3. Wardrobe with double doors and handles
4. Orange decorative rug
5. Window with glass pane

---

## 3. External Assets, Textures, and Libraries Used

### JavaScript Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.x | UI component framework |
| Next.js | 15.x | React framework with server-side rendering |
| Three.js | 0.170.x | Core 3D graphics engine |
| @react-three/fiber | 8.x | React renderer for Three.js (declarative API) |
| @react-three/drei | 9.x | Useful helpers (OrbitControls, ContactShadows) |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS framework for UI styling |

### External Assets

- **No external 3D models** - All geometry is created programmatically using Three.js primitives:
  - BoxGeometry (walls, furniture, floors)
  - CylinderGeometry (lamp poles, fan motor, handles)
  - SphereGeometry (lamp globes)
  
- **No external textures** - All materials use procedural colors with physically-based rendering (PBR) properties including roughness, metalness, and emissive values

- **No external fonts** - Uses system default fonts for UI

---

## 4. Known Limitations or Bugs

### Current Limitations

1. **Simplified Geometry**: Furniture uses basic geometric primitives rather than detailed 3D models. This was a design choice for performance and code simplicity.

2. **Procedural Materials**: No image-based textures (wood grain, fabric patterns). Materials rely on solid colors with PBR properties.

3. **Static Shadows**: Shadow mapping is limited to the directional light for performance. Not all objects cast dynamic shadows.

4. **Fixed Room Layout**: Room dimensions and furniture positions are defined in code and not dynamically configurable through the UI.

5. **No Physics Engine**: Objects don't have physical interactions. Collision detection is limited to camera bounds only.

6. **Browser Compatibility**: WebGL required. May not work on older browsers or devices without GPU acceleration.

### Potential Future Improvements

- Import detailed GLTF/GLB 3D models for more realistic furniture
- Add image-based textures for wood grain, fabric patterns, etc.
- Implement first-person walking mode with WASD controls
- Add more interactive elements (open drawers, change TV channels)
- Include sound effects for animations
- Add more rooms (bathroom, kitchen, hallway)
- Implement day/night cycle with changing lighting

---

## 5. Screenshots

### 5.1 Overview View
*Complete two-room layout visible from elevated angle, showing living room (left) and bedroom (right) connected by doorway with swinging door.*

[Insert Screenshot Here]

### 5.2 Living Room View  
*Close-up showing blue sofa on orange rug, coffee table, dining table with chairs, bookshelf, TV stand, ceiling fan, and floor lamp.*

[Insert Screenshot Here]

### 5.3 Bedroom View
*Close-up showing bed with purple bedding and pillows, nightstand with lamp, and wardrobe against back wall.*

[Insert Screenshot Here]

### 5.4 Top-Down View
*Bird's eye view displaying floor plan layout and furniture arrangement of both rooms.*

[Insert Screenshot Here]

### 5.5 Light Toggle Demonstration
*Screenshots showing lights ON vs OFF states to demonstrate interactive lighting controls.*

[Insert Screenshots Here]

### 5.6 Animated Elements
*The rotating ceiling fan and oscillating swinging door in motion.*

[Insert Screen Recording Link or GIF Here]

---

## 6. Code Organization

The project follows a clean, modular structure:

\`\`\`
3d-architecture-tour/
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   └── scene-3d.tsx      # Main 3D scene (all 3D code)
├── package.json          # Project dependencies
└── REPORT.md            # This documentation
\`\`\`

### Code Quality Features:
- **Modular Components**: Each furniture piece is a separate React component
- **Reusable Materials**: Material components prevent code duplication
- **Comprehensive Comments**: All functions and sections are documented
- **Type Safety**: TypeScript provides compile-time error checking
- **Context API**: Used for sharing light state across components

---

## 7. Conclusion

This project successfully implements an interactive 3D architecture tour that meets and exceeds the course requirements:

**Core Requirements Met:**
- Two distinct rooms with complete walls, floors, and ceilings
- Multiple furniture pieces per room (10 in living room, 5 in bedroom)
- 9+ different materials with varied properties
- OrbitControls for camera navigation
- Two animated elements (ceiling fan, swinging door)

**Bonus Features Implemented:**
- Smooth camera transitions between preset views
- Collision detection preventing camera from passing through walls
- Interactive light toggles for dynamic lighting control
- Additional furniture (bookshelf, TV stand) for visual polish

The application runs smoothly in modern browsers and provides an engaging interactive experience for exploring the 3D architectural space.

---

*End of Report*
