# API reference

Use this reference to integrate these components into your application. It is written for developers and AI coding agents.

Start with [`manifest.json`](manifest.json), find the component, module, or hook you need, and open its `path` relative to this directory:

- `components/` contains controls, panels, layouts, and providers.
- `modules/` contains the ready-to-use toolbar, top bar, and participant and screen-sharing views.
- `hooks/` contains hooks for reading state and building custom controls.
- `schemas/` contains the JSON Schemas that these files follow.

Each file describes one public API: its import, provider requirements, props or return values, relevant types, and behavior. For example, use `components/audio-button.json` for the standard audio button, or `hooks/use-audio-controller.json` to build custom audio controls.
