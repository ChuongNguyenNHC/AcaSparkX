import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p style={styles.text}>&copy; {new Date().getFullYear()} AcaSparkX. Bảo lưu mọi quyền.</p>
        </footer>
    );
};

const styles = {
    footer: {
        padding: '1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-dark)',
        borderTop: '1px solid rgba(16, 185, 129, 0.3)',
        marginTop: 'auto',
    },
    text: {
        margin: 0,
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    }
}
    ;

export default Footer;
