# VE Wellness Blue
**Current Version: v1.7.1**

This repository contains the source code for the **VE Wellness Blue** e-commerce website, built with **React**, **Vite**, **Tailwind CSS**, and **shadcn/ui**. It provides a premium shopping experience for wellness products.

## Project Structure

*   **/src**: Contains the main application source code (components, pages, hooks, contexts, etc.).
*   **/public**: Static assets (images, fonts, etc.).
*   **/cart**: (If applicable) Subdirectory for any backend or microservices included in the monorepo.

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ve-wellness-blue-main
    ```

2.  **Install dependencies:**
    Run `npm install` to automatically install all required packages listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    Start the local development server to view the website.
    ```bash
    npm run dev
    ```
    The site will typically be available at `http://localhost:5173`.

## Deployment

### Netlify

This project is configured for deployment on Netlify. A `netlify.toml` file is included to handle Single Page Application (SPA) routing redirects.

1.  Connect your repository to Netlify.
2.  Use the following build settings:
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`

## Features

*   **Modern Design:** Built with Tailwind CSS and shadcn/ui for a sleek, responsive interface.
*   **Product Catalog:** Browse products by category (Water Bottles, Supplements, Accessories, Bundles).
*   **Shopping Cart:** Fully functional cart with persistent state.
*   **Responsive:** Optimized for mobile, tablet, and desktop devices.

## License

[MIT License](LICENSE) (or specify your license here)
