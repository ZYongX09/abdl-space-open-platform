import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CaptchaKeys from './pages/CaptchaKeys';
import OAuthClients from './pages/OAuthClients';
import ContentKeys from './pages/ContentKeys';
import DocsCaptcha from './pages/DocsCaptcha';
import DocsContent from './pages/DocsContent';
import DocsOAuth from './pages/DocsOAuth';
import DocsBasicConcepts from './pages/DocsBasicConcepts';
import Callback from './pages/Callback';
import Login from './pages/Login';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/captcha-keys" element={<CaptchaKeys />} />
            <Route path="/content-keys" element={<ContentKeys />} />
            <Route path="/oauth-clients" element={<OAuthClients />} />
            <Route path="/docs/captcha" element={<DocsCaptcha />} />
            <Route path="/docs/content" element={<DocsContent />} />
            <Route path="/docs/oauth" element={<DocsOAuth />} />
            <Route path="/docs/basic-concepts" element={<DocsBasicConcepts />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
