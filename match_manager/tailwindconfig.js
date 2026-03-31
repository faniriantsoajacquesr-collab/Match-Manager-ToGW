<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary-dim": "#00d4ec",
                        "on-secondary-fixed": "#651900",
                        "surface-container-high": "#201f21",
                        "tertiary-fixed-dim": "#cc84ff",
                        "on-primary-container": "#004d57",
                        "secondary": "#ff7346",
                        "background": "#0e0e0f",
                        "error": "#ff716c",
                        "primary-fixed": "#00e3fd",
                        "tertiary-fixed": "#d597ff",
                        "inverse-on-surface": "#565556",
                        "surface-container-low": "#131314",
                        "on-tertiary-fixed-variant": "#5a008d",
                        "on-error-container": "#ffa8a3",
                        "outline-variant": "#484849",
                        "on-primary-fixed": "#003840",
                        "surface-container-lowest": "#000000",
                        "outline": "#767576",
                        "surface-bright": "#2c2c2d",
                        "surface": "#0e0e0f",
                        "surface-variant": "#262627",
                        "on-tertiary-container": "#000000",
                        "surface-tint": "#81ecff",
                        "inverse-primary": "#006976",
                        "inverse-surface": "#fcf8f9",
                        "error-container": "#9f0519",
                        "on-background": "#ffffff",
                        "on-surface": "#ffffff",
                        "error-dim": "#d7383b",
                        "on-error": "#490006",
                        "secondary-dim": "#ff7346",
                        "tertiary": "#c97cff",
                        "tertiary-container": "#ad34fd",
                        "secondary-container": "#ae3200",
                        "on-primary-fixed-variant": "#005762",
                        "on-secondary-fixed-variant": "#962a00",
                        "primary": "#81ecff",
                        "surface-container-highest": "#262627",
                        "tertiary-dim": "#aa30fa",
                        "on-secondary-container": "#fff6f3",
                        "on-primary": "#005762",
                        "surface-dim": "#0e0e0f",
                        "surface-container": "#1a191b",
                        "secondary-fixed-dim": "#ffb199",
                        "on-surface-variant": "#adaaab",
                        "primary-fixed-dim": "#00d4ec",
                        "on-tertiary": "#350056",
                        "secondary-fixed": "#ffc4b3",
                        "primary-container": "#00e3fd",
                        "on-secondary": "#420d00",
                        "on-tertiary-fixed": "#290044"
                    },
                    fontFamily: {
                        "headline": ["Space Grotesk"],
                        "body": ["Manrope"],
                        "label": ["Inter"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .skew-heading { transform: skewX(-6deg); }
        .skew-card { transform: skewX(-3deg); }
        .no-skew { transform: skewX(3deg); }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000000; }
        ::-webkit-scrollbar-thumb { background: #81ecff; }