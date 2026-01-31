import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgrPlugin from 'vite-plugin-svgr';
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
    plugins: [ svgrPlugin(
        {
            svgrOptions: {
                replaceAttrValues: {
                    '#000': 'currentColor',
                    '#000000': 'currentColor', // In my project, all icons are black by default, so I just stick to replacing black colors
                },
            },
        },
    ),nodePolyfills(),react()],

})
