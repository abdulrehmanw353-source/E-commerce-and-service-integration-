# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Progress Log

- Switched frontend from Apple light styling to a DoorSetFix dark-neon theme and rebuilt the Admin Dashboard, Store Landing, and Services screens to match provided UI references, including fixing booking slot integration to use the public available-slots endpoint.
- Added complete admin auth flow support (register/login/refresh/logout wiring), improved admin dashboard theme polish, and integrated backend dummy-data initialization scripts for realistic admin testing.
- Finalized admin stabilization: fixed button/icon/link visibility issues, restored dashboard analytics tabs/charts, aligned booking/order statuses with backend, added technician assignment UI flow, and enforced single-admin registration lock with redirect notice.
- Implemented customers-only admin tab, dedicated technician CRUD tab, separate analytics page with charts, and technician-first customer booking selection with slot availability filtered per selected technician.
