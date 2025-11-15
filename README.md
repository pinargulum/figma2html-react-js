Figma-to-HTML/CSS Conversion

This project is my implementation of Softlight’s take-home assignment: converting the provided Figma screen into HTML/CSS using a custom rendering approach.

The goal was to load the structure of the Figma design, interpret the layout data, and reproduce the final mockup as closely as possible in the browser. The rendering is done programmatically rather than by manually recreating the layout.

Overview

The application reads the exported Figma JSON file and reconstructs the layout using React.
Every visible element on the screen—frames, text layers, shapes, gradients, and spacing—is generated based on the information in the JSON, not manually styled.

The project is divided into a few focused components:

App.jsx

Coordinates the rendering process.
It loads the Figma JSON, selects the relevant frame, and passes it into the renderer.
App.jsx itself contains no layout logic; it simply provides the data and sets up the environment.

NodeRenderer.jsx

Responsible for turning each Figma node into a corresponding DOM element.
It walks the node tree recursively and builds the correct HTML structure.
Each node becomes an element, and children are rendered inside their parents, reproducing the nesting found in Figma.

styleFromNode.js

Transforms Figma styling properties into actual CSS.
This includes sizes, positions, fills, borders, gradients, text styling, and corner radii.
The function converts Figma’s design metadata into inline style objects so that each rendered element visually matches the design.

Why inline styles

Because every element in the Figma file has unique pixel-based values, using inline styles simplified the rendering logic.
Nothing in this mockup is reusable or shared across multiple screens, so defining separate CSS classes would not provide much value.
Inline styles make the output explicit and easy to verify against the Figma file.

Figma Data Handling

The original implementation included a working integration with the Figma REST API.
The design was fetched using a personal API key, and the renderer was built around the live JSON response.

GitHub, however, blocks pushes containing API keys—even when they are stored in .env and not exposed in the code. To avoid commit rejections and keep the repository clean, I removed the live API request from the public version.

The final submission loads a locally exported figma.json file, but the rendering logic and data flow are identical to the REST API version.
This approach still demonstrates how the system interprets and renders the Figma content without exposing any credentials.

Live Demo

A fully working version of the project is deployed via GitHub Pages and can be viewed here:

[Live Demo](https://pinargulum.github.io/figma2html-react-js/)

Static HTML/CSS Output

The assignment required providing static HTML and CSS files that can be opened in a browser.
These are included in the output/ directory:

figma-converted.html

figma-converted.css

These files represent a snapshot of the final rendered layout extracted from the browser.
They are not intended to be production markup, but rather a static view of what the renderer produces.

Tech Stack

React (Vite)

JavaScript

Custom Figma-to-style conversion

GitHub Pages for deployment

Limitations

The main screen preserves the original fixed width from Figma (393px).
Because the layout uses absolute positioning, it does not scale responsively; instead, it remains centered and fully visible on smaller screens.

The renderer focuses on the elements used in this mockup. It does not attempt to cover the full Figma feature set.

The REST API logic was implemented and tested, but excluded from the public repo to avoid exposing keys. A local JSON copy is used in its place.

Running the Project Locally

Install dependencies:

npm install


Run the development server:

npm run dev


The mockup will render based on the local Figma JSON file.