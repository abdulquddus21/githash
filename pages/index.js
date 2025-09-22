import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import favico from "../public/assets/favicon.png"

export default function Home() {
const router = useRouter()
const [modal, setModal] = useState({ show: false, type: '', message: '', onConfirm: null })

const showModal = (type, message, onConfirm = null) => {
    setModal({ show: true, type, message, onConfirm })
}

const hideModal = () => {
    setModal({ show: false, type: '', message: '', onConfirm: null })
}

useEffect(() => {
    // Replace alert with modal in global scope
    window.showModal = showModal
}, [])

return (
    <>
    <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        <link rel="icon" href="/assets/favicon.png" type="image/png" />
        <title>insta qidiruv Private</title>
    </Head>

    <style jsx global>{`
        :root{
        --bg:#071026;
        --card:#0b1220;
        --accent:#7c3aed;
        --muted:#9aa4b2;
        --glass: rgba(255,255,255,0.03);
        --popular: #f59e0b;
        --success: #10b981;
        --danger: #e85555;
        }
        *{box-sizing:border-box}
        html,body{height:100%}
        body{
        margin:0;
        font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
        background: black;
        color:#e6eef6;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:18px;
        -webkit-tap-highlight-color: transparent;
            outline: none;
        }

        .wrap{
        width:100%;
        max-width:920px;
        background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
        border-radius:14px;
        padding:18px;
        box-shadow: 0 10px 40px rgba(2,6,23,0.6);
        border:2px solid;
        display:grid;
        gap:14px;
        
        }

        .top{
        display:flex;
        gap:10px;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
        }

        .search-box{
        display:flex;
        gap:10px;
        align-items:center;
        width:100%;
        }

        input[type="text"], input[type="file"]{
        background:var(--glass);
        border:1px solid rgba(255,255,255,0.03);
        padding:14px 16px;
        border-radius:10px;
        color:inherit;
        outline:none;
        font-family:inherit;
        font-size:16px;
        width:100%;
        letter-spacing:0.6px;
        }

        input[type="text"]:focus, input[type="file"]:focus{
        border-color:var(--accent);
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
        }

        button.btn{
        color:white;
        background-color:#030617;
        padding:14px 14px;
        border-radius:10px;
        border:none;
        cursor:pointer;
        font-weight:700;
        transition: all 0.2s;
        }
        button.btn:hover{
        background-color:#1a1f3a;
        transform: translateY(-1px);
        }

        .layout{
        display:grid;
        grid-template-columns:1fr 360px;
        gap:14px;
        }
        @media (max-width:880px){ 
        .layout{grid-template-columns:1fr} 
        .wrap{padding:12px}
        .top{flex-direction:column}
        .search-box{width:100%}
        }

        .card{
        background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
        padding:14px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,0.02);
        box-shadow: 0 6px 18px rgba(2,6,23,0.35);

        ::-webkit-scrollbar {
  width: 1px;           /* kengligi (vertical scroll uchun) */
  height: 1px;          /* balandligi (horizontal scroll uchun) */
}

/* Scroll yo'lagining fon rangi */
::-webkit-scrollbar-track {
  background:#9c34c24a;   /* orqa fon */
  border-radius: 10px;
}

/* Scrollning o'zi */
::-webkit-scrollbar-thumb {
  background:  #B54CFF;   /* scroll rangi */
  border-radius: 10px;   /* yumaloqlash */
}


        }

        .list{display:flex;flex-direction:column;gap:10px;max-height:420px;overflow:auto;padding-right:6px}
        .item{
        display:flex;align-items:start;gap:12px;padding:10px;border-radius:8px;background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.02);
        transition: all 0.2s;
        cursor: pointer;
        position: relative;
        }
        .item:hover{
        background:rgba(255,255,255,0.03);
        border-color:rgba(255,255,255,0.05);
        transform: translateY(-1px);
        }
        
        .item.popular {
        background: linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02));
        border: 1px solid rgba(245,158,11,0.15);
        }
        
        .item.popular:hover {
        background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04));
        border-color: rgba(245,158,11,0.25);
        }
        
        .username{font-weight:700;margin-bottom:4px}
        .meta{color:var(--muted);font-size:13px}
        .profile-pic{width:60px;height:60px;border-radius:12px;object-fit:cover;margin-right:12px;border:2px solid rgba(255,255,255,0.1)}
        .post-item{margin-top:8px;padding:8px;border:1px solid rgba(255,255,255,0.02);border-radius:8px}
        .post-media{max-width:100%;height:auto;border-radius:8px;margin-top:8px;max-height:200px;object-fit:cover}

        label.small{font-size:13px;color:var(--muted);margin-bottom:6px;display:block}
        input.small{padding:8px 10px;border-radius:8px;font-size:14px}

        .hint{color:var(--muted);font-size:13px;margin-top:8px}
        .admin-pill{background:rgba(124,58,237,0.14);color:var(--accent);padding:6px 8px;border-radius:8px;font-weight:700;font-size:13px;animation:pulse 2s infinite}

        .post-entry { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 8px; }
        .remove-post { background: #e85555; padding: 8px; font-size: 12px; }
        
        .loading { opacity: 0.6; pointer-events: none; }
        .upload-progress { 
        background: var(--accent); 
        height: 3px; 
        border-radius: 2px; 
        transition: width 0.3s; 
        margin-top: 5px;
        }

        /* IMPROVED ADMIN PANEL STYLES */
        .admin-panel {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.02), rgba(124, 58, 237, 0.01));
            border: 1px solid rgba(124, 58, 237, 0.1);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(124, 58, 237, 0.1);
            position: relative;
            overflow: hidden;
        }

        .admin-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent), var(--popular));
            border-radius: 16px 16px 0 0;
        }

        .admin-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top:300px
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            flex-wrap: wrap;
            gap: 12px;
        }

        .admin-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 18px;
            font-weight: 700;
            color: var(--accent);
            margin-top:150px;
        }

        .admin-title i {
            background: linear-gradient(135deg, var(--accent), var(--popular));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 20px;
        }

        .admin-form {
            display: grid;
            gap: 20px;
        }

        .form-section {
            background: rgba(255,255,255,0.01);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.03);
        }

        .form-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #e6eef6;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 16px;
        }

        .form-row:last-child {
            margin-bottom: 0;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .input-group label {
            font-size: 12px;
            font-weight: 500;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .input-with-icon {
            position: relative;
        }

        .input-with-icon i {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--muted);
            font-size: 14px;
        }

        .input-with-icon input {
            padding-left: 38px;
        }

        .posts-section {
            border: 1px dashed rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 16px;
            margin: 16px 0;
            background: rgba(255,255,255,0.005);
        }

        .posts-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        .posts-title {
            font-size: 14px;
            font-weight: 600;
            color: #e6eef6;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-add-post {
            background: linear-gradient(135deg, var(--accent), #6d28d9);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .btn-add-post:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .post-entry {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 12px;
            position: relative;
        }

        .post-entry-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .post-entry-title {
            font-size: 13px;
            font-weight: 600;
            color: #e6eef6;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .remove-post {
            background: var(--danger);
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .remove-post:hover {
            background: #dc2626;
            transform: scale(0.95);
        }

        .admin-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent), #6d28d9);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 120px;
            justify-content: center;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }

        .btn-secondary {
            background: rgba(255,255,255,0.05);
            color: #e6eef6;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 12px 20px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 120px;
            justify-content: center;
        }

        .btn-secondary:hover {
            background: rgba(255,255,255,0.1);
            transform: translateY(-1px);
        }

        .btn-danger {
            background: linear-gradient(135deg, var(--danger), #dc2626);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 120px;
            justify-content: center;
        }

        .btn-danger:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(232, 85, 85, 0.4);
        }

        .admin-hint {
            background: rgba(245, 158, 11, 0.05);
            border: 1px solid rgba(245, 158, 11, 0.15);
            border-radius: 10px;
            padding: 12px;
            margin-top: 16px;
            color: var(--popular);
            font-size: 12px;
            line-height: 1.4;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .admin-hint i {
            margin-top: 2px;
            flex-shrink: 0;
        }

        .admin-users-section {
            text-align: center;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* Responsive improvements */
        @media (max-width: 600px) {
            .admin-panel {
                padding: 16px;
            }

            .admin-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }

            .admin-title {
                font-size: 16px;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .admin-actions {
                flex-direction: column;
                gap: 10px;
            }

            .btn-primary, .btn-secondary, .btn-danger {
                min-width: 100%;
                justify-content: center;
            }

            .posts-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .btn-add-post {
                align-self: stretch;
                justify-content: center;
            }
        }

        @media (max-width: 400px) {
            .admin-panel {
                padding: 12px;
            }

            .form-section {
                padding: 12px;
            }

            .post-entry {
                padding: 10px;
            }
        }

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
        background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 14px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(2,6,23,0.8);
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
        
        .modal-icon.success { background: #10b981; color: white; }
        .modal-icon.error { background: #e85555; color: white; }
        .modal-icon.confirm { background: #f59e0b; color: white; }
        .modal-icon.info { background: var(--accent); color: white; }
        
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
        background: rgba(255,255,255,0.05);
        color: var(--muted);
        border: 1px solid rgba(255,255,255,0.1);
        }
        
        .modal-btn.secondary:hover {
        background: rgba(255,255,255,0.1);
        color: #e6eef6;
        }

        .posts-count {
        background: rgba(124,58,237,0.1);
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
        top: 8px;
        right: 8px;
        background: linear-gradient(135deg, var(--popular), #d97706);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 8px rgba(245,158,11,0.3);
        animation: popularPulse 2s ease-in-out infinite;
        }

        .search-count {
        background: rgba(245,158,11,0.1);
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
        border-bottom: 1px solid rgba(255,255,255,0.05);
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

        @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
        }
        
        @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
        }

        @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
        }

        @keyframes popularPulse {
        0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 2px 8px rgba(245,158,11,0.3);
        }
        50% { 
            transform: scale(1.05); 
            box-shadow: 0 4px 12px rgba(245,158,11,0.5);
        }
        }

        @media (max-width: 480px) {
        .modal {
            margin: 20px;
            padding: 20px;
        }
        .profile-pic{width:50px;height:50px}
        .popular-badge {
            font-size: 9px;
            padding: 3px 6px;
        }
        }
    `}</style>

    <div className="wrap">
        <div className="top">
        <div style={{width:'100%'}} className="search-box">
            <input id="main-input" type="text" placeholder="Username kiriting" />
            <button id="btn-search" className="btn"><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div id="admin-indicator" style={{display:'none'}} className="admin-pill">ADMIN</div>
        </div>

        <div className="layout">
        <div className="card">
            <div id="results" className="list">
            <div className="meta">Hech qanday qidiruv hali bajarilmadi.</div>
            </div>
        </div>

        <div id="admin-area" style={{display:'none'}}>
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
                                <div id="profile-progress" className="upload-progress" style={{width:'0%',display:'none'}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="posts-section">
                        <div className="posts-header">
                            <div className="posts-title">
                                <i className="fa-solid fa-images"></i>
                                Postlar
                            </div>
                            <button id="btn-add-post" className="btn-add-post">
                                <i className="fa-solid fa-plus"></i>
                                Post qo'shish
                            </button>
                        </div>
                        <div id="posts-container"></div>
                    </div>

                    <div className="admin-actions">
                        <button id="btn-add" className="btn-primary">
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
                    <button id="btn-users" className="btn-secondary">
                        <i className="fa-solid fa-users"></i>
                        Users
                    </button>
                </div>
            </div>
        </div>
        </div>

        {/* Custom Modal */}
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
                {modal.type === 'info' && 'Ma\'lumot'}
                </div>
            </div>
            <div className="modal-message">
                {modal.message}
            </div>
            <div className="modal-actions">
                {modal.type === 'confirm' ? (
                <>
                    <button className="modal-btn secondary" onClick={hideModal}>
                    <i className="fa-solid fa-times"></i> Bekor qilish
                    </button>
                    <button className="modal-btn primary" onClick={() => {
                    modal.onConfirm()
                    hideModal()
                    }}>
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

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script dangerouslySetInnerHTML={{
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

        (async function init() {
            const { data, error } = await supabaseClient
            .from('secrets')
            .select('value')
            .eq('name', 'admin_secret')
            .single();
            if (!error && data) adminSecretValue = data.value;

            if (localStorage.getItem('is_admin') === '1') {
            isAdmin = true;
            showAdmin();
            }

            // Initialize search statistics table if it doesn't exist
            await initializeSearchStats();
            
            // Load popular users on page load
            await loadPopularUsers();
        })();

        async function initializeSearchStats() {
            try {
                // Check if the table exists by trying to select from it
                const { data, error } = await supabaseClient
                .from('search_statistics')
                .select('id')
                .limit(1);
                
                // If table doesn't exist or has error, it will be created by the database admin
                // This is just to handle the initial case gracefully
                if (error) {
                    console.log('Search statistics table not found or error:', error.message);
                }
            } catch (error) {
                console.log('Error initializing search stats:', error);
            }
        }

        async function incrementProfileView(username) {
            try {
            // First, check if the username already exists in statistics
            const { data: existing, error: selectError } = await supabaseClient
                .from('search_statistics')
                .select('*')
                .eq('username', username)
                .single();

            if (selectError && selectError.code !== 'PGRST116') {
                console.error('Error checking existing stats:', selectError);
                return;
            }

            if (existing) {
                // Update existing record - increment profile_views
                const { error: updateError } = await supabaseClient
                .from('search_statistics')
                .update({ 
                    profile_views: (existing.profile_views || 0) + 1,
                    last_viewed: new Date().toISOString()
                })
                .eq('username', username);
                
                if (updateError) {
                console.error('Error updating profile view count:', updateError);
                }
            } else {
                // Insert new record
                const { error: insertError } = await supabaseClient
                .from('search_statistics')
                .insert({ 
                    username: username,
                    search_count: 0,
                    profile_views: 1,
                    last_viewed: new Date().toISOString()
                });
                
                if (insertError) {
                console.error('Error inserting profile view count:', insertError);
                }
            }
            } catch (error) {
            console.error('Error in incrementProfileView:', error);
            }
        }

        async function incrementSearchCount(username) {
            try {
            // First, check if the username already exists in statistics
            const { data: existing, error: selectError } = await supabaseClient
                .from('search_statistics')
                .select('*')
                .eq('username', username)
                .single();

            if (selectError && selectError.code !== 'PGRST116') {
                console.error('Error checking existing stats:', selectError);
                return;
            }

            if (existing) {
                // Update existing record
                const { error: updateError } = await supabaseClient
                .from('search_statistics')
                .update({ 
                    search_count: existing.search_count + 1,
                    last_searched: new Date().toISOString()
                })
                .eq('username', username);
                
                if (updateError) {
                console.error('Error updating search count:', updateError);
                }
            } else {
                // Insert new record
                const { error: insertError } = await supabaseClient
                .from('search_statistics')
                .insert({ 
                    username: username,
                    search_count: 1,
                    profile_views: 0,
                    last_searched: new Date().toISOString()
                });
                
                if (insertError) {
                console.error('Error inserting search count:', insertError);
                }
            }
            } catch (error) {
            console.error('Error in incrementSearchCount:', error);
            }
        }

        async function loadPopularUsers() {
            try {
            // Get top 10 most viewed profiles (based on profile_views, not search_count)
            const { data: popularStats, error: statsError } = await supabaseClient
                .from('search_statistics')
                .select('username, profile_views, search_count')
                .order('profile_views', { ascending: false })
                .limit(10);

            if (statsError || !popularStats || popularStats.length === 0) {
                results.innerHTML = '<div class="meta">Hech qanday profil hali ko\\'rilmagan.</div>';
                return;
            }

            // Filter only users with profile_views > 0
            const viewedUsers = popularStats.filter(stat => stat.profile_views > 0);

            if (viewedUsers.length === 0) {
                results.innerHTML = '<div class="meta">Hech qanday profil hali ko\\'rilmagan.</div>';
                return;
            }

            // Get user details for popular users
            const usernames = viewedUsers.map(stat => stat.username);
            const { data: accounts, error: accountsError } = await supabaseClient
                .from('instagram_accounts')
                .select('*')
                .in('username', usernames);

            if (accountsError || !accounts) {
                results.innerHTML = '<div class="meta">Mashhur foydalanuvchilarni yuklab bo\\'lmadi.</div>';
                return;
            }

            // Merge view stats with account data
            const popularUsers = accounts.map(account => {
                const stats = viewedUsers.find(stat => stat.username === account.username);
                return {
                ...account,
                profile_views: stats ? stats.profile_views : 0,
                search_count: stats ? stats.search_count : 0
                };
            }).sort((a, b) => b.profile_views - a.profile_views);

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

            // Add section header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'section-header';
            headerDiv.innerHTML = '<i class="fa-solid fa-fire section-icon"></i>' +
            '<span class="section-title">Eng ko\\'p ko\\'rilgan profillar</span>';
            results.appendChild(headerDiv);

            for (const user of users) {
            // Get posts count
            const { data: posts } = await supabaseClient
                .from('posts')
                .select('id')
                .eq('account_id', user.id);
            
            const postsCount = posts ? posts.length : 0;
            
            const div = document.createElement('div');
            div.className = 'item popular';
            
            div.innerHTML = '<div class="popular-badge">Mashhur</div>' +
                '<div style="display:flex;align-items:start;width:100%">' + 
                (user.profile_pic_url ? '<img class="profile-pic" src="' + user.profile_pic_url + '" alt="Profile">' : '') + 
                '<div style="flex:1"><div class="username">@' + escapeHtml(user.username) + 
                '<span class="search-count"><i class="fa-solid fa-eye"></i> ' + user.profile_views + '</span></div>' +
                '<div class="meta">' + escapeHtml(user.note || 'Izoh yoq') + '</div>' + 
                (postsCount > 0 ? '<div class="posts-count"><i class="fa-solid fa-images"></i> ' + postsCount + ' ta post</div>' : '') +
                '</div></div>';
            
            // Add click event - increment profile view when clicked
            div.addEventListener('click', () => {
                incrementProfileView(user.username);
                window.location.href = '/profile/' + encodeURIComponent(user.username);
            });
            
            results.appendChild(div);
            }
        }

        function escapeHtml(str) {
            if (!str) return '';
            return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
        }

        async function renderList(items, isSearchResult = false) {
            results.innerHTML = '';
            if (!items || items.length === 0) {
            results.innerHTML = '<div class="meta">Hech narsa topilmadi.</div>';
            return;
            }

            if (isSearchResult) {
            // Add search results header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'section-header';
            headerDiv.innerHTML = '<i class="fa-solid fa-search section-icon"></i>' +
                '<span class="section-title">Qidiruv natijalari</span>';
            results.appendChild(headerDiv);
            }
            
            for (const item of items) {
            // Get posts count for display only
            const { data: posts, error } = await supabaseClient
                .from('posts')
                .select('id')
                .eq('account_id', item.id);
            
            const postsCount = posts ? posts.length : 0;
            
            const div = document.createElement('div');
            div.className = 'item';
            
            // Only show user info, not the actual posts
            div.innerHTML = '<div style="display:flex;align-items:start;width:100%">' + 
                (item.profile_pic_url ? '<img class="profile-pic" src="' + item.profile_pic_url + '" alt="Profile">' : '') + 
                '<div style="flex:1"><div class="username">@' + escapeHtml(item.username) + '</div>' +
                '<div class="meta">' + escapeHtml(item.note || 'Izoh yoq') + '</div>' + 
                (postsCount > 0 ? '<div class="posts-count"><i class="fa-solid fa-images"></i> ' + postsCount + ' ta post</div>' : '') +
                '</div></div>';
            
            // Add click event to go to profile and increment view count
            div.addEventListener('click', () => {
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
                '<button class="remove-post">' +
                    '<i class="fa-solid fa-trash"></i>' +
                '</button>' +
            '</div>' +
            '<div class="input-group">' +
                '<label>Post izoh (ixtiyoriy)</label>' +
                '<input type="text" class="post-content" placeholder="Post izoh" />' +
            '</div>' +
            '<div class="input-group">' +
                '<label>Post media (rasm yoki video, ixtiyoriy)</label>' +
                '<input type="file" class="post-media" accept="image/*,video/*" />' +
                '<div class="upload-progress" style="width:0%;display:none"></div>' +
            '</div>';
            
            postsContainer.appendChild(postDiv);
            postEntries.push(postDiv);

            postDiv.querySelector('.remove-post').addEventListener('click', () => {
            postsContainer.removeChild(postDiv);
            postEntries = postEntries.filter(p => p !== postDiv);
            // Update post numbers
            postEntries.forEach((entry, index) => {
                const title = entry.querySelector('.post-entry-title');
                title.innerHTML = '<i class="fa-solid fa-image"></i>Post #' + (index + 1);
            });
            });
        }

        btnAddPost.addEventListener('click', addPostEntry);
        
        btnLock.addEventListener('click', () => {
            hideAdmin();
            window.showModal('info', "Admin paneli yopildi");
        });
        
        btnUsers.addEventListener('click', () => {
            window.location.href = '/users';
        });

        async function uploadToNextJS(file, type, username, postIndex = null) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('username', username);
            if (postIndex !== null) formData.append('postIndex', postIndex);

            const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.url;
        }

        function showProgress(progressElement, percent) {
            progressElement.style.display = 'block';
            progressElement.style.width = percent + '%';
            if (percent === 100) {
            setTimeout(() => {
                progressElement.style.display = 'none';
                progressElement.style.width = '0%';
            }, 1000);
            }
        }

        btnAdd.addEventListener('click', async () => {
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
            let profileUrl = null;
            const profileFile = profilePic.files[0];
            if (profileFile) {
                showProgress(profileProgress, 20);
                profileUrl = await uploadToNextJS(profileFile, 'profile', username);
                showProgress(profileProgress, 100);
            }

            const { data: accountData, error: accountError } = await supabaseClient
                .from('instagram_accounts')
                .insert({ username, note, profile_pic_url: profileUrl })
                .select()
                .single();
            if (accountError) throw new Error("Hisob qo'shishda xato: " + accountError.message);
            const accountId = accountData.id;

            for (let i = 0; i < postEntries.length; i++) {
                const postDiv = postEntries[i];
                const content = postDiv.querySelector('.post-content').value.trim();
                const mediaFile = postDiv.querySelector('.post-media').files[0];
                const postProgress = postDiv.querySelector('.upload-progress');
                
                let mediaUrl = null;
                let mediaType = null;
                if (mediaFile) {
                showProgress(postProgress, 30);
                mediaUrl = await uploadToNextJS(mediaFile, 'post', username, i);
                showProgress(postProgress, 100);
                mediaType = mediaFile.type.startsWith('video') ? 'video' : 'image';
                }
                if (content || mediaUrl) {
                await supabaseClient.from('posts').insert({
                    account_id: accountId,
                    content,
                    media_url: mediaUrl,
                    media_type: mediaType
                });
                }
            }

            addUsername.value = '';
            addNote.value = '';
            profilePic.value = '';
            postsContainer.innerHTML = '';
            postEntries = [];
            window.showModal('success', "Muvaffaqiyatli qo'shildi!");

            } catch (error) {
            window.showModal('error', "Xato: " + error.message);
            } finally {
            btnAdd.classList.remove('loading');
            btnAdd.innerHTML = '<i class="fa-solid fa-user-plus"></i> Qo\\'shish';
            }
        });

        btnSearch.addEventListener('click', async () => {
            const q = mainInput.value.trim();
            if (!q) { 
            await loadPopularUsers();
            return; 
            }

            if (adminSecretValue && q === adminSecretValue) {
            isAdmin = true;
            showAdmin();
            results.innerHTML = '<div class="meta"><i class="fa-solid fa-crown"></i> Admin bo\\'ldingiz</div>';
            mainInput.value = '';
            return;
            }

            // Show loading
            results.innerHTML = '<div class="meta"><i class="fa-solid fa-spinner fa-spin"></i> Qidirilmoqda...</div>';

            // Increment search count for the searched username
            await incrementSearchCount(q);

            const { data, error } = await supabaseClient
            .from('instagram_accounts')
            .select('*')
            .ilike('username', '%' + q + '%');
            
            if (error) { 
            results.innerHTML = '<div class="meta">Qidirishda xato yuz berdi</div>'; 
            return; 
            }
            
            renderList(data, true);
        });

        mainInput.addEventListener('keypress', e => {
            if (e.key === "Enter") btnSearch.click();
        });
        `
    }} />
    </>
    )
}