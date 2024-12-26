import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            width: '100%'
        }}>
            <p>&copy; 2024 My Application. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
