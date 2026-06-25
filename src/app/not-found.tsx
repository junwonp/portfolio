import React from 'react';
import Link from 'next/link';



export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333',
      backgroundColor: '#fff',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 10px', fontWeight: 800 }}>404</h1>
      <p style={{ fontSize: '1.25rem', margin: '0 0 20px', color: '#666' }}>페이지를 찾을 수 없습니다.</p>
      <Link 
        href="/" 
        style={{
          color: '#1a5cc5',
          textDecoration: 'none',
          fontWeight: 600,
          border: '1px solid #1a5cc5',
          padding: '8px 16px',
          borderRadius: '6px'
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
