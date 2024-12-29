// webpack.config.ts
import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: {
    content: './src/content/content.ts',
    popup: './src/popup/popup.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

export default config;

// package.json
{
  "name": "custom-font-plus",
  "version": "1.0.0",
  "description": "A Chrome extension for custom font enforcement",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "type-check": "tsc --noEmit",
    "lint": "eslint 'src/**/*.{js,ts}'"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/chrome": "^0.0.260",
    "@types/node": "^20.11.0",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "eslint": "^8.56.0",
    "ts-loader": "^9.5.1",
    "typescript": "^5.3.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "typeRoots": [
      "./node_modules/@types",
      "./src/types"
    ]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
