
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ใช้ base: './' เพื่อให้ไฟล์เรียกหากันเจอไม่ว่าจะวางไว้ใน sub-folder ของ GitHub หรือไม่
  base: './',
  build: {
    outDir: 'dist',
  }
});
