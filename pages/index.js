import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [modal, setModal] = useState({ show: false, type: '', message: '', onConfirm: null });

  const showModal = (type, message, onConfirm = null) => {
    setModal({ show: true, type, message, onConfirm });
  };

  const hideModal = () => {
    setModal({ show: false, type: '', message: '', onConfirm: null });
  };

  useEffect(() => {
    window.showModal = showModal;
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/assets/favicon.png" type="image/png" />
        <title>insta qidiruv Private</title>
      </Head>

      <style jsx global>{`
        :root {
          --bg: #071026;
          --card: #0b1220;
          --accent: #7c3aed;
          --muted: #9aa4b2;
          --glass: rgba(255, 255, 255, 0.03);
          --popular: #f59e0b;
          --success: #10b981;
          --danger: #e85555;
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
          background: black;
          color: #e6eef6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        .wrap {
          width: 100%;
          max-width: 920px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0));
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 10px 40px rgba(2, 6, 23, 0.6);
          border: 2px solid;
          display: grid;
          gap: 14px;
        }

        .list::-webkit-scrollbar {
    width: 1px; /* scroll bar kengligi */
}
        

        .top {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          gap: 10px;
          align-items: center;
          width: 100%;
        }

        input[type="text"],
        input[type="file"] {
          background: var(--glass);
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 14px 16px;
          border-radius: 10px;
          color: inherit;
          outline: none;
          font-family: inherit;
          font-size: 16px;
          width: 100%;
          letter-spacing: 0.6px;
        }

        input[type="text"]:focus,
        input[type="file"]:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
        }

        button.btn {
          color: white;
          background-color: #030617;
          padding: 14px 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        button.btn:hover {
          background-color: #1a1f3a;
          transform: translateY(-1px);
        }

        .layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 14px;
        }
        @media (max-width: 880px) {
          .layout {
            grid-template-columns: 1fr;
          }
          .wrap {
            padding: 12px;
          }
          .top {
            flex-direction: column;
          }
          .search-box {
            width: 100%;
          }
        }

        .card {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0));
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.02);
          box-shadow: 0 6px 18px rgba(2, 6, 23, 0.35);
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 420px;
          overflow: auto;
          padding-right: 6px;
        }
        .item {
          display: flex;
          align-items: start;
          gap: 12px;
          padding: 10px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.02);
          transition: all 0.2s;
          cursor: pointer;
          position: relative;
        }
        .item:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }

        .item.popular {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02));
          border: 1px solid rgba(245, 158, 11, 0.15);
        }

        .item.popular:hover {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.04));
          border-color: rgba(245, 158, 11, 0.25);
        }

        .username {
          font-weight: 700;
          max-width:350px;
          margin-bottom: 4px;
        }
        .meta {
          color: var(--muted);
          font-size: 13px;
        }
        .profile-pic {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          object-fit: cover;
          margin-right: 12px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .post-item {
          margin-top: 8px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .post-media {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin-top: 8px;
          max-height: 200px;
          object-fit: cover;
        }

        label.small {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 6px;
          display: block;
        }
        input.small {
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 14px;
        }

        .hint {
          color: var(--muted);
          font-size: 13px;
          margin-top: 8px;
        }
        .admin-pill {
          background: rgba(124, 58, 237, 0.14);
          color: var(--accent);
          padding: 6px 8px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          animation: pulse 2s infinite;
          margin-top: 600px;
        }

        .post-entry {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .remove-post {
          background: #e85555;
          padding: 8px;
          font-size: 12px;
        }

        .loading {
          opacity: 0.6;
          pointer-events: none;
        }
        .upload-progress {
          background: var(--accent);
          height: 3px;
          border-radius: 2px;
          transition: width 0.3s;
          margin-top: 5px;
        }

        /* YANGI VA ZOR ADMIN PANEL STYLES */
        .admin-panel {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(124, 58, 237, 0.02));
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 15px 50px rgba(124, 58, 237, 0.15);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .admin-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent), #B54CFF, var(--popular));
          border-radius: 20px 20px 0 0;
        }

        .admin-panel::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 2px 10px rgba(124, 58, 237, 0.5);
        }

        .admin-title i {
          background: linear-gradient(135deg, var(--accent), #B54CFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(124, 58, 237, 0.3));
        }

        .admin-form {
          display: grid;
          gap: 24px;
        }

        .form-section {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 5px 15px rgba(2, 6, 23, 0.3);
          transition: all 0.3s ease;
        }

        .form-section:hover {
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow: 0 8px 25px rgba(2, 6, 23, 0.4);
          transform: translateY(-2px);
        }

        .form-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #e6eef6;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .form-section-title i {
          color: var(--accent);
          font-size: 18px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 18px;
        }

        .form-row:last-child {
          margin-bottom: 0;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          font-size: 16px;
          z-index: 1;
        }

        .input-with-icon input {
          padding-left: 44px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }

        .input-with-icon input:focus {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }

        .posts-section {
          border: 2px dashed rgba(124, 58, 237, 0.2);
          border-radius: 16px;
          padding: 20px;
          margin: 20px 0;
          background: rgba(124, 58, 237, 0.02);
          transition: all 0.3s ease;
        }

        .posts-section:hover {
          border-color: rgba(124, 58, 237, 0.3);
          background: rgba(124, 58, 237, 0.04);
        }

        .posts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .posts-title {
          font-size: 16px;
          font-weight: 700;
          color: #e6eef6;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-add-post {
          background: linear-gradient(135deg, var(--accent), #6d28d9);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .btn-add-post:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }

        .post-entry {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          position: relative;
          transition: all 0.3s ease;
        }

        .post-entry:hover {
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow: 0 5px 15px rgba(2, 6, 23, 0.3);
        }

        .post-entry-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .post-entry-title {
          font-size: 14px;
          font-weight: 700;
          color: #e6eef6;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .remove-post {
          background: linear-gradient(135deg, var(--danger), #dc2626);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .remove-post:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: scale(0.95);
          box-shadow: 0 4px 10px rgba(232, 85, 85, 0.3);
        }

        .admin-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent), #6d28d9);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 140px;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(124, 58, 237, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
        }

        .btn-secondary {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          color: #e6eef6;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 140px;
          justify-content: center;
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(2, 6, 23, 0.3);
        }

        .btn-danger {
          background: linear-gradient(135deg, var(--danger), #dc2626);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 140px;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(232, 85, 85, 0.3);
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(232, 85, 85, 0.4);
        }

        .admin-hint {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.04));
          border: 1px solid rgba(245, 158, 11, 0.15);
          border-radius: 12px;
          padding: 16px;
          margin-top: 20px;
          color: var(--popular);
          font-size: 13px;
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .admin-hint i {
          margin-top: 2px;
          flex-shrink: 0;
          color: var(--popular);
          font-size: 16px;
        }

        .admin-users-section {
          text-align: center;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Scrollbar styles for admin panel */
        .admin-panel ::-webkit-scrollbar {
          width: 6px;
        }

        .admin-panel ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }

        .admin-panel ::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }

        .admin-panel ::-webkit-scrollbar-thumb:hover {
          background: #6d28d9;
        }

        /* Responsive improvements */
        @media (max-width: 600px) {
          .admin-panel {
            padding: 20px 16px;
          }

          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .admin-title {
            font-size: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .admin-actions {
            flex-direction: column;
            gap: 12px;
          }

          .btn-primary,
          .btn-secondary,
          .btn-danger {
            min-width: 100%;
            justify-content: center;
          }

          .posts-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .btn-add-post {
            align-self: stretch;
            justify-content: center;
          }
        }

        @media (max-width: 400px) {
          .admin-panel {
            padding: 16px 12px;
          }

          .form-section {
            padding: 16px;
          }

          .post-entry {
            padding: 14px;
          }
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(2, 6, 23, 0.8);
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .modal-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .modal-icon.success {
          background: #10b981;
          color: white;
        }
        .modal-icon.error {
          background: #e85555;
          color: white;
        }
        .modal-icon.confirm {
          background: #f59e0b;
          color: white;
        }
        .modal-icon.info {
          background: var(--accent);
          color: white;
        }

        .modal-title {
          font-weight: 700;
          font-size: 16px;
        }

        .modal-message {
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .modal-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn.primary {
          background: var(--accent);
          color: white;
        }

        .modal-btn.primary:hover {
          background: #6d28d9;
          transform: translateY(-1px);
        }

        .modal-btn.secondary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--muted);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #e6eef6;
        }

        .posts-count {
          background: rgba(124, 58, 237, 0.1);
          color: var(--accent);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
          display: inline-block;
        }

        .popular-badge {
          position: absolute;
          right: 8px;
          
          background: linear-gradient(135deg, var(--popular), #d97706);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          animation: popularPulse 2s ease-in-out infinite;

        }

        .search-count {
          background: rgba(245, 158, 11, 0.1);
          color: var(--popular);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 8px;
        }

        .popular-section {
          margin-bottom: 20px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--popular);
        }

        .section-icon {
          font-size: 16px;
          color: var(--popular);
        }

        .input-group label {
          display: none;
        }

        .by {
          font-size: 6px;
          position: absolute;
          right: 0;
          margin-right: 10px;
          bottom: -2px;
        }

        .by a {
          text-decoration: none;
          color: whitesmoke;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes popularPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5);
          }
        }

        @media (max-width: 480px) {
          .modal {
            margin: 20px;
            padding: 20px;
          }
          .profile-pic {
            width: 50px;
            height: 50px;
          }
          .popular-badge {
            font-size: 9px;
            padding: 3px 6px;
          }
            .username{
            max-width:180px;
            }
        }

        @media (max-width: 345px) {
          .popular-badge {
            margin-right: 170px;
            top: 65px;
          }
        }

        @media (max-width: 335px) {
          .popular-badge {
            margin-right: 160px;
            top: 65px;
          }
        }
      `}</style>

      <div className="wrap">
        <div className="top">
          <div style={{ width: '100%' }} className="search-box">
            <input id="main-input" type="text" placeholder="Username kiriting" />
            <button id="btn-search" className="btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div id="admin-indicator" style={{ display: 'none' }} className="admin-pill">
            ADMIN
          </div>
        </div>

        <div className="layout">
          <div className="card">
            <div id="results" className="list">
              <div className="meta">Hech qanday qidiruv hali bajarilmadi.</div>
            </div>
          </div>

          <div id="admin-area" style={{ display: 'none' }}>
            <div className="admin-panel">
              <div className="admin-header">
                <div className="admin-title">
                  <i className="fa-solid fa-crown"></i>
                  <span>Admin Panel</span>
                </div>
                <button id="btn-lock" className="btn-danger">
                  <i className="fa-solid fa-lock"></i> Lock
                </button>
              </div>

              <div className="admin-form">
                <div className="form-section">
                  <div className="form-section-title">
                    <i className="fa-solid fa-user"></i>
                    Foydalanuvchi ma'lumotlari
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Instagram Username</label>
                      <div className="input-with-icon">
                        <i className="fa-brands fa-instagram"></i>
                        <input id="add-username" type="text" placeholder="username" />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Izoh (ixtiyoriy)</label>
                      <div className="input-with-icon">
                        <i className="fa-solid fa-comment"></i>
                        <input id="add-note" type="text" placeholder="izoh" />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Profil rasmi (ixtiyoriy)</label>
                      <input id="profile-pic" type="file" accept="image/*" />
                      <div id="profile-progress" className="upload-progress" style={{ width: '0%', display: 'none' }}></div>
                    </div>
                  </div>
                </div>

                <div className="posts-section">
                  <div className="posts-header">
                    <div className="posts-title">
                      <i className="fa-solid fa-images"></i>
                      Postlar
                    </div>
                    <button id="btn-add-post" className="btn-add-post" type="button">
                      <i className="fa-solid fa-plus"></i>
                      Post qo'shish
                    </button>
                  </div>
                  <div id="posts-container"></div>
                </div>

                <div className="admin-actions">
                  <button id="btn-add" className="btn-primary" type="button">
                    <i className="fa-solid fa-user-plus"></i>
                    Qo'shish
                  </button>
                </div>

                <div className="admin-hint">
                  <i className="fa-solid fa-info-circle"></i>
                  <span>Qo'shilgan hisoblar hamma uchun qidiruvda ko'rinadi. Fayllar assets/ papkasiga saqlanadi.</span>
                </div>
              </div>

              <div className="admin-users-section">
                <button id="btn-users" className="btn-secondary" type="button">
                  <i className="fa-solid fa-users"></i>
                  Users
                </button>
              </div>
            </div>
          </div>
        </div>

        {modal.show && (
          <div className="modal-overlay" onClick={hideModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className={`modal-icon ${modal.type}`}>
                  {modal.type === 'success' && <i className="fa-solid fa-check"></i>}
                  {modal.type === 'error' && <i className="fa-solid fa-times"></i>}
                  {modal.type === 'confirm' && <i className="fa-solid fa-exclamation"></i>}
                  {modal.type === 'info' && <i className="fa-solid fa-info"></i>}
                </div>
                <div className="modal-title">
                  {modal.type === 'success' && 'Muvaffaqiyat'}
                  {modal.type === 'error' && 'Xato'}
                  {modal.type === 'confirm' && 'Tasdiqlash'}
                  {modal.type === 'info' && "Ma'lumot"}
                </div>
              </div>
              <div className="modal-message">{modal.message}</div>
              <div className="modal-actions">
                {modal.type === 'confirm' ? (
                  <>
                    <button className="modal-btn secondary" onClick={hideModal}>
                      <i className="fa-solid fa-times"></i> Bekor qilish
                    </button>
                    <button
                      className="modal-btn primary"
                      onClick={() => {
                        modal.onConfirm();
                        hideModal();
                      }}
                    >
                      <i className="fa-solid fa-check"></i> Tasdiqlash
                    </button>
                  </>
                ) : (
                  <button className="modal-btn primary" onClick={hideModal}>
                    <i className="fa-solid fa-check"></i> OK
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <h1 className="by">
        Powered by <a href="https://t.me/mrkeloff">Abdurhmonovv</a>
      </h1>
      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          const SUPABASE_URL = "https://xzbwfoacsnrmgjmildcr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Yndmb2Fjc25ybWdqbWlsZGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxOTkxNzUsImV4cCI6MjA3Mzc3NTE3NX0.c10rEbuzQIkVvuJEecEltokgaj6AqjyP5IoFVffjizc";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const mainInput = document.getElementById('main-input');
const btnSearch = document.getElementById('btn-search');
const results = document.getElementById('results');
const adminArea = document.getElementById('admin-area');
const adminIndicator = document.getElementById('admin-indicator');
const btnAdd = document.getElementById('btn-add');
const addUsername = document.getElementById('add-username');
const addNote = document.getElementById('add-note');
const profilePic = document.getElementById('profile-pic');
const postsContainer = document.getElementById('posts-container');
const btnAddPost = document.getElementById('btn-add-post');
const btnLock = document.getElementById('btn-lock');
const btnUsers = document.getElementById('btn-users');
const profileProgress = document.getElementById('profile-progress');

let adminSecretValue = null;
let isAdmin = false;
let postEntries = [];

// Initialization
(async function init() {
  try {
    const result = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('name', 'admin_secret')
      .single();
    if (!result.error && result.data) adminSecretValue = result.data.value;

    if (localStorage.getItem('is_admin') === '1') {
      isAdmin = true;
      showAdmin();
    }

    await initializeSearchStats();
    await loadPopularUsers();
  } catch (error) {
    console.error('Initialization error:', error);
  }
})();

async function initializeSearchStats() {
  try {
    const result = await supabaseClient
      .from('search_statistics')
      .select('id')
      .limit(1);
      
    if (result.error) {
      console.log('Search statistics table not found or error:', result.error.message);
    }
  } catch (error) {
    console.log('Error initializing search stats:', error);
  }
}

async function incrementProfileView(username) {
  try {
    const existingResult = await supabaseClient
      .from('search_statistics')
      .select('*')
      .eq('username', username)
      .single();

    if (existingResult.error && existingResult.error.code !== 'PGRST116') {
      console.error('Error checking existing stats:', existingResult.error);
      return;
    }

    if (existingResult.data) {
      const updateResult = await supabaseClient
        .from('search_statistics')
        .update({ 
          profile_views: (existingResult.data.profile_views || 0) + 1,
          last_viewed: new Date().toISOString()
        })
        .eq('username', username);
      
      if (updateResult.error) {
        console.error('Error updating profile view count:', updateResult.error);
      }
    } else {
      const insertResult = await supabaseClient
        .from('search_statistics')
        .insert({ 
          username: username,
          search_count: 0,
          profile_views: 1,
          last_viewed: new Date().toISOString()
        });
      
      if (insertResult.error) {
        console.error('Error inserting profile view count:', insertResult.error);
      }
    }
  } catch (error) {
    console.error('Error in incrementProfileView:', error);
  }
}

async function incrementSearchCount(username) {
  try {
    const existingResult = await supabaseClient
      .from('search_statistics')
      .select('*')
      .eq('username', username)
      .single();

    if (existingResult.error && existingResult.error.code !== 'PGRST116') {
      console.error('Error checking existing stats:', existingResult.error);
      return;
    }

    if (existingResult.data) {
      const updateResult = await supabaseClient
        .from('search_statistics')
        .update({ 
          search_count: existingResult.data.search_count + 1,
          last_searched: new Date().toISOString()
        })
        .eq('username', username);
      
      if (updateResult.error) {
        console.error('Error updating search count:', updateResult.error);
      }
    } else {
      const insertResult = await supabaseClient
        .from('search_statistics')
        .insert({ 
          username: username,
          search_count: 1,
          profile_views: 0,
          last_searched: new Date().toISOString()
        });
      
      if (insertResult.error) {
        console.error('Error inserting search count:', insertResult.error);
      }
    }
  } catch (error) {
    console.error('Error in incrementSearchCount:', error);
  }
}

async function loadPopularUsers() {
  try {
    const statsResult = await supabaseClient
      .from('search_statistics')
      .select('username, profile_views, search_count')
      .order('profile_views', { ascending: false })
      .limit(10);

    if (statsResult.error || !statsResult.data || statsResult.data.length === 0) {
      results.innerHTML = '<div class="meta">Hech qanday profil hali korilmagan.</div>';
      return;
    }

    const viewedUsers = statsResult.data.filter(function(stat) {
      return stat.profile_views > 0;
    });

    if (viewedUsers.length === 0) {
      results.innerHTML = '<div class="meta">Hech qanday profil hali korilmagan.</div>';
      return;
    }

    const usernames = viewedUsers.map(function(stat) {
      return stat.username;
    });
    
    const accountsResult = await supabaseClient
      .from('instagram_accounts')
      .select('*')
      .in('username', usernames);

    if (accountsResult.error || !accountsResult.data) {
      results.innerHTML = '<div class="meta">Mashhur foydalanuvchilarni yuklab bolmadi.</div>';
      return;
    }

    const popularUsers = accountsResult.data.map(function(account) {
      const stats = viewedUsers.find(function(stat) {
        return stat.username === account.username;
      });
      return {
        id: account.id,
        username: account.username,
        note: account.note,
        profile_pic_url: account.profile_pic_url,
        profile_views: stats ? stats.profile_views : 0,
        search_count: stats ? stats.search_count : 0
      };
    }).sort(function(a, b) {
      return b.profile_views - a.profile_views;
    });

    await renderPopularUsers(popularUsers);
  } catch (error) {
    console.error('Error loading popular users:', error);
    results.innerHTML = '<div class="meta">Xato yuz berdi.</div>';
  }
}

async function renderPopularUsers(users) {
  results.innerHTML = '';
  
  if (!users || users.length === 0) {
    results.innerHTML = '<div class="meta">Mashhur foydalanuvchilar topilmadi.</div>';
    return;
  }

  const headerDiv = document.createElement('div');
  headerDiv.className = 'section-header';
  headerDiv.innerHTML = '<i class="fa-solid fa-fire section-icon"></i>' +
    '<span class="section-title">Eng Mashxur profillar</span>';
  results.appendChild(headerDiv);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const postsResult = await supabaseClient
      .from('posts')
      .select('id')
      .eq('account_id', user.id);
    
    const postsCount = postsResult.data ? postsResult.data.length : 0;
    
    const div = document.createElement('div');
    div.className = 'item popular';
    
    div.innerHTML = '<div class="popular-badge"><i class="fa-solid fa-fire"></i></div>' +
      '<div style="display:flex;align-items:start;width:100%">' + 
      (user.profile_pic_url ? '<img class="profile-pic" src="' + user.profile_pic_url + '" alt="Profile">' : '') + 
      '<div style="flex:1"><div class="username">@' + escapeHtml(user.username) + 
      '<span class="search-count"><i class="fa-solid fa-eye"></i> ' + user.profile_views + '</span></div>' +
      '<div class="meta">' + escapeHtml(user.note || 'Izoh yoq') + '</div>' + 
      (postsCount > 0 ? '<div class="posts-count"><i class="fa-solid fa-images"></i> ' + postsCount + ' ta post</div>' : '') +
      '</div></div>';
    
    div.addEventListener('click', function() {
      incrementProfileView(user.username);
      window.location.href = '/profile/' + encodeURIComponent(user.username);
    });
    
    results.appendChild(div);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, function(m) {
    return map[m];
  });
}

async function renderList(items, isSearchResult) {
  results.innerHTML = '';
  if (!items || items.length === 0) {
    results.innerHTML = '<div class="meta">Hech narsa topilmadi.</div>';
    return;
  }

  if (isSearchResult) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'section-header';
    headerDiv.innerHTML = '<i class="fa-solid fa-search section-icon"></i>' +
      '<span class="section-title">Qidiruv natijalari</span>';
    results.appendChild(headerDiv);
  }
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const postsResult = await supabaseClient
      .from('posts')
      .select('id')
      .eq('account_id', item.id);
    
    const postsCount = postsResult.data ? postsResult.data.length : 0;
    
    const div = document.createElement('div');
    div.className = 'item';
    
    div.innerHTML = '<div style="display:flex;align-items:start;width:100%">' + 
      (item.profile_pic_url ? '<img class="profile-pic" src="' + item.profile_pic_url + '" alt="Profile">' : '') + 
      '<div style="flex:1"><div class="username">@' + escapeHtml(item.username) + '</div>' +
      '<div class="meta">' + escapeHtml(item.note || 'Izoh yoq') + '</div>' + 
      (postsCount > 0 ? '<div class="posts-count"><i class="fa-solid fa-images"></i> ' + postsCount + ' ta post</div>' : '') +
      '</div></div>';
    
    div.addEventListener('click', function() {
      incrementProfileView(item.username);
      window.location.href = '/profile/' + encodeURIComponent(item.username);
    });
    
    results.appendChild(div);
  }
}

function showAdmin() {
  adminArea.style.display = 'block';
  adminIndicator.style.display = 'inline-block';
  localStorage.setItem('is_admin', '1');
}

function hideAdmin() {
  adminArea.style.display = 'none';
  adminIndicator.style.display = 'none';
  localStorage.removeItem('is_admin');
  isAdmin = false;
}

function addPostEntry() {
  const postDiv = document.createElement('div');
  postDiv.className = 'post-entry';
  postDiv.innerHTML = 
    '<div class="post-entry-header">' +
      '<div class="post-entry-title">' +
        '<i class="fa-solid fa-image"></i>' +
        'Post #' + (postEntries.length + 1) +
      '</div>' +
      '<button class="remove-post" type="button">' +
        '<i class="fa-solid fa-trash"></i>' +
      '</button>' +
    '</div>' +
    '<div class="input-group">' +
      '<label>Post izoh (ixtiyoriy)</label>' +
      '<input type="text" class="post-content" placeholder="Post izoh" />' +
    '</div>' +
    '<div class="input-group">' +
      '<label>Post media (rasm yoki video, ixtiyoriy, bir nechta fayl tanlash mumkin)</label>' +
      '<input type="file" class="post-media" accept="image/*,video/*" multiple />' +
      '<div class="upload-progress" style="width:0%;display:none"></div>' +
    '</div>';
  
  postsContainer.appendChild(postDiv);
  postEntries.push(postDiv);

  postDiv.querySelector('.remove-post').addEventListener('click', function(e) {
    e.preventDefault();
    postsContainer.removeChild(postDiv);
    postEntries = postEntries.filter(function(p) {
      return p !== postDiv;
    });
    postEntries.forEach(function(entry, index) {
      const title = entry.querySelector('.post-entry-title');
      title.innerHTML = '<i class="fa-solid fa-image"></i>Post #' + (index + 1);
    });
  });
}

function validateFileSize(file, maxSizeMB) {
  if (typeof maxSizeMB === 'undefined') maxSizeMB = 500;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(file.name + ' fayli juda katta (' + (file.size / (1024*1024)).toFixed(1) + 'MB). Maksimal ruxsat etilgan hajm: ' + maxSizeMB + 'MB');
  }
  return true;
}

async function uploadToNextJS(files, type, username, postIndex, onProgress) {
  return new Promise(function(resolve, reject) {
    try {
      console.log('Starting upload process...');
      console.log('Files:', files, 'Type:', type, 'Username:', username);

      const formData = new FormData();
      
      if (Array.isArray(files)) {
        console.log('Processing ' + files.length + ' files...');
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            validateFileSize(file, 500);
            formData.append('file', file);
            console.log('File ' + (i + 1) + ': ' + file.name + ' (' + (file.size / (1024*1024)).toFixed(2) + 'MB)');
          } catch (error) {
            console.error('File validation error for ' + file.name + ':', error.message);
            reject(error);
            return;
          }
        }
      } else {
        try {
          validateFileSize(files, 500);
          formData.append('file', files);
          console.log('Single file: ' + files.name + ' (' + (files.size / (1024*1024)).toFixed(2) + 'MB)');
        } catch (error) {
          console.error('Single file validation error:', error.message);
          reject(error);
          return;
        }
      }
      
      formData.append('type', type);
      formData.append('username', username);
      if (postIndex !== null && postIndex !== undefined) {
        formData.append('postIndex', postIndex.toString());
      }

      console.log('FormData prepared, creating XMLHttpRequest...');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      xhr.timeout = 600000;

      console.log('Sending POST request to /api/upload');

      xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          console.log('Upload progress: ' + percent + '%');
          if (onProgress) onProgress(percent);
        }
      };

      xhr.onload = function() {
        console.log('Response received. Status: ' + xhr.status);
        console.log('Response text:', xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('Upload successful:', data);
            
            if (data.errors && data.errors.length > 0) {
              console.error('Some files failed:', data.errors);
              const errorMessages = data.errors.map(function(e) {
                return e.error;
              }).join(', ');
              reject(new Error('Upload failed for some files: ' + errorMessages));
            } else {
              const urls = data.uploaded ? data.uploaded.map(function(u) {
                return u.url;
              }) : [data.url];
              console.log('Generated URLs:', urls);
              resolve(urls);
            }
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.error('Raw response:', xhr.responseText);
            reject(new Error('Upload response parsing error: ' + parseError.message));
          }
        } else if (xhr.status === 413) {
          console.error('File too large (413)');
          reject(new Error('Fayl hajmi juda katta. Iltimos, kichikroq fayl yuklang.'));
        } else if (xhr.status === 405) {
          console.error('Method not allowed (405)');
          console.error('Response:', xhr.responseText);
          reject(new Error('Server xatosi: Method Not Allowed. API endpoint POST qabul qilmayapti.'));
        } else {
          console.error('HTTP error ' + xhr.status);
          console.error('Response:', xhr.responseText);
          reject(new Error('Upload failed with status ' + xhr.status + ': ' + xhr.responseText));
        }
      };

      xhr.onerror = function(error) {
        console.error('Network error:', error);
        reject(new Error('Network error during upload'));
      };

      xhr.ontimeout = function() {
        console.error('Upload timeout');
        reject(new Error('Upload timeout - fayl yuklash vaqti tugadi'));
      };

      xhr.onabort = function() {
        console.error('Upload aborted');
        reject(new Error('Upload was aborted'));
      };

      console.log('Sending FormData...');
      xhr.send(formData);
      
    } catch (error) {
      console.error('Upload setup error:', error);
      reject(error);
    }
  });
}

function showProgress(progressElement, percent) {
  if (progressElement) {
    progressElement.style.display = 'block';
    progressElement.style.width = percent + '%';
    if (percent === 100) {
      setTimeout(function() {
        progressElement.style.display = 'none';
        progressElement.style.width = '0%';
      }, 1000);
    }
  }
}

// Event listeners
btnAddPost.addEventListener('click', function(e) {
  e.preventDefault();
  addPostEntry();
});

btnLock.addEventListener('click', function(e) {
  e.preventDefault();
  hideAdmin();
  window.showModal('info', "Admin paneli yopildi");
});

btnUsers.addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = '/users';
});

btnAdd.addEventListener('click', async function(e) {
  e.preventDefault();
  
  if (!isAdmin) { 
    window.showModal('error', "Admin emassiz"); 
    return; 
  }
  
  const username = addUsername.value.trim();
  const note = addNote.value.trim();
  
  if (!username) { 
    window.showModal('error', "Username kiriting"); 
    return; 
  }

  btnAdd.classList.add('loading');
  btnAdd.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yuklanmoqda...';

  try {
    console.log('Starting add user process...');
    console.log('Username:', username, 'Note:', note);

    let profileUrl = null;
    
    const profileFile = profilePic.files[0];
    if (profileFile) {
      console.log('Uploading profile picture...');
      try {
        const profileUrls = await uploadToNextJS(profileFile, 'profile', username, null, function(percent) {
          showProgress(profileProgress, percent);
        });
        profileUrl = profileUrls[0];
        console.log('Profile picture uploaded:', profileUrl);
      } catch (uploadError) {
        console.error('Profile upload failed:', uploadError);
        throw new Error('Profil rasm yuklashda xato: ' + uploadError.message);
      }
    }

    console.log('Inserting account to database...');
    const accountResult = await supabaseClient
      .from('instagram_accounts')
      .insert({ username: username, note: note, profile_pic_url: profileUrl })
      .select()
      .single();
      
    if (accountResult.error) {
      console.error('Database insert error:', accountResult.error);
      throw new Error("Hisob qo'shishda xato: " + accountResult.error.message);
    }
    
    const accountId = accountResult.data.id;
    console.log('Account created with ID:', accountId);

    console.log('Processing ' + postEntries.length + ' posts...');
    for (let i = 0; i < postEntries.length; i++) {
      const postDiv = postEntries[i];
      const content = postDiv.querySelector('.post-content').value.trim();
      const mediaFiles = Array.from(postDiv.querySelector('.post-media').files);
      const postProgress = postDiv.querySelector('.upload-progress');
      
      console.log('Processing post ' + (i + 1) + ':', { content: content, mediaCount: mediaFiles.length });
      
      if (mediaFiles.length > 0) {
        console.log('Uploading ' + mediaFiles.length + ' media files for post ' + (i + 1) + '...');
        try {
          const mediaUrls = await uploadToNextJS(mediaFiles, 'post', username, i + 1, function(percent) {
            showProgress(postProgress, percent);
          });
          
          console.log('Media uploaded for post ' + (i + 1) + ':', mediaUrls);
          
          for (let j = 0; j < mediaUrls.length; j++) {
            const mediaUrl = mediaUrls[j];
            const mediaType = mediaFiles[j].type.startsWith('video') ? 'video' : 'image';
            
            const postResult = await supabaseClient.from('posts').insert({
              account_id: accountId,
              content: content || null,
              media_url: mediaUrl,
              media_type: mediaType
            });
            
            if (postResult.error) {
              console.error('Post insert error for media ' + (j + 1) + ':', postResult.error);
              throw new Error('Post ' + (i + 1) + ' media ' + (j + 1) + ' saqlashda xato: ' + postResult.error.message);
            }
            
            console.log('Post saved: ' + mediaType + ' - ' + mediaUrl);
          }
        } catch (mediaUploadError) {
          console.error('Media upload failed for post ' + (i + 1) + ':', mediaUploadError);
          throw new Error('Post ' + (i + 1) + ' media yuklashda xato: ' + mediaUploadError.message);
        }
      } else if (content) {
        console.log('Saving text-only post ' + (i + 1) + '...');
        const postResult = await supabaseClient.from('posts').insert({
          account_id: accountId,
          content: content
        });
        
        if (postResult.error) {
          console.error('Text post insert error:', postResult.error);
          throw new Error('Text post ' + (i + 1) + ' saqlashda xato: ' + postResult.error.message);
        }
        
        console.log('Text post saved: ' + content);
      }
    }

    console.log('Resetting form...');
    addUsername.value = '';
    addNote.value = '';
    profilePic.value = '';
    postsContainer.innerHTML = '';
    postEntries = [];
    
    console.log('All operations completed successfully!');
    window.showModal('success', "Muvaffaqiyatli qo'shildi!");

  } catch (error) {
    console.error('Global error in add user process:', error);
    window.showModal('error', "Xato: " + error.message);
  } finally {
    btnAdd.classList.remove('loading');
    btnAdd.innerHTML = '<i class="fa-solid fa-user-plus"></i> Qoshish';
  }
});

btnSearch.addEventListener('click', async function(e) {
  e.preventDefault();
  const q = mainInput.value.trim();
  
  if (!q) { 
    await loadPopularUsers();
    return; 
  }

  if (adminSecretValue && q === adminSecretValue) {
    isAdmin = true;
    showAdmin();
    results.innerHTML = '<div class="meta"><i class="fa-solid fa-crown"></i> Admin boldingiz</div>';
    mainInput.value = '';
    return;
  }

  results.innerHTML = '<div class="meta"><i class="fa-solid fa-spinner fa-spin"></i> Qidirilmoqda...</div>';

  await incrementSearchCount(q);

  try {
    const searchResult = await supabaseClient
      .from('instagram_accounts')
      .select('*')
      .ilike('username', '%' + q + '%')
      .limit(3);
    
    if (searchResult.error) { 
      console.error('Search error:', searchResult.error);
      results.innerHTML = '<div class="meta">Qidirishda xato yuz berdi</div>'; 
      return; 
    }
    
    renderList(searchResult.data, true);
  } catch (error) {
    console.error('Search error:', error);
    results.innerHTML = '<div class="meta">Qidirishda xato yuz berdi</div>';
  }
});

mainInput.addEventListener('keypress', function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    btnSearch.click();
  }
});

console.log('Application initialized successfully!');
          `,
        }}
      />
    </>
  );
}