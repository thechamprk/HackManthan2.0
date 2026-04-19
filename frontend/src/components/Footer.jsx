import styles from '../styles/Footer.module.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <h3 className={styles.brand}>Hindsight Expert</h3>
          <p className={styles.text}>AI-powered support agent with persistent memory and measurable learning.</p>
        </div>
        <div className={styles.links}>
          <a href="https://hindsight.vectorize.io" target="_blank" rel="noreferrer">Hindsight</a>
          <a href="https://groq.com" target="_blank" rel="noreferrer">Groq</a>
          <a href="/docs">Documentation</a>
        </div>
        <p className={styles.copy}>© {year} Hindsight Expert. Built for HackManthan 2.0.</p>
      </div>
    </footer>
  );
}

export default Footer;
